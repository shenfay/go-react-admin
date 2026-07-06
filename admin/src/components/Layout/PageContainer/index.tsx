import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: 24,
        background: 'var(--main-bg)',
      }}
    >
      {children}
    </div>
  )
}
