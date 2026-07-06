import { useState } from 'react'
import { Tree, Table, Tag, Card, Row, Col, Avatar } from 'antd'
import { UserOutlined, TeamOutlined, ApartmentOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const orgTree = [
  {
    title: '中台管理',
    key: 'root',
    children: [
      {
        title: '技术部',
        key: 'tech',
        children: [
          { title: '数据组', key: 'data-team', children: [
            { title: '张小明', key: 'zhangxm', isLeaf: true },
            { title: '赵鹏', key: 'zhaop', isLeaf: true },
          ]},
          { title: '平台组', key: 'platform', children: [
            { title: '王磊', key: 'wanglei', isLeaf: true },
          ]},
        ],
      },
      {
        title: '运营部',
        key: 'ops',
        children: [
          { title: '内容运营组', key: 'content-ops', children: [
            { title: '李雪', key: 'lixue', isLeaf: true },
          ]},
        ],
      },
      {
        title: '产品部',
        key: 'product',
        children: [
          { title: '市场组', key: 'market', children: [
            { title: '陈芳', key: 'chenfang', isLeaf: true },
          ]},
        ],
      },
      {
        title: '市场部',
        key: 'mkt',
        children: [
          { title: '推广组', key: 'promotion', children: [] },
        ],
      },
    ],
  },
]

const memberData = [
  { id: '1', name: '张小明', dept: '技术部-数据组', role: '管理员', status: '活跃' },
  { id: '2', name: '赵鹏', dept: '技术部-数据组', role: '成员', status: '活跃' },
  { id: '3', name: '王磊', dept: '技术部-平台组', role: '编辑', status: '待激活' },
  { id: '4', name: '李雪', dept: '运营部-内容运营组', role: '编辑', status: '活跃' },
  { id: '5', name: '陈芳', dept: '市场部-推广组', role: '成员', status: '已禁用' },
]

export default function Organization() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null)

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', render: (v: string) => (
      <span><Avatar size={20} icon={<UserOutlined />} style={{ marginRight: 8 }} />{v}</span>
    )},
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (v: string) => <Tag>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === '活跃' ? 'success' : v === '待激活' ? 'warning' : 'error'}>{v}</Tag> },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
      <DataPanel title="组织架构">
        <Tree
          treeData={orgTree}
          defaultExpandedKeys={['root', 'tech', 'data-team']}
          onSelect={keys => setSelectedDept(keys[0] as string)}
          showIcon
          icon={<ApartmentOutlined />}
        />
      </DataPanel>
      <DataPanel title={selectedDept ? `部门成员` : '全部成员'}>
        <Table dataSource={memberData} columns={columns} rowKey="id" />
      </DataPanel>
    </div>
  )
}
