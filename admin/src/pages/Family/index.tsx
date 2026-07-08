import { useState } from 'react'
import { Table, Button, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '活跃', value: 'active' },
  { label: '未激活', value: 'inactive' },
]

const columns = [
  { title: '家庭名称', dataIndex: 'name', key: 'name' },
  { title: '家长', dataIndex: 'parentName', key: 'parentName' },
  { title: '孩子数', dataIndex: 'childrenCount', key: 'childrenCount' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: status === 'active' ? '#22c55e' : '#d4cdc0',
          display: 'inline-block',
        }} />
        <span style={{ color: '#2b2b2b', fontSize: 13 }}>{status === 'active' ? '活跃' : '未激活'}</span>
      </div>
    ),
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
]

export default function Family() {
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <DataPanel
      title="家庭管理"
      filters={
        <>
          <FilterSearch placeholder="搜索家庭名称..." />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 140 }} options={statusOptions} />
          <Button icon={<SearchOutlined />} style={{ color: '#2b2b2b' }}>查询</Button>
        </>
      }
      toolbarActions={
        <Button type="primary" icon={<PlusOutlined />}>
          新增家庭
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
