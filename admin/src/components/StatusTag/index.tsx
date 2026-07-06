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
  完成: { color: 'var(--green-text)', bg: 'var(--green-light)' },
  正常: { color: 'var(--green-text)', bg: 'var(--green-light)' },
  活跃: { color: 'var(--green-text)', bg: 'var(--green-light)' },
  处理中: { color: 'var(--blue-text)', bg: 'var(--blue-light)' },
  待审核: { color: 'var(--yellow-text)', bg: 'var(--yellow-light)' },
  警告: { color: 'var(--yellow-text)', bg: 'var(--yellow-light)' },
  延迟: { color: 'var(--yellow-text)', bg: 'var(--yellow-light)' },
  待激活: { color: 'var(--yellow-text)', bg: 'var(--yellow-light)' },
  失败: { color: 'var(--red-text)', bg: 'var(--red-light)' },
  异常: { color: 'var(--red-text)', bg: 'var(--red-light)' },
  已禁用: { color: 'var(--red-text)', bg: 'var(--red-light)' },
  管理员: { color: 'var(--blue-text)', bg: 'var(--blue-light)' },
  编辑: { color: 'var(--gray-text)', bg: 'var(--gray-light)' },
  成员: { color: 'var(--gray-text)', bg: 'var(--gray-light)' },
  MySQL: { color: 'var(--blue-text)', bg: 'var(--blue-light)' },
  Elasticsearch: { color: 'var(--gray-text)', bg: 'var(--gray-light)' },
  S3: { color: 'var(--gray-text)', bg: 'var(--gray-light)' },
  Kafka: { color: 'var(--gray-text)', bg: 'var(--gray-light)' },
}

export default function StatusTag({ status, children }: StatusTagProps) {
  const style = statusColorMap[status] || { color: 'var(--gray-text)', bg: 'var(--gray-light)' }

  return (
    <Tag
      style={{
        color: style.color,
        background: style.bg,
        border: 'none',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 8px',
      }}
    >
      {children || status}
    </Tag>
  )
}
