import { useState } from 'react'
import { Table, Tag, Tree, Switch, Button, Modal, Form, Input } from 'antd'
import DataPanel from '@/components/DataPanel'

const { TextArea } = Input

interface Role {
  id: string
  name: string
  code: string
  description: string
  userCount: number
  status: boolean
}

const menuTreeData = [
  {
    title: '概览',
    key: 'overview',
    children: [{ title: '工作台', key: 'dashboard' }],
  },
  {
    title: '数据中台',
    key: 'data',
    children: [
      { title: '数据概览', key: 'data-overview' },
      { title: '数据报表', key: 'data-report' },
      { title: '数据质量', key: 'data-quality' },
      { title: '数据资产', key: 'data-assets' },
    ],
  },
  {
    title: '用户中心',
    key: 'user',
    children: [
      { title: '用户管理', key: 'user-management' },
      { title: '权限管理', key: 'permission-management' },
      { title: '组织架构', key: 'organization' },
    ],
  },
  {
    title: '业务中台',
    key: 'business',
    children: [
      { title: '内容管理', key: 'content-management' },
      { title: '工作流', key: 'workflow' },
      { title: 'API 管理', key: 'api-management' },
    ],
  },
  {
    title: '系统',
    key: 'system',
    children: [
      { title: '审计日志', key: 'audit-log' },
      { title: '系统设置', key: 'system-settings' },
    ],
  },
]

export default function PermissionManagement() {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: '管理员', code: 'admin', description: '系统管理员，拥有所有权限', userCount: 3, status: true },
    { id: '2', name: '编辑', code: 'editor', description: '内容编辑人员', userCount: 12, status: true },
    { id: '3', name: '成员', code: 'member', description: '普通成员', userCount: 45, status: true },
  ])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色编码', dataIndex: 'code', key: 'code', render: (v: string) => <Tag>{v}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: boolean, record: Role) => (
        <Switch
          checked={v}
          onChange={checked => {
            setRoles(prev =>
              prev.map(r => (r.id === record.id ? { ...r, status: checked } : r))
            )
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Role) => (
        <Button type="link" onClick={() => setSelectedRole(record)}>
          配置权限
        </Button>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="角色列表"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            新增角色
          </Button>
        }
      >
        <Table dataSource={roles} columns={columns} rowKey="id" />
      </DataPanel>

      {selectedRole && (
        <DataPanel
          title={`${selectedRole.name} - 菜单权限配置`}
          style={{ marginTop: 16 }}
          extra={
            <Button type="link" onClick={() => setSelectedRole(null)}>
              收起
            </Button>
          }
        >
          <Tree
            checkable
            defaultExpandedKeys={['overview', 'data', 'user', 'business', 'system']}
            treeData={menuTreeData}
          />
        </DataPanel>
      )}

      <Modal
        title="新增角色"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(values => {
            setRoles(prev => [
              ...prev,
              {
                id: String(prev.length + 1),
                ...values,
                userCount: 0,
                status: true,
              },
            ])
            setIsModalOpen(false)
            form.resetFields()
          })
        }}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="角色编码" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
