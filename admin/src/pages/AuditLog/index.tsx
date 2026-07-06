import { useState } from 'react'
import { Table, Tag, Select, DatePicker, Button, Space } from 'antd'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const { RangePicker } = DatePicker

interface AuditRecord {
  id: string
  time: string
  user: string
  action: string
  target: string
  detail: string
  ip: string
  result: string
}

const auditData: AuditRecord[] = [
  { id: '1', time: '2026-05-27 10:30:00', user: '张小明', action: '登录系统', target: '系统', detail: 'IP: 192.168.1.100 登录成功', ip: '192.168.1.100', result: '通过' },
  { id: '2', time: '2026-05-27 10:25:00', user: '系统', action: '权限变更', target: '角色：编辑', detail: '李雪修改了「编辑」角色的权限', ip: '192.168.1.101', result: '通过' },
  { id: '3', time: '2026-05-27 10:00:00', user: '系统', action: '数据访问', target: '表：user', detail: '王磊查询了 user 表敏感字段', ip: '192.168.1.102', result: '拒绝' },
  { id: '4', time: '2026-05-27 09:30:00', user: '系统', action: '配置变更', target: '邮件服务', detail: '陈芳修改了邮件服务器配置', ip: '192.168.1.103', result: '通过' },
  { id: '5', time: '2026-05-27 09:00:00', user: '系统', action: '数据导出', target: '数据：用户信息', detail: '赵鹏导出 1000 条用户数据', ip: '192.168.1.104', result: '拒绝' },
  { id: '6', time: '2026-05-27 08:00:00', user: '系统', action: '数据删除', target: '表：temp_log', detail: '定时任务清理临时日志表', ip: '-', result: '通过' },
  { id: '7', time: '2026-05-26 23:00:00', user: '系统', action: '任务执行', target: 'ETL：用户同步', detail: 'ETL 任务执行失败，已自动重试 3 次', ip: '-', result: '失败' },
  { id: '8', time: '2026-05-26 18:00:00', user: '系统', action: '账号管理', target: '用户：赵六', detail: '管理员禁用了用户「赵六」的账号', ip: '192.168.1.100', result: '通过' },
]

export default function AuditLog() {
  const [actionFilter, setActionFilter] = useState('')

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 170 },
    { title: '操作类型', dataIndex: 'action', key: 'action', render: (v: string) => <Tag>{v}</Tag> },
    { title: '操作对象', dataIndex: 'target', key: 'target' },
    { title: '详情', dataIndex: 'detail', key: 'detail', ellipsis: true },
    { title: '来源 IP', dataIndex: 'ip', key: 'ip' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (v: string) => (
      <Tag color={v === '通过' ? 'success' : v === '拒绝' ? 'warning' : 'error'}>{v}</Tag>
    )},
    { title: '操作人', dataIndex: 'user', key: 'user' },
  ]

  return (
    <div>
      <DataPanel title="审计日志" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            value={actionFilter}
            onChange={setActionFilter}
            style={{ width: 140 }}
            options={[
              { label: '全部类型', value: '' },
              { label: '登录系统', value: '登录系统' },
              { label: '权限变更', value: '权限变更' },
              { label: '数据访问', value: '数据访问' },
              { label: '配置变更', value: '配置变更' },
              { label: '数据导出', value: '数据导出' },
              { label: '数据删除', value: '数据删除' },
              { label: '任务执行', value: '任务执行' },
              { label: '账号管理', value: '账号管理' },
            ]}
          />
          <Select
            style={{ width: 120 }}
            options={[
              { label: '全部结果', value: '' },
              { label: '通过', value: '通过' },
              { label: '拒绝', value: '拒绝' },
              { label: '失败', value: '失败' },
            ]}
          />
          <RangePicker />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </DataPanel>

      <DataPanel title="">
        <Table dataSource={auditData} columns={columns} rowKey="id" pagination={{ showSizeChanger: true, showTotal: total => `共 ${total} 条记录` }} />
      </DataPanel>
    </div>
  )
}
