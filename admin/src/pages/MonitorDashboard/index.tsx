import { useState } from 'react'
import { Card, Row, Col, Tag, Progress, Space, Button, Select } from 'antd'
import { Area, Column } from '@ant-design/charts'
import { ReloadOutlined } from '@ant-design/icons'
import StatCard from '@/components/StatCard'
import DataPanel from '@/components/DataPanel'

interface ServiceItem {
  name: string
  health: number
  status: string
}

const serviceData: ServiceItem[] = [
  { name: 'API 网关', health: 98, status: '正常' },
  { name: '数据引擎', health: 92, status: '正常' },
  { name: '消息队列', health: 76, status: '警告' },
  { name: '存储服务', health: 95, status: '正常' },
  { name: '调度中心', health: 88, status: '正常' },
  { name: '日志服务', health: 45, status: '异常' },
]

export default function MonitorDashboard() {
  const [timeRange, setTimeRange] = useState('1h')

  const areaData = [
    { time: '00:00', cpu: 45, memory: 62, io: 30 },
    { time: '01:00', cpu: 38, memory: 58, io: 25 },
    { time: '02:00', cpu: 35, memory: 55, io: 22 },
    { time: '03:00', cpu: 32, memory: 52, io: 20 },
    { time: '04:00', cpu: 34, memory: 54, io: 28 },
    { time: '05:00', cpu: 42, memory: 60, io: 35 },
    { time: '06:00', cpu: 55, memory: 65, io: 45 },
    { time: '07:00', cpu: 68, memory: 72, io: 55 },
    { time: '08:00', cpu: 78, memory: 80, io: 65 },
    { time: '09:00', cpu: 82, memory: 85, io: 72 },
    { time: '10:00', cpu: 85, memory: 88, io: 78 },
    { time: '11:00', cpu: 88, memory: 90, io: 80 },
  ]

  const areaConfig = {
    data: areaData,
    xField: 'time',
    yField: ['cpu', 'memory', 'io'] as unknown as string,
    seriesField: 'type',
    smooth: true,
    color: ['var(--accent)', 'var(--green)', 'var(--blue)'],
    legend: {
      position: 'top-right',
      itemName: { style: { fill: 'var(--text-secondary)' } },
    },
    xAxis: {
      label: { style: { fill: 'var(--text-muted)' } },
      line: { style: { stroke: 'var(--border-color)' } },
    },
    yAxis: {
      label: { style: { fill: 'var(--text-muted)' } },
      grid: { line: { style: { stroke: 'var(--border-color)' } } },
    },
  }

  const requestData = [
    { time: '00:00', value: 1200 },
    { time: '01:00', value: 800 },
    { time: '02:00', value: 600 },
    { time: '03:00', value: 500 },
    { time: '04:00', value: 700 },
    { time: '05:00', value: 1500 },
    { time: '06:00', value: 2800 },
    { time: '07:00', value: 4200 },
    { time: '08:00', value: 5800 },
    { time: '09:00', value: 6200 },
    { time: '10:00', value: 5500 },
    { time: '11:00', value: 5100 },
  ]

  const requestConfig = {
    data: requestData,
    xField: 'time',
    yField: 'value',
    color: 'var(--accent)',
    columnStyle: { radius: [4, 4, 0, 0] },
    xAxis: {
      label: { style: { fill: 'var(--text-muted)' } },
      line: { style: { stroke: 'var(--border-color)' } },
    },
    yAxis: {
      label: { style: { fill: 'var(--text-muted)' } },
      grid: { line: { style: { stroke: 'var(--border-color)' } } },
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '正常': return 'success'
      case '警告': return 'warning'
      case '异常': return 'error'
      default: return 'default'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'var(--green)'
    if (health >= 60) return 'var(--yellow)'
    return 'var(--red)'
  }

  return (
    <div>
      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard label="系统健康度" value="92%" change={1.2} changeLabel="较昨日" color="var(--green)" />
        </Col>
        <Col span={6}>
          <StatCard label="平均响应时间" value="186ms" change={-12} changeLabel="较昨日" color="var(--accent)" />
        </Col>
        <Col span={6}>
          <StatCard label="当前 QPS" value="3,240" change={5.8} changeLabel="较昨日" color="var(--blue)" />
        </Col>
        <Col span={6}>
          <StatCard label="错误率" value="0.12%" change={-0.03} changeLabel="较昨日" color="var(--red)" />
        </Col>
      </Row>

      {/* Time Range Selector + Refresh */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={[
              { label: '最近 1 小时', value: '1h' },
              { label: '最近 6 小时', value: '6h' },
              { label: '最近 24 小时', value: '24h' },
              { label: '最近 7 天', value: '7d' },
            ]}
          />
        </Space>
        <Button icon={<ReloadOutlined />}>刷新</Button>
      </div>

      {/* System Metrics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <DataPanel title="系统资源监控 (CPU / 内存 / IO)">
            <Area {...areaConfig} />
          </DataPanel>
        </Col>
        <Col span={8}>
          <DataPanel title="请求量趋势">
            <Column {...requestConfig} />
          </DataPanel>
        </Col>
      </Row>

      {/* Service Health */}
      <DataPanel title="服务健康状态">
        <Row gutter={[16, 16]}>
          {serviceData.map((service, index) => (
            <Col span={8} key={index}>
              <Card
                size="small"
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{service.name}</span>
                  <Tag color={getStatusColor(service.status)}>{service.status}</Tag>
                </div>
                <Progress
                  percent={service.health}
                  size="small"
                  strokeColor={getHealthColor(service.health)}
                  format={pct => `${pct}%`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </DataPanel>
    </div>
  )
}
