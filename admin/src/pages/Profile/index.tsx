import { useState } from 'react'
import { Card, Form, Input, Button, Avatar, Descriptions, Divider, message, Tabs } from 'antd'
import { UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

export default function Profile() {
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('profile')

  const userInfo = {
    name: '张小明',
    email: 'zhangxiaoming@example.com',
    role: '管理员',
    dept: '技术部',
    phone: '138****5678',
    joinDate: '2026-01-15',
    lastLogin: '2026-05-27 09:30:00',
  }

  const handleSaveProfile = () => {
    message.success('个人信息已保存')
  }

  const handleChangePassword = () => {
    message.success('密码修改成功')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* User Info Card */}
      <DataPanel title="" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ background: 'var(--accent)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              {userInfo.name}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{userInfo.email}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{userInfo.role} · {userInfo.dept}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>上次登录: {userInfo.lastLogin}</span>
            </div>
          </div>
        </div>
      </DataPanel>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
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
              <DataPanel title="">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="姓名" span={1}>{userInfo.name}</Descriptions.Item>
                  <Descriptions.Item label="邮箱" span={1}>{userInfo.email}</Descriptions.Item>
                  <Descriptions.Item label="角色" span={1}>{userInfo.role}</Descriptions.Item>
                  <Descriptions.Item label="部门" span={1}>{userInfo.dept}</Descriptions.Item>
                  <Descriptions.Item label="手机号" span={1}>{userInfo.phone}</Descriptions.Item>
                  <Descriptions.Item label="入职日期" span={1}>{userInfo.joinDate}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Form
                  form={profileForm}
                  layout="vertical"
                  style={{ maxWidth: 500 }}
                >
                  <Form.Item label="昵称" name="nickname" initialValue={userInfo.name}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="邮箱" name="email" initialValue={userInfo.email} rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="手机号" name="phone" initialValue={userInfo.phone}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="个人简介" name="bio">
                    <Input.TextArea rows={3} placeholder="介绍一下自己..." />
                  </Form.Item>
                  <Button type="primary" onClick={handleSaveProfile}>保存修改</Button>
                </Form>
              </DataPanel>
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
              <DataPanel title="">
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
              </DataPanel>
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
              <DataPanel title="">
                <div style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                  配置您需要接收的系统通知类型
                </div>
                <Form layout="vertical" style={{ maxWidth: 500 }}>
                  <Form.Item label="邮件通知" name="emailNotify">
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                      接收系统告警和任务状态更新的邮件通知
                    </div>
                  </Form.Item>
                  <Form.Item label="短信通知" name="smsNotify">
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                      接收紧急告警的短信通知
                    </div>
                  </Form.Item>
                  <Button type="primary">保存设置</Button>
                </Form>
              </DataPanel>
            ),
          },
        ]}
      />
    </div>
  )
}
