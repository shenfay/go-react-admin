import { useState } from 'react'
import { Table, Tag, Space, Button, Select } from 'antd'
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已完成', value: 'completed' },
]

const columns = [
  { title: '兑换者', dataIndex: 'childName', key: 'childName' },
  { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (points: number) => <Tag style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{points} 积分</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, { bg: string; color: string }> = {
        pending: { bg: '#fef3c7', color: '#92400e' },
        approved: { bg: '#dcfce7', color: '#166534' },
        rejected: { bg: '#fef2f2', color: '#e74c3c' },
        completed: { bg: '#edf2ff', color: '#3b6fdf' },
      }
      const labelMap: Record<string, string> = {
        pending: '待处理',
        approved: '已通过',
        rejected: '已拒绝',
        completed: '已完成',
      }
      const c = colorMap[status] || { bg: '#f5f2ed', color: '#6b6258' }
      return <Tag style={{ background: c.bg, color: c.color, border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size={4}>
        <Button type="text" size="small" icon={<CheckOutlined />} style={{ color: '#22c55e', width: 28, height: 28, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
        <Button type="text" size="small" icon={<CloseOutlined />} style={{ color: '#b0a89a', width: 28, height: 28, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
      </Space>
    ),
  },
]

export default function ExchangeOrder() {
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <DataPanel
      title="兑换订单"
      filters={
        <>
          <FilterSearch placeholder="搜索兑换者/商品..." />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 140 }} options={statusOptions} />
          <Button icon={<SearchOutlined />} style={{ color: '#2b2b2b' }}>查询</Button>
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
  )
}
