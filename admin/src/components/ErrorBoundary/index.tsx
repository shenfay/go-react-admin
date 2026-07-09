import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button, Result } from 'antd'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * React 错误边界
 * 捕获子组件树中的渲染错误，防止整个应用白屏。
 * 生产环境展示友好提示，开发环境保留控制台错误信息。
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 生产环境可上报到监控平台
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <Result
          status="error"
          title="页面出错了"
          subTitle={import.meta.env.DEV ? this.state.error?.message : '抱歉，页面渲染时发生了意外错误'}
          extra={
            <Button type="primary" onClick={this.handleReset}>
              重新加载
            </Button>
          }
        />
      )
    }

    return this.props.children
  }
}
