import { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Select, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'
import { getOperationLogs, type OperationLogRecord } from '@/services/operationLog'

// 分类选项（对应后端 category 字段）
const categoryOptions = [
  { label: '全部分类', value: '' },
  { label: '认证', value: 'AUTH' },
  { label: '用户', value: 'USER' },
  { label: '系统', value: 'SYSTEM' },
  { label: '业务', value: 'BIZ' },
]

// 分类标签颜色映射
const categoryColorMap: Record<string, string> = {
  AUTH: 'blue',
  USER: 'green',
  SYSTEM: 'purple',
  BIZ: 'orange',
}

// action 中文映射
const actionLabelMap: Record<string, string> = {
  'AUTH.LOGIN.SUCCESS': '登录成功',
  'AUTH.LOGIN.FAILED': '登录失败',
  'AUTH.LOGOUT': '退出登录',
  'AUTH.TOKEN.REFRESHED': '刷新令牌',
  'AUTH.ACCOUNT.LOCKED': '账户锁定',
  'USER.REGISTER': '用户注册',
  'USER.PROFILE.UPDATED': '更新资料',
  'SYSTEM.CONFIG.UPDATED': '更新配置',
  'SYSTEM.PERMISSION.CHANGED': '权限变更',
}

function formatAction(action: string): string {
  return actionLabelMap[action] || action
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function OperationLog() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<OperationLogRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getOperationLogs({
        category: categoryFilter || undefined,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      })
      setDataSource(res.data || [])
      // 后端暂未返回 total，用 data length 推断是否有下一页
      setTotal(res.data?.length >= pageSize ? page * pageSize + 1 : (page - 1) * pageSize + (res.data?.length || 0))
    } catch {
      setDataSource([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 筛选变更时重置到第一页
  const handleCategoryChange = (v: string) => {
    setCategoryFilter(v)
    setPage(1)
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 170,
      render: (v: string) => formatTime(v),
    },
    {
      title: '操作人',
      dataIndex: 'email',
      key: 'email',
      render: (v: string, record: OperationLogRecord) => v || record.user_id,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      render: (v: string) => (
        <Tag color={categoryColorMap[v] || 'default'}>{v}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (v: string) => formatAction(v),
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (v: string) => v || '-',
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: '结果',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: string) => {
        const isSuccess = v === 'SUCCESS'
        return (
          <Tag style={{
            background: isSuccess ? 'var(--green-light)' : 'var(--red-light)',
            color: isSuccess ? 'var(--green-text)' : 'var(--red-text)',
          }}>
            {isSuccess ? '成功' : '失败'}
          </Tag>
        )
      },
    },
  ]

  return (
    <div>
      <DataPanel
        title="操作日志"
        filters={
          <>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              style={{ width: 140 }}
              options={categoryOptions}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              options={[
                { label: '全部结果', value: '' },
                { label: '成功', value: 'SUCCESS' },
                { label: '失败', value: 'FAILED' },
              ]}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              style={{ color: 'var(--text-primary)' }}
            >
              刷新
            </Button>
          </>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条记录`,
            onChange: (p, ps) => {
              setPage(p)
              setPageSize(ps)
            },
          }}
        />
      </DataPanel>
    </div>
  )
}
