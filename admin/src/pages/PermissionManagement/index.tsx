import { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Tree, Switch, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'
import { menuConfig, type MenuItem } from '@/config/menu'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  getRolePermissions,
  updateRolePermissions,
} from '@/services/role'
import type { Role, RolePermission } from '@/types'

const { TextArea } = Input

/** 从 menuConfig 生成权限树数据 */
function buildPermissionTree() {
  return menuConfig.map(group => ({
    title: group.label,
    key: group.key,
    children: (group.children || []).map(item => ({
      title: item.label,
      key: item.key,
      permission: item.permission || '',
    })),
  }))
}

/** 从权限树中提取所有叶子节点的 key */
function getAllLeafKeys(treeData: ReturnType<typeof buildPermissionTree>): string[] {
  const keys: string[] = []
  treeData.forEach(group => {
    group.children?.forEach(item => {
      keys.push(item.key)
    })
  })
  return keys
}

export default function PermissionManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [permLoading, setPermLoading] = useState(false)
  const [form] = Form.useForm()

  const permissionTree = buildPermissionTree()
  const allLeafKeys = getAllLeafKeys(permissionTree)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getRoleList()
      setRoles(res || [])
    } catch {
      setRoles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  /** 加载角色权限 */
  const loadRolePermissions = async (role: Role) => {
    setPermLoading(true)
    try {
      const perms = await getRolePermissions(role.id)
      const menuKeys = perms.map((p: RolePermission) => p.menu_key).filter(Boolean)
      setCheckedKeys(menuKeys)
    } catch {
      setCheckedKeys([])
    } finally {
      setPermLoading(false)
    }
  }

  /** 选择角色配置权限 */
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role)
    loadRolePermissions(role)
  }

  /** 保存权限配置 */
  const handleSavePermissions = async () => {
    if (!selectedRole) return
    setPermLoading(true)
    try {
      // 将选中的菜单 key 转换为权限列表
      const permissions: { permission_key: string; menu_key: string }[] = []
      permissionTree.forEach(group => {
        group.children?.forEach(item => {
          if (checkedKeys.includes(item.key)) {
            permissions.push({
              permission_key: item.permission || `${item.key}:view`,
              menu_key: item.key,
            })
          }
        })
      })
      await updateRolePermissions(selectedRole.id, permissions)
      message.success('权限配置已保存')
    } catch {
      message.error('保存失败')
    } finally {
      setPermLoading(false)
    }
  }

  /** 新增角色 */
  const handleAddRole = () => {
    setEditingRole(null)
    form.resetFields()
    setIsRoleModalOpen(true)
  }

  /** 编辑角色 */
  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description,
    })
    setIsRoleModalOpen(true)
  }

  /** 提交角色表单 */
  const handleSubmitRole = async () => {
    try {
      const values = await form.validateFields()
      if (editingRole) {
        await updateRole(editingRole.id, {
          name: values.name,
          description: values.description,
        })
        message.success('角色已更新')
      } else {
        await createRole({
          name: values.name,
          code: values.code,
          description: values.description,
        })
        message.success('角色已创建')
      }
      setIsRoleModalOpen(false)
      form.resetFields()
      fetchRoles()
    } catch {
      // validation or API error
    }
  }

  /** 删除角色 */
  const handleDeleteRole = async (role: Role) => {
    try {
      await deleteRole(role.id)
      message.success('角色已删除')
      if (selectedRole?.id === role.id) {
        setSelectedRole(null)
        setCheckedKeys([])
      }
      fetchRoles()
    } catch {
      message.error('删除失败')
    }
  }

  /** 切换角色状态 */
  const handleToggleStatus = async (role: Role) => {
    try {
      await toggleRoleStatus(role.id)
      message.success('状态已更新')
      fetchRoles()
    } catch {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 120 },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: boolean, record: Role) => (
        <Switch
          checked={v}
          size="small"
          onChange={() => handleToggleStatus(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: Role) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleSelectRole(record)}>
            配置权限
          </Button>
          <Button type="link" size="small" onClick={() => handleEditRole(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色？"
            description="删除后不可恢复"
            onConfirm={() => handleDeleteRole(record)}
          >
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="角色列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
            新增角色
          </Button>
        }
      >
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </DataPanel>

      {selectedRole && (
        <DataPanel
          title={`${selectedRole.name} - 菜单权限配置`}
          style={{ marginTop: 16 }}
          extra={
            <Space>
              <Button
                type="primary"
                size="small"
                loading={permLoading}
                onClick={handleSavePermissions}
              >
                保存权限
              </Button>
              <Button size="small" onClick={() => setSelectedRole(null)}>
                收起
              </Button>
            </Space>
          }
        >
          <Tree
            checkable
            checkedKeys={checkedKeys}
            onCheck={(keys) => {
              // 只保留叶子节点的 key
              const leafKeys = (keys as string[]).filter(k => allLeafKeys.includes(k))
              setCheckedKeys(leafKeys)
            }}
            defaultExpandedKeys={permissionTree.map(g => g.key)}
            treeData={permissionTree}
          />
        </DataPanel>
      )}

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isRoleModalOpen}
        onOk={handleSubmitRole}
        onCancel={() => { setIsRoleModalOpen(false); form.resetFields() }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="如：管理员、运营、观察员" />
          </Form.Item>
          {!editingRole && (
            <Form.Item label="角色编码" name="code" rules={[{ required: true, message: '请输入角色编码' }]}>
              <Input placeholder="如：admin、operator、viewer" />
            </Form.Item>
          )}
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="角色描述..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
