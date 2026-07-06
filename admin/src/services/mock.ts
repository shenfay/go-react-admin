/**
 * Mock 数据服务
 * 开发环境使用，后端 API 就绪后可移除
 */

import type { UserPermission } from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 默认权限配置
const defaultPermissions: UserPermission = {
  roles: [{ id: 'role_admin', name: '管理员', code: 'admin' }],
  permissions: [
    'dashboard:view',
    'family:manage',
    'goal:manage',
    'card_template:manage',
    'card_instance:view',
    'companion:manage',
    'acceptance:manage',
    'points:view',
    'shop_item:manage',
    'exchange_order:manage',
    'user:manage',
    'permission:manage',
    'profile:view',
    'operation:log',
    'setting:manage',
  ],
  menus: [
    'dashboard',
    'family',
    'goals',
    'card-templates',
    'card-instances',
    'companions',
    'acceptance',
    'points',
    'shop-items',
    'exchange-orders',
    'user-management',
    'permission-management',
    'profile',
    'operation-log',
    'system-settings',
  ],
}

// 模拟登录
export async function mockLogin(email: string, _password: string) {
  await delay(500)

  const users: Record<string, { userId: string; name: string; email: string }> = {
    'admin@example.com': { userId: '1', name: '管理员', email: 'admin@example.com' },
    'operator@example.com': { userId: '2', name: '运营', email: 'operator@example.com' },
    'viewer@example.com': { userId: '3', name: '观察员', email: 'viewer@example.com' },
  }

  const user = users[email]
  if (!user) {
    throw new Error('用户名或密码错误')
  }

  return {
    user: {
      id: user.userId,
      email: user.email,
      name: user.name,
      email_verified: true,
      created_at: new Date().toISOString(),
    },
    access_token: `mock-token-${user.userId}`,
    refresh_token: `mock-refresh-${user.userId}`,
    expires_in: 7200,
    permissions: defaultPermissions,
  }
}

// 获取概览统计
export async function mockGetStats() {
  await delay(400)
  return {
    totalFamilies: 0,
    totalGoals: 0,
    totalCards: 0,
    pendingAcceptance: 0,
    totalPointsIssued: 0,
    totalPointsSpent: 0,
  }
}
