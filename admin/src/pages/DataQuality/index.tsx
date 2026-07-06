import { Progress, Table } from 'antd'
import StatCard from '@/components/StatCard'
import DataPanel from '@/components/DataPanel'

export default function DataQuality() {
  const qualityData = [
    { id: '1', table: '用户表', completeness: 98, accuracy: 96, consistency: 94, timeliness: 99, overall: 97 },
    { id: '2', table: '订单表', completeness: 95, accuracy: 92, consistency: 90, timeliness: 96, overall: 93 },
    { id: '3', table: '商品表', completeness: 99, accuracy: 98, consistency: 97, timeliness: 95, overall: 97 },
    { id: '4', table: '日志表', completeness: 88, accuracy: 85, consistency: 82, timeliness: 90, overall: 86 },
    { id: '5', table: '配置表', completeness: 100, accuracy: 99, consistency: 98, timeliness: 100, overall: 99 },
  ]

  const anomalyData = [
    { id: '1', table: '用户表', field: '手机号', issue: '格式不合法', count: 23, severity: '高' },
    { id: '2', table: '订单表', field: '金额', issue: '负值异常', count: 5, severity: '高' },
    { id: '3', table: '日志表', field: '时间戳', issue: '未来时间', count: 156, severity: '中' },
    { id: '4', table: '商品表', field: '库存', issue: '空值', count: 12, severity: '低' },
  ]

  const columns = [
    { title: '数据表', dataIndex: 'table', key: 'table' },
    {
      title: '完整性',
      dataIndex: 'completeness',
      key: 'completeness',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--accent)" />,
    },
    {
      title: '准确性',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--green)" />,
    },
    {
      title: '一致性',
      dataIndex: 'consistency',
      key: 'consistency',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--blue)" />,
    },
    {
      title: '及时性',
      dataIndex: 'timeliness',
      key: 'timeliness',
      render: (v: number) => <Progress percent={v} size="small" strokeColor="var(--yellow)" />,
    },
    {
      title: '综合评分',
      dataIndex: 'overall',
      key: 'overall',
      render: (v: number) => (
        <span style={{ fontWeight: 600, color: v >= 95 ? 'var(--green)' : v >= 85 ? 'var(--yellow)' : 'var(--red)' }}>
          {v}
        </span>
      ),
    },
  ]

  const anomalyColumns = [
    { title: '数据表', dataIndex: 'table', key: 'table' },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '异常类型', dataIndex: 'issue', key: 'issue' },
    { title: '异常数量', dataIndex: 'count', key: 'count' },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (v: string) => (
        <span style={{
          color: v === '高' ? 'var(--red)' : v === '中' ? 'var(--yellow)' : 'var(--green)',
          fontWeight: 500,
        }}>
          {v}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="数据质量评分" value="94.2" change={1.8} changeLabel="较上周" color="var(--green)" />
        <StatCard label="异常数据表" value="3" change={-1} changeLabel="较昨日" color="var(--red)" />
        <StatCard label="待修复异常" value="196" change={23} changeLabel="新增" color="var(--yellow)" />
        <StatCard label="质量巡检" value="100%" changeLabel="覆盖率" color="var(--blue)" />
      </div>

      <DataPanel title="数据质量评分" style={{ marginBottom: 16 }}>
        <Table
          dataSource={qualityData}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </DataPanel>

      <DataPanel title="异常数据列表">
        <Table
          dataSource={anomalyData}
          columns={anomalyColumns}
          rowKey="id"
          pagination={false}
        />
      </DataPanel>
    </div>
  )
}
