import { Breadcrumb, Button, Dropdown } from 'antd'
import { SearchOutlined, QuestionCircleOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { menuConfig } from '@/config/menu'
import { message } from 'antd'

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAppStore()

  const findBreadcrumb = () => {
    const result: { title: string }[] = [{ title: '首页' }]
    for (const group of menuConfig) {
      for (const item of group.children || []) {
        if (item.path === location.pathname) {
          result.push({ title: group.label })
          result.push({ title: item.label })
          return result
        }
      }
    }
    return result
  }

  const breadcrumbItems = findBreadcrumb()

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'logout':
        logout()
        message.success('已退出登录')
        navigate('/login', { replace: true })
        break
    }
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  return (
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
        background: 'var(--main-bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Breadcrumb
          items={breadcrumbItems.map((item, index) => ({
            title: (
              <span
                style={{
                  color:
                    index === breadcrumbItems.length - 1
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                  fontWeight: index === breadcrumbItems.length - 1 ? 500 : 400,
                }}
              >
                {item.title}
              </span>
            ),
          }))}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: '#F5F5F5',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'background 0.15s',
            marginRight: 8,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#EBEBEB'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#F5F5F5'
          }}
        >
          <SearchOutlined style={{ fontSize: 14, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>搜索</span>
          <kbd
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              background: '#E5E5E5',
              padding: '1px 5px',
              borderRadius: 4,
              fontFamily: 'var(--font-family)',
              marginLeft: 8,
            }}
          >
            ⌘K
          </kbd>
        </div>
        <Button
          type="text"
          icon={<QuestionCircleOutlined style={{ fontSize: 16 }} />}
          style={{
            width: 36,
            height: 36,
            color: 'var(--text-secondary)',
          }}
        />
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'background 0.15s',
              marginLeft: 4,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--hover-bg)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ECDC4, #44B09E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {username?.charAt(0) || 'U'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              {username || '用户'}
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}
