import { useState } from 'react'
import { Button, Table, Tag, Progress, Space, Modal, Form, Input, Select, Radio } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'
import StatusTag from '@/components/StatusTag'

interface ETLTask {
  id: string
  name: string
  source: string
  target: string
  schedule: string
  lastRun: string
  status: string
  progress: number
}

const taskData: ETLTask[] = [
  { id: '1', name: '用户数据同步', source: 'MySQL', target: 'Hive', schedule: '每小时', lastRun: '10 分钟前', status: '运行中', progress: 78 },
  { id: '2', name: '订单数据清洗', source: 'PostgreSQL', target: 'ClickHouse', schedule: '每日 02:00', lastRun: '2 小时前', status: '成功', progress: 100 },
  { id: '3', name: '日志数据聚合', source: 'Kafka', target: 'Elasticsearch', schedule: '每 15 分钟', lastRun: '5 分钟前', status: '运行中', progress: 45 },
  { id: '4', name: '商品数据全量同步', source: 'Oracle', target: 'Hive', schedule: '每周日', lastRun: '3 天前', status: '失败', progress: 0 },
  { id: '5', name: '用户行为数据ETL', source: 'Kafka', target: 'ClickHouse', schedule: '每小时', lastRun: '1 小时前', status: '成功', progress: 100 },
]

const historyData = [
  { id: '1', taskName: '用户数据同步', startTime: '2026-05-27 10:00:00', endTime: '2026-05-27 10:05:23', duration: '5分23秒', status: '成功', records: 12500 },
  { id: '2', taskName: '订单数据清洗', startTime: '2026-05-27 02:00:00', endTime: '2026-05-27 02:12:45', duration: '12分45秒', status: '成功', records: 89000 },
  { id: '3', taskName: '商品数据全量同步', startTime: '2026-05-24 03:00:00', endTime: '2026-05-24 03:01:12', duration: '1分12秒', status: '失败', records: 0 },
]

export default function ETLTasks() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')
  const [form] = Form.useForm()

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '数据源', dataIndex: 'source', key: 'source', render: (v: string) => <Tag>{v}</Tag> },
    { title: '目标库', dataIndex: 'target', key: 'target', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '调度周期', dataIndex: 'schedule', key: 'schedule' },
    { title: '最近执行', dataIndex: 'lastRun', key: 'lastRun' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <StatusTag status={v} />,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (v: number, record: ETLTask) =>
        record.status === '运行中' ? <Progress percent={v} size="small" /> : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ETLTask) => (
        <Space>
          {record.status === '运行中' ? (
            <Button size="small" icon={<PauseCircleOutlined />}>暂停</Button>
          ) : (
            <Button size="small" type="primary" icon={<PlayCircleOutlined />}>启动</Button>
          )}
          <Button size="small" icon={<ReloadOutlined />}>重试</Button>
        </Space>
      ),
    },
  ]

  const historyColumns = [
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { title: '耗时', dataIndex: 'duration', key: 'duration' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <StatusTag status={v} />,
    },
    { title: '处理记录数', dataIndex: 'records', key: 'records', render: (v: number) => v.toLocaleString() },
  ]

  return (
    <div>
      <Radio.Group
        value={activeTab}
        onChange={e => setActiveTab(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="tasks">任务列表</Radio.Button>
        <Radio.Button value="history">执行历史</Radio.Button>
      </Radio.Group>

      {activeTab === 'tasks' && (
        <DataPanel
          title="ETL 任务列表"
          extra={
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              新建任务
            </Button>
          }
        >
          <Table dataSource={taskData} columns={columns} rowKey="id" />
        </DataPanel>
      )}

      {activeTab === 'history' && (
        <DataPanel title="执行历史">
          <Table dataSource={historyData} columns={historyColumns} rowKey="id" />
        </DataPanel>
      )}

      <Modal
        title="新建 ETL 任务"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="任务名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="数据源" name="source" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择数据源">
                <Select.Option value="mysql">MySQL</Select.Option>
                <Select.Option value="postgresql">PostgreSQL</Select.Option>
                <Select.Option value="oracle">Oracle</Select.Option>
                <Select.Option value="kafka">Kafka</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="目标库" name="target" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择目标库">
                <Select.Option value="hive">Hive</Select.Option>
                <Select.Option value="clickhouse">ClickHouse</Select.Option>
                <Select.Option value="elasticsearch">Elasticsearch</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="调度周期" name="schedule" rules={[{ required: true }]}>
            <Select placeholder="选择调度周期">
              <Select.Option value="minute15">每 15 分钟</Select.Option>
              <Select.Option value="hourly">每小时</Select.Option>
              <Select.Option value="daily">每日</Select.Option>
              <Select.Option value="weekly">每周</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="SQL 脚本" name="sql">
            <Input.TextArea rows={6} placeholder="请输入 SQL 脚本" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
