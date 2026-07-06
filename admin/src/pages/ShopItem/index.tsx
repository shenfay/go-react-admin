import { Card, Table, Tag, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '商品名称', dataIndex: 'name', key: 'name' },
  { title: '商品描述', dataIndex: 'description', key: 'description', ellipsis: true },
  {
    title: '积分价格',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => <Tag color="gold">{price} 积分</Tag>,
  },
  {
    title: '审批级别',
    dataIndex: 'approvalLevel',
    key: 'approvalLevel',
    render: (level: string) => {
      const labelMap: Record<string, string> = {
        auto: '自动通过',
        notify: '通知家长',
        approve: '需审批',
      }
      const colorMap: Record<string, string> = {
        auto: 'green',
        notify: 'orange',
        approve: 'red',
      }
      return <Tag color={colorMap[level]}>{labelMap[level] || level}</Tag>
    },
  },
  { title: '库存', dataIndex: 'stock', key: 'stock' },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function ShopItem() {
  return (
    <Card
      title="商品管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增商品
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
