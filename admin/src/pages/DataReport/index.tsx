import { useState } from 'react'
import { Button, DatePicker, Select, Space } from 'antd'
import { Line, Pie } from '@ant-design/charts'
import DataPanel from '@/components/DataPanel'

const { RangePicker } = DatePicker

export default function DataReport() {
  const [reportType, setReportType] = useState('daily')

  const lineData = [
    { date: '2026-05-01', category: '访问量', value: 1200 },
    { date: '2026-05-02', category: '访问量', value: 1500 },
    { date: '2026-05-03', category: '访问量', value: 1800 },
    { date: '2026-05-04', category: '访问量', value: 1400 },
    { date: '2026-05-05', category: '访问量', value: 2100 },
    { date: '2026-05-06', category: '访问量', value: 2300 },
    { date: '2026-05-07', category: '访问量', value: 1900 },
    { date: '2026-05-01', category: '转化量', value: 300 },
    { date: '2026-05-02', category: '转化量', value: 450 },
    { date: '2026-05-03', category: '转化量', value: 500 },
    { date: '2026-05-04', category: '转化量', value: 380 },
    { date: '2026-05-05', category: '转化量', value: 600 },
    { date: '2026-05-06', category: '转化量', value: 650 },
    { date: '2026-05-07', category: '转化量', value: 520 },
  ]

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    color: ['var(--accent)', 'var(--green)'],
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: 'var(--text-secondary)',
        },
      },
    },
    xAxis: {
      label: {
        style: { fill: 'var(--text-muted)' },
      },
      line: {
        style: { stroke: 'var(--border-color)' },
      },
    },
    yAxis: {
      label: {
        style: { fill: 'var(--text-muted)' },
      },
      grid: {
        line: {
          style: { stroke: 'var(--border-color)' },
        },
      },
    },
  }

  const pieData = [
    { type: '直接访问', value: 35 },
    { type: '搜索引擎', value: 28 },
    { type: '外部链接', value: 20 },
    { type: '社交媒体', value: 12 },
    { type: '邮件营销', value: 5 },
  ]

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: {
        fill: 'var(--text-secondary)',
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fill: 'var(--text-secondary)',
        },
      },
    },
  }

  return (
    <div>
      {/* Filter Bar */}
      <DataPanel title="报表筛选" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 120 }}
            options={[
              { label: '日报', value: 'daily' },
              { label: '周报', value: 'weekly' },
              { label: '月报', value: 'monthly' },
            ]}
          />
          <RangePicker />
          <Button type="primary">查询</Button>
          <Button>导出报表</Button>
        </Space>
      </DataPanel>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <DataPanel title="访问趋势">
          <Line {...lineConfig} />
        </DataPanel>
        <DataPanel title="流量来源">
          <Pie {...pieConfig} />
        </DataPanel>
      </div>
    </div>
  )
}
