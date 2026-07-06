import {
  DashboardOutlined,
  TeamOutlined,
  AimOutlined,
  FileTextOutlined,
  SmileOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ShopOutlined,
  SwapOutlined,
  UserOutlined,
  LockOutlined,
  AuditOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import React, { type ReactNode } from 'react'

export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  path?: string
  children?: MenuItem[]
  badge?: number
  permission?: string
}

export const menuConfig: MenuItem[] = [
  {
    key: 'overview',
    label: '概览',
    icon: 'DashboardOutlined',
    children: [
      {
        key: 'dashboard',
        label: '工作台',
        icon: 'DashboardOutlined',
        path: '/dashboard',
        permission: 'dashboard:view',
      },
    ],
  },
  {
    key: 'growth',
    label: '成长管理',
    icon: 'AimOutlined',
    children: [
      {
        key: 'family',
        label: '家庭管理',
        icon: 'TeamOutlined',
        path: '/family',
        permission: 'family:manage',
      },
      {
        key: 'goals',
        label: '目标管理',
        icon: 'AimOutlined',
        path: '/goals',
        permission: 'goal:manage',
      },
    ],
  },
  {
    key: 'card-engine',
    label: '卡片引擎',
    icon: 'FileTextOutlined',
    children: [
      {
        key: 'card-templates',
        label: '卡片模板',
        icon: 'FileTextOutlined',
        path: '/card-templates',
        permission: 'card_template:manage',
      },
      {
        key: 'card-instances',
        label: '提交记录',
        icon: 'ProfileOutlined',
        path: '/card-instances',
        permission: 'card_instance:view',
      },
    ],
  },
  {
    key: 'companion',
    label: '伙伴系统',
    icon: 'SmileOutlined',
    children: [
      {
        key: 'companions',
        label: '伙伴管理',
        icon: 'SmileOutlined',
        path: '/companions',
        permission: 'companion:manage',
      },
    ],
  },
  {
    key: 'acceptance',
    label: '验收管理',
    icon: 'CheckCircleOutlined',
    children: [
      {
        key: 'acceptance',
        label: '待验收',
        icon: 'CheckCircleOutlined',
        path: '/acceptance',
        permission: 'acceptance:manage',
      },
    ],
  },
  {
    key: 'points-system',
    label: '积分系统',
    icon: 'StarOutlined',
    children: [
      {
        key: 'points',
        label: '积分流水',
        icon: 'StarOutlined',
        path: '/points',
        permission: 'points:view',
      },
      {
        key: 'shop-items',
        label: '商品管理',
        icon: 'ShopOutlined',
        path: '/shop-items',
        permission: 'shop_item:manage',
      },
      {
        key: 'exchange-orders',
        label: '兑换订单',
        icon: 'SwapOutlined',
        path: '/exchange-orders',
        permission: 'exchange_order:manage',
      },
    ],
  },
  {
    key: 'user',
    label: '用户中心',
    icon: 'UserOutlined',
    children: [
      {
        key: 'user-management',
        label: '用户管理',
        icon: 'UserOutlined',
        path: '/users',
        permission: 'user:manage',
      },
      {
        key: 'permission-management',
        label: '权限管理',
        icon: 'LockOutlined',
        path: '/permissions',
        permission: 'permission:manage',
      },
      {
        key: 'profile',
        label: '个人中心',
        icon: 'ProfileOutlined',
        path: '/profile',
        permission: 'profile:view',
      },
    ],
  },
  {
    key: 'system',
    label: '系统',
    icon: 'SettingOutlined',
    children: [
      {
        key: 'operation-log',
        label: '操作日志',
        icon: 'AuditOutlined',
        path: '/operation-log',
        permission: 'operation:log',
      },
      {
        key: 'system-settings',
        label: '系统设置',
        icon: 'SettingOutlined',
        path: '/settings',
        permission: 'setting:manage',
      },
    ],
  },
]

const iconMap: Record<string, ReactNode> = {
  DashboardOutlined: React.createElement(DashboardOutlined),
  TeamOutlined: React.createElement(TeamOutlined),
  AimOutlined: React.createElement(AimOutlined),
  FileTextOutlined: React.createElement(FileTextOutlined),
  SmileOutlined: React.createElement(SmileOutlined),
  CheckCircleOutlined: React.createElement(CheckCircleOutlined),
  StarOutlined: React.createElement(StarOutlined),
  ShopOutlined: React.createElement(ShopOutlined),
  SwapOutlined: React.createElement(SwapOutlined),
  UserOutlined: React.createElement(UserOutlined),
  LockOutlined: React.createElement(LockOutlined),
  AuditOutlined: React.createElement(AuditOutlined),
  SettingOutlined: React.createElement(SettingOutlined),
  ProfileOutlined: React.createElement(ProfileOutlined),
}

export function getIcon(name: string): ReactNode {
  return iconMap[name] || null
}

export function flattenMenu(menus: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []
  menus.forEach(menu => {
    if (menu.children) {
      result.push(...flattenMenu(menu.children))
    } else {
      result.push(menu)
    }
  })
  return result
}

export const flatMenuConfig = flattenMenu(menuConfig)
