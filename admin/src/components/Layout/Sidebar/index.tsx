import { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Button, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { getIcon } from '@/config/menu'
import type { MenuTreeNode } from '@/services/auth'
import { message } from 'antd'

const { Sider } = Layout

/** 将后端菜单树转换为 Ant Design Menu 项 */
function convertMenuTree(nodes: MenuTreeNode[], showIcons: boolean, isParent: boolean): Array<{ key: string; label: string; icon?: React.ReactNode; children?: Array<{ key: string; label: string; icon?: React.ReactNode }> }> {
  return nodes
    .filter(node => node.status)
    .map(node => {
      const resolvedIcon = node.icon ? getIcon(node.icon) : undefined
      const hasChildren = node.children && node.children.length > 0
      const renderItem = {
        key: node.key,
        label: node.label,
        icon: (isParent && !showIcons) ? undefined : resolvedIcon,
      }

      if (hasChildren) {
        return {
          ...renderItem,
          children: convertMenuTree(node.children!, showIcons, true),
        }
      }

      return renderItem
    })
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, username, isLogin, menuTree, logout } = useAppStore()
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 从动态菜单树中提取所有叶子节点的 key，用于 selectedKeys
  const allLeafKeys: string[] = []
  function collectLeafKeys(nodes: MenuTreeNode[]) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        collectLeafKeys(node.children)
      } else {
        allLeafKeys.push(node.key)
      }
    })
  }
  if (menuTree.length > 0) {
    collectLeafKeys(menuTree)
  }

  // 从动态菜单树中提取所有父级 key，用于 openKeys
  useEffect(() => {
    const parentKeys: string[] = []
    function collectParentKeys(nodes: MenuTreeNode[]) {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          parentKeys.push(node.key)
          collectParentKeys(node.children!)
        }
      })
    }
    collectParentKeys(menuTree)
    setOpenKeys(parentKeys)
  }, [menuTree])

  const filteredMenu = menuTree.length > 0
    ? convertMenuTree(menuTree, sidebarCollapsed, false)
    : []

  const handleMenuClick = ({ key }: { key: string }) => {
    // 从菜单树中查找对应 path
    function findPath(nodes: MenuTreeNode[]): string | null {
      for (const node of nodes) {
        if (node.key === key && node.path) return node.path
        if (node.children) {
          const found = findPath(node.children)
          if (found) return found
        }
      }
      return null
    }
    const path = findPath(menuTree)
    if (path) {
      navigate(path)
    }
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
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

  const selectedKey = location.pathname === '/dashboard' ? 'dashboard' : allLeafKeys.find(key => {
    // 从菜单树中查找 key 对应的 path
    function findPathBykey(nodes: MenuTreeNode[]): string | null {
      for (const node of nodes) {
        if (node.key === key && node.path) return node.path
        if (node.children) {
          const found = findPathBykey(node.children)
          if (found) return found
        }
      }
      return null
    }
    return findPathBykey(menuTree) === location.pathname
  }) || ''

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
              className="sidebar-toggle-btn"
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
                  background: 'var(--brand-dark)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                K
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
                巧记成长
              </span>
              <Button
                type="text"
                className="sidebar-toggle-btn"
                icon={<MenuFoldOutlined style={{ fontSize: 16 }} />}
                onClick={toggleSidebar}
                style={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  padding: 0,
                  color: 'var(--text-muted)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
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
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="topLeft">
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
              </Dropdown>
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
