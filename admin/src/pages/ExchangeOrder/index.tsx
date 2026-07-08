import { useState } from 'react'
import { Table, Tag, Space, Button, Select } from 'antd'
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import { DEFAULT_PAGINATION } from '@/config/pagination'

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
    render: (points: number) => <Tag style={{ background: 'var(--yellow-light)', color: 'var(--yellow-text)' }}>{points} 积分</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'var(--yellow-light)', color: 'var(--yellow-text)' },
        approved: { bg: 'var(--green-light)', color: 'var(--green-text)' },
        rejected: { bg: 'var(--red-light)', color: 'var(--red-text)' },
        completed: { bg: 'var(--blue-light)', color: 'var(--blue-text)' },
      }
      const labelMap: Record<string, string> = {
        pending: '待处理',
        approved: '已通过',
        rejected: '已拒绝',
        completed: '已完成',
      }
      const c = colorMap[status] || { bg: 'var(--gray-light)', color: 'var(--gray-text)' }
      return <Tag style={{ background: c.bg, color: c.color }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size={4}>
        <Button type="link" size="small" icon={<CheckOutlined />}>通过</Button>
        <Button type="link" size="small" icon={<CloseOutlined />}>拒绝</Button>
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
          <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
        </>
      }
    >
      <Table
        columns={columns}
        dataSource={[]}
        rowKey="id"
        locale={{ emptyText: '暂无数据' }}
        pagination={DEFAULT_PAGINATION}
      />
    </DataPanel>
  )
}
