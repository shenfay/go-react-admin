import { useState } from 'react'
import { Form, Input, Button, Avatar, Descriptions, Divider, message, Tabs, Tag } from 'antd'
import { UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons'
import { useAppStore } from '@/stores'
import DataPanel from '@/components/DataPanel'

export default function Profile() {
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('profile')
  const { username, email, roles } = useAppStore()

  const roleLabels = roles.map(r => r.name).join('、') || '未分配角色'

  const handleSaveProfile = () => {
    message.success('个人信息已保存')
  }

  const handleChangePassword = () => {
    message.success('密码修改成功')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* User Info Card */}
      <DataPanel title="" compact>
        <div style={{ padding: '20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ background: '#2b2b2b', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#2b2b2b', marginBottom: 4 }}>
                {username || '用户'}
              </div>
              <div style={{ color: '#6b6258', marginBottom: 8 }}>{email || ''}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {roles.map(r => <Tag key={r.code} style={{ background: '#edf2ff', color: '#3b6fdf', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>{r.name}</Tag>)}
                {roles.length === 0 && <Tag style={{ background: '#f5f2ed', color: '#b0a89a', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>未分配角色</Tag>}
              </div>
            </div>
          </div>
        </div>
      </DataPanel>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ padding: '0 28px' }}
        items={[
          {
            key: 'profile',
            label: (
              <span>
                <UserOutlined style={{ marginRight: 4 }} />
                基本信息
              </span>
            ),
            children: (
              <div style={{ padding: '16px 0' }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="姓名" span={1}>{username || '-'}</Descriptions.Item>
                  <Descriptions.Item label="邮箱" span={1}>{email || '-'}</Descriptions.Item>
                  <Descriptions.Item label="角色" span={1}>{roleLabels}</Descriptions.Item>
                  <Descriptions.Item label="部门" span={1}>-</Descriptions.Item>
                  <Descriptions.Item label="手机号" span={1}>-</Descriptions.Item>
                  <Descriptions.Item label="注册日期" span={1}>-</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Form
                  form={profileForm}
                  layout="vertical"
                  style={{ maxWidth: 500 }}
                >
                  <Form.Item label="昵称" name="nickname" initialValue={username || ''}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="邮箱" name="email" initialValue={email || ''} rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="手机号" name="phone" initialValue="">
                    <Input />
                  </Form.Item>
                  <Form.Item label="个人简介" name="bio">
                    <Input.TextArea rows={3} placeholder="介绍一下自己..." />
                  </Form.Item>
                  <Button type="primary" onClick={handleSaveProfile}>保存修改</Button>
                </Form>
              </div>
            ),
          },
          {
            key: 'password',
            label: (
              <span>
                <LockOutlined style={{ marginRight: 4 }} />
                修改密码
              </span>
            ),
            children: (
              <div style={{ padding: '16px 0' }}>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  style={{ maxWidth: 400 }}
                >
                  <Form.Item label="当前密码" name="oldPassword" rules={[{ required: true, message: '请输入当前密码' }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="新密码" name="newPassword" rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 8, message: '密码长度不能少于 8 位' },
                  ]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="确认新密码" name="confirmPassword" rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                        return Promise.reject(new Error('两次输入的密码不一致'))
                      },
                    }),
                  ]}>
                    <Input.Password />
                  </Form.Item>
                  <Button type="primary" onClick={handleChangePassword}>修改密码</Button>
                </Form>
              </div>
            ),
          },
          {
            key: 'notifications',
            label: (
              <span>
                <BellOutlined style={{ marginRight: 4 }} />
                通知设置
              </span>
            ),
            children: (
              <div style={{ padding: '16px 0' }}>
                <div style={{ color: '#6b6258', marginBottom: 16 }}>
                  配置您需要接收的系统通知类型
                </div>
                <Form layout="vertical" style={{ maxWidth: 500 }}>
                  <Form.Item label="邮件通知" name="emailNotify">
                    <div style={{ color: '#6b6258', fontSize: 13, marginBottom: 8 }}>
                      接收系统告警和任务状态更新的邮件通知
                    </div>
                  </Form.Item>
                  <Form.Item label="短信通知" name="smsNotify">
                    <div style={{ color: '#6b6258', fontSize: 13, marginBottom: 8 }}>
                      接收紧急告警的短信通知
                    </div>
                  </Form.Item>
                  <Button type="primary">保存设置</Button>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
