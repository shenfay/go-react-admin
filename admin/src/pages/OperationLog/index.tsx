import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Select, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'
import { DEFAULT_PAGINATION, getPaginationShowTotal } from '@/config/pagination'
import { useCrudList } from '@/hooks/useCrudList'
import { getOperationLogs, type OperationLogRecord } from '@/services/operationLog'

// 分类标签颜色映射
const categoryColorMap: Record<string, string> = {
  AUTH: 'blue',
  USER: 'green',
  SYSTEM: 'purple',
  BIZ: 'orange',
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
  const { t } = useTranslation()
  const [categoryFilter, setCategoryFilter] = useState('')

  const categoryOptions = [
    { label: t('allCategories'), value: '' },
    { label: t('categoryAuth'), value: 'AUTH' },
    { label: t('categoryUser'), value: 'USER' },
    { label: t('categorySystem'), value: 'SYSTEM' },
    { label: t('categoryBiz'), value: 'BIZ' },
  ]

  const actionLabelMap: Record<string, string> = {
    'AUTH.LOGIN.SUCCESS': t('actionLoginSuccess'),
    'AUTH.LOGIN.FAILED': t('actionLoginFailed'),
    'AUTH.LOGOUT': t('actionLogout'),
    'AUTH.TOKEN.REFRESHED': t('actionTokenRefreshed'),
    'AUTH.ACCOUNT.LOCKED': t('actionAccountLocked'),
    'USER.REGISTER': t('actionUserRegister'),
    'USER.PROFILE.UPDATED': t('actionProfileUpdated'),
    'SYSTEM.CONFIG.UPDATED': t('actionConfigUpdated'),
    'SYSTEM.PERMISSION.CHANGED': t('actionPermissionChanged'),
  }

  function formatAction(action: string): string {
    return actionLabelMap[action] || action
  }

  const { loading, dataSource, total, page, pageSize, fetchData, handlePageChange } =
    useCrudList<OperationLogRecord>(
      async ({ page: p, pageSize: ps }) => {
        const res = await getOperationLogs({
          category: categoryFilter || undefined,
          limit: ps,
          offset: (p - 1) * ps,
        })
        const data = res.data || []
        const inferredTotal = data.length >= ps ? p * ps + 1 : (p - 1) * ps + data.length
        return { data, total: inferredTotal }
      },
    )

  const handleCategoryChange = (v: string) => {
    setCategoryFilter(v)
  }

  const columns = [
    {
      title: t('time'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 170,
      render: (v: string) => formatTime(v),
    },
    {
      title: t('operator'),
      dataIndex: 'email',
      key: 'email',
      render: (v: string, record: OperationLogRecord) => v || record.user_id,
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      width: 90,
      render: (v: string) => (
        <Tag color={categoryColorMap[v] || 'default'}>{v}</Tag>
      ),
    },
    {
      title: t('actions'),
      dataIndex: 'action',
      key: 'action',
      render: (v: string) => formatAction(v),
    },
    {
      title: t('ipAddress'),
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (v: string) => v || '-',
    },
    {
      title: t('device'),
      dataIndex: 'device',
      key: 'device',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: t('result'),
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
            {isSuccess ? t('success') : t('failed')}
          </Tag>
        )
      },
    },
  ]

  return (
    <div>
      <DataPanel
        title={t('operationLog')}
        filters={
          <>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              style={{ width: 140 }}
              options={categoryOptions}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              style={{ color: 'var(--text-primary)' }}
            >
              {t('refresh')}
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
            ...DEFAULT_PAGINATION,
            ...getPaginationShowTotal(t),
            onChange: handlePageChange,
          }}
        />
      </DataPanel>
    </div>
  )
}
