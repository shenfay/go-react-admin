import { useState } from 'react'
import { Button, Input, Table, Tag, Space, message } from 'antd'
import { PlayCircleOutlined, SaveOutlined, HistoryOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

const { TextArea } = Input

interface ScriptRecord {
  id: string
  name: string
  content: string
  version: string
  updatedAt: string
  status: string
}

const scriptList: ScriptRecord[] = [
  {
    id: '1',
    name: '用户活跃度统计',
    content: 'SELECT date, COUNT(DISTINCT user_id) as dau\nFROM user_behavior\nWHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)\nGROUP BY date\nORDER BY date;',
    version: 'v1.3',
    updatedAt: '2026-05-26',
    status: '已发布',
  },
  {
    id: '2',
    name: '订单金额聚合',
    content: 'SELECT\n  DATE_FORMAT(order_date, "%Y-%m") as month,\n  SUM(order_amount) as total_amount,\n  COUNT(*) as order_count\nFROM orders\nGROUP BY month\nORDER BY month;',
    version: 'v2.0',
    updatedAt: '2026-05-25',
    status: '已发布',
  },
  {
    id: '3',
    name: '商品库存预警',
    content: 'SELECT product_id, product_name, stock\nFROM products\nWHERE stock < 100\nORDER BY stock ASC;',
    version: 'v1.0',
    updatedAt: '2026-05-27',
    status: '草稿',
  },
]

export default function ScriptDev() {
  const [selectedScript, setSelectedScript] = useState<ScriptRecord | null>(null)
  const [scriptContent, setScriptContent] = useState('')
  const [resultData, setResultData] = useState<Record<string, unknown>[]>([])
  const [executing, setExecuting] = useState(false)

  const handleExecute = () => {
    setExecuting(true)
    setTimeout(() => {
      setExecuting(false)
      setResultData([
        { date: '2026-05-01', dau: 3200 },
        { date: '2026-05-02', dau: 3450 },
        { date: '2026-05-03', dau: 3100 },
        { date: '2026-05-04', dau: 3800 },
        { date: '2026-05-05', dau: 4100 },
      ])
      message.success('执行成功，返回 5 条记录')
    }, 1500)
  }

  const resultColumns = resultData.length > 0
    ? Object.keys(resultData[0]).map(key => ({ title: key, dataIndex: key, key }))
    : []

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* 左侧：脚本列表 - 改用卡片列表布局 */}
      <div style={{ width: 360, flexShrink: 0 }}>
        <DataPanel title="脚本列表">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scriptList.map(script => (
              <div
                key={script.id}
                onClick={() => {
                  setSelectedScript(script)
                  setScriptContent(script.content)
                  setResultData([])
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: selectedScript?.id === script.id
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border-color)',
                  background: selectedScript?.id === script.id
                    ? 'rgba(61, 90, 128, 0.04)'
                    : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (selectedScript?.id !== script.id) {
                    e.currentTarget.style.background = 'var(--hover-bg)'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedScript?.id !== script.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 14 }}>{script.name}</span>
                  <Tag color={script.status === '已发布' ? 'success' : 'default'} style={{ marginRight: 0 }}>{script.status}</Tag>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{script.version}</span>
                  <span>{script.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>

      {/* 右侧：编辑器 + 结果 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <DataPanel
          title={selectedScript ? `编辑: ${selectedScript.name}` : 'SQL 编辑器'}
          extra={
            <Space>
              <Button icon={<SaveOutlined />}>保存</Button>
              <Button icon={<HistoryOutlined />}>历史版本</Button>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={executing}
                onClick={handleExecute}
              >
                执行
              </Button>
            </Space>
          }
        >
          <TextArea
            value={scriptContent}
            onChange={e => setScriptContent(e.target.value)}
            rows={16}
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              background: '#f8f9fa',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
            placeholder="请输入 SQL 脚本..."
          />
        </DataPanel>

        {resultData.length > 0 && (
          <DataPanel title="执行结果" style={{ marginTop: 16 }}>
            <Table dataSource={resultData} columns={resultColumns} size="small" />
          </DataPanel>
        )}
      </div>
    </div>
  )
}
