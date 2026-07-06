import { useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PageContainer from './PageContainer'
import { useAppStore } from '@/stores'
import type { ReactNode } from 'react'

const { Content } = Layout

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLogin, login } = useAppStore()

  // 首次加载时自动以管理员身份登录
  useEffect(() => {
    if (!isLogin) {
      login({
        userId: '1',
        username: '管理员',
        role: 'admin',
        roleName: '管理员',
      })
    }
  }, [isLogin, login])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ height: '100vh' }}>
        <TopBar />
        <Content style={{ overflow: 'hidden', height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
          <PageContainer>{children}</PageContainer>
        </Content>
      </Layout>
    </Layout>
  )
}
