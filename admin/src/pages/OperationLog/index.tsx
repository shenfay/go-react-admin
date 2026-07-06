import { useState } from 'react'
import { Table, Tag, Select, DatePicker, Button, Space } from 'antd'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const { RangePicker } = DatePicker

interface LogRecord {
  id: string
  user: string
  module: string
  action: string
  detail: string
  ip: string
  result: string
  time: string
}

const logData: LogRecord[] = [
  { id: '1', user: '张小明', module: '用户管理', action: '创建用户', detail: '创建用户「李华」', ip: '192.168.1.100', result: '成功', time: '2026-05-27 10:30:00' },
  { id: '2', user: '李雪', module: '权限管理', action: '修改角色', detail: '编辑角色「编辑」的权限', ip: '192.168.1.101', result: '成功', time: '2026-05-27 10:15:00' },
  { id: '3', user: '王磊', module: '系统设置', action: '修改配置', detail: '修改邮件服务器配置', ip: '192.168.1.102', result: '成功', time: '2026-05-27 09:50:00' },
  { id: '4', user: '陈芳', module: '用户管理', action: '禁用用户', detail: '禁用用户「赵六」', ip: '192.168.1.103', result: '成功', time: '2026-05-27 09:30:00' },
  { id: '5', user: '赵鹏', module: '数据安全', action: '导出数据', detail: '导出 1000 条用户数据', ip: '192.168.1.104', result: '拒绝', time: '2026-05-27 09:20:00' },
  { id: '6', user: '张小明', module: 'API 管理', action: '更新接口', detail: '更新接口 /api/v1/user/detail', ip: '192.168.1.100', result: '成功', time: '2026-05-27 09:00:00' },
  { id: '7', user: '系统', module: '任务调度', action: '任务执行', detail: 'ETL 任务「用户数据同步」执行失败', ip: '-', result: '失败', time: '2026-05-27 08:45:00' },
  { id: '8', user: '李雪', module: '内容管理', action: '发布内容', detail: '发布文章「Q2 运营报告」', ip: '192.168.1.101', result: '成功', time: '2026-05-27 08:30:00' },
]

const moduleOptions = [
  { label: '全部模块', value: '' },
  { label: '用户管理', value: '用户管理' },
  { label: '权限管理', value: '权限管理' },
  { label: '系统设置', value: '系统设置' },
  { label: '数据安全', value: '数据安全' },
  { label: 'API 管理', value: 'API 管理' },
  { label: '任务调度', value: '任务调度' },
  { label: '内容管理', value: '内容管理' },
]

export default function OperationLog() {
  const [moduleFilter, setModuleFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 170 },
    { title: '操作人', dataIndex: 'user', key: 'user' },
    { title: '模块', dataIndex: 'module', key: 'module', render: (v: string) => <Tag>{v}</Tag> },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: '详情', dataIndex: 'detail', key: 'detail' },
    { title: 'IP 地址', dataIndex: 'ip', key: 'ip' },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      render: (v: string) => (
        <Tag color={v === '成功' ? 'success' : v === '拒绝' ? 'warning' : 'error'}>{v}</Tag>
      ),
    },
  ]

  return (
    <div>
      {/* Filter Bar */}
      <DataPanel title="操作日志" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            value={moduleFilter}
            onChange={setModuleFilter}
            style={{ width: 140 }}
            options={moduleOptions}
          />
          <Select
            value={resultFilter}
            onChange={setResultFilter}
            style={{ width: 120 }}
            options={[
              { label: '全部结果', value: '' },
              { label: '成功', value: '成功' },
              { label: '失败', value: '失败' },
              { label: '拒绝', value: '拒绝' },
            ]}
          />
          <RangePicker />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </DataPanel>

      {/* Log Table */}
      <DataPanel title="">
        <Table
          dataSource={logData}
          columns={columns}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </DataPanel>
    </div>
  )
}
