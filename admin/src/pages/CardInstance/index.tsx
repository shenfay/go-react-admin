import { useState } from 'react'
import { Table, Tag, Button, Select } from 'antd'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import { DEFAULT_PAGINATION } from '@/config/pagination'

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待验收', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已退回', value: 'rejected' },
  { label: '自动通过', value: 'auto_passed' },
]

const columns = [
  { title: '卡片内容', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: '提交者', dataIndex: 'childName', key: 'childName' },
  { title: '所属目标', dataIndex: 'goalName', key: 'goalName' },
  { title: '卡片模板', dataIndex: 'templateName', key: 'templateName' },
  {
    title: '验收状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'var(--yellow-light)', color: 'var(--yellow-text)' },
        approved: { bg: 'var(--green-light)', color: 'var(--green-text)' },
        rejected: { bg: 'var(--red-light)', color: 'var(--red-text)' },
        auto_passed: { bg: 'var(--blue-light)', color: 'var(--blue-text)' },
      }
      const labelMap: Record<string, string> = {
        pending: '待验收',
        approved: '已通过',
        rejected: '已退回',
        auto_passed: '自动通过',
      }
      const c = colorMap[status] || { bg: 'var(--gray-light)', color: 'var(--gray-text)' }
      return <Tag style={{ background: c.bg, color: c.color }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
    ),
  },
]

export default function CardInstance() {
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <DataPanel
      title="卡片提交记录"
      filters={
        <>
          <FilterSearch placeholder="搜索卡片内容..." />
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
