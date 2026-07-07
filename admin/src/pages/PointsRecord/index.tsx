import { Table, Tag, Statistic, Row, Col, Card } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const columns = [
  { title: '用户', dataIndex: 'userName', key: 'userName' },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag style={{
        background: type === 'earn' ? '#dcfce7' : '#fef2f2',
        color: type === 'earn' ? '#166534' : '#e74c3c',
        border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500,
      }}>
        {type === 'earn' ? '获得' : '消费'}
      </Tag>
    ),
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (points: number, record: { type: string }) => (
      <span style={{ color: record.type === 'earn' ? '#22c55e' : '#e74c3c', fontSize: 13 }}>
        {record.type === 'earn' ? '+' : '-'}{points}
      </span>
    ),
  },
  { title: '来源', dataIndex: 'source', key: 'source' },
  { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function PointsRecord() {
  return (
    <div>
      <div style={{ padding: '20px 28px 0' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card style={{ borderRadius: 12, borderColor: '#efeae2' }}>
              <Statistic title="今日发放积分" value={0} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#22c55e' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: 12, borderColor: '#efeae2' }}>
              <Statistic title="今日消费积分" value={0} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#e74c3c' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: 12, borderColor: '#efeae2' }}>
              <Statistic title="积分总余额" value={0} />
            </Card>
          </Col>
        </Row>
      </div>
      <DataPanel title="积分流水" description="查看积分收支明细" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
      </DataPanel>
    </div>
  )
}
