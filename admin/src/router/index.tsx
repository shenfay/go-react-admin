import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '@/components/Layout'
import PermissionGuard from '@/components/PermissionGuard'
import Dashboard from '@/pages/Dashboard'
import DataOverview from '@/pages/DataOverview'
import DataReport from '@/pages/DataReport'
import DataQuality from '@/pages/DataQuality'
import ETLTasks from '@/pages/ETLTasks'
import DataModeling from '@/pages/DataModeling'
import ScriptDev from '@/pages/ScriptDev'
import DataInterface from '@/pages/DataInterface'
import DataSubscription from '@/pages/DataSubscription'
import MetadataMgmt from '@/pages/MetadataMgmt'
import DataStandard from '@/pages/DataStandard'
import DataSecurity from '@/pages/DataSecurity'
import DataAssets from '@/pages/DataAssets'
import Organization from '@/pages/Organization'
import ContentManagement from '@/pages/ContentManagement'
import Workflow from '@/pages/Workflow'
import AuditLog from '@/pages/AuditLog'
import AlertRules from '@/pages/AlertRules'
import MonitorDashboard from '@/pages/MonitorDashboard'
import UserManagement from '@/pages/UserManagement'
import PermissionManagement from '@/pages/PermissionManagement'
import Profile from '@/pages/Profile'
import APIManagement from '@/pages/APIManagement'
import OperationLog from '@/pages/OperationLog'
import SystemSettings from '@/pages/SystemSettings'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <PermissionGuard permission="dashboard:view">
            <Dashboard />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-overview',
        element: (
          <PermissionGuard permission="data:overview">
            <DataOverview />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-report',
        element: (
          <PermissionGuard permission="data:report">
            <DataReport />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-quality',
        element: (
          <PermissionGuard permission="data:quality">
            <DataQuality />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-assets',
        element: (
          <PermissionGuard permission="data:assets">
            <DataAssets />
          </PermissionGuard>
        ),
      },
      {
        path: 'etl-tasks',
        element: (
          <PermissionGuard permission="etl:manage">
            <ETLTasks />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-modeling',
        element: (
          <PermissionGuard permission="modeling:view">
            <DataModeling />
          </PermissionGuard>
        ),
      },
      {
        path: 'script-dev',
        element: (
          <PermissionGuard permission="script:dev">
            <ScriptDev />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-interface',
        element: (
          <PermissionGuard permission="interface:manage">
            <DataInterface />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-subscription',
        element: (
          <PermissionGuard permission="subscription:manage">
            <DataSubscription />
          </PermissionGuard>
        ),
      },
      {
        path: 'metadata-mgmt',
        element: (
          <PermissionGuard permission="metadata:view">
            <MetadataMgmt />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-standard',
        element: (
          <PermissionGuard permission="standard:manage">
            <DataStandard />
          </PermissionGuard>
        ),
      },
      {
        path: 'data-security',
        element: (
          <PermissionGuard permission="security:manage">
            <DataSecurity />
          </PermissionGuard>
        ),
      },
      {
        path: 'alert-rules',
        element: (
          <PermissionGuard permission="alert:manage">
            <AlertRules />
          </PermissionGuard>
        ),
      },
      {
        path: 'monitor-dashboard',
        element: (
          <PermissionGuard permission="monitor:view">
            <MonitorDashboard />
          </PermissionGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <PermissionGuard permission="user:manage">
            <UserManagement />
          </PermissionGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <PermissionGuard permission="permission:manage">
            <PermissionManagement />
          </PermissionGuard>
        ),
      },
      {
        path: 'organization',
        element: (
          <PermissionGuard permission="org:view">
            <Organization />
          </PermissionGuard>
        ),
      },
      {
        path: 'profile',
        element: (
          <PermissionGuard permission="profile:view">
            <Profile />
          </PermissionGuard>
        ),
      },
      {
        path: 'content',
        element: (
          <PermissionGuard permission="content:manage">
            <ContentManagement />
          </PermissionGuard>
        ),
      },
      {
        path: 'workflow',
        element: (
          <PermissionGuard permission="workflow:manage">
            <Workflow />
          </PermissionGuard>
        ),
      },
      {
        path: 'api-management',
        element: (
          <PermissionGuard permission="api:manage">
            <APIManagement />
          </PermissionGuard>
        ),
      },
      {
        path: 'operation-log',
        element: (
          <PermissionGuard permission="operation:log">
            <OperationLog />
          </PermissionGuard>
        ),
      },
      {
        path: 'audit-logs',
        element: (
          <PermissionGuard permission="audit:view">
            <AuditLog />
          </PermissionGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <PermissionGuard permission="setting:manage">
            <SystemSettings />
          </PermissionGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])

export default router
