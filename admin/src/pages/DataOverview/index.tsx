import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { Column } from '@ant-design/charts'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import DataPanel from '@/components/DataPanel'
import { mockGetDataSources } from '@/services/mock'
import type { DataSource } from '@/types'

export default function DataOverview() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])

  useEffect(() => {
    mockGetDataSources().then(setDataSources)
  }, [])

  const chartData = [
    { month: '1月', value: 120 },
    { month: '2月', value: 200 },
    { month: '3月', value: 150 },
    { month: '4月', value: 80 },
    { month: '5月', value: 70 },
    { month: '6月', value: 110 },
  ]

  const chartConfig = {
    data: chartData,
    xField: 'month',
    yField: 'value',
    color: 'var(--accent)',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: 'var(--text-secondary)',
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: 'var(--text-muted)',
        },
      },
      line: {
        style: {
          stroke: 'var(--border-color)',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: 'var(--text-muted)',
        },
      },
      grid: {
        line: {
          style: {
            stroke: 'var(--border-color)',
          },
        },
      },
    },
  }

  return (
    <div>
      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard label="数据表总量" value="1,284" change={56} changeLabel="本月新增" color="var(--accent)" />
        <StatCard label="数据质量评分" value="94.2" change={1.8} changeLabel="较上周" color="var(--green)" />
        <StatCard label="ETL 任务" value="327" change={12} changeLabel="今日运行" color="var(--blue)" />
        <StatCard label="异常数据" value="18" change={3} changeLabel="较昨日" color="var(--red)" />
      </div>

      {/* Chart */}
      <DataPanel title="数据增长趋势" style={{ marginBottom: 16 }}>
        <Column {...chartConfig} />
      </DataPanel>

      {/* Data Sources */}
      <DataPanel
        title="数据源接入"
        extra={
          <Button type="link" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            接入新数据源
          </Button>
        }
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>数据源</th>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>类型</th>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>同步状态</th>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>最近同步</th>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>数据量</th>
              <th style={{
                textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                padding: '10px 12px 10px 0', borderBottom: '1px solid var(--border-color)',
              }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map((item, index) => (
              <tr key={index}>
                <td style={{
                  padding: '13px 12px 13px 0', fontSize: 14, color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>{item.name}</td>
                <td style={{
                  padding: '13px 12px 13px 0', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>
                  <StatusTag status={item.type} />
                </td>
                <td style={{
                  padding: '13px 12px 13px 0', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>
                  <StatusTag status={item.status} />
                </td>
                <td style={{
                  padding: '13px 12px 13px 0', fontSize: 14, color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>{item.lastSync}</td>
                <td style={{
                  padding: '13px 12px 13px 0', fontSize: 14, color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>{item.size}</td>
                <td style={{
                  padding: '13px 12px 13px 0', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle',
                }}>
                  <Button size="small">编辑</Button>
                  <Button type="link" size="small">同步</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataPanel>
    </div>
  )
}
