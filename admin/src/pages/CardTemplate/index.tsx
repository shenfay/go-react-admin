import { Table, Tag, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const columns = [
  { title: '模板名称', dataIndex: 'name', key: 'name' },
  {
    title: '卡片类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => {
      const labelMap: Record<string, string> = {
        flash: '闪念卡',
        cause: '归因卡',
        digest: '消化卡',
        feynman: '费曼卡',
        daily3: '每日三件事',
      }
      return <Tag style={{ background: '#f5f2ed', color: '#6b6258', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[type] || type}</Tag>
    },
  },
  { title: '难度系数', dataIndex: 'difficulty', key: 'difficulty' },
  { title: '基础积分', dataIndex: 'basePoints', key: 'basePoints' },
  {
    title: '验收方式',
    dataIndex: 'acceptanceType',
    key: 'acceptanceType',
    render: (type: string) => (
      <Tag style={{
        background: type === 'auto' ? '#dcfce7' : '#fef3c7',
        color: type === 'auto' ? '#166534' : '#92400e',
        border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500,
      }}>
        {type === 'auto' ? '自动通过' : '家长验收'}
      </Tag>
    ),
  },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function CardTemplate() {
  return (
    <DataPanel
      title="卡片模板管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增模板
        </Button>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </DataPanel>
  )
}
