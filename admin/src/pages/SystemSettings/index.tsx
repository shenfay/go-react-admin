import { useState } from 'react'
import { Form, Input, Switch, Button, Select, InputNumber, message } from 'antd'
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

  return (
    <div>
      <DataPanel title="基础配置">
        <Form form={form} layout="vertical" initialValues={{
          siteName: '中台管理系统',
          logo: 'Z',
          language: 'zh-CN',
          timezone: 'Asia/Shanghai',
          sessionTimeout: 30,
          enableRegister: true,
          enableAudit: true,
          enableNotify: true,
        }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item label="站点名称" name="siteName" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item label="站点 Logo" name="logo" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
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
          <Form.Item label="会话超时（分钟）" name="sessionTimeout">
            <InputNumber min={5} max={120} style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </DataPanel>

      <DataPanel title="功能开关" style={{ marginTop: 16 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="开放注册"
            name="enableRegister"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="审计日志"
            name="enableAudit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="消息通知"
            name="enableNotify"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </DataPanel>

      <div style={{ marginTop: 24 }}>
        <Button type="primary" loading={loading} onClick={handleSave}>
          保存设置
        </Button>
        <Button style={{ marginLeft: 12 }} onClick={() => form.resetFields()}>
          重置
        </Button>
      </div>
    </div>
  )
}
