import { useState, useEffect, useCallback } from 'react'
import {
  Form, Input, InputNumber, Switch, Button, Select, Tabs, Table, Tag,
  Modal, message, Spin, Space,
} from 'antd'
import { EditOutlined, CheckOutlined, FormatPainterOutlined } from '@ant-design/icons'
import type { TabsProps, TableColumnsType } from 'antd'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import DataPanel from '@/components/DataPanel'
import {
  getSettings, batchUpdateSettings,
  type SettingItem, type SettingUpdateItem,
} from '@/services/setting'

// ---- 类型 ----
type SettingsMap = Record<string, unknown>

// ---- 通知事件定义 ----
interface NotifyEvent {
  key: string
  label: string
  enabled: boolean
}

// ---- 渠道配置 ----
interface ChannelConfig {
  name: string
  key: string
  configured: boolean
}

export default function SystemSettings() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settingsData, setSettingsData] = useState<SettingsMap>({})
  const [rawSettings, setRawSettings] = useState<SettingItem[]>([])

  // 通知设置状态
  const [notifyEvents, setNotifyEvents] = useState<NotifyEvent[]>([])
  const [channelModalOpen, setChannelModalOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<ChannelConfig | null>(null)
  const [channelForm] = Form.useForm()

  // 业务规则 JSON 编辑器状态
  const [streakJson, setStreakJson] = useState('')

  // ---- 加载数据 ----
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const items = await getSettings()
      setRawSettings(items)

      const map: SettingsMap = {}
      items.forEach((item) => {
        map[item.key] = item.value
      })
      setSettingsData(map)

      // 填充表单
      const formValues: Record<string, unknown> = {}
      items.forEach((item) => {
        formValues[item.key] = item.value
      })
      form.setFieldsValue(formValues)

      // 初始化通知事件
      setNotifyEvents([
        { key: 'notify_acceptance', label: '验收提醒', enabled: map['notify_acceptance'] as boolean ?? true },
        { key: 'notify_goal_progress', label: '目标进度通知', enabled: map['notify_goal_progress'] as boolean ?? true },
        { key: 'notify_companion_status', label: '伙伴状态通知', enabled: map['notify_companion_status'] as boolean ?? true },
        { key: 'notify_streak_inactive', label: '连续未完成提醒', enabled: map['notify_streak_inactive'] as boolean ?? true },
      ])

      // 初始化连续加成规则 JSON
      const streakRules = map['streak_bonus_rules']
      if (streakRules && typeof streakRules === 'object') {
        setStreakJson(JSON.stringify(streakRules, null, 2))
      } else if (typeof streakRules === 'string') {
        try {
          setStreakJson(JSON.stringify(JSON.parse(streakRules), null, 2))
        } catch {
          setStreakJson('{}')
        }
      }
    } catch {
      message.error('加载设置失败')
    } finally {
      setLoading(false)
    }
  }, [form])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ---- 保存设置 ----
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const updates: SettingUpdateItem[] = []

      // 收集所有表单字段
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'streak_bonus_rules') return // JSON 字段单独处理
        updates.push({ key, value })
      })

      // 处理连续加成规则 JSON
      if (streakJson) {
        try {
          const parsed = JSON.parse(streakJson)
          updates.push({ key: 'streak_bonus_rules', value: parsed })
        } catch {
          message.error('连续加成规则 JSON 格式错误')
          setSaving(false)
          return
        }
      }

      // 收集通知事件开关
      notifyEvents.forEach((event) => {
        updates.push({ key: event.key, value: event.enabled })
      })

      await batchUpdateSettings(updates)
      message.success('保存成功')
      await fetchData()
    } catch {
      // validation failed
    } finally {
      setSaving(false)
    }
  }

  // ---- 通知事件切换 ----
  const handleNotifyToggle = (key: string, enabled: boolean) => {
    setNotifyEvents((prev) =>
      prev.map((e) => (e.key === key ? { ...e, enabled } : e))
    )
  }

  // ---- 渠道配置 ----
  const channels: ChannelConfig[] = [
    { name: '邮件渠道', key: 'channel_email', configured: hasChannelConfig('channel_email') },
    { name: 'Webhook 渠道', key: 'channel_webhook', configured: hasChannelConfig('channel_webhook') },
  ]

  function hasChannelConfig(key: string): boolean {
    const val = settingsData[key]
    if (!val || typeof val !== 'object') return false
    const obj = val as Record<string, unknown>
    // 检查是否有非空字段
    return Object.values(obj).some((v) => {
      if (typeof v === 'string') return v !== '' && v !== '••••••'
      if (typeof v === 'number') return v !== 0
      return v !== null && v !== undefined
    })
  }

  const handleEditChannel = (channel: ChannelConfig) => {
    setEditingChannel(channel)
    const val = settingsData[channel.key]
    if (val && typeof val === 'object') {
      channelForm.setFieldsValue(val as Record<string, unknown>)
    } else {
      channelForm.resetFields()
    }
    setChannelModalOpen(true)
  }

  const handleChannelSave = async () => {
    if (!editingChannel) return
    try {
      const values = await channelForm.validateFields()
      setSaving(true)

      // 密码/secret 字段：如果是占位符则不提交（保持原值）
      const obj = { ...values }
      if (obj.password === '••••••') delete obj.password
      if (obj.secret === '••••••') delete obj.secret

      await batchUpdateSettings([{ key: editingChannel.key, value: obj }])
      message.success('渠道配置已保存')
      setChannelModalOpen(false)
      fetchData()
    } catch {
      // validation failed
    } finally {
      setSaving(false)
    }
  }

  // ---- JSON 格式化 ----
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(streakJson)
      setStreakJson(JSON.stringify(parsed, null, 2))
    } catch {
      message.error('JSON 格式错误，请检查')
    }
  }

  // ---- Tab 内容 ----
  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基础配置',
      children: (
        <>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="站点名称" name="site_name" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入站点名称' }]}>
              <Input placeholder="请输入站点名称" />
            </Form.Item>
            <Form.Item label="站点 Logo" name="logo_url" style={{ flex: 1 }}>
              <Input placeholder="输入 Logo 图片 URL" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="默认语言" name="default_language" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="zh-CN">简体中文</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="时区" name="timezone" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="Asia/Shanghai">Asia/Shanghai</Select.Option>
                <Select.Option value="UTC">UTC</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="会话超时" name="session_timeout" style={{ maxWidth: 400 }}
            rules={[{ required: true, message: '请输入会话超时时间' }]}>
            <InputNumber min={5} max={120} addonAfter="分钟" style={{ width: '100%' }} />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'toggle',
      label: '功能开关',
      children: (
        <>
          <Form.Item label="开放注册" name="enable_register" valuePropName="checked">
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
          <Form.Item label="审计日志" name="enable_audit_log" valuePropName="checked">
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
          <Form.Item label="消息通知" name="enable_notification" valuePropName="checked">
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'business',
      label: '业务规则',
      children: (
        <>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="家庭最大孩子数" name="max_children_per_family" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="每日最大卡片数" name="max_daily_cards" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="目标最大关联卡片数" name="max_goal_cards" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="XP等级公式除数" name="xp_level_divisor" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="伙伴初始名称" name="default_companion_name" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="如：波奇" />
            </Form.Item>
            <Form.Item label="积分达成默认奖金" name="default_goal_reward" style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={1} addonAfter="分" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {/* 连续加成规则 - CodeMirror 编辑器 */}
          <Form.Item label="积分连续加成规则">
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
              <CodeMirror
                value={streakJson}
                height="150px"
                extensions={[json()]}
                onChange={(val) => setStreakJson(val)}
                basicSetup={{ lineNumbers: true, foldGutter: false }}
              />
            </div>
            <Space style={{ marginTop: 8 }}>
              <Button size="small" icon={<FormatPainterOutlined />} onClick={handleFormatJson}>
                格式化 JSON
              </Button>
              <Button size="small" icon={<CheckOutlined />} onClick={() => {
                try { JSON.parse(streakJson); message.success('JSON 格式正确') }
                catch { message.error('JSON 格式错误') }
              }}>
                校验
              </Button>
            </Space>
          </Form.Item>
        </>
      ),
    },
    {
      key: 'notification',
      label: '通知设置',
      children: <NotificationTab />,
    },
  ]

  // ---- 通知设置 Tab 内容 ----
  function NotificationTab() {
    const eventColumns: TableColumnsType<NotifyEvent> = [
      { title: '通知事件', dataIndex: 'label', key: 'label' },
      {
        title: '状态', dataIndex: 'enabled', key: 'enabled',
        render: (enabled: boolean) => (
          <Tag color={enabled ? 'green' : 'default'}>{enabled ? '已开启' : '已关闭'}</Tag>
        ),
      },
      {
        title: '操作', key: 'action', width: 100,
        render: (_: unknown, record: NotifyEvent) => (
          <Switch
            size="small"
            checked={record.enabled}
            onChange={(checked) => handleNotifyToggle(record.key, checked)}
          />
        ),
      },
    ]

    const channelColumns: TableColumnsType<ChannelConfig> = [
      { title: '渠道名称', dataIndex: 'name', key: 'name' },
      {
        title: '配置状态', dataIndex: 'configured', key: 'configured',
        render: (configured: boolean) => (
          <Tag color={configured ? 'green' : 'default'}>{configured ? '已配置' : '未配置'}</Tag>
        ),
      },
      {
        title: '操作', key: 'action', width: 100,
        render: (_: unknown, record: ChannelConfig) => (
          <Button type="link" size="small" icon={<EditOutlined />}
            onClick={() => handleEditChannel(record)}>
            编辑
          </Button>
        ),
      },
    ]

    return (
      <>
        <div style={{ marginBottom: 16, fontWeight: 500 }}>事件开关</div>
        <Table<NotifyEvent>
          columns={eventColumns}
          dataSource={notifyEvents}
          rowKey="key"
          pagination={false}
          size="small"
          style={{ marginBottom: 24 }}
        />

        <div style={{ marginBottom: 16, fontWeight: 500 }}>渠道配置</div>
        <Table<ChannelConfig>
          columns={channelColumns}
          dataSource={channels}
          rowKey="key"
          pagination={false}
          size="small"
        />
      </>
    )
  }

  // ---- 渠道编辑 Modal ----
  function ChannelModal() {
    const isEmail = editingChannel?.key === 'channel_email'

    return (
      <Modal
        title={`编辑${editingChannel?.name ?? ''}`}
        open={channelModalOpen}
        onOk={handleChannelSave}
        onCancel={() => setChannelModalOpen(false)}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={channelForm} layout="vertical" preserve={false}>
          {isEmail ? (
            <>
              <Form.Item label="SMTP Host" name="host" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="如：smtp.gmail.com" />
              </Form.Item>
              <Form.Item label="Port" name="port" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="如：587" />
              </Form.Item>
              <Form.Item label="用户名" name="user" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="SMTP 用户名" />
              </Form.Item>
              <Form.Item label="密码" name="password">
                <Input.Password placeholder="••••••" />
              </Form.Item>
              <Form.Item label="发件人" name="from" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="如：noreply@kiqi.com" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="Webhook URL" name="url" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item label="签名密钥" name="secret">
                <Input.Password placeholder="••••••" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    )
  }

  if (loading) {
    return (
      <DataPanel title="系统设置">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      </DataPanel>
    )
  }

  return (
    <DataPanel title="系统设置">
      <div style={{ padding: '0 28px 20px' }}>
        <Form form={form} layout="vertical">
          <Tabs items={tabItems} />

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存设置
            </Button>
            <Button onClick={() => fetchData()}>
              重置
            </Button>
          </div>
        </Form>

        <ChannelModal />
      </div>
    </DataPanel>
  )
}
