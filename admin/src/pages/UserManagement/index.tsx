import { useEffect, useState } from 'react'
import { Button, Table, Form, Input, Select, Checkbox, Radio, Modal } from 'antd'
import StatusTag from '@/components/StatusTag'
import DataPanel from '@/components/DataPanel'
import { mockGetUsers } from '@/services/mock'
import type { User } from '@/types'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    mockGetUsers().then(setUsers)
  }, [])

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => <StatusTag status={v} />,
    },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <StatusTag status={v} />,
    },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => (
        <span>
          <Button size="small">编辑</Button>
          <Button size="small" danger style={{ marginLeft: 8 }}>
            {record.status === '已禁用' ? '启用' : '禁用'}
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="用户列表"
        extra={
          <span>
            <Button style={{ marginRight: 8 }}>导出</Button>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              添加用户
            </Button>
          </span>
        }
      >
        <Table dataSource={users} columns={columns} rowKey="id" />
      </DataPanel>

      <Modal
        title="添加用户"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="example@domain.com" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="部门" name="dept" style={{ flex: 1 }}>
              <Select placeholder="请选择部门">
                <Select.Option value="tech">技术部</Select.Option>
                <Select.Option value="product">产品部</Select.Option>
                <Select.Option value="operation">运营部</Select.Option>
                <Select.Option value="market">市场部</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="角色"
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择角色">
                <Select.Option value="admin">管理员</Select.Option>
                <Select.Option value="editor">编辑</Select.Option>
                <Select.Option value="member">成员</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注信息（可选）" rows={3} />
          </Form.Item>
          <Form.Item label="权限" name="permissions">
            <Checkbox.Group>
              <Checkbox value="data">数据查看</Checkbox>
              <Checkbox value="edit">内容编辑</Checkbox>
              <Checkbox value="user">用户管理</Checkbox>
              <Checkbox value="setting">系统设置</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="active">
            <Radio.Group>
              <Radio value="active">活跃</Radio>
              <Radio value="inactive">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
