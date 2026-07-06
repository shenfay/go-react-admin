import { Card, Table, Tag, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '家庭名称', dataIndex: 'name', key: 'name' },
  { title: '家长', dataIndex: 'parentName', key: 'parentName' },
  { title: '孩子数', dataIndex: 'childrenCount', key: 'childrenCount' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'active' ? 'green' : 'default'}>
        {status === 'active' ? '活跃' : '未激活'}
      </Tag>
    ),
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function Family() {
  return (
    <Card
      title="家庭管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增家庭
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
