import { useState } from 'react'
import { Form, Input, Switch, Button, Select, InputNumber, message, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import DataPanel from '@/components/DataPanel'

export default function SystemSettings() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('保存成功')
    }, 800)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基础配置',
      children: (
        <>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item
              label="站点名称"
              name="siteName"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入站点名称' }]}
            >
              <Input placeholder="请输入站点名称" />
            </Form.Item>
            <Form.Item label="站点 Logo" name="logo" style={{ flex: 1 }}>
              <Input placeholder="输入 Logo 文字或图片 URL" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label="默认语言" name="language" style={{ flex: 1 }}>
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
          <Form.Item
            label="会话超时"
            name="sessionTimeout"
            style={{ maxWidth: 400 }}
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <InputNumber min={5} max={120} addonAfter="分钟" style={{ width: '100%' }} />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'toggles',
      label: '功能开关',
      children: (
        <>
          <Form.Item
            label="开放注册"
            name="enableRegister"
            valuePropName="checked"
          >
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
          <Form.Item
            label="审计日志"
            name="enableAudit"
            valuePropName="checked"
          >
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
          <Form.Item
            label="消息通知"
            name="enableNotify"
            valuePropName="checked"
          >
            <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <DataPanel title="系统设置">
      <div style={{ padding: '0 28px 20px' }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: '中台管理系统',
            logo: 'Z',
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            sessionTimeout: 30,
            enableRegister: true,
            enableAudit: true,
            enableNotify: true,
          }}
        >
          <Tabs items={tabItems} />

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button type="primary" loading={loading} onClick={handleSave}>
              保存设置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </div>
        </Form>
      </div>
    </DataPanel>
  )
}
