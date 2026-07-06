package rbac

// RolePermission 角色权限值对象
type RolePermission struct {
	ID            int    `json:"id"`
	RoleID        string `json:"role_id"`
	PermissionKey string `json:"permission_key"`
	MenuKey       string `json:"menu_key"`
}

// UserPermission 用户权限聚合（登录时返回）
type UserPermission struct {
	Roles       []RoleBrief `json:"roles"`
	Permissions []string    `json:"permissions"`
	Menus       []string    `json:"menus"`
}

// RoleBrief 角色简要信息
type RoleBrief struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Code string `json:"code"`
}

// MenuItem 菜单权限树节点
type MenuItem struct {
	Key      string     `json:"key"`
	Title    string     `json:"title"`
	Children []MenuItem `json:"children,omitempty"`
}
