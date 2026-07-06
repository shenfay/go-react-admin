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

/** 权限检查工具 */
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
