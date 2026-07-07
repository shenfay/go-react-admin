import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '@/components/Layout'
import PermissionGuard from '@/components/PermissionGuard'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Family from '@/pages/Family'
import Goal from '@/pages/Goal'
import CardTemplate from '@/pages/CardTemplate'
import CardInstance from '@/pages/CardInstance'
import Companion from '@/pages/Companion'
import Acceptance from '@/pages/Acceptance'
import PointsRecord from '@/pages/PointsRecord'
import ShopItem from '@/pages/ShopItem'
import ExchangeOrder from '@/pages/ExchangeOrder'
import UserManagement from '@/pages/UserManagement'
import PermissionManagement from '@/pages/PermissionManagement'
import MenuManagement from '@/pages/MenuManagement'
import Profile from '@/pages/Profile'
import OperationLog from '@/pages/OperationLog'
import SystemSettings from '@/pages/SystemSettings'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <PermissionGuard permission="dashboard:view"><Dashboard /></PermissionGuard>,
      },
      {
        path: 'family',
        element: <PermissionGuard permission="family:manage"><Family /></PermissionGuard>,
      },
      {
        path: 'goals',
        element: <PermissionGuard permission="goal:manage"><Goal /></PermissionGuard>,
      },
      {
        path: 'card-templates',
        element: <PermissionGuard permission="card_template:manage"><CardTemplate /></PermissionGuard>,
      },
      {
        path: 'card-instances',
        element: <PermissionGuard permission="card_instance:view"><CardInstance /></PermissionGuard>,
      },
      {
        path: 'companions',
        element: <PermissionGuard permission="companion:manage"><Companion /></PermissionGuard>,
      },
      {
        path: 'acceptance',
        element: <PermissionGuard permission="acceptance:manage"><Acceptance /></PermissionGuard>,
      },
      {
        path: 'points',
        element: <PermissionGuard permission="points:view"><PointsRecord /></PermissionGuard>,
      },
      {
        path: 'shop-items',
        element: <PermissionGuard permission="shop_item:manage"><ShopItem /></PermissionGuard>,
      },
      {
        path: 'exchange-orders',
        element: <PermissionGuard permission="exchange_order:manage"><ExchangeOrder /></PermissionGuard>,
      },
      {
        path: 'users',
        element: <PermissionGuard permission="user:manage"><UserManagement /></PermissionGuard>,
      },
      {
        path: 'permissions',
        element: <PermissionGuard permission="permission:manage"><PermissionManagement /></PermissionGuard>,
      },
      {
        path: 'menus',
        element: <PermissionGuard permission="menu:manage"><MenuManagement /></PermissionGuard>,
      },
      {
        path: 'profile',
        element: <PermissionGuard permission="profile:view"><Profile /></PermissionGuard>,
      },
      {
        path: 'operation-log',
        element: <PermissionGuard permission="operation:log"><OperationLog /></PermissionGuard>,
      },
      {
        path: 'settings',
        element: <PermissionGuard permission="setting:manage"><SystemSettings /></PermissionGuard>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

export default router
