/**
 * Store 入口
 *
 * 用户状态 → useUserStore（认证、权限、菜单树）
 * 布局状态 → useLayoutStore（侧边栏折叠等 UI 状态）
 *
 * useAppStore 为兼容选择器，内部代理到对应子 store。
 * 新代码建议直接使用 useUserStore / useLayoutStore。
 */

export { useUserStore } from './useUserStore'
export { useLayoutStore } from './useLayoutStore'

import { useUserStore } from './useUserStore'
import { useLayoutStore } from './useLayoutStore'

/**
 * 兼容层：将旧 useAppStore 调用代理到拆分后的子 store。
 * 支持 selector 模式，如 useAppStore(state => state.menuTree)
 */
export function useAppStore<T>(selector?: (state: Record<string, unknown>) => T): T {
  const user = useUserStore()
  const layout = useLayoutStore()

  const combined = { ...user, ...layout } as Record<string, unknown>

  if (selector) {
    return selector(combined)
  }
  return combined as unknown as T
}

// 保留 getState 以支持 useAppStore.getState().xxx() 调用
useAppStore.getState = () => {
  return {
    ...useUserStore.getState(),
    ...useLayoutStore.getState(),
  } as Record<string, unknown>
}
