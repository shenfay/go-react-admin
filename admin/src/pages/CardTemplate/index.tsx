import { useState } from 'react'
import { Table, Tag, Button, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import { DEFAULT_PAGINATION } from '@/config/pagination'

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '闪念卡', value: 'flash' },
  { label: '归因卡', value: 'cause' },
  { label: '消化卡', value: 'digest' },
  { label: '费曼卡', value: 'feynman' },
  { label: '每日三件事', value: 'daily3' },
]

const acceptanceOptions = [
  { label: '全部验收方式', value: '' },
  { label: '自动通过', value: 'auto' },
  { label: '家长验收', value: 'manual' },
]

const columns = [
  { title: '模板名称', dataIndex: 'name', key: 'name' },
  {
    title: '卡片类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => {
      const labelMap: Record<string, string> = {
        flash: '闪念卡',
        cause: '归因卡',
        digest: '消化卡',
        feynman: '费曼卡',
        daily3: '每日三件事',
      }
      return <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)' }}>{labelMap[type] || type}</Tag>
    },
  },
  { title: '难度系数', dataIndex: 'difficulty', key: 'difficulty' },
  { title: '基础积分', dataIndex: 'basePoints', key: 'basePoints' },
  {
    title: '验收方式',
    dataIndex: 'acceptanceType',
    key: 'acceptanceType',
    render: (type: string) => (
      <Tag style={{
        background: type === 'auto' ? 'var(--green-light)' : 'var(--yellow-light)',
        color: type === 'auto' ? 'var(--green-text)' : 'var(--yellow-text)',
      }}>
        {type === 'auto' ? '自动通过' : '家长验收'}
      </Tag>
    ),
  },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function CardTemplate() {
  const [typeFilter, setTypeFilter] = useState('')
  const [acceptanceFilter, setAcceptanceFilter] = useState('')

  return (
    <DataPanel
      title="卡片模板管理"
      filters={
        <>
          <FilterSearch placeholder="搜索模板名称..." />
          <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 140 }} options={typeOptions} />
          <Select value={acceptanceFilter} onChange={setAcceptanceFilter} style={{ width: 140 }} options={acceptanceOptions} />
          <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
        </>
      }
      toolbarActions={
        <Button type="primary" icon={<PlusOutlined />}>
          新增模板
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
