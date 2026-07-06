import { useState } from 'react'
import { Layout, Menu, Badge, Avatar, Button } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { menuConfig, getIcon } from '@/config/menu'
import type { MenuItem } from '@/config/menu'

const { Sider } = Layout

function renderMenuItems(items: MenuItem[], userMenus: string[], isLogin: boolean, showIcons: boolean): MenuItem[] {
  return items
    .map(item => {
      const resolvedIcon = item.icon ? getIcon(item.icon as string) : undefined
      const isParent = !!item.children
      // 展开时只隐藏父级菜单图标，叶子菜单始终显示；折叠时全部显示
      const renderItem = {
        ...item,
        icon: isParent && !showIcons ? undefined : resolvedIcon,
        label: item.badge ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {item.label}
            <Badge count={item.badge} size="small" style={{ background: 'var(--red)' }} />
          </span>
        ) : (
          item.label
        ),
      }

      if (item.children) {
        const filteredChildren = renderMenuItems(item.children, userMenus, isLogin, showIcons)
        if (filteredChildren.length === 0) return null
        return {
          ...renderItem,
          children: filteredChildren,
        }
      }

      // 未登录时显示所有菜单项；已登录时按权限过滤
      if (!isLogin || !item.permission || userMenus.includes(item.key)) {
        return renderItem
      }
      return null
    })
    .filter(Boolean) as MenuItem[]
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, username, isLogin, menus } = useAppStore()
  const [openKeys, setOpenKeys] = useState<string[]>(['overview', 'data', 'data-dev', 'data-service', 'data-govern', 'monitor', 'user', 'business', 'system'])

  const filteredMenu = renderMenuItems(menuConfig, menus, isLogin, sidebarCollapsed)

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuConfig
      .flatMap(m => m.children || [m])
      .find(i => i.key === key)
    if (item?.path) {
      navigate(item.path)
    }
  }

  const selectedKey = menuConfig
    .flatMap(m => m.children || [m])
    .find(i => i.path === location.pathname)?.key

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={sidebarCollapsed}
      width={224}
      collapsedWidth={56}
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        transition: 'all var(--transition)',
      }}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo / Toggle */}
        <div
          style={{
            padding: sidebarCollapsed ? '16px 8px' : '16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: 10,
            height: 56,
            flexShrink: 0,
          }}
        >
          {sidebarCollapsed ? (
            <Button
              type="text"
              icon={<MenuUnfoldOutlined style={{ fontSize: 16 }} />}
              onClick={toggleSidebar}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                transition: 'all 0.15s',
              }}
            />
          ) : (
            <>
              <div
                style={{
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  background: 'var(--accent)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Z
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                中台管理
              </span>
              <Button
                type="text"
                icon={<MenuFoldOutlined style={{ fontSize: 16 }} />}
                onClick={toggleSidebar}
                style={{
                  width: 24,
                  height: 24,
                  minWidth: 24,
                  padding: 0,
                  color: 'var(--text-muted)',
                }}
              />
            </>
          )}
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 6px' }}>
          <Menu
            mode="inline"
            inlineCollapsed={sidebarCollapsed}
            selectedKeys={selectedKey ? [selectedKey] : []}
            openKeys={sidebarCollapsed ? [] : openKeys}
            onOpenChange={setOpenKeys}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items={filteredMenu as any}
            onClick={handleMenuClick}
            style={{
              background: 'transparent',
              borderRight: 'none',
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: sidebarCollapsed ? '8px 0 12px' : '12px 12px 16px',
            borderTop: '1px solid var(--border-color)',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {sidebarCollapsed ? (
            <Avatar
              size={32}
              style={{
                background: 'linear-gradient(135deg, #4ECDC4, #44B09E)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {username?.charAt(0) || '管'}
            </Avatar>
          ) : (
            <>
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
                    background: 'linear-gradient(135deg, #4ECDC4, #44B09E)',
                    fontSize: 11,
                    fontWeight: 600,
                    minWidth: 28,
                  }}
                >
                  {username?.charAt(0) || '管'}
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
                  {username || '管理员'}
                </span>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <BellOutlined
                  style={{
                    fontSize: 16,
                    color: 'var(--text-secondary)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    minWidth: 15,
                    height: 15,
                    borderRadius: '7.5px',
                    background: 'var(--red)',
                    color: '#fff',
                    fontSize: 10,
                    lineHeight: '15px',
                    textAlign: 'center',
                    padding: '0 3px',
                    fontWeight: 600,
                  }}
                >
                  29
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Sider>
  )
}
