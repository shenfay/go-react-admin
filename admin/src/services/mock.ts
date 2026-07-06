/**
 * Mock 数据服务
 * 开发环境使用，生产环境可移除
 */

import type { PermissionConfig } from '@/config/permission'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 用户登录
export async function mockLogin(username: string, _password: string) {
  await delay(500)
  const users: Record<string, { userId: string; username: string; role: string }> = {
    admin: { userId: '1', username: '管理员', role: 'admin' },
    editor: { userId: '2', username: '编辑', role: 'editor' },
    member: { userId: '3', username: '成员', role: 'member' },
  }
  const user = users[username]
  if (!user) {
    throw new Error('用户名或密码错误')
  }
  return {
    token: `mock-token-${user.userId}`,
    ...user,
  }
}

// 获取权限配置
export async function mockGetPermissions(): Promise<PermissionConfig[]> {
  await delay(300)
  return [
    {
      role: 'admin',
      roleName: '管理员',
      permissions: [
        'dashboard:view',
        'data:overview',
        'data:report',
        'data:quality',
        'data:assets',
        'etl:manage',
        'modeling:view',
        'script:dev',
        'interface:manage',
        'subscription:manage',
        'metadata:view',
        'standard:manage',
        'security:manage',
        'alert:manage',
        'monitor:view',
        'user:manage',
        'permission:manage',
        'org:view',
        'profile:view',
        'content:manage',
        'workflow:manage',
        'api:manage',
        'operation:log',
        'audit:view',
        'setting:manage',
      ],
      menus: [
        'dashboard',
        'data-overview',
        'data-report',
        'data-quality',
        'data-assets',
        'etl-tasks',
        'data-modeling',
        'script-dev',
        'data-interface',
        'data-subscription',
        'metadata-mgmt',
        'data-standard',
        'data-security',
        'alert-rules',
        'monitor-dashboard',
        'user-management',
        'permission-management',
        'organization',
        'profile',
        'content-management',
        'workflow',
        'api-management',
        'operation-log',
        'audit-log',
        'system-settings',
      ],
    },
    {
      role: 'editor',
      roleName: '编辑',
      permissions: [
        'dashboard:view',
        'data:overview',
        'data:report',
        'content:manage',
        'workflow:manage',
      ],
      menus: [
        'dashboard',
        'data-overview',
        'data-report',
        'content-management',
        'workflow',
      ],
    },
    {
      role: 'member',
      roleName: '成员',
      permissions: ['dashboard:view', 'data:overview'],
      menus: ['dashboard', 'data-overview'],
    },
  ]
}

// 获取统计数据
export async function mockGetStats() {
  await delay(400)
  return {
    totalUsers: 12847,
    totalUsersChange: 12.5,
    dailyActive: 3291,
    dailyActiveChange: 8.2,
    apiCalls: 48500,
    apiCallsChange: 23.1,
    avgResponse: 1.2,
    avgResponseChange: -0.3,
  }
}

// 获取最近活动
export async function mockGetActivities() {
  await delay(300)
  return [
    { id: '1', user: '张小明', action: '创建对话「项目方案讨论」', status: '完成', time: '2 分钟前' },
    { id: '2', user: '李雪', action: '上传文件「Q2报告.pdf」', status: '处理中', time: '15 分钟前' },
    { id: '3', user: '王磊', action: '调用插件「数据分析」', status: '完成', time: '1 小时前' },
    { id: '4', user: '陈芳', action: '修改系统配置', status: '待审核', time: '2 小时前' },
    { id: '5', user: '赵鹏', action: '批量导入用户数据', status: '失败', time: '3 小时前' },
  ]
}

// 获取服务状态
export async function mockGetServices() {
  await delay(300)
  return [
    { name: 'API 网关', health: 95, status: '正常' },
    { name: '数据引擎', health: 87, status: '正常' },
    { name: '消息队列', health: 62, status: '警告' },
    { name: '存储服务', health: 91, status: '正常' },
    { name: '定时任务', health: 23, status: '异常' },
  ]
}

// 获取数据源
export async function mockGetDataSources() {
  await delay(400)
  return [
    { name: '业务主库', type: 'MySQL', status: '正常', lastSync: '3 分钟前', size: '2.4M 行' },
    { name: '日志中心', type: 'Elasticsearch', status: '正常', lastSync: '1 分钟前', size: '8.7M 条' },
    { name: '对象存储', type: 'S3', status: '延迟', lastSync: '42 分钟前', size: '156 GB' },
    { name: '消息队列', type: 'Kafka', status: '正常', lastSync: '实时', size: '12.3k/s' },
  ]
}

// 获取用户列表
export async function mockGetUsers() {
  await delay(400)
  return [
    { id: '1', name: '张小明', email: 'zhang@example.com', role: '管理员', dept: '技术部', status: '活跃', createdAt: '2026-01-15' },
    { id: '2', name: '李雪', email: 'lixue@example.com', role: '编辑', dept: '运营部', status: '活跃', createdAt: '2026-02-20' },
    { id: '3', name: '王磊', email: 'wanglei@example.com', role: '编辑', dept: '产品部', status: '待激活', createdAt: '2026-03-10' },
    { id: '4', name: '陈芳', email: 'chenfang@example.com', role: '成员', dept: '市场部', status: '活跃', createdAt: '2026-04-05' },
    { id: '5', name: '赵鹏', email: 'zhaopeng@example.com', role: '成员', dept: '技术部', status: '已禁用', createdAt: '2026-04-18' },
  ]
}
