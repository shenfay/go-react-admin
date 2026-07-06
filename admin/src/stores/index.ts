import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PermissionConfig } from '@/config/permission'
import { defaultPermissions } from '@/config/permission'
import type { UserPermission, RoleBrief } from '@/types'

interface UserState {
  userId: string | null
  username: string | null
  email: string | null
  avatar: string | null
  roles: RoleBrief[]
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
  login: (userData: {
    userId: string
    username: string
    email: string
    roles: RoleBrief[]
    permissions: UserPermission
    token: string
    refreshToken: string
  }) => void
  logout: () => void
  setUserInfo: (info: Partial<UserState>) => void
  updatePermissions: (perms: UserPermission) => void
}

const initialUserState: UserState = {
  userId: null,
  username: null,
  email: null,
  avatar: null,
  roles: [],
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
      },

      // User
      login: userData => {
        // 存储 token
        localStorage.setItem('admin-token', userData.token)
        if (userData.refreshToken) {
          localStorage.setItem('admin-refresh-token', userData.refreshToken)
        }

        set({
          ...initialUserState,
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          roles: userData.roles,
          permissions: userData.permissions?.permissions || [],
          menus: userData.permissions?.menus || [],
          isLogin: true,
        })
      },
      logout: () => {
        localStorage.removeItem('admin-token')
        localStorage.removeItem('admin-refresh-token')
        set(initialUserState)
      },
      setUserInfo: info => set(state => ({ ...state, ...info })),
      updatePermissions: perms => {
        set({
          permissions: perms?.permissions || [],
          menus: perms?.menus || [],
          roles: perms?.roles || get().roles,
        })
      },
    }),
    {
      name: 'kiqi-admin-storage',
      version: 4,
      migrate: (_persistedState: unknown, version: number) => {
        if (version < 4) {
          return initialUserState as AppState & { sidebarCollapsed: boolean }
        }
        return _persistedState as AppState & { sidebarCollapsed: boolean }
      },
      partialize: state => ({
        sidebarCollapsed: state.sidebarCollapsed,
        userId: state.userId,
        username: state.username,
        email: state.email,
        avatar: state.avatar,
        roles: state.roles,
        permissions: state.permissions,
        menus: state.menus,
        isLogin: state.isLogin,
      }),
    }
  )
)
