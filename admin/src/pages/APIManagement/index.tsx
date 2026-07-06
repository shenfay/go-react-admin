import { useState } from 'react'
import { Table, Tag, Button, Descriptions, Tabs } from 'antd'
import DataPanel from '@/components/DataPanel'

interface APIItem {
  id: string
  name: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  status: '在线' | '离线' | '维护中'
  calls: number
  avgTime: string
}

const apiData: APIItem[] = [
  { id: '1', name: '用户列表', path: '/api/users', method: 'GET', status: '在线', calls: 12500, avgTime: '45ms' },
  { id: '2', name: '创建用户', path: '/api/users', method: 'POST', status: '在线', calls: 3200, avgTime: '120ms' },
  { id: '3', name: '数据查询', path: '/api/data/query', method: 'POST', status: '在线', calls: 45000, avgTime: '80ms' },
  { id: '4', name: '报表导出', path: '/api/report/export', method: 'GET', status: '维护中', calls: 800, avgTime: '2.5s' },
  { id: '5', name: '系统配置', path: '/api/config', method: 'PUT', status: '在线', calls: 150, avgTime: '30ms' },
]

const methodColors: Record<string, string> = {
  GET: 'var(--green)',
  POST: 'var(--blue)',
  PUT: 'var(--yellow)',
  DELETE: 'var(--red)',
}

export default function APIManagement() {
  const [selectedApi, setSelectedApi] = useState<APIItem | null>(null)

  const columns = [
    { title: 'API 名称', dataIndex: 'name', key: 'name' },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
      render: (v: string, record: APIItem) => (
        <span>
          <Tag color={methodColors[record.method]}>{record.method}</Tag>
          <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{v}</span>
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag
          style={{
            background: v === '在线' ? 'var(--green-light)' : v === '维护中' ? 'var(--yellow-light)' : 'var(--red-light)',
            color: v === '在线' ? 'var(--green-text)' : v === '维护中' ? 'var(--yellow-text)' : 'var(--red-text)',
            border: 'none',
          }}
        >
          {v}
        </Tag>
      ),
    },
    { title: '调用次数', dataIndex: 'calls', key: 'calls', render: (v: number) => v.toLocaleString() },
    { title: '平均耗时', dataIndex: 'avgTime', key: 'avgTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: APIItem) => (
        <Button type="link" onClick={() => setSelectedApi(record)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <DataPanel title="API 列表">
        <Table dataSource={apiData} columns={columns} rowKey="id" />
      </DataPanel>

      {selectedApi && (
        <DataPanel
          title={`${selectedApi.name} - API 详情`}
          style={{ marginTop: 16 }}
          extra={
            <Button type="link" onClick={() => setSelectedApi(null)}>
              收起
            </Button>
          }
        >
          <Tabs
            items={[
              {
                key: '1',
                label: '基本信息',
                children: (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="API 名称">{selectedApi.name}</Descriptions.Item>
                    <Descriptions.Item label="请求方法">
                      <Tag color={methodColors[selectedApi.method]}>{selectedApi.method}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="请求路径">{selectedApi.path}</Descriptions.Item>
                    <Descriptions.Item label="状态">{selectedApi.status}</Descriptions.Item>
                    <Descriptions.Item label="调用次数">{selectedApi.calls.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="平均耗时">{selectedApi.avgTime}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: '2',
                label: '请求参数',
                children: (
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'auto',
                    }}
                  >
                    {JSON.stringify(
                      {
                        name: { type: 'string', required: true, description: '用户姓名' },
                        email: { type: 'string', required: true, description: '邮箱地址' },
                        role: { type: 'string', required: false, description: '角色编码' },
                      },
                      null,
                      2
                    )}
                  </pre>
                ),
              },
              {
                key: '3',
                label: '响应示例',
                children: (
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'auto',
                    }}
                  >
                    {JSON.stringify(
                      {
                        code: 200,
                        message: 'success',
                        data: {
                          id: '123',
                          name: '张三',
                          email: 'zhangsan@example.com',
                          role: 'admin',
                          createdAt: '2026-01-15T08:00:00Z',
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                ),
              },
            ]}
          />
        </DataPanel>
      )}
    </div>
  )
}
