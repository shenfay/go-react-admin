import { Avatar, Dropdown } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

interface SidebarUserProps {
  collapsed: boolean
  username: string
  onLogout: () => void
}

export default function SidebarUser({ collapsed, username, onLogout }: SidebarUserProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'logout':
        onLogout()
        message.success(t('logoutSuccess'))
        navigate('/login', { replace: true })
        break
    }
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: t('personalCenter') },
    { key: 'settings', icon: <SettingOutlined />, label: t('systemSettings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: t('logout'), danger: true },
  ]

  return (
    <div
      style={{
        padding: collapsed ? '8px 0 12px' : '12px 12px 16px',
        borderTop: '1px solid var(--border-color)',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {collapsed ? (
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="topLeft">
          <Avatar
            size={32}
            style={{
              background: 'linear-gradient(135deg, var(--avatar-gradient-start), var(--avatar-gradient-end))',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {username?.charAt(0) || t('user').charAt(0)}
          </Avatar>
        </Dropdown>
      ) : (
        <>
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="topLeft">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 4,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--hover-bg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Avatar
                size={28}
                style={{
                  background: 'linear-gradient(135deg, var(--avatar-gradient-start), var(--avatar-gradient-end))',
                  fontSize: 11,
                  fontWeight: 600,
                  minWidth: 28,
                }}
              >
                {username?.charAt(0) || t('user').charAt(0)}
              </Avatar>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {username || t('user')}
              </span>
            </div>
          </Dropdown>
          <div
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BellOutlined
              style={{
                fontSize: 16,
                color: 'var(--text-secondary)',
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
