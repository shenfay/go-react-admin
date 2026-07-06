import { useState } from 'react'
import { Table, Tag, Button, Progress, Modal, Form, Input, Select } from 'antd'
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface Standard {
  id: string
  name: string
  category: string
  rule: string
  coverage: number
  compliance: number
  status: string
}

const standardData: Standard[] = [
  { id: '1', name: '手机号格式规范', category: '数据格式', rule: '符合中国大陆手机号格式: 1[3-9]\\d{9}', coverage: 98, compliance: 96, status: '已发布' },
  { id: '2', name: '邮箱格式规范', category: '数据格式', rule: '符合 RFC 5322 邮箱格式', coverage: 95, compliance: 92, status: '已发布' },
  { id: '3', name: '日期格式统一', category: '数据格式', rule: '统一使用 YYYY-MM-DD HH:mm:ss', coverage: 100, compliance: 99, status: '已发布' },
  { id: '4', name: '金额精度规范', category: '数值规范', rule: '金额字段统一保留 2 位小数', coverage: 90, compliance: 88, status: '已发布' },
  { id: '5', name: '编码规范', category: '字符规范', rule: '统一使用 UTF-8 编码', coverage: 100, compliance: 100, status: '已发布' },
  { id: '6', name: '敏感字段脱敏', category: '安全规范', rule: '手机号/身份证/银行卡需脱敏展示', coverage: 85, compliance: 80, status: '试行' },
]

const checkData = [
  { id: '1', table: 'user', field: 'phone', standard: '手机号格式规范', checkResult: '通过', failCount: 23 },
  { id: '2', table: 'user', field: 'email', standard: '邮箱格式规范', checkResult: '通过', failCount: 156 },
  { id: '3', table: 'order', field: 'amount', standard: '金额精度规范', checkResult: '不通过', failCount: 45 },
  { id: '4', table: 'user', field: 'id_card', standard: '敏感字段脱敏', checkResult: '不通过', failCount: 1200 },
]

export default function DataStandard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('standards')
  const [form] = Form.useForm()

  const standardColumns = [
    { title: '标准名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
    { title: '规则描述', dataIndex: 'rule', key: 'rule' },
    {
      title: '覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--accent)" />,
    },
    {
      title: '合规率',
      dataIndex: 'compliance',
      key: 'compliance',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--green)" />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={v === '已发布' ? 'success' : 'warning'}>{v}</Tag>,
    },
  ]

  const checkColumns = [
    { title: '表名', dataIndex: 'table', key: 'table' },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '标准', dataIndex: 'standard', key: 'standard' },
    {
      title: '检查结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      render: (v: string) => <Tag color={v === '通过' ? 'success' : 'error'}>{v}</Tag>,
    },
    { title: '异常数', dataIndex: 'failCount', key: 'failCount', render: (v: number) => <span style={{ color: v > 0 ? 'var(--red)' : 'inherit' }}>{v}</span> },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type={activeTab === 'standards' ? 'primary' : 'default'} onClick={() => setActiveTab('standards')}>
          标准定义
        </Button>
        <Button type={activeTab === 'checks' ? 'primary' : 'default'} onClick={() => setActiveTab('checks')} style={{ marginLeft: 8 }}>
          落标检查
        </Button>
      </div>

      <DataPanel
        title={activeTab === 'standards' ? '数据标准' : '落标检查结果'}
        extra={
          activeTab === 'standards' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              新增标准
            </Button>
          )
        }
      >
        {activeTab === 'standards' ? (
          <Table dataSource={standardData} columns={standardColumns} rowKey="id" />
        ) : (
          <Table dataSource={checkData} columns={checkColumns} rowKey="id" />
        )}
      </DataPanel>

      <Modal
        title="新增数据标准"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标准名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="数据格式">数据格式</Select.Option>
              <Select.Option value="数值规范">数值规范</Select.Option>
              <Select.Option value="字符规范">字符规范</Select.Option>
              <Select.Option value="安全规范">安全规范</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="规则描述" name="rule" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
