import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Switch, Button, Select, InputNumber, message, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import DataPanel from '@/components/DataPanel'

export default function SystemSettings() {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success(t('saveSuccess'))
    }, 800)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: t('basicConfig'),
      children: (
        <>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item
              label={t('siteName')}
              name="siteName"
              style={{ flex: 1 }}
              rules={[{ required: true, message: t('siteNamePlaceholder') }]}
            >
              <Input placeholder={t('siteNamePlaceholder')} />
            </Form.Item>
            <Form.Item label={t('siteLogo')} name="logo" style={{ flex: 1 }}>
              <Input placeholder={t('logoPlaceholder')} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item label={t('defaultLanguage')} name="language" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="zh-CN">{t('zhCN')}</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label={t('timezone')} name="timezone" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="Asia/Shanghai">Asia/Shanghai</Select.Option>
                <Select.Option value="UTC">UTC</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            label={t('sessionTimeout')}
            name="sessionTimeout"
            style={{ maxWidth: 400 }}
            rules={[{ required: true, message: t('sessionTimeoutPlaceholder') }]}
          >
            <InputNumber min={5} max={120} addonAfter={t('minutes')} style={{ width: '100%' }} />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'toggles',
      label: t('featureToggles'),
      children: (
        <>
          <Form.Item
            label={t('openRegistration')}
            name="enableRegister"
            valuePropName="checked"
          >
            <Switch checkedChildren={t('turnedOn')} unCheckedChildren={t('turnedOff')} />
          </Form.Item>
          <Form.Item
            label={t('auditLog')}
            name="enableAudit"
            valuePropName="checked"
          >
            <Switch checkedChildren={t('turnedOn')} unCheckedChildren={t('turnedOff')} />
          </Form.Item>
          <Form.Item
            label={t('messageNotification')}
            name="enableNotify"
            valuePropName="checked"
          >
            <Switch checkedChildren={t('turnedOn')} unCheckedChildren={t('turnedOff')} />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <DataPanel title={t('systemSettings')}>
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
              {t('saveSettings')}
            </Button>
            <Button onClick={() => form.resetFields()}>
              {t('reset')}
            </Button>
          </div>
        </Form>
      </div>
    </DataPanel>
  )
}
