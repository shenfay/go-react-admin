import { useState } from 'react'
import { Button, Table, Tag, Progress, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface Topic {
  id: string
  name: string
  type: string
  messageCount: number
  consumerGroups: number
  lag: number
  status: string
}

const topicData: Topic[] = [
  { id: '1', name: 'user_behavior', type: 'Kafka', messageCount: 12500000, consumerGroups: 3, lag: 120, status: '正常' },
  { id: '2', name: 'order_events', type: 'Kafka', messageCount: 8900000, consumerGroups: 2, lag: 0, status: '正常' },
  { id: '3', name: 'log_stream', type: 'Pulsar', messageCount: 45000000, consumerGroups: 5, lag: 5000, status: '堆积' },
  { id: '4', name: 'config_changes', type: 'Kafka', messageCount: 15000, consumerGroups: 1, lag: 0, status: '正常' },
]

const consumerData = [
  { id: '1', group: 'analytics-group', topic: 'user_behavior', consumers: 3, lag: 120, status: '正常' },
  { id: '2', group: 'order-service', topic: 'order_events', consumers: 2, lag: 0, status: '正常' },
  { id: '3', group: 'log-processor', topic: 'log_stream', consumers: 5, lag: 5000, status: '滞后' },
]

export default function DataSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('topics')
  const [form] = Form.useForm()

  const topicColumns = [
    { title: '主题名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    { title: '消息总量', dataIndex: 'messageCount', key: 'messageCount', render: (v: number) => v.toLocaleString() },
    { title: '消费组数', dataIndex: 'consumerGroups', key: 'consumerGroups' },
    {
      title: '消费延迟',
      dataIndex: 'lag',
      key: 'lag',
      render: (v: number) => (
        <span style={{ color: v > 1000 ? 'var(--red)' : v > 100 ? 'var(--yellow)' : 'var(--green)' }}>
          {v.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={v === '正常' ? 'success' : 'warning'}>{v}</Tag>,
    },
  ]

  const consumerColumns = [
    { title: '消费组', dataIndex: 'group', key: 'group' },
    { title: '订阅主题', dataIndex: 'topic', key: 'topic' },
    { title: '消费者数', dataIndex: 'consumers', key: 'consumers' },
    {
      title: '消费延迟',
      dataIndex: 'lag',
      key: 'lag',
      render: (v: number) => (
        <span style={{ color: v > 1000 ? 'var(--red)' : v > 100 ? 'var(--yellow)' : 'var(--green)' }}>
          {v.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={v === '正常' ? 'success' : 'warning'}>{v}</Tag>,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type={activeTab === 'topics' ? 'primary' : 'default'} onClick={() => setActiveTab('topics')}>
          主题管理
        </Button>
        <Button type={activeTab === 'consumers' ? 'primary' : 'default'} onClick={() => setActiveTab('consumers')} style={{ marginLeft: 8 }}>
          消费组
        </Button>
      </div>

      <DataPanel
        title={activeTab === 'topics' ? '消息主题' : '消费组'}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            {activeTab === 'topics' ? '新建主题' : '新建消费组'}
          </Button>
        }
      >
        {activeTab === 'topics' ? (
          <Table dataSource={topicData} columns={topicColumns} rowKey="id" />
        ) : (
          <Table dataSource={consumerData} columns={consumerColumns} rowKey="id" />
        )}
      </DataPanel>

      <Modal
        title="新建消息主题"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="主题名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="如: user_events" />
          </Form.Item>
          <Form.Item label="消息类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Kafka">Kafka</Select.Option>
              <Select.Option value="Pulsar">Pulsar</Select.Option>
              <Select.Option value="RocketMQ">RocketMQ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="分区数" name="partitions" rules={[{ required: true }]}>
            <Input type="number" min={1} max={100} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
