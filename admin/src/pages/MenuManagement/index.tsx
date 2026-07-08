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
  SearchOutlined,
} from '@ant-design/icons'
import DataPanel, { FilterSearch } from '@/components/DataPanel'
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
} from '@/services/menu'
import type { MenuItem } from '@/types'


export default function MenuManagement() {
  const [menuTree, setMenuTree] = useState<MenuItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
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
  const flatMenus: MenuItem[] = []
  function flatten(nodes: MenuItem[]) {
    for (const node of nodes) {
      flatMenus.push(node)
      if (node.children) flatten(node.children)
    }
  }
  flatten(menuTree)

  /** 新增菜单 */
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
  const handleEdit = (record: MenuItem) => {
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
  const handleDelete = async (record: MenuItem) => {
    try {
      await deleteMenu(record.id)
      message.success('已删除')
      fetchMenus()
    } catch {
      message.error('删除失败')
    }
  }

  /** 切换状态 */
  const handleToggleStatus = async (record: MenuItem) => {
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
      render: (v: string) => <Tag style={{ background: 'var(--blue-light)', color: 'var(--blue-text)' }}>{v}</Tag>,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 160,
      render: (v: string) => v ? <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)' }}>{v}</Tag> : <span style={{ color: 'var(--text-muted)' }}>-</span>,
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      width: 160,
      render: (v: string) => v || <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 180,
      render: (v: string) => v ? <Tag style={{ background: 'var(--green-light)', color: 'var(--green-text)' }}>{v}</Tag> : <span style={{ color: 'var(--text-muted)' }}>-</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: boolean, record: MenuItem) => (
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
      render: (_: unknown, record: MenuItem) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => handleAddChild(record.key)}>
            新增子菜单
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该菜单？"
            description="子菜单将一并删除"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="菜单管理"
        filters={
          <>
            <FilterSearch placeholder="搜索菜单名称..." />
            <Button icon={<SearchOutlined />} style={{ color: 'var(--text-primary)' }}>查询</Button>
          </>
        }
        toolbarActions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoot}>
            新增菜单
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
              <Input placeholder="如：BuildOutlined" />
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
