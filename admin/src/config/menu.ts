import {
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  NodeIndexOutlined,
  ApiOutlined,
  AuditOutlined,
  SettingOutlined,
  CodeOutlined,
  PartitionOutlined,
  SendOutlined,
  AlertOutlined,
  MonitorOutlined,
  LockOutlined,
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
    key: 'data',
    label: '数据中台',
    icon: 'BarChartOutlined',
    children: [
      {
        key: 'data-overview',
        label: '数据概览',
        icon: 'BarChartOutlined',
        path: '/data-overview',
        permission: 'data:overview',
      },
      {
        key: 'data-report',
        label: '数据报表',
        icon: 'LineChartOutlined',
        path: '/data-report',
        permission: 'data:report',
      },
      {
        key: 'data-quality',
        label: '数据质量',
        icon: 'SafetyCertificateOutlined',
        path: '/data-quality',
        permission: 'data:quality',
      },
      {
        key: 'data-assets',
        label: '数据资产',
        icon: 'DatabaseOutlined',
        path: '/data-assets',
        permission: 'data:assets',
      },
    ],
  },
  {
    key: 'data-dev',
    label: '数据开发',
    icon: 'CodeOutlined',
    children: [
      {
        key: 'etl-tasks',
        label: 'ETL 任务管理',
        icon: 'NodeIndexOutlined',
        path: '/etl-tasks',
        permission: 'etl:manage',
      },
      {
        key: 'data-modeling',
        label: '数据建模',
        icon: 'PartitionOutlined',
        path: '/data-modeling',
        permission: 'modeling:view',
      },
      {
        key: 'script-dev',
        label: '脚本开发',
        icon: 'CodeOutlined',
        path: '/script-dev',
        permission: 'script:dev',
      },
    ],
  },
  {
    key: 'data-service',
    label: '数据服务',
    icon: 'ApiOutlined',
    children: [
      {
        key: 'data-interface',
        label: '数据接口',
        icon: 'ApiOutlined',
        path: '/data-interface',
        permission: 'interface:manage',
      },
      {
        key: 'data-subscription',
        label: '数据订阅',
        icon: 'SendOutlined',
        path: '/data-subscription',
        permission: 'subscription:manage',
      },
    ],
  },
  {
    key: 'data-govern',
    label: '数据治理',
    icon: 'SafetyCertificateOutlined',
    children: [
      {
        key: 'metadata-mgmt',
        label: '元数据管理',
        icon: 'DatabaseOutlined',
        path: '/metadata-mgmt',
        permission: 'metadata:view',
      },
      {
        key: 'data-standard',
        label: '数据标准',
        icon: 'SafetyCertificateOutlined',
        path: '/data-standard',
        permission: 'standard:manage',
      },
      {
        key: 'data-security',
        label: '数据安全',
        icon: 'LockOutlined',
        path: '/data-security',
        permission: 'security:manage',
      },
    ],
  },
  {
    key: 'monitor',
    label: '监控告警',
    icon: 'AlertOutlined',
    children: [
      {
        key: 'alert-rules',
        label: '告警规则',
        icon: 'AlertOutlined',
        path: '/alert-rules',
        permission: 'alert:manage',
      },
      {
        key: 'monitor-dashboard',
        label: '监控大盘',
        icon: 'MonitorOutlined',
        path: '/monitor-dashboard',
        permission: 'monitor:view',
      },
    ],
  },
  {
    key: 'user',
    label: '用户中心',
    icon: 'TeamOutlined',
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
        icon: 'TeamOutlined',
        path: '/permissions',
        permission: 'permission:manage',
      },
      {
        key: 'organization',
        label: '组织架构',
        icon: 'ApartmentOutlined',
        path: '/organization',
        permission: 'org:view',
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
    key: 'business',
    label: '业务中台',
    icon: 'ApartmentOutlined',
    children: [
      {
        key: 'content-management',
        label: '内容管理',
        icon: 'FileTextOutlined',
        path: '/content',
        permission: 'content:manage',
        badge: 3,
      },
      {
        key: 'workflow',
        label: '工作流',
        icon: 'NodeIndexOutlined',
        path: '/workflow',
        permission: 'workflow:manage',
      },
      {
        key: 'api-management',
        label: 'API 管理',
        icon: 'ApiOutlined',
        path: '/api-management',
        permission: 'api:manage',
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
        key: 'audit-log',
        label: '审计日志',
        icon: 'AuditOutlined',
        path: '/audit-logs',
        permission: 'audit:view',
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
  BarChartOutlined: React.createElement(BarChartOutlined),
  LineChartOutlined: React.createElement(LineChartOutlined),
  SafetyCertificateOutlined: React.createElement(SafetyCertificateOutlined),
  DatabaseOutlined: React.createElement(DatabaseOutlined),
  UserOutlined: React.createElement(UserOutlined),
  TeamOutlined: React.createElement(TeamOutlined),
  ApartmentOutlined: React.createElement(ApartmentOutlined),
  FileTextOutlined: React.createElement(FileTextOutlined),
  NodeIndexOutlined: React.createElement(NodeIndexOutlined),
  ApiOutlined: React.createElement(ApiOutlined),
  AuditOutlined: React.createElement(AuditOutlined),
  SettingOutlined: React.createElement(SettingOutlined),
  CodeOutlined: React.createElement(CodeOutlined),
  PartitionOutlined: React.createElement(PartitionOutlined),
  SendOutlined: React.createElement(SendOutlined),
  AlertOutlined: React.createElement(AlertOutlined),
  MonitorOutlined: React.createElement(MonitorOutlined),
  LockOutlined: React.createElement(LockOutlined),
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
