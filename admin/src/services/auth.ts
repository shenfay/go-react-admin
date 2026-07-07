/**
 * 认证相关 API
 */
import request from '@/utils/request'
import type { LoginRequest, LoginResponse, UserPermission } from '@/types'

/** 菜单树节点（后端返回） */
export interface MenuTreeNode {
  id: string
  key: string
  label: string
  icon: string
  path: string
  permission: string
  parent_id: string
  sort_order: number
  status: boolean
  children?: MenuTreeNode[]
}

/** 登录 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request.post('/v1/auth/login', data)
}

/** 获取当前用户信息 */
export async function getCurrentUser() {
  return request.get('/v1/auth/me')
}

/** 获取当前用户权限 */
export async function getPermissions(): Promise<UserPermission> {
  return request.get('/v1/auth/permissions')
}

/** 获取当前用户菜单树 */
export async function getUserMenuTree(): Promise<MenuTreeNode[]> {
  return request.get('/v1/auth/menus')
}

/** 登出 */
export async function logout() {
  return request.post('/v1/auth/logout')
}
