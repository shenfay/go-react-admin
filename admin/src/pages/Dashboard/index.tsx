import { useEffect, useState } from 'react'
import { Button } from 'antd'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import ProgressBar from '@/components/ProgressBar'
import DataPanel from '@/components/DataPanel'
import { mockGetStats, mockGetActivities, mockGetServices } from '@/services/mock'
import type { Activity, ServiceStatus } from '@/types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUsersChange: 0,
    dailyActive: 0,
    dailyActiveChange: 0,
    apiCalls: 0,
    apiCallsChange: 0,
    avgResponse: 0,
    avgResponseChange: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [services, setServices] = useState<ServiceStatus[]>([])

  useEffect(() => {
    mockGetStats().then(setStats)
    mockGetActivities().then(setActivities)
    mockGetServices().then(setServices)
  }, [])

  const getServiceStatus = (health: number) => {
    if (health >= 80) return 'normal' as const
    if (health >= 50) return 'warning' as const
    return 'exception' as const
  }

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="总用户数"
          value={stats.totalUsers.toLocaleString()}
          change={stats.totalUsersChange}
          changeLabel="较上月"
          color="var(--accent)"
        />
        <StatCard
          label="日活用户"
          value={stats.dailyActive.toLocaleString()}
          change={stats.dailyActiveChange}
          changeLabel="较昨日"
          color="var(--green)"
        />
        <StatCard
          label="API 调用"
          value={`${(stats.apiCalls / 1000).toFixed(1)}k`}
          change={stats.apiCallsChange}
          changeLabel="较上月"
          color="var(--blue)"
        />
        <StatCard
          label="平均响应"
          value={`${stats.avgResponse}s`}
          change={stats.avgResponseChange}
          changeLabel="较上月"
          color="var(--yellow)"
        />
      </div>

      {/* Panels Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Recent Activities */}
        <DataPanel
          title="最近活动"
          extra={
            <Button type="link" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              查看全部
            </Button>
          }
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '10px 12px 10px 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  用户
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '10px 12px 10px 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  操作
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '10px 12px 10px 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  状态
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '10px 12px 10px 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  时间
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map(item => (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: '13px 12px 13px 0',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-color)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.user}
                  </td>
                  <td
                    style={{
                      padding: '13px 12px 13px 0',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-color)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.action}
                  </td>
                  <td
                    style={{
                      padding: '13px 12px 13px 0',
                      borderBottom: '1px solid var(--border-color)',
                      verticalAlign: 'middle',
                    }}
                  >
                    <StatusTag status={item.status} />
                  </td>
                  <td
                    style={{
                      padding: '13px 12px 13px 0',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-color)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>

        {/* Service Status */}
        <DataPanel
          title="服务状态"
          extra={
            <Button type="link" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              详情
            </Button>
          }
        >
          <ul style={{ listStyle: 'none' }}>
            {services.map(service => (
              <li
                key={service.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: 14,
                }}
              >
                <span style={{ minWidth: 80 }}>{service.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, margin: '0 16px' }}>
                  <ProgressBar
                    percent={service.health}
                    status={getServiceStatus(service.health)}
                  />
                </div>
                <StatusTag status={service.status} />
              </li>
            ))}
          </ul>
        </DataPanel>
      </div>

      {/* Quick Actions */}
      <DataPanel title="快捷操作">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button type="primary">新建对话</Button>
          <Button>添加用户</Button>
          <Button>导出报表</Button>
          <Button>API 文档</Button>
          <Button danger>清空缓存</Button>
        </div>
      </DataPanel>
    </div>
  )
}
