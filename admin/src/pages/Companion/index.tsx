import { Card, Table, Tag, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '伙伴名称', dataIndex: 'name', key: 'name' },
  {
    title: '性格类型',
    dataIndex: 'personality',
    key: 'personality',
    render: (personality: string) => {
      const labelMap: Record<string, string> = {
        explorer: '探索型',
        guardian: '守护型',
        creator: '创造型',
        thinker: '思考型',
      }
      return <Tag>{labelMap[personality] || personality}</Tag>
    },
  },
  { title: '解锁等级', dataIndex: 'unlockLevel', key: 'unlockLevel' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function Companion() {
  return (
    <Card
      title="伙伴模板管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增伙伴
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
