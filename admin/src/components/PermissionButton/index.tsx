import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import { useAppStore } from '@/stores'
import { hasPermission } from '@/config/permission'

interface PermissionButtonProps extends ButtonProps {
  permission?: string
  fallback?: React.ReactNode
}

export default function PermissionButton({
  permission,
  fallback = null,
  children,
  ...props
}: PermissionButtonProps) {
  const { permissions } = useAppStore()

  if (permission && !hasPermission(permissions, permission)) {
    return <>{fallback}</>
  }

  return <Button {...props}>{children}</Button>
}
