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
    operator: { userId: '2', username: '运营', role: 'operator' },
    viewer: { userId: '3', username: '观察员', role: 'viewer' },
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
    },
    {
      role: 'operator',
      roleName: '运营',
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
        'profile:view',
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
        'profile',
      ],
    },
    {
      role: 'viewer',
      roleName: '观察员',
      permissions: [
        'dashboard:view',
        'card_instance:view',
        'points:view',
        'profile:view',
      ],
      menus: [
        'dashboard',
        'card-instances',
        'points',
        'profile',
      ],
    },
  ]
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
