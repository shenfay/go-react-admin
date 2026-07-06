/**
 * 全局类型定义
 */

// 通用响应结构
export interface ApiResponse<T = unknown> {
  code: string
  message: string
  data: T
}

// 分页参数
export interface PaginationParams {
  current: number
  pageSize: number
}

// 分页结果
export interface PaginationResult<T> {
  list: T[]
  total: number
  current: number
  pageSize: number
}

// 角色简要信息
export interface RoleBrief {
  id: string
  name: string
  code: string
}

// 用户权限信息
export interface UserPermission {
  roles: RoleBrief[]
  permissions: string[]
  menus: string[]
}

// 用户
export interface User {
  id: string
  email: string
  name: string
  email_verified: boolean
  locked: boolean
  roles: RoleBrief[]
  last_login_at?: string
  created_at: string
  updated_at: string
}

// 用户列表响应
export interface UserListResponse {
  users: User[]
  total: number
}

// 角色
export interface Role {
  id: string
  name: string
  code: string
  description: string
  status: boolean
  created_at: string
  updated_at: string
}

// 角色权限
export interface RolePermission {
  id?: number
  role_id: string
  permission_key: string
  menu_key: string
}

// 登录请求
export interface LoginRequest {
  email: string
  password: string
}

// 登录响应
export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    email_verified: boolean
    created_at: string
  }
  access_token: string
  refresh_token: string
  expires_in: number
  permissions?: UserPermission
}

// 菜单树节点
export interface MenuTreeNode {
  key: string
  title: string
  children?: MenuTreeNode[]
}

// 活动记录
export interface Activity {
  id: string
  user: string
  action: string
  status: string
  time: string
}

// 服务状态
export interface ServiceStatus {
  name: string
  health: number
  status: string
}

// 数据源
export interface DataSource {
  name: string
  type: string
  status: string
  lastSync: string
  size: string
}

// 统计卡片
export interface StatCardData {
  label: string
  value: string | number
  change: number
  changeLabel: string
  color: string
}
