import { useState } from 'react'
import { Table, Tag, Button, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import { DEFAULT_PAGINATION } from '@/config/pagination'

const personalityOptions = [
  { label: '全部性格', value: '' },
  { label: '探索型', value: 'explorer' },
  { label: '守护型', value: 'guardian' },
  { label: '创造型', value: 'creator' },
  { label: '思考型', value: 'thinker' },
]

const columns = [
  { title: '伙伴名称', dataIndex: 'name', key: 'name' },
  {
    title: '性格类型',
    dataIndex: 'personality',
    key: 'personality',
    render: (personality: string) => {
      const labelMap: Record<string, string> = {
        explorer: '探索型',
        guardian: '守护型',
        creator: '创造型',
        thinker: '思考型',
      }
      return <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)' }}>{labelMap[personality] || personality}</Tag>
    },
  },
  { title: '解锁等级', dataIndex: 'unlockLevel', key: 'unlockLevel' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function Companion() {
  const [personalityFilter, setPersonalityFilter] = useState('')

  return (
    <DataPanel
      title="伙伴模板管理"
      filters={
        <>
          <FilterSearch placeholder="搜索伙伴名称..." />
          <Select value={personalityFilter} onChange={setPersonalityFilter} style={{ width: 140 }} options={personalityOptions} />
          <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
        </>
      }
      toolbarActions={
        <Button type="primary" icon={<PlusOutlined />}>
          新增伙伴
        </Button>
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
