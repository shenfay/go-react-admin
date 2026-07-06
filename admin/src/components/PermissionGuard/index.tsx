import type { ReactNode } from 'react'
// import { Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { hasPermission } from '@/config/permission'

interface PermissionGuardProps {
  permission?: string
  children: ReactNode
  fallback?: ReactNode
}

export default function PermissionGuard({
  permission,
  children,
  fallback,
}: PermissionGuardProps) {
  const { isLogin, permissions } = useAppStore()

  // 未登录，自动模拟登录管理员（实际项目中应跳转到登录页）
  if (!isLogin) {
    // 实际项目中这里应该跳转到登录页
    // return <Navigate to="/login" replace />
    return <>{children}</>
  }

  // 检查权限
  if (permission && !hasPermission(permissions, permission)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted)',
          fontSize: 16,
        }}
      >
        暂无权限访问该页面
      </div>
    )
  }

  return <>{children}</>
}
