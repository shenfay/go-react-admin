import { Card, Table, Tag, Statistic, Row, Col, Space } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

const columns = [
  { title: '用户', dataIndex: 'userName', key: 'userName' },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag color={type === 'earn' ? 'green' : 'red'}>
        {type === 'earn' ? '获得' : '消费'}
      </Tag>
    ),
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (points: number, record: { type: string }) => (
      <span style={{ color: record.type === 'earn' ? '#52c41a' : '#ff4d4f' }}>
        {record.type === 'earn' ? '+' : '-'}
        {points}
      </span>
    ),
  },
  { title: '来源', dataIndex: 'source', key: 'source' },
  { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function PointsRecord() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="今日发放积分" value={0} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日消费积分" value={0} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="积分总余额" value={0} />
          </Card>
        </Col>
      </Row>
      <Card title="积分流水">
        <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
      </Card>
    </Space>
  )
}
