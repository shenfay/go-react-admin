import { useState, useEffect, useCallback } from 'react'
import { Tag, Space, Button, Modal, Form, Input, Select, message, Switch, Popconfirm, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import { DEFAULT_PAGINATION } from '@/config/pagination'
import { useCrudList } from '@/hooks/useCrudList'
import { getUserList, createUser, updateUser, toggleUserStatus } from '@/services/user'
import { getRoleList } from '@/services/role'
import { emailRules, passwordRules } from '@/utils/formRules'
import type { User, Role } from '@/types'

export default function UserManagement() {
  const {
    loading, dataSource: users, total, page, pageSize,
    fetchData: fetchUsers, handlePageChange,
    isModalOpen, editingItem: editingUser, form,
    handleAdd, handleEdit, handleCancel,
  } = useCrudList<User>(
    async ({ page: p, pageSize: ps }) => {
      const res = await getUserList({ page: p, page_size: ps, keyword })
      return { data: res.users || [], total: res.total || 0 }
    },
  )

  const [roles, setRoles] = useState<Role[]>([])
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const fetchRoles = async () => {
    try {
      const res = await getRoleList()
      setRoles(res || [])
    } catch {
      setRoles([])
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // keyword 变化时重新加载
  const fetchWithKeyword = useCallback(async () => {
    const res = await getUserList({ page, page_size: pageSize, keyword })
    return { data: res.users || [], total: res.total || 0 }
  }, [page, pageSize, keyword])

  useEffect(() => {
    fetchUsers()
  }, [fetchWithKeyword]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditUser = (record: User) => {
    handleEdit(record, {
      name: record.name,
      email: record.email,
      role_ids: record.roles?.map(r => r.id) || [],
    })
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
      handleCancel()
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

  const columns: TableColumnsType<User> = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 140 },
    { title: '邮箱', dataIndex: 'email', key: 'email', ellipsis: true },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 160,
      render: (_: unknown, record: User) => (
        <Space wrap size={4}>
          {(record.roles || []).map(r => (
            <Tag key={r.code} style={{ background: 'var(--blue-light)', color: 'var(--blue-text)' }}>{r.name}</Tag>
          ))}
          {(!record.roles || record.roles.length === 0) && <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)' }}>未分配</Tag>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'locked',
      key: 'locked',
      width: 100,
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: record.locked ? 'var(--border-hover)' : 'var(--green)',
            display: 'inline-block',
          }} />
          <span style={{ color: 'var(--text-primary)' }}>{record.locked ? '已禁用' : '活跃'}</span>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (_: unknown, record: User) => record.created_at
        ? <span style={{ color: 'var(--text-secondary)' }}>{new Date(record.created_at).toLocaleString('zh-CN')}</span>
        : <span style={{ color: 'var(--text-muted)' }}>-</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: User) => (
        <Space size={12}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            编辑
          </Button>
          <Popconfirm
            title={record.locked ? '确定启用该用户？' : '确定禁用该用户？'}
            onConfirm={() => handleToggleStatus(record)}
          >
            <Switch checked={!record.locked} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="用户管理"
        filters={
          <>
            <FilterSearch value={keyword} onChange={setKeyword} placeholder="搜索姓名 / 邮箱..." onSearch={() => fetchUsers()} />
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 140 }}
              options={[
                { label: '全部角色', value: '' },
                ...roles.map(r => ({ label: r.name, value: r.id })),
              ]}
            />
            <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }} onClick={() => fetchUsers()}>查询</Button>
          </>
        }
        toolbarActions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        }
      >
        <Table<User>
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            ...DEFAULT_PAGINATION,
            onChange: handlePageChange,
          }}
        />
      </DataPanel>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={emailRules}>
            <Input placeholder="example@domain.com" />
          </Form.Item>
          {!editingUser && (
            <Form.Item label="密码" name="password" rules={passwordRules}>
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
