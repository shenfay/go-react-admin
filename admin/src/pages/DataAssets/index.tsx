import { useState } from 'react'
import { Table, Tag, Button, Input, Progress } from 'antd'
import { DatabaseOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface AssetItem {
  id: string
  name: string
  type: string
  owner: string
  storage: string
  records: string
  quality: number
  status: string
  updatedAt: string
}

const assetData: AssetItem[] = [
  { id: '1', name: 'ods_user', type: '表', owner: '技术部', storage: 'Hive', records: '1,284,562', quality: 98, status: '已注册', updatedAt: '2026-05-27' },
  { id: '2', name: 'dim_product', type: '表', owner: '技术部', storage: 'Hive', records: '52,380', quality: 96, status: '已注册', updatedAt: '2026-05-27' },
  { id: '3', name: 'fact_order', type: '表', owner: '技术部', storage: 'ClickHouse', records: '8,920,145', quality: 94, status: '已注册', updatedAt: '2026-05-26' },
  { id: '4', name: 'user_behavior_stream', type: '流', owner: '数据组', storage: 'Kafka', records: '45,000,000+', quality: 87, status: '已注册', updatedAt: '2026-05-26' },
  { id: '5', name: 'weekly_report_v3', type: '文件', owner: '运营部', storage: 'S3', records: '156', quality: 100, status: '待审核', updatedAt: '2026-05-25' },
  { id: '6', name: 'api_access_log', type: '表', owner: '技术部', storage: 'Elasticsearch', records: '125,000,000', quality: 91, status: '已注册', updatedAt: '2026-05-24' },
]

export default function DataAssets() {
  const [searchText, setSearchText] = useState('')

  const columns = [
    { title: '资产名称', dataIndex: 'name', key: 'name', render: (v: string) => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    { title: '负责人', dataIndex: 'owner', key: 'owner' },
    { title: '存储位置', dataIndex: 'storage', key: 'storage', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '记录数', dataIndex: 'records', key: 'records' },
    { title: '数据质量', dataIndex: 'quality', key: 'quality', render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 90 ? 'var(--green)' : v >= 80 ? 'var(--yellow)' : 'var(--red)'} /> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === '已注册' ? 'success' : 'warning'}>{v}</Tag> },
    { title: '更新日期', dataIndex: 'updatedAt', key: 'updatedAt' },
  ]

  const filtered = assetData.filter(item =>
    !searchText || item.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div>
      <DataPanel
        title="数据资产目录"
        extra={
          <Input.Search
            placeholder="搜索资产名称..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
          />
        }
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </DataPanel>
    </div>
  )
}
