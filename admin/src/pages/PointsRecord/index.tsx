import { useState } from 'react'
import { Table, Tag, Statistic, Row, Col, Card, Button, Select } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '获得', value: 'earn' },
  { label: '消费', value: 'spend' },
]

const columns = [
  { title: '用户', dataIndex: 'userName', key: 'userName' },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag style={{
        background: type === 'earn' ? 'var(--green-light)' : 'var(--red-light)',
        color: type === 'earn' ? 'var(--green-text)' : 'var(--red-text)',
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
      <span style={{ color: record.type === 'earn' ? 'var(--green)' : 'var(--red)', fontSize: 13 }}>
        {record.type === 'earn' ? '+' : '-'}{points}
      </span>
    ),
  },
  { title: '来源', dataIndex: 'source', key: 'source' },
  { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function PointsRecord() {
  const [typeFilter, setTypeFilter] = useState('')

  return (
    <div>
      <div style={{ padding: '20px 28px 0' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card style={{ borderRadius: 'var(--radius-md)', borderColor: 'var(--border-light)' }}>
              <Statistic title="今日发放积分" value={0} prefix={<ArrowUpOutlined />} valueStyle={{ color: 'var(--green)' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: 'var(--radius-md)', borderColor: 'var(--border-light)' }}>
              <Statistic title="今日消费积分" value={0} prefix={<ArrowDownOutlined />} valueStyle={{ color: 'var(--red)' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: 'var(--radius-md)', borderColor: 'var(--border-light)' }}>
              <Statistic title="积分总余额" value={0} />
            </Card>
          </Col>
        </Row>
      </div>
      <DataPanel
        title="积分流水"
        style={{ marginTop: 16 }}
        filters={
          <>
            <FilterSearch placeholder="搜索用户/来源..." />
            <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 120 }} options={typeOptions} />
            <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
          </>
        }
      >
        <Table
          columns={columns}
          dataSource={[]}
          rowKey="id"
          locale={{ emptyText: '暂无数据' }}
          pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条记录` }}
        />
      </DataPanel>
    </div>
  )
}
