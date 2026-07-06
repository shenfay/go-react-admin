import { useState } from 'react'
import { Button, Table, Tag, Switch, Modal, Form, Input, Select, InputNumber, Descriptions } from 'antd'
import { ApiOutlined, EyeOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface DataInterface {
  id: string
  name: string
  path: string
  method: string
  dataSource: string
  qps: number
  status: boolean
  createdAt: string
}

const interfaceData: DataInterface[] = [
  { id: '1', name: '用户详情查询', path: '/api/v1/user/detail', method: 'GET', dataSource: 'MySQL', qps: 1200, status: true, createdAt: '2026-01-15' },
  { id: '2', name: '订单列表查询', path: '/api/v1/order/list', method: 'POST', dataSource: 'ClickHouse', qps: 800, status: true, createdAt: '2026-02-20' },
  { id: '3', name: '商品搜索', path: '/api/v1/product/search', method: 'GET', dataSource: 'Elasticsearch', qps: 2500, status: true, createdAt: '2026-03-10' },
  { id: '4', name: '实时数据推送', path: '/api/v1/data/stream', method: 'GET', dataSource: 'Kafka', qps: 5000, status: false, createdAt: '2026-04-05' },
]

export default function DataInterface() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState<DataInterface | null>(null)
  const [form] = Form.useForm()

  const columns = [
    { title: '接口名称', dataIndex: 'name', key: 'name' },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
      render: (v: string, record: DataInterface) => (
        <span>
          <Tag color={record.method === 'GET' ? 'green' : 'blue'}>{record.method}</Tag>
          <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{v}</span>
        </span>
      ),
    },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'QPS', dataIndex: 'qps', key: 'qps' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: boolean) => <Switch checked={v} size="small" />,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DataInterface) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => setSelectedInterface(record)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="数据接口列表"
        extra={
          <Button type="primary" icon={<ApiOutlined />} onClick={() => setIsModalOpen(true)}>
            注册接口
          </Button>
        }
      >
        <Table dataSource={interfaceData} columns={columns} rowKey="id" />
      </DataPanel>

      {selectedInterface && (
        <DataPanel title="接口详情" style={{ marginTop: 16 }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="接口名称">{selectedInterface.name}</Descriptions.Item>
            <Descriptions.Item label="请求路径">{selectedInterface.path}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{selectedInterface.method}</Descriptions.Item>
            <Descriptions.Item label="数据源">{selectedInterface.dataSource}</Descriptions.Item>
            <Descriptions.Item label="QPS 限制">{selectedInterface.qps}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedInterface.createdAt}</Descriptions.Item>
          </Descriptions>
        </DataPanel>
      )}

      <Modal
        title="注册数据接口"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="接口名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="请求路径" name="path" rules={[{ required: true }]}>
            <Input placeholder="/api/v1/..." />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="请求方法" name="method" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="数据源" name="dataSource" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Select.Option value="MySQL">MySQL</Select.Option>
                <Select.Option value="ClickHouse">ClickHouse</Select.Option>
                <Select.Option value="Elasticsearch">Elasticsearch</Select.Option>
                <Select.Option value="Hive">Hive</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="QPS 限制" name="qps" rules={[{ required: true }]}>
            <InputNumber min={1} max={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
