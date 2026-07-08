import { Breadcrumb, Input } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores'
import type { MenuItem } from '@/types'

interface TopBarProps {
  onRefresh: () => void
}

export default function TopBar({ onRefresh }: TopBarProps) {
  const location = useLocation()
  const menuTree = useAppStore(state => state.menuTree)

  const findBreadcrumb = () => {
    const result: { title: string }[] = [{ title: '首页' }]
    function search(nodes: MenuItem[], parentLabel?: string): boolean {
      for (const node of nodes) {
        if (node.path === location.pathname) {
          if (parentLabel) result.push({ title: parentLabel })
          result.push({ title: node.label })
          return true
        }
        if (node.children && search(node.children, node.label)) {
          return true
        }
      }
      return false
    }
    search(menuTree)
    return result
  }

  const breadcrumbItems = findBreadcrumb()

  return (
    <div
      style={{
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px 0',
        flexShrink: 0,
        background: 'var(--main-bg)',
      }}
    >
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumb
          items={breadcrumbItems.map((item, index) => ({
            title: (
              <span
                style={{
                  fontSize: 13,
                  color:
                    index === breadcrumbItems.length - 1
                      ? 'var(--text-secondary)'
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

      {/* Right: Global Search + Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Global Search */}
        <div style={{ position: 'relative' }}>
          <SearchOutlined
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 14,
              color: 'var(--text-icon)',
              pointerEvents: 'none',
            }}
          />
          <Input
            placeholder="搜索..."
            style={{
              width: 220,
              height: 34,
              paddingLeft: 32,
              paddingRight: 12,
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-light)',
              fontSize: 13,
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--brand-dark)'
              e.target.style.background = 'var(--bg-white)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border-color)'
              e.target.style.background = 'var(--bg-light)'
            }}
          />
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-light)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--hover-bg)'
            e.currentTarget.style.borderColor = 'var(--border-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-light)'
            e.currentTarget.style.borderColor = 'var(--border-color)'
          }}
        >
          <ReloadOutlined style={{ fontSize: 16, color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </div>
  )
}
