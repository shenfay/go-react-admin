import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PermissionConfig } from '@/config/permission'
import { defaultPermissions } from '@/config/permission'

interface UserState {
  userId: string | null
  username: string | null
  avatar: string | null
  role: string | null
  roleName: string | null
  permissions: string[]
  menus: string[]
  isLogin: boolean
}

interface LayoutState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
}

interface PermissionState {
  permissionConfig: PermissionConfig[]
  setPermissionConfig: (config: PermissionConfig[]) => void
  loadFromBackend: (config: PermissionConfig[]) => void
}

interface AppState extends UserState, LayoutState, PermissionState {
  // User actions
  login: (userData: Partial<UserState>) => void
  logout: () => void
  setUserInfo: (info: Partial<UserState>) => void
}

const initialUserState: UserState = {
  userId: null,
  username: null,
  avatar: null,
  role: null,
  roleName: null,
  permissions: [],
  menus: [],
  isLogin: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialUserState,

      // Layout
      sidebarCollapsed: false,
      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Permission
      permissionConfig: defaultPermissions,
      setPermissionConfig: config => set({ permissionConfig: config }),
      loadFromBackend: config => {
        set({ permissionConfig: config })
        // 如果用户已登录，重新加载对应角色的权限
        const { role, isLogin } = get()
        if (isLogin && role) {
          const userConfig = config.find(c => c.role === role)
          if (userConfig) {
            set({
              permissions: userConfig.permissions,
              menus: userConfig.menus,
            })
          }
        }
      },

      // User
      login: userData => {
        const { permissionConfig } = get()
        const role = userData.role || 'member'
        const config = permissionConfig.find(c => c.role === role)
        set({
          ...initialUserState,
          ...userData,
          role,
          roleName: config?.roleName || userData.roleName,
          permissions: config?.permissions || [],
          menus: config?.menus || [],
          isLogin: true,
        })
      },
      logout: () => set(initialUserState),
      setUserInfo: info => set(state => ({ ...state, ...info })),
    }),
    {
      name: 'admin-scaffold-storage',
      version: 2,
      migrate: (_persistedState: unknown, version: number) => {
        // 版本变更时丢弃旧缓存，使用默认初始状态
        if (version < 2) {
          return initialUserState as AppState & { sidebarCollapsed: boolean }
        }
        return _persistedState as AppState & { sidebarCollapsed: boolean }
      },
      partialize: state => ({
        sidebarCollapsed: state.sidebarCollapsed,
        userId: state.userId,
        username: state.username,
        avatar: state.avatar,
        role: state.role,
        roleName: state.roleName,
        permissions: state.permissions,
        menus: state.menus,
        isLogin: state.isLogin,
      }),
    }
  )
)
