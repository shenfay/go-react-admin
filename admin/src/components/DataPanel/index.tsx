import { Card } from 'antd'
import type { ReactNode } from 'react'

interface DataPanelProps {
  title: string
  extra?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
}

export default function DataPanel({ title, extra, children, style }: DataPanelProps) {
  return (
    <Card
      title={title}
      extra={extra}
      style={{
        borderRadius: 'var(--radius-md)',
        borderColor: 'var(--border-color)',
        ...style,
      }}
      headStyle={{
        borderBottomColor: 'var(--border-color)',
        padding: '14px 20px',
        minHeight: 'auto',
      }}
      bodyStyle={{
        padding: '16px 20px',
      }}
    >
      {children}
    </Card>
  )
}
