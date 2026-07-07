import { Breadcrumb, Input } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { menuConfig } from '@/config/menu'

export default function TopBar() {
  const location = useLocation()

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
                      ? '#6b6258'
                      : '#b0a89a',
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
              color: '#c4bdb0',
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
              border: '1px solid #e8e2d8',
              background: '#faf8f5',
              fontSize: 13,
            }}
            onFocus={e => {
              e.target.style.borderColor = '#2b2b2b'
              e.target.style.background = '#fff'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e8e2d8'
              e.target.style.background = '#faf8f5'
            }}
          />
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid #e8e2d8',
            background: '#faf8f5',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f0ece6'
            e.currentTarget.style.borderColor = '#d4cdc0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#faf8f5'
            e.currentTarget.style.borderColor = '#e8e2d8'
          }}
        >
          <ReloadOutlined style={{ fontSize: 16, color: '#6b6258' }} />
        </button>
      </div>
    </div>
  )
}
