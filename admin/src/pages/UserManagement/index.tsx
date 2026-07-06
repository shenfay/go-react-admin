import { useState } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => {
      const labelMap: Record<string, string> = { admin: '管理员', operator: '运营', viewer: '观察员' }
      return <Tag>{labelMap[role] || role}</Tag>
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'active' ? 'green' : 'default'}>
        {status === 'active' ? '活跃' : '停用'}
      </Tag>
    ),
  },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>禁用</Button>
      </Space>
    ),
  },
]

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  return (
    <Card
      title="用户管理"
      extra={
        <Space>
          <Button>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            添加用户
          </Button>
        </Space>
      }
    >
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />

      <Modal
        title="添加用户"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input placeholder="example@domain.com" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="operator">运营</Select.Option>
              <Select.Option value="viewer">观察员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
