import { useState, useCallback, useEffect } from 'react'
import { Layout } from 'antd'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PageContainer from './PageContainer'
import { useAppStore } from '@/stores'
import { getUserMenuTree } from '@/services/auth'
import type { ReactNode } from 'react'

const { Content } = Layout

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const { isLogin, setMenuTree } = useAppStore()
  const [contentKey, setContentKey] = useState(0)

  const handleRefresh = useCallback(() => {
    setContentKey(k => k + 1)
  }, [])

  // 未登录时跳转到登录页
  useEffect(() => {
    if (!isLogin) {
      navigate('/login', { replace: true })
    }
  }, [isLogin, navigate])

  // 每次页面加载时都获取最新菜单树，确保权限变更后菜单实时更新
  useEffect(() => {
    if (isLogin) {
      getUserMenuTree()
        .then(tree => {
          setMenuTree(tree || [])
        })
        .catch(() => {
          // 获取失败静默处理
        })
    }
  }, [isLogin, setMenuTree])

  if (!isLogin) {
    return null
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ height: '100vh' }}>
        <TopBar onRefresh={handleRefresh} />
        <Content style={{ overflow: 'hidden', height: 'calc(100vh - 50px)', display: 'flex', flexDirection: 'column' }}>
          <PageContainer key={contentKey}>{children}</PageContainer>
        </Content>
      </Layout>
    </Layout>
  )
}
