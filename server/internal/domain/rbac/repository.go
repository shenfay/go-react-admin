package rbac

import "context"

// RoleRepository 角色仓储接口
type RoleRepository interface {
	// Create 创建角色
	Create(ctx context.Context, role *Role) error

	// Update 更新角色
	Update(ctx context.Context, role *Role) error

	// Delete 删除角色
	Delete(ctx context.Context, roleID string) error

	// FindByID 根据 ID 查找角色
	FindByID(ctx context.Context, id string) (*Role, error)

	// FindByCode 根据编码查找角色
	FindByCode(ctx context.Context, code string) (*Role, error)

	// FindAll 获取所有角色
	FindAll(ctx context.Context) ([]*Role, error)

	// FindByUserID 查询用户的所有角色（通过 user_roles 关联表）
	FindByUserID(ctx context.Context, userID string) ([]*Role, error)

	// FindPermissionsByUserID 查询用户的所有权限（通过 user_roles + role_permissions）
	FindPermissionsByUserID(ctx context.Context, userID string) (*UserPermission, error)

	// FindRolePermissions 查询角色的权限列表
	FindRolePermissions(ctx context.Context, roleID string) ([]RolePermission, error)

	// UpdateRolePermissions 更新角色权限（先删后插）
	UpdateRolePermissions(ctx context.Context, roleID string, permissions []RolePermission) error

	// AssignRolesToUser 分配角色给用户（先删后插 user_roles）
	AssignRolesToUser(ctx context.Context, userID string, roleIDs []string) error

	// HasRole 检查用户是否拥有指定角色
	HasRole(ctx context.Context, userID string, roleCode string) (bool, error)
}
