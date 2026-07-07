/**
 * 菜单管理 API
 */
import request from '@/utils/request'

/** 菜单节点 */
export interface MenuNode {
  id: string
  key: string
  label: string
  icon: string
  path: string
  permission: string
  parent_id: string
  sort_order: number
  status: boolean
  children?: MenuNode[]
  created_at: string
  updated_at: string
}

/** 获取菜单树 */
export async function getMenuTree(): Promise<MenuNode[]> {
  return request.get('/v1/admin/menus')
}

/** 创建菜单 */
export async function createMenu(data: {
  key: string
  label: string
  icon?: string
  path?: string
  permission?: string
  parent_id?: string
  sort_order?: number
}): Promise<MenuNode> {
  return request.post('/v1/admin/menus', data)
}

/** 更新菜单 */
export async function updateMenu(
  id: string,
  data: {
    label: string
    icon?: string
    path?: string
    permission?: string
  }
): Promise<MenuNode> {
  return request.put(`/v1/admin/menus/${id}`, data)
}

/** 删除菜单 */
export async function deleteMenu(id: string) {
  return request.delete(`/v1/admin/menus/${id}`)
}

/** 切换菜单状态 */
export async function toggleMenuStatus(id: string) {
  return request.patch(`/v1/admin/menus/${id}/status`)
}

/** 更新菜单排序 */
export async function updateMenuSort(items: { id: string; sort_order: number }[]) {
  return request.put('/v1/admin/menus/sort', { items })
}
