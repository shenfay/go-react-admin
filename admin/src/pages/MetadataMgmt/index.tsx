import { useState } from 'react'
import { Tree, Table, Tag, Input, Descriptions, Button } from 'antd'
import { DatabaseOutlined, TableOutlined, FieldStringOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const treeData = [
  {
    title: (
      <span>
        <DatabaseOutlined style={{ marginRight: 4 }} />
        ods_db（贴源层）
      </span>
    ),
    key: 'ods',
    children: [
      { title: 'ods_user', key: 'ods_user' },
      { title: 'ods_order', key: 'ods_order' },
      { title: 'ods_product', key: 'ods_product' },
    ],
  },
  {
    title: (
      <span>
        <DatabaseOutlined style={{ marginRight: 4 }} />
        dwd_db（明细层）
      </span>
    ),
    key: 'dwd',
    children: [
      { title: 'dwd_user_info', key: 'dwd_user_info' },
      { title: 'dwd_order_detail', key: 'dwd_order_detail' },
    ],
  },
  {
    title: (
      <span>
        <DatabaseOutlined style={{ marginRight: 4 }} />
        dws_db（汇总层）
      </span>
    ),
    key: 'dws',
    children: [
      { title: 'dws_user_stats', key: 'dws_user_stats' },
      { title: 'dws_order_stats', key: 'dws_order_stats' },
    ],
  },
  {
    title: (
      <span>
        <DatabaseOutlined style={{ marginRight: 4 }} />
        ads_db（应用层）
      </span>
    ),
    key: 'ads',
    children: [
      { title: 'ads_user_retention', key: 'ads_user_retention' },
      { title: 'ads_revenue_report', key: 'ads_revenue_report' },
    ],
  },
]

const fieldData = [
  { name: 'user_id', type: 'BIGINT', length: '-', nullable: '否', default: '-', comment: '用户唯一标识' },
  { name: 'user_name', type: 'VARCHAR', length: '64', nullable: '否', default: '-', comment: '用户姓名' },
  { name: 'email', type: 'VARCHAR', length: '128', nullable: '是', default: 'NULL', comment: '邮箱地址' },
  { name: 'phone', type: 'VARCHAR', length: '20', nullable: '是', default: 'NULL', comment: '手机号' },
  { name: 'register_date', type: 'DATE', length: '-', nullable: '否', default: 'CURRENT_DATE', comment: '注册日期' },
  { name: 'status', type: 'TINYINT', length: '1', nullable: '否', default: '1', comment: '状态: 1-正常, 0-禁用' },
]

const impactData = [
  { level: '上游', table: 'ods_user', relation: '直接来源', field: 'user_id, user_name' },
  { level: '下游', table: 'dwd_user_info', relation: '清洗转换', field: 'user_id, user_name, email' },
  { level: '下游', table: 'dws_user_stats', relation: '聚合统计', field: 'user_id' },
  { level: '下游', table: 'ads_user_retention', relation: '留存分析', field: 'user_id, register_date' },
]

export default function MetadataMgmt() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const fieldColumns = [
    { title: '字段名', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '长度', dataIndex: 'length', key: 'length' },
    { title: '可空', dataIndex: 'nullable', key: 'nullable' },
    { title: '默认值', dataIndex: 'default', key: 'default' },
    { title: '注释', dataIndex: 'comment', key: 'comment' },
  ]

  const impactColumns = [
    { title: '层级', dataIndex: 'level', key: 'level', render: (v: string) => <Tag color={v === '上游' ? 'blue' : 'green'}>{v}</Tag> },
    { title: '表名', dataIndex: 'table', key: 'table' },
    { title: '关系', dataIndex: 'relation', key: 'relation' },
    { title: '关联字段', dataIndex: 'field', key: 'field' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      <DataPanel title="数据分层">
        <Input.Search placeholder="搜索表名" style={{ marginBottom: 12 }} />
        <Tree treeData={treeData} onSelect={keys => setSelectedTable(keys[0] as string)} />
      </DataPanel>

      <div>
        <DataPanel title="数据字典" style={{ marginBottom: 16 }}>
          <Table dataSource={fieldData} columns={fieldColumns} pagination={false} size="small" />
        </DataPanel>

        <DataPanel title="影响分析">
          <Table dataSource={impactData} columns={impactColumns} pagination={false} size="small" />
        </DataPanel>
      </div>
    </div>
  )
}
