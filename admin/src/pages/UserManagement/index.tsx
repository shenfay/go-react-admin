import { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Space, Button, Modal, Form, Input, Select, message, Switch, Popconfirm } from 'antd'
import { PlusOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch, IconButton } from '@/components/DataPanel'
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
    { title: '姓名', dataIndex: 'name', key: 'name', width: '10%' },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: '24%' },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: '10%',
      render: (roles: User['roles']) => (
        <Space wrap>
          {(roles || []).map(r => (
            <Tag key={r.code} style={{ background: '#edf2ff', color: '#3b6fdf', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{r.name}</Tag>
          ))}
          {(!roles || roles.length === 0) && <Tag style={{ background: '#f5f2ed', color: '#b0a89a', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>未分配</Tag>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'locked',
      key: 'locked',
      width: '8%',
      render: (locked: boolean) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: locked ? '#d4cdc0' : '#22c55e',
            display: 'inline-block',
          }} />
          <span style={{ color: '#2b2b2b', fontSize: 13 }}>{locked ? '已禁用' : '活跃'}</span>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '10%',
      render: (v: string) => v ? <span style={{ color: '#6b6258' }}>{new Date(v).toLocaleString('zh-CN')}</span> : <span style={{ color: '#b0a89a' }}>-</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '8%',
      render: (_: unknown, record: User) => (
        <Space size={4}>
          <IconButton
            title="编辑"
            icon={<EditOutlined style={{ fontSize: 14, color: '#b0a89a' }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={record.locked ? '确定启用该用户？' : '确定禁用该用户？'}
            onConfirm={() => handleToggleStatus(record)}
          >
            <IconButton
              title={record.locked ? '启用' : '禁用'}
              icon={<Switch checked={!record.locked} size="small" />}
            />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        }
        filters={
          <FilterSearch
            value={keyword}
            onChange={setKeyword}
            placeholder="搜索姓名/邮箱"
            onSearch={() => { setPage(1); fetchUsers() }}
          />
        }
        toolbarActions={
          <>
            <IconButton icon={<ReloadOutlined style={{ fontSize: 16, color: '#6b6258' }} />} onClick={() => fetchUsers()} title="刷新" />
          </>
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
