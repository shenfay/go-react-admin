import { Table, Tag, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

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
      return <Tag style={{ background: '#f5f2ed', color: '#6b6258', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[personality] || personality}</Tag>
    },
  },
  { title: '解锁等级', dataIndex: 'unlockLevel', key: 'unlockLevel' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function Companion() {
  return (
    <DataPanel
      title="伙伴模板管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增伙伴
        </Button>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </DataPanel>
  )
}
