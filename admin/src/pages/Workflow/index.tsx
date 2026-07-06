import { useState } from 'react'
import { Table, Tag, Button, Steps, Descriptions, Space, Select } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface WorkflowDef {
  id: string
  name: string
  version: string
  status: string
  updatedAt: string
  instances: number
}

const workflowData: WorkflowDef[] = [
  { id: '1', name: '数据接入审批流程', version: 'v2', status: '已发布', updatedAt: '2026-05-20', instances: 12 },
  { id: '2', name: '数据发布审核流程', version: 'v1', status: '已发布', updatedAt: '2026-05-15', instances: 8 },
  { id: '3', name: '权限变更审批流程', version: 'v3', status: '已发布', updatedAt: '2026-05-10', instances: 25 },
  { id: '4', name: '数据质量复核流程', version: 'v1', status: '草稿', updatedAt: '2026-05-05', instances: 0 },
]

const instanceData = [
  { id: '1', workflow: '数据接入审批流程', initiator: '张小明', status: '进行中', currentNode: '技术负责人审批', createTime: '2026-05-27 10:00' },
  { id: '2', workflow: '权限变更审批流程', initiator: '李雪', status: '已完成', currentNode: '-', createTime: '2026-05-26 14:00' },
  { id: '3', workflow: '数据发布审核流程', initiator: '王磊', status: '驳回', currentNode: '重新提交', createTime: '2026-05-25 09:00' },
  { id: '4', workflow: '权限变更审批流程', initiator: '陈芳', status: '待审批', currentNode: '部门主管审批', createTime: '2026-05-27 08:30' },
]

export default function Workflow() {
  const [activeTab, setActiveTab] = useState('definitions')

  const defColumns = [
    { title: '流程名称', dataIndex: 'name', key: 'name' },
    { title: '版本', dataIndex: 'version', key: 'version', render: (v: string) => <Tag>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === '已发布' ? 'success' : 'default'}>{v}</Tag> },
    { title: '运行中实例', dataIndex: 'instances', key: 'instances' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: WorkflowDef) => (
        <Space>
          {record.status === '已发布' ? (
            <Button size="small" icon={<PauseCircleOutlined />}>停用</Button>
          ) : (
            <Button size="small" icon={<PlayCircleOutlined />}>发布</Button>
          )}
          <Button size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  const instanceColumns = [
    { title: '流程名称', dataIndex: 'workflow', key: 'workflow' },
    { title: '发起人', dataIndex: 'initiator', key: 'initiator' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => {
      const colorMap: Record<string, string> = { '进行中': 'processing', '已完成': 'success', '驳回': 'error', '待审批': 'warning' }
      return <Tag color={colorMap[v]}>{v}</Tag>
    }},
    { title: '当前节点', dataIndex: 'currentNode', key: 'currentNode' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type={activeTab === 'definitions' ? 'primary' : 'default'} onClick={() => setActiveTab('definitions')}>
          流程定义
        </Button>
        <Button type={activeTab === 'instances' ? 'primary' : 'default'} onClick={() => setActiveTab('instances')} style={{ marginLeft: 8 }}>
          运行实例
        </Button>
      </div>

      <DataPanel title={activeTab === 'definitions' ? '工作流定义' : '运行实例'}>
        {activeTab === 'definitions' ? (
          <Table dataSource={workflowData} columns={defColumns} rowKey="id" />
        ) : (
          <Table dataSource={instanceData} columns={instanceColumns} rowKey="id" />
        )}
      </DataPanel>
    </div>
  )
}
