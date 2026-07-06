import { Card, Table, Tag, Space, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const columns = [
  { title: '卡片内容', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: '提交者', dataIndex: 'childName', key: 'childName' },
  { title: '所属目标', dataIndex: 'goalName', key: 'goalName' },
  { title: '卡片模板', dataIndex: 'templateName', key: 'templateName' },
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
        <Button type="link" icon={<EyeOutlined />} size="small">
          查看
        </Button>
      </Space>
    ),
  },
]

export default function CardInstance() {
  return (
    <Card title="卡片提交记录">
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
