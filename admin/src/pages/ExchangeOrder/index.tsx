import { Card, Table, Tag, Space, Button } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const columns = [
  { title: '兑换者', dataIndex: 'childName', key: 'childName' },
  { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (points: number) => <Tag color="gold">{points} 积分</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red',
        completed: 'blue',
      }
      const labelMap: Record<string, string> = {
        pending: '待处理',
        approved: '已通过',
        rejected: '已拒绝',
        completed: '已完成',
      }
      return <Tag color={colorMap[status]}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link" icon={<CheckOutlined />} size="small" style={{ color: '#52c41a' }}>
          通过
        </Button>
        <Button type="link" icon={<CloseOutlined />} size="small" danger>
          拒绝
        </Button>
      </Space>
    ),
  },
]

export default function ExchangeOrder() {
  return (
    <Card title="兑换订单">
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
