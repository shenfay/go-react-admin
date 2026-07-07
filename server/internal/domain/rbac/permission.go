package rbac

// RolePermission 角色权限值对象（权限由 Casbin 管理，此处仅保留领域模型）
type RolePermission struct {
	RoleID        string `json:"role_id"`
	PermissionKey string `json:"permission_key"`
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

// PermissionMenuMap 权限标识 → 菜单 key 静态映射
var PermissionMenuMap = map[string]string{
	"dashboard:view":        "dashboard",
	"family:manage":         "family",
	"goal:manage":           "goals",
	"card_template:manage":  "card-templates",
	"card_instance:view":    "card-instances",
	"companion:manage":      "companions",
	"acceptance:manage":     "acceptance",
	"points:view":           "points",
	"shop_item:manage":      "shop-items",
	"exchange_order:manage": "exchange-orders",
	"user:manage":           "user-management",
	"user:list":             "user-management",
	"user:create":           "user-management",
	"user:update":           "user-management",
	"permission:manage":     "permission-management",
	"permission:view":       "permission-management",
	"menu:manage":           "menu-management",
	"profile:view":          "profile",
	"operation:log":         "operation-log",
	"setting:manage":        "system-settings",
}

// DeriveMenus 根据权限列表推导菜单 key 列表（去重）
func DeriveMenus(permissions []string) []string {
	menuSet := make(map[string]bool)
	for _, perm := range permissions {
		if menu, ok := PermissionMenuMap[perm]; ok {
			menuSet[menu] = true
		}
	}
	menus := make([]string, 0, len(menuSet))
	for m := range menuSet {
		menus = append(menus, m)
	}
	return menus
}
