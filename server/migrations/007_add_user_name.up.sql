-- 用户表增加 name 字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100) DEFAULT '';

-- 为已有用户设置默认名称（取邮箱前缀）
UPDATE users SET name = SPLIT_PART(email, '@', 1) WHERE name = '' OR name IS NULL;

COMMENT ON COLUMN users.name IS '用户名称';
