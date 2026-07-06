import { useState } from 'react'
import { Button, Table, Tag, Switch, Modal, Form, Input, Select, Space, InputNumber } from 'antd'
import { AlertOutlined, PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface AlertRule {
  id: string
  name: string
  metric: string
  condition: string
  threshold: number
  severity: string
  notify: string
  enabled: boolean
  lastTriggered: string
}

const ruleData: AlertRule[] = [
  { id: '1', name: 'API 响应时间过高', metric: '响应时间 (ms)', condition: '>', threshold: 2000, severity: '严重', notify: '短信+邮件', enabled: true, lastTriggered: '10 分钟前' },
  { id: '2', name: '数据同步延迟告警', metric: '同步延迟 (s)', condition: '>', threshold: 300, severity: '警告', notify: '邮件', enabled: true, lastTriggered: '1 小时前' },
  { id: '3', name: '磁盘使用率告警', metric: '磁盘使用率 (%)', condition: '>', threshold: 85, severity: '严重', notify: '短信+邮件', enabled: true, lastTriggered: '3 小时前' },
  { id: '4', name: 'QPS 突增告警', metric: 'QPS', condition: '>', threshold: 5000, severity: '警告', notify: '邮件', enabled: false, lastTriggered: '-' },
  { id: '5', name: '任务失败率告警', metric: '失败率 (%)', condition: '>', threshold: 10, severity: '严重', notify: '短信+邮件', enabled: true, lastTriggered: '2 天前' },
  { id: '6', name: '内存使用率告警', metric: '内存使用率 (%)', condition: '>', threshold: 90, severity: '警告', notify: '邮件', enabled: false, lastTriggered: '-' },
]

const severityColor: Record<string, string> = {
  '严重': 'red',
  '警告': 'orange',
  '提示': 'blue',
}

export default function AlertRules() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '监控指标', dataIndex: 'metric', key: 'metric' },
    {
      title: '触发条件',
      key: 'condition',
      render: (_: unknown, record: AlertRule) => (
        <span>{record.condition} {record.threshold}</span>
      ),
    },
    {
      title: '严重级别',
      dataIndex: 'severity',
      key: 'severity',
      render: (v: string) => <Tag color={severityColor[v]}>{v}</Tag>,
    },
    { title: '通知方式', dataIndex: 'notify', key: 'notify' },
    {
      title: '最近触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (v: string) => <span style={{ color: v === '-' ? 'var(--text-muted)' : 'inherit' }}>{v}</span>,
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (v: boolean) => <Switch checked={v} size="small" />,
    },
  ]

  return (
    <div>
      <DataPanel
        title="告警规则"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            新建规则
          </Button>
        }
      >
        <Table dataSource={ruleData} columns={columns} rowKey="id" />
      </DataPanel>

      <Modal
        title="新建告警规则"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="规则名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="监控指标" name="metric" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="选择指标">
                <Select.Option value="响应时间 (ms)">响应时间 (ms)</Select.Option>
                <Select.Option value="同步延迟 (s)">同步延迟 (s)</Select.Option>
                <Select.Option value="磁盘使用率 (%)">磁盘使用率 (%)</Select.Option>
                <Select.Option value="QPS">QPS</Select.Option>
                <Select.Option value="失败率 (%)">失败率 (%)</Select.Option>
                <Select.Option value="内存使用率 (%)">内存使用率 (%)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="触发条件" name="condition" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="条件">
                <Select.Option value=">">{'>'}</Select.Option>
                <Select.Option value="<">{'<'}</Select.Option>
                <Select.Option value=">=">{'>='}</Select.Option>
                <Select.Option value="<=">{'<='}</Select.Option>
                <Select.Option value="=">=</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="阈值" name="threshold" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="严重级别" name="severity" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Select.Option value="严重">严重</Select.Option>
                <Select.Option value="警告">警告</Select.Option>
                <Select.Option value="提示">提示</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="通知方式" name="notify" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="选择通知方式">
              <Select.Option value="短信">短信</Select.Option>
              <Select.Option value="邮件">邮件</Select.Option>
              <Select.Option value="企业微信">企业微信</Select.Option>
              <Select.Option value="钉钉">钉钉</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
