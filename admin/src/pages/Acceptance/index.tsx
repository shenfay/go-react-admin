import { Card, Table, Tag, Space, Button } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const columns = [
  { title: '卡片内容', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: '提交者', dataIndex: 'childName', key: 'childName' },
  { title: '所属目标', dataIndex: 'goalName', key: 'goalName' },
  {
    title: '验收状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red',
        auto_passed: 'blue',
      }
      const labelMap: Record<string, string> = {
        pending: '待验收',
        approved: '已通过',
        rejected: '已退回',
        auto_passed: '自动通过',
      }
      return <Tag color={colorMap[status]}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link" icon={<CheckOutlined />} size="small" style={{ color: '#52c41a' }}>
          通过
        </Button>
        <Button type="link" icon={<CloseOutlined />} size="small" danger>
          退回
        </Button>
      </Space>
    ),
  },
]

export default function Acceptance() {
  return (
    <Card title="验收管理">
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
