import { useState } from 'react'
import { Table, Tag, Button, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'completed' },
  { label: '已归档', value: 'archived' },
]

const columns = [
  { title: '目标名称', dataIndex: 'name', key: 'name' },
  { title: '所属家庭', dataIndex: 'familyName', key: 'familyName' },
  { title: '目标类型', dataIndex: 'type', key: 'type' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, { bg: string; color: string }> = {
        active: { bg: 'var(--green-light)', color: 'var(--green-text)' },
        completed: { bg: 'var(--blue-light)', color: 'var(--blue-text)' },
        archived: { bg: 'var(--gray-light)', color: 'var(--gray-text)' },
      }
      const labelMap: Record<string, string> = {
        active: '进行中',
        completed: '已完成',
        archived: '已归档',
      }
      const c = colorMap[status] || { bg: 'var(--gray-light)', color: 'var(--gray-text)' }
      return <Tag style={{ background: c.bg, color: c.color }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function Goal() {
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <DataPanel
      title="目标管理"
      filters={
        <>
          <FilterSearch placeholder="搜索目标名称..." />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 140 }} options={statusOptions} />
          <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
        </>
      }
      toolbarActions={
        <Button type="primary" icon={<PlusOutlined />}>
          新增目标
        </Button>
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
