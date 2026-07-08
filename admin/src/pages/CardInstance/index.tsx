import { useState } from 'react'
import { Table, Tag, Button, Select } from 'antd'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'

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
        pending: { bg: '#fef3c7', color: '#92400e' },
        approved: { bg: '#dcfce7', color: '#166534' },
        rejected: { bg: '#fef2f2', color: '#e74c3c' },
        auto_passed: { bg: '#edf2ff', color: '#3b6fdf' },
      }
      const labelMap: Record<string, string> = {
        pending: '待验收',
        approved: '已通过',
        rejected: '已退回',
        auto_passed: '自动通过',
      }
      const c = colorMap[status] || { bg: '#f5f2ed', color: '#6b6258' }
      return <Tag style={{ background: c.bg, color: c.color, border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#b0a89a', width: 28, height: 28, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
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
