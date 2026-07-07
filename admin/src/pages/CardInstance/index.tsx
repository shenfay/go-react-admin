import { Table, Tag, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const columns = [
  { title: '卡片内容', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: '提交者', dataIndex: 'childName', key: 'childName' },
  { title: '所属目标', dataIndex: 'goalName', key: 'goalName' },
  { title: '卡片模板', dataIndex: 'templateName', key: 'templateName' },
  {
    title: '验收状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, { bg: string; color: string }> = {
        pending: { bg: '#fef3c7', color: '#92400e' },
        approved: { bg: '#dcfce7', color: '#166534' },
        rejected: { bg: '#fef2f2', color: '#e74c3c' },
        auto_passed: { bg: '#edf2ff', color: '#3b6fdf' },
      }
      const labelMap: Record<string, string> = {
        pending: '待验收',
        approved: '已通过',
        rejected: '已退回',
        auto_passed: '自动通过',
      }
      const c = colorMap[status] || { bg: '#f5f2ed', color: '#6b6258' }
      return <Tag style={{ background: c.bg, color: c.color, border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{labelMap[status] || status}</Tag>
    },
  },
  { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#b0a89a', width: 28, height: 28, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />
    ),
  },
]

export default function CardInstance() {
  return (
    <DataPanel title="卡片提交记录">
      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无数据' }} />
    </DataPanel>
  )
}
