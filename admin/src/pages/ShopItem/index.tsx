import { Table, Tag, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const columns = [
  { title: '商品名称', dataIndex: 'name', key: 'name' },
  { title: '商品描述', dataIndex: 'description', key: 'description', ellipsis: true },
  {
    title: '积分价格',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => <Tag style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{price} 积分</Tag>,
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
      const colorMap: Record<string, { bg: string; color: string }> = {
        auto: { bg: '#dcfce7', color: '#166534' },
        notify: { bg: '#fef3c7', color: '#92400e' },
        approve: { bg: '#fef2f2', color: '#e74c3c' },
      }
      const c = colorMap[level] || { bg: '#f5f2ed', color: '#6b6258' }
      return <Tag style={{ background: c.bg, color: c.color, border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[level] || level}</Tag>
    },
  },
  { title: '库存', dataIndex: 'stock', key: 'stock' },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function ShopItem() {
  return (
    <DataPanel
      title="商品管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增商品
        </Button>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </DataPanel>
  )
}
