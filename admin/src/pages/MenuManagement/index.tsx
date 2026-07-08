import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import DataPanel, { IconButton } from '@/components/DataPanel'
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  type MenuNode,
} from '@/services/menu'

/** 可选图标列表 */
const ICON_OPTIONS = [
  'DashboardOutlined',
  'TeamOutlined',
  'AimOutlined',
  'FileTextOutlined',
  'SmileOutlined',
  'CheckCircleOutlined',
  'StarOutlined',
  'ShopOutlined',
  'SwapOutlined',
  'UserOutlined',
  'LockOutlined',
  'AuditOutlined',
  'SettingOutlined',
  'ProfileOutlined',
  'MenuOutlined',
]

export default function MenuManagement() {
  const [menuTree, setMenuTree] = useState<MenuNode[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuNode | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  /** 加载菜单树 */
  const fetchMenus = useCallback(async () => {
    setLoading(true)
    try {
      const tree = await getMenuTree()
      setMenuTree(tree || [])
      if (expandedKeys.length === 0 && tree) {
        setExpandedKeys(tree.map(m => m.key))
      }
    } catch {
      setMenuTree([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  /** 扁平化菜单列表 */
  const flatMenus: MenuNode[] = []
  function flatten(nodes: MenuNode[]) {
    for (const node of nodes) {
      flatMenus.push(node)
      if (node.children) flatten(node.children)
    }
  }
  flatten(menuTree)

  /** 新增顶级菜单 */
  const handleAddRoot = () => {
    setEditingItem(null)
    form.resetFields()
    form.setFieldsValue({ parent_id: '' })
    setIsModalOpen(true)
  }

  /** 新增子菜单 */
  const handleAddChild = (parentKey: string) => {
    const parent = flatMenus.find(m => m.key === parentKey)
    setEditingItem(null)
    form.resetFields()
    form.setFieldsValue({ parent_id: parent?.id || '' })
    setIsModalOpen(true)
  }

  /** 编辑 */
  const handleEdit = (record: MenuNode) => {
    setEditingItem(record)
    form.setFieldsValue({
      parent_id: record.parent_id || '',
      label: record.label,
      key: record.key,
      icon: record.icon || undefined,
      path: record.path || undefined,
      permission: record.permission || undefined,
    })
    setIsModalOpen(true)
  }

  /** 删除 */
  const handleDelete = async (record: MenuNode) => {
    try {
      await deleteMenu(record.id)
      message.success('已删除')
      fetchMenus()
    } catch {
      message.error('删除失败')
    }
  }

  /** 切换状态 */
  const handleToggleStatus = async (record: MenuNode) => {
    try {
      await toggleMenuStatus(record.id)
      message.success('状态已更新')
      fetchMenus()
    } catch {
      message.error('操作失败')
    }
  }

  /** 提交表单 */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingItem) {
        await updateMenu(editingItem.id, {
          label: values.label,
          icon: values.icon || '',
          path: values.path || '',
          permission: values.permission || '',
        })
        message.success('菜单已更新')
      } else {
        const parent = flatMenus.find(m => m.id === values.parent_id)
        await createMenu({
          key: values.key,
          label: values.label,
          icon: values.icon || '',
          path: values.path || '',
          permission: values.permission || '',
          parent_id: values.parent_id || '',
          sort_order: 0,
        })
        message.success('菜单已添加')
        if (parent && !expandedKeys.includes(parent.key)) {
          setExpandedKeys(prev => [...prev, parent.key])
        }
      }
      setIsModalOpen(false)
      form.resetFields()
      fetchMenus()
    } catch {
      // validation or API error
    }
  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'label',
      key: 'label',
      width: 200,
    },
    {
      title: '标识 Key',
      dataIndex: 'key',
      key: 'key',
      width: 160,
      render: (v: string) => <Tag style={{ background: '#edf2ff', color: '#3b6fdf', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{v}</Tag>,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 160,
      render: (v: string) => v ? <Tag style={{ background: '#f5f2ed', color: '#6b6258', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{v}</Tag> : <span style={{ color: '#b0a89a' }}>-</span>,
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      width: 160,
      render: (v: string) => v || <span style={{ color: '#b0a89a' }}>—</span>,
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 180,
      render: (v: string) => v ? <Tag style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{v}</Tag> : <span style={{ color: '#b0a89a' }}>-</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: boolean, record: MenuNode) => (
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
      width: 140,
      render: (_: unknown, record: MenuNode) => (
        <Space size={4}>
          <IconButton
            title="添加子菜单"
            icon={<PlusOutlined style={{ fontSize: 14, color: '#b0a89a' }} />}
            onClick={() => handleAddChild(record.key)}
          />
          <IconButton
            title="编辑"
            icon={<EditOutlined style={{ fontSize: 14, color: '#b0a89a' }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除该菜单？"
            description="子菜单将一并删除"
            onConfirm={() => handleDelete(record)}
          >
            <IconButton
              title="删除"
              icon={<DeleteOutlined style={{ fontSize: 14, color: '#b0a89a' }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="菜单管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoot}>
            新增顶级菜单
          </Button>
        }
        >
        <Table
          dataSource={menuTree}
          columns={columns}
          rowKey="key"
          loading={loading}
          pagination={false}
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: (keys) => setExpandedKeys(keys as string[]),
          }}
          size="middle"
        />
      </DataPanel>

      <Modal
        title={editingItem ? '编辑菜单' : '新增菜单'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => { setIsModalOpen(false); form.resetFields() }}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="父级菜单" name="parent_id">
            <Select
              placeholder="无（顶级菜单）"
              allowClear
              options={[
                { value: '', label: '无（顶级菜单）' },
                ...flatMenus
                  .filter(f => !editingItem || f.id !== editingItem.id)
                  .map(f => ({ value: f.id, label: f.label })),
              ]}
            />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label="菜单名称"
              name="label"
              rules={[{ required: true, message: '请输入菜单名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="如：工作台" />
            </Form.Item>
            <Form.Item
              label="标识 Key"
              name="key"
              rules={[
                { required: true, message: '请输入标识 Key' },
                { pattern: /^[a-z0-9-]+$/, message: '仅支持小写字母、数字和短横线' },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="如：dashboard" disabled={!!editingItem} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="图标" name="icon" style={{ flex: 1 }}>
              <Select
                placeholder="选择图标"
                allowClear
                showSearch
                options={ICON_OPTIONS.map(name => ({ value: name, label: name }))}
              />
            </Form.Item>
            <Form.Item label="路由路径" name="path" style={{ flex: 1 }}>
              <Input placeholder="如：/dashboard" />
            </Form.Item>
          </div>
          <Form.Item label="权限标识" name="permission">
            <Input placeholder="如：dashboard:view" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
