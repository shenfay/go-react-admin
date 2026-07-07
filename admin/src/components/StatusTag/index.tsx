import { Tag } from 'antd'
import type { ReactNode } from 'react'

export type StatusType =
  | '完成'
  | '处理中'
  | '待审核'
  | '失败'
  | '正常'
  | '警告'
  | '异常'
  | '活跃'
  | '待激活'
  | '已禁用'
  | '延迟'
  | string

interface StatusTagProps {
  status: StatusType
  children?: ReactNode
}

const statusColorMap: Record<string, { color: string; bg: string }> = {
  完成: { color: '#166534', bg: '#dcfce7' },
  正常: { color: '#166534', bg: '#dcfce7' },
  活跃: { color: '#166534', bg: '#dcfce7' },
  处理中: { color: '#3b6fdf', bg: '#edf2ff' },
  待审核: { color: '#92400e', bg: '#fef3c7' },
  警告: { color: '#92400e', bg: '#fef3c7' },
  延迟: { color: '#92400e', bg: '#fef3c7' },
  待激活: { color: '#92400e', bg: '#fef3c7' },
  失败: { color: '#e74c3c', bg: '#fef2f2' },
  异常: { color: '#e74c3c', bg: '#fef2f2' },
  已禁用: { color: '#e74c3c', bg: '#fef2f2' },
  管理员: { color: '#3b6fdf', bg: '#edf2ff' },
  编辑: { color: '#6b6258', bg: '#f5f2ed' },
  成员: { color: '#6b6258', bg: '#f5f2ed' },
  MySQL: { color: '#3b6fdf', bg: '#edf2ff' },
  Elasticsearch: { color: '#6b6258', bg: '#f5f2ed' },
  S3: { color: '#6b6258', bg: '#f5f2ed' },
  Kafka: { color: '#6b6258', bg: '#f5f2ed' },
}

export default function StatusTag({ status, children }: StatusTagProps) {
  const style = statusColorMap[status] || { color: '#6b6258', bg: '#f5f2ed' }

  return (
    <Tag
      style={{
        color: style.color,
        background: style.bg,
        border: 'none',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 10px',
        lineHeight: '20px',
      }}
    >
      {children || status}
    </Tag>
  )
}
