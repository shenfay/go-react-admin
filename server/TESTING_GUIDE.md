# 功能测试指南

## 前置准备

确保服务已启动：
```bash
cd server
go run cmd/api/main.go      # API 服务
go run cmd/worker/main.go   # Worker 服务
```

---

## 一、邮箱验证流程测试

### 1.1 注册新用户（触发验证邮件）

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**预期响应**：
```json
{
  "code": 201,
  "data": {
    "user": { "id": "...", "email": "test@example.com", "email_verified": false },
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

**验证点**：
- 返回 201 状态码
- `email_verified` 为 `false`
- Worker 日志应显示 "Sending verification email to test@example.com"（NoopSender 模式）

### 1.2 查看 Worker 日志获取验证令牌

由于使用 NoopSender，验证链接会打印到 Worker 日志：
```
Sending verification email to test@example.com
Token: abc123def456...
URL: http://localhost:3000/verify-email?token=abc123def456...&user_id=xxx
```

### 1.3 验证邮箱

```bash
curl -X GET "http://localhost:8080/api/v1/auth/verify-email?token=TOKEN&user_id=USER_ID"
```

**预期响应**：
```json
{
  "code": 200,
  "message": "邮箱验证成功"
}
```

**验证点**：
- 返回 200 状态码
- 数据库中 `email_verification_tokens` 表记录 `used=true`
- 用户 `email_verified` 字段变为 `true`

### 1.4 重复使用令牌（应失败）

```bash
curl -X GET "http://localhost:8080/api/v1/auth/verify-email?token=TOKEN&user_id=USER_ID"
```

**预期响应**：
```json
{
  "code": 410,
  "message": "验证令牌已使用"
}
```

### 1.5 重新发送验证邮件

```bash
curl -X POST http://localhost:8080/api/v1/auth/resend-verification \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**预期响应**：
```json
{
  "code": 200,
  "message": "验证邮件已发送"
}
```

---

## 二、密码重置流程测试

### 2.1 请求密码重置（防枚举）

```bash
# 存在的邮箱
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 不存在的邮箱（应返回相同响应）
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "nonexistent@example.com"}'
```

**预期响应**（两种情况相同）：
```json
{
  "code": 200,
  "message": "如果该邮箱已注册，重置密码邮件已发送"
}
```

**验证点**：
- 无论邮箱是否存在，都返回 200（防枚举攻击）
- Worker 日志显示重置链接（仅当邮箱存在时）

### 2.2 查看 Worker 日志获取重置令牌

```
Sending password reset email to test@example.com
Token: xyz789abc012...
URL: http://localhost:3000/reset-password?token=xyz789abc012...&user_id=xxx
```

### 2.3 执行密码重置

```bash
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN",
    "user_id": "USER_ID",
    "new_password": "newpassword456"
  }'
```

**预期响应**：
```json
{
  "code": 200,
  "message": "密码已重置，请重新登录"
}
```

**验证点**：
- 返回 200 状态码
- 数据库中 `password_reset_tokens` 表记录 `used=true`
- 使用新密码可以登录，旧密码无法登录

### 2.4 使用新密码登录

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "newpassword456"
  }'
```

**预期响应**：
```json
{
  "code": 200,
  "data": {
    "user": { "id": "...", "email": "test@example.com" },
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

---

## 三、WebSocket 实时推送测试

### 3.1 使用 wscat 测试 WebSocket 连接

安装 wscat：
```bash
npm install -g wscat
```

连接 WebSocket（需要先获取 access_token）：
```bash
wscat -c "ws://localhost:8080/ws?token=ACCESS_TOKEN"
```

**预期**：
- 连接成功建立
- Worker 日志显示 "WebSocket connected" 和 user_id

### 3.2 使用浏览器控制台测试

```javascript
const token = "YOUR_ACCESS_TOKEN";
const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

ws.onopen = () => console.log("Connected");
ws.onmessage = (event) => console.log("Message:", JSON.parse(event.data));
ws.onerror = (error) => console.error("Error:", error);
ws.onclose = () => console.log("Disconnected");
```

### 3.3 触发实时推送

在另一个终端，调用系统通知接口（需要管理员权限）：

```bash
curl -X POST http://localhost:8080/api/v1/admin/messages/system \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": "USER_ID",
    "category": "points",
    "title": "测试通知",
    "content": "这是一条实时推送测试消息"
  }'
```

**预期**：
- WebSocket 客户端收到消息：
```json
{
  "type": "system",
  "category": "points",
  "title": "测试通知",
  "content": "这是一条实时推送测试消息",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 3.4 测试断开连接

在 WebSocket 连接中按 `Ctrl+C` 或关闭浏览器标签：
- Worker 日志应显示连接断开
- Hub 自动清理该客户端

---

## 四、数据库验证

### 4.1 查看验证令牌表

```sql
SELECT id, user_id, token, used, expires_at, created_at 
FROM email_verification_tokens 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4.2 查看重置令牌表

```sql
SELECT id, user_id, token, used, expires_at, created_at 
FROM password_reset_tokens 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4.3 查看用户邮箱验证状态

```sql
SELECT id, email, email_verified, created_at 
FROM users 
WHERE email = 'test@example.com';
```

### 4.4 查看消息表

```sql
SELECT id, recipient_id, type, category, title, content, is_read, created_at 
FROM messages 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 五、错误场景测试

### 5.1 无效令牌格式

```bash
curl -X GET "http://localhost:8080/api/v1/auth/verify-email?token=invalid&user_id=xxx"
```
**预期**：404 或 400 错误

### 5.2 过期令牌

等待令牌过期后（默认 24 小时）尝试使用：
**预期**：410 错误 "验证令牌已过期"

### 5.3 用户 ID 不匹配

```bash
curl -X GET "http://localhost:8080/api/v1/auth/verify-email?token=VALID_TOKEN&user_id=WRONG_USER_ID"
```
**预期**：400 错误

### 5.4 WebSocket 无令牌连接

```bash
wscat -c "ws://localhost:8080/ws"
```
**预期**：401 错误

### 5.5 WebSocket 无效令牌

```bash
wscat -c "ws://localhost:8080/ws?token=invalid"
```
**预期**：401 错误

---

## 六、性能测试建议

### 6.1 并发注册测试

```bash
# 使用 hey 进行并发测试
hey -n 100 -c 10 -m POST \
    -H "Content-Type: application/json" \
    -d '{"email":"user{{.}}@test.com","password":"password123"}' \
    http://localhost:8080/api/v1/auth/register
```

### 6.2 WebSocket 连接压力测试

使用多个 wscat 实例或编写脚本创建多个连接，观察 Hub 的并发处理能力。

---

## 七、日志检查点

### API 服务日志
- 注册时：应看到 "Email verification event published"
- 密码重置：应看到 "Password reset event published"
- WebSocket 连接：应看到 "WebSocket upgrade request"

### Worker 服务日志
- 邮件发送：应看到 "Sending verification email" 或 "Sending password reset email"
- 实时推送：应看到 "Real-time push sent to user xxx"
- 错误：应看到详细的错误信息和堆栈

---

## 八、切换到 SMTP 模式测试

修改 `configs/development.yaml`：

```yaml
email:
  mode: smtp  # 改为 smtp
  smtp:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    from: "Your App <your-email@gmail.com>"
```

重启服务后，真实的验证/重置邮件将发送到用户邮箱。
