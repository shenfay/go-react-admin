import { Card, Table, Tag, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '目标名称', dataIndex: 'name', key: 'name' },
  { title: '所属家庭', dataIndex: 'familyName', key: 'familyName' },
  { title: '目标类型', dataIndex: 'type', key: 'type' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        active: 'green',
        completed: 'blue',
        archived: 'default',
      }
      const labelMap: Record<string, string> = {
        active: '进行中',
        completed: '已完成',
        archived: '已归档',
      }
      return <Tag color={colorMap[status]}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function Goal() {
  return (
    <Card
      title="目标管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增目标
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </Card>
  )
}
