/**
 * 表格分页默认配置
 * 所有列表页统一使用此配置，避免重复定义
 */
export const DEFAULT_PAGINATION = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
} as const
