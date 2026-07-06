/**
 * 全局类型定义
 */

// 通用响应结构
export interface ApiResponse<T = unknown> {
  code: number
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

// 用户
export interface User {
  id: string
  name: string
  email: string
  role: string
  dept: string
  status: string
  createdAt: string
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
