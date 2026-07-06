import { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Space, Button, Modal, Form, Input, Select, message, Switch, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'
import { getUserList, createUser, updateUser, toggleUserStatus } from '@/services/user'
import { getRoleList } from '@/services/role'
import type { User, Role } from '@/types'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [keyword, setKeyword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUserList({ page, page_size: pageSize, keyword })
      setUsers(res.users || [])
      setTotal(res.total || 0)
    } catch {
      // API 未就绪时使用空数据
      setUsers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, keyword])

  const fetchRoles = async () => {
    try {
      const res = await getRoleList()
      setRoles(res || [])
    } catch {
      setRoles([])
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: User) => {
    setEditingUser(record)
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role_ids: record.roles?.map(r => r.id) || [],
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingUser) {
        await updateUser(editingUser.id, {
          name: values.name,
          email: values.email,
          role_ids: values.role_ids,
        })
        message.success('用户已更新')
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role_ids: values.role_ids || [],
        })
        message.success('用户已创建')
      }
      setIsModalOpen(false)
      form.resetFields()
      fetchUsers()
    } catch {
      // validation or API error
    }
  }

  const handleToggleStatus = async (record: User) => {
    try {
      await toggleUserStatus(record.id, !record.locked)
      message.success(record.locked ? '用户已启用' : '用户已禁用')
      fetchUsers()
    } catch {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 200,
      render: (roles: User['roles']) => (
        <Space wrap>
          {(roles || []).map(r => (
            <Tag key={r.code} color="blue">{r.name}</Tag>
          ))}
          {(!roles || roles.length === 0) && <Tag>未分配</Tag>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'locked',
      key: 'locked',
      width: 100,
      render: (locked: boolean) => (
        <Tag color={locked ? 'default' : 'green'}>
          {locked ? '已禁用' : '活跃'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title={record.locked ? '确定启用该用户？' : '确定禁用该用户？'}
            onConfirm={() => handleToggleStatus(record)}
          >
            <Button type="link" size="small" danger={!!record.locked}>
              {record.locked ? '启用' : '禁用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="用户管理"
        extra={
          <Space>
            <Input
              placeholder="搜索姓名/邮箱"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onPressEnter={() => { setPage(1); fetchUsers() }}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="按角色筛选"
              allowClear
              style={{ width: 140 }}
              onChange={v => { setPage(1); setKeyword(v || '') }}
            >
              {roles.map(r => (
                <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
              ))}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加用户
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: t => `共 ${t} 条`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps) },
          }}
        />
      </DataPanel>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => { setIsModalOpen(false); form.resetFields() }}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input placeholder="example@domain.com" />
          </Form.Item>
          {!editingUser && (
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少 8 位' }]}>
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item label="角色" name="role_ids">
            <Select mode="multiple" placeholder="请选择角色（可多选）">
              {roles.map(r => (
                <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
