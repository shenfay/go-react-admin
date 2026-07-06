import { useState } from 'react'
import { Card, Tree, Table, Tag, Button, Descriptions } from 'antd'
import { DatabaseOutlined, TableOutlined, LinkOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface ModelNode {
  id: string
  name: string
  type: 'database' | 'table' | 'field'
  children?: ModelNode[]
}

const modelData: ModelNode[] = [
  {
    id: 'db1',
    name: '数据仓库',
    type: 'database',
    children: [
      {
        id: 'dim1',
        name: 'dim_user（用户维度表）',
        type: 'table',
        children: [
          { id: 'f1', name: 'user_id (BIGINT, PK)', type: 'field' },
          { id: 'f2', name: 'user_name (VARCHAR)', type: 'field' },
          { id: 'f3', name: 'register_date (DATE)', type: 'field' },
          { id: 'f4', name: 'user_level (INT)', type: 'field' },
        ],
      },
      {
        id: 'dim2',
        name: 'dim_product（商品维度表）',
        type: 'table',
        children: [
          { id: 'f5', name: 'product_id (BIGINT, PK)', type: 'field' },
          { id: 'f6', name: 'product_name (VARCHAR)', type: 'field' },
          { id: 'f7', name: 'category_id (INT)', type: 'field' },
          { id: 'f8', name: 'price (DECIMAL)', type: 'field' },
        ],
      },
      {
        id: 'fact1',
        name: 'fact_order（订单事实表）',
        type: 'table',
        children: [
          { id: 'f9', name: 'order_id (BIGINT, PK)', type: 'field' },
          { id: 'f10', name: 'user_id (BIGINT, FK)', type: 'field' },
          { id: 'f11', name: 'product_id (BIGINT, FK)', type: 'field' },
          { id: 'f12', name: 'order_amount (DECIMAL)', type: 'field' },
          { id: 'f13', name: 'order_date (TIMESTAMP)', type: 'field' },
        ],
      },
    ],
  },
]

const lineageData = [
  { id: '1', source: 'ods_user', target: 'dim_user', relation: '清洗转换', status: '正常' },
  { id: '2', source: 'ods_product', target: 'dim_product', relation: '清洗转换', status: '正常' },
  { id: '3', source: 'ods_order', target: 'fact_order', relation: '关联聚合', status: '正常' },
  { id: '4', source: 'dim_user', target: 'fact_order', relation: '维度关联', status: '正常' },
  { id: '5', source: 'dim_product', target: 'fact_order', relation: '维度关联', status: '正常' },
]

export default function DataModeling() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const treeData = modelData.map(db => ({
    title: (
      <span>
        <DatabaseOutlined style={{ marginRight: 4 }} />
        {db.name}
      </span>
    ),
    key: db.id,
    children: db.children?.map(table => ({
      title: (
        <span>
          <TableOutlined style={{ marginRight: 4 }} />
          {table.name}
        </span>
      ),
      key: table.id,
      children: table.children?.map(field => ({
        title: field.name,
        key: field.id,
        isLeaf: true,
      })),
    })),
  }))

  const lineageColumns = [
    { title: '上游表', dataIndex: 'source', key: 'source', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '下游表', dataIndex: 'target', key: 'target', render: (v: string) => <Tag color="green">{v}</Tag> },
    { title: '关系类型', dataIndex: 'relation', key: 'relation' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color="success">{v}</Tag> },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
      <DataPanel title="模型树">
        <Tree
          treeData={treeData}
          onSelect={keys => setSelectedTable(keys[0] as string)}
        />
      </DataPanel>

      <div>
        {selectedTable && (
          <DataPanel title="表详情" style={{ marginBottom: 16 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="表名">dim_user</Descriptions.Item>
              <Descriptions.Item label="类型">维度表</Descriptions.Item>
              <Descriptions.Item label="存储引擎">ORC</Descriptions.Item>
              <Descriptions.Item label="数据量">1.2M 行</Descriptions.Item>
              <Descriptions.Item label="最近更新">2026-05-27 10:00:00</Descriptions.Item>
              <Descriptions.Item label="负责人">张小明</Descriptions.Item>
            </Descriptions>
          </DataPanel>
        )}

        <DataPanel
          title="血缘分析"
          extra={
            <Button type="link" icon={<LinkOutlined />}>
              查看全图
            </Button>
          }
        >
          <Table dataSource={lineageData} columns={lineageColumns} rowKey="id" pagination={false} />
        </DataPanel>
      </div>
    </div>
  )
}
