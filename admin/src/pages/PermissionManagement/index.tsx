import { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Tree, Switch, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import DataPanel, { IconButton } from '@/components/DataPanel'
import { getMenuTree, type MenuNode } from '@/services/menu'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  getRolePermissions,
  updateRolePermissions,
} from '@/services/role'
import type { Role } from '@/types'

const { TextArea } = Input

/** 从后端菜单数据生成权限树 */
function buildPermissionTree(menus: MenuNode[]) {
  return menus
    .filter(m => m.status)
    .map(group => ({
      title: group.label,
      key: group.key,
      children: (group.children || [])
        .filter(c => c.status)
        .map(item => ({
          title: item.label,
          key: item.key,
          permission: item.permission || '',
        })),
    }))
    .filter(group => group.children && group.children.length > 0)
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

/** 构建 key -> permission 映射 */
function buildKeyPermMap(treeData: ReturnType<typeof buildPermissionTree>): Record<string, string> {
  const map: Record<string, string> = {}
  treeData.forEach(group => {
    group.children?.forEach(item => {
      map[item.key] = item.permission || `${item.key}:view`
    })
  })
  return map
}

export default function PermissionManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [permLoading, setPermLoading] = useState(false)
  const [menuData, setMenuData] = useState<MenuNode[]>([])
  const [form] = Form.useForm()

  const permissionTree = buildPermissionTree(menuData)
  const allLeafKeys = getAllLeafKeys(permissionTree)
  const keyPermMap = buildKeyPermMap(permissionTree)

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

  const fetchMenus = useCallback(async () => {
    try {
      const res = await getMenuTree()
      setMenuData(res || [])
    } catch {
      setMenuData([])
    }
  }, [])

  useEffect(() => {
    fetchRoles()
    fetchMenus()
  }, [fetchRoles, fetchMenus])

  /** 加载角色权限 */
  const loadRolePermissions = async (role: Role) => {
    setPermLoading(true)
    try {
      const perms = await getRolePermissions(role.id)
      // 反向映射：permission string -> menu key
      const permToKey: Record<string, string> = {}
      Object.entries(keyPermMap).forEach(([key, perm]) => {
        permToKey[perm] = key
      })
      const menuKeys = perms
        .map((p: string) => permToKey[p])
        .filter((k): k is string => !!k)
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
      const permissions: string[] = []
      checkedKeys.forEach(key => {
        const perm = keyPermMap[key]
        if (perm) {
          permissions.push(perm)
        }
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
      render: (v: string) => <Tag style={{ background: '#f5f2ed', color: '#6b6258', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{v}</Tag>,
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
        <Space size={4}>
          <Button type="link" size="small" onClick={() => handleSelectRole(record)} style={{ color: '#6b6258', fontSize: 13 }}>
            配置权限
          </Button>
          <Button type="link" size="small" onClick={() => handleEditRole(record)} style={{ color: '#6b6258', fontSize: 13 }}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色？"
            description="删除后不可恢复"
            onConfirm={() => handleDeleteRole(record)}
          >
            <Button type="link" size="small" danger style={{ fontSize: 13 }}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="角色管理"
        description="管理系统角色及其权限配置"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
            新增角色
          </Button>
        }
        toolbarActions={
          <IconButton icon={<ReloadOutlined style={{ fontSize: 16, color: '#6b6258' }} />} onClick={() => fetchRoles()} title="刷新" />
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
          style={{ marginTop: 0 }}
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
          compact
        >
          <Tree
            checkable
            checkedKeys={checkedKeys}
            onCheck={(keys) => {
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
