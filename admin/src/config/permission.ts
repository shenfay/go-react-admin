/**
 * 权限配置
 * 支持本地配置或从后端接口加载
 */

export interface PermissionConfig {
  /** 角色编码 */
  role: string
  /** 角色名称 */
  roleName: string
  /** 权限列表 */
  permissions: string[]
  /** 菜单权限 */
  menus: string[]
}

/** 默认权限配置（本地模拟） */
export const defaultPermissions: PermissionConfig[] = [
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

/** 权限检查 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  if (!requiredPermission) return true
  return userPermissions.includes(requiredPermission)
}

/** 检查是否有任意一个权限 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  return requiredPermissions.some(p => userPermissions.includes(p))
}
