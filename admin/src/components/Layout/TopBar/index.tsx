import { Breadcrumb, Button } from 'antd'
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons'
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
      </div>
    </div>
  )
}
