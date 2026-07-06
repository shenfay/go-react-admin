import { Card, Table, Tag, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

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
      return <Tag>{labelMap[type] || type}</Tag>
    },
  },
  { title: '难度系数', dataIndex: 'difficulty', key: 'difficulty' },
  { title: '基础积分', dataIndex: 'basePoints', key: 'basePoints' },
  {
    title: '验收方式',
    dataIndex: 'acceptanceType',
    key: 'acceptanceType',
    render: (type: string) => (
      <Tag color={type === 'auto' ? 'green' : 'orange'}>
        {type === 'auto' ? '自动通过' : '家长验收'}
      </Tag>
    ),
  },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function CardTemplate() {
  return (
    <Card
      title="卡片模板管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增模板
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
