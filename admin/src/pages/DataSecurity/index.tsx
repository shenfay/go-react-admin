import { useState } from 'react'
import { Table, Tag, Switch, Button, Progress, Modal, Form, Input, Select } from 'antd'
import { SafetyOutlined, PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface SensitiveField {
  id: string
  table: string
  field: string
  type: string
  level: string
  masked: boolean
  rule: string
}

const sensitiveData: SensitiveField[] = [
  { id: '1', table: 'user', field: 'phone', type: '手机号', level: '高', masked: true, rule: '中间 4 位脱敏' },
  { id: '2', table: 'user', field: 'id_card', type: '身份证号', level: '高', masked: true, rule: '中间 8 位脱敏' },
  { id: '3', table: 'user', field: 'email', type: '邮箱', level: '中', masked: false, rule: '-' },
  { id: '4', table: 'order', field: 'bank_card', type: '银行卡号', level: '高', masked: true, rule: '前 4 后 4 保留' },
  { id: '5', table: 'user', field: 'address', type: '地址', level: '中', masked: false, rule: '-' },
]

const accessData = [
  { id: '1', user: '张小明', table: 'user', field: 'phone', action: '查询', time: '2026-05-27 10:00:00', result: '脱敏访问' },
  { id: '2', user: '李雪', table: 'order', field: 'bank_card', action: '导出', time: '2026-05-27 09:30:00', result: '拒绝' },
  { id: '3', user: '王磊', table: 'user', field: 'id_card', action: '查询', time: '2026-05-27 09:15:00', result: '脱敏访问' },
]

export default function DataSecurity() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('fields')
  const [form] = Form.useForm()

  const fieldColumns = [
    { title: '表名', dataIndex: 'table', key: 'table' },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '敏感类型', dataIndex: 'type', key: 'type' },
    {
      title: '敏感等级',
      dataIndex: 'level',
      key: 'level',
      render: (v: string) => <Tag color={v === '高' ? 'error' : 'warning'}>{v}</Tag>,
    },
    {
      title: '已脱敏',
      dataIndex: 'masked',
      key: 'masked',
      render: (v: boolean) => <Switch checked={v} size="small" />,
    },
    { title: '脱敏规则', dataIndex: 'rule', key: 'rule' },
  ]

  const accessColumns = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '表名', dataIndex: 'table', key: 'table' },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      render: (v: string) => <Tag color={v === '拒绝' ? 'error' : 'success'}>{v}</Tag>,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type={activeTab === 'fields' ? 'primary' : 'default'} onClick={() => setActiveTab('fields')}>
          敏感字段
        </Button>
        <Button type={activeTab === 'access' ? 'primary' : 'default'} onClick={() => setActiveTab('access')} style={{ marginLeft: 8 }}>
          访问审计
        </Button>
      </div>

      <DataPanel
        title={activeTab === 'fields' ? '敏感字段识别' : '访问审计日志'}
        extra={
          activeTab === 'fields' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              新增规则
            </Button>
          )
        }
      >
        {activeTab === 'fields' ? (
          <Table dataSource={sensitiveData} columns={fieldColumns} rowKey="id" />
        ) : (
          <Table dataSource={accessData} columns={accessColumns} rowKey="id" />
        )}
      </DataPanel>

      <Modal
        title="新增脱敏规则"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="表名" name="table" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="字段名" name="field" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="敏感类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="手机号">手机号</Select.Option>
              <Select.Option value="身份证号">身份证号</Select.Option>
              <Select.Option value="银行卡号">银行卡号</Select.Option>
              <Select.Option value="邮箱">邮箱</Select.Option>
              <Select.Option value="地址">地址</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="敏感等级" name="level" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="高">高</Select.Option>
              <Select.Option value="中">中</Select.Option>
              <Select.Option value="低">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="脱敏规则" name="rule">
            <Input placeholder="如: 中间 4 位脱敏" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
