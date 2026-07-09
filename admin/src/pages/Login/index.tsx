import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores'
import { login as loginApi, getUserMenuTree } from '@/services/auth'
import { emailRules, passwordRules } from '@/utils/formRules'
import type { LoginRequest } from '@/types'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: LoginRequest) => {
    setLoading(true)
    try {
      const res = await loginApi(values)
      login({
        userId: res.user.id,
        username: res.user.name || res.user.email.split('@')[0],
        email: res.user.email,
        roles: res.permissions?.roles || [],
        permissions: res.permissions || { roles: [], permissions: [], menus: [] },
        token: res.access_token,
        refreshToken: res.refresh_token,
      })

      // 登录后获取用户菜单树
      try {
        const menuTree = await getUserMenuTree()
        useUserStore.getState().setMenuTree(menuTree || [])
      } catch {
        // 菜单获取失败不影响登录
      }

      message.success('登录成功')
      navigate('/', { replace: true })
    } catch (err: unknown) {
      // 从 axios 响应中提取后端返回的错误消息
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg = axiosErr?.response?.data?.message || '登录失败，请检查邮箱和密码'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 左侧品牌区域 — 黄金比例 ~61.8% */}
      <div
        style={{
          flex: '0 0 61.8%',
          background: 'linear-gradient(135deg, var(--brand-gradient-start) 0%, var(--brand-gradient-mid) 50%, var(--brand-gradient-end) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰圆 */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 36,
            marginBottom: 32,
            backdropFilter: 'blur(10px)',
          }}
        >
          K
        </div>

        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 16px',
            letterSpacing: 2,
          }}
        >
          巧记成长
        </h1>

        <p
          style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.8,
            maxWidth: 360,
          }}
        >
          记录家庭成长点滴
          <br />
          让每一刻都值得珍藏
        </p>

        {/* 底部特性列表 */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 64,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[
            { label: '家庭协作', value: '多角色协同' },
            { label: '成长记录', value: '卡片式管理' },
            { label: '目标激励', value: '积分与验收' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧登录表单 — 黄金比例 ~38.2% */}
      <div
        style={{
          flex: '0 0 38.2%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          padding: '60px 48px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 8px',
              }}
            >
              欢迎回来
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              请登录您的管理后台账号
            </p>
          </div>

          <Form
            name="login"
            size="large"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={emailRules}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'var(--text-icon)' }} />}
                placeholder="邮箱"
                style={{ height: 44 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={passwordRules}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--text-icon)' }} />}
                placeholder="密码"
                style={{ height: 44 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-icon)' }}>
            请联系管理员获取登录凭据
          </div>
        </div>
      </div>
    </div>
  )
}
