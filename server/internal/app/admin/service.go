package admin

import (
	"context"
	"time"

	"github.com/shenfay/kiqi/internal/domain/rbac"
	"github.com/shenfay/kiqi/internal/domain/user"
	"github.com/shenfay/kiqi/internal/infra/authorize"
	"github.com/shenfay/kiqi/pkg/utils"
)

// Service 管理员应用服务
type Service struct {
	userRepo user.UserRepository
	roleRepo rbac.RoleRepository
	enforcer *authorize.Enforcer
}

// NewService 创建管理员应用服务
func NewService(userRepo user.UserRepository, roleRepo rbac.RoleRepository, enforcer *authorize.Enforcer) *Service {
	return &Service{
		userRepo: userRepo,
		roleRepo: roleRepo,
		enforcer: enforcer,
	}
}

// ---- 用户管理 ----

// ListUsers 分页查询用户列表
func (s *Service) ListUsers(ctx context.Context, params user.UserListParams) (*UserListDTO, error) {
	result, err := s.userRepo.List(ctx, params)
	if err != nil {
		return nil, err
	}

	// 查询每个用户的角色
	userDTOs := make([]*UserDTO, 0, len(result.Users))
	for _, u := range result.Users {
		dto := toUserDTO(u)
		roles, _ := s.roleRepo.FindByUserID(ctx, u.ID)
		if roles != nil {
			dto.Roles = rolesToBriefs(roles)
		}
		userDTOs = append(userDTOs, dto)
	}

	return &UserListDTO{
		Users: userDTOs,
		Total: result.Total,
	}, nil
}

// CreateUser 创建用户并分配角色
func (s *Service) CreateUser(ctx context.Context, cmd CreateUserCmd) (*UserDTO, error) {
	u, err := user.NewUser(cmd.Email, cmd.Name, cmd.Password)
	if err != nil {
		return nil, err
	}

	if err := s.userRepo.Create(ctx, u); err != nil {
		return nil, err
	}

	// 分配角色（DB + Casbin 同步）
	if len(cmd.RoleIDs) > 0 {
		if err := s.roleRepo.AssignRolesToUser(ctx, u.ID, cmd.RoleIDs); err != nil {
			return nil, err
		}
		if err := s.enforcer.SyncUserRoles(u.ID, cmd.RoleIDs); err != nil {
			return nil, err
		}
	}

	dto := toUserDTO(u)
	roles, _ := s.roleRepo.FindByUserID(ctx, u.ID)
	if roles != nil {
		dto.Roles = rolesToBriefs(roles)
	}
	return dto, nil
}

// UpdateUser 更新用户信息
func (s *Service) UpdateUser(ctx context.Context, cmd UpdateUserCmd) (*UserDTO, error) {
	u, err := s.userRepo.FindByID(ctx, cmd.UserID)
	if err != nil {
		return nil, err
	}

	if cmd.Name != "" {
		_ = u.UpdateName(cmd.Name)
	}
	if cmd.Email != "" {
		_ = u.UpdateEmail(cmd.Email)
	}

	if err := s.userRepo.Update(ctx, u); err != nil {
		return nil, err
	}

	// 更新角色（DB + Casbin 同步）
	if cmd.RoleIDs != nil {
		if err := s.roleRepo.AssignRolesToUser(ctx, u.ID, cmd.RoleIDs); err != nil {
			return nil, err
		}
		if err := s.enforcer.SyncUserRoles(u.ID, cmd.RoleIDs); err != nil {
			return nil, err
		}
	}

	dto := toUserDTO(u)
	roles, _ := s.roleRepo.FindByUserID(ctx, u.ID)
	if roles != nil {
		dto.Roles = rolesToBriefs(roles)
	}
	return dto, nil
}

// ToggleUserStatus 启用/禁用用户
func (s *Service) ToggleUserStatus(ctx context.Context, userID string, locked bool) error {
	u, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if locked {
		u.Locked = true
	} else {
		u.Locked = false
		u.ResetFailedAttempts()
	}
	u.UpdatedAt = utils.Now()

	return s.userRepo.Update(ctx, u)
}

// ---- 角色管理 ----

// ListRoles 获取所有角色
func (s *Service) ListRoles(ctx context.Context) ([]*RoleDTO, error) {
	roles, err := s.roleRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	dtos := make([]*RoleDTO, 0, len(roles))
	for _, r := range roles {
		dtos = append(dtos, toRoleDTO(r))
	}
	return dtos, nil
}

// CreateRole 创建角色
func (s *Service) CreateRole(ctx context.Context, cmd CreateRoleCmd) (*RoleDTO, error) {
	r := rbac.NewRole(cmd.Name, cmd.Code, cmd.Description)
	if err := s.roleRepo.Create(ctx, r); err != nil {
		return nil, err
	}
	return toRoleDTO(r), nil
}

// UpdateRole 更新角色
func (s *Service) UpdateRole(ctx context.Context, cmd UpdateRoleCmd) (*RoleDTO, error) {
	r, err := s.roleRepo.FindByID(ctx, cmd.RoleID)
	if err != nil {
		return nil, err
	}

	r.Update(cmd.Name, cmd.Description)
	if err := s.roleRepo.Update(ctx, r); err != nil {
		return nil, err
	}

	return toRoleDTO(r), nil
}

// DeleteRole 删除角色
func (s *Service) DeleteRole(ctx context.Context, roleID string) error {
	return s.roleRepo.Delete(ctx, roleID)
}

// ToggleRoleStatus 切换角色状态
func (s *Service) ToggleRoleStatus(ctx context.Context, roleID string) error {
	r, err := s.roleRepo.FindByID(ctx, roleID)
	if err != nil {
		return err
	}
	r.ToggleStatus()
	return s.roleRepo.Update(ctx, r)
}

// ---- 权限管理（通过 Casbin）----

// GetRolePermissions 获取角色权限列表（从 Casbin 查询）
func (s *Service) GetRolePermissions(ctx context.Context, roleID string) ([]string, error) {
	return s.enforcer.GetPermissionsForRole(roleID)
}

// UpdateRolePermissions 更新角色权限（通过 Casbin）
func (s *Service) UpdateRolePermissions(ctx context.Context, roleID string, permissions []string) error {
	return s.enforcer.SetRolePermissions(roleID, permissions)
}

// GetUserPermissions 获取用户权限（登录时使用）
func (s *Service) GetUserPermissions(ctx context.Context, userID string) (*rbac.UserPermission, error) {
	// 1. 查用户角色
	roles, err := s.roleRepo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	roleBriefs := make([]rbac.RoleBrief, 0, len(roles))
	for _, role := range roles {
		roleBriefs = append(roleBriefs, rbac.RoleBrief{
			ID:   role.ID,
			Name: role.Name,
			Code: role.Code,
		})
	}

	// 2. 从 Casbin 查权限
	permissions, err := s.enforcer.GetPermissionsForUser(userID)
	if err != nil {
		return nil, err
	}

	// 3. 推导菜单
	menus := rbac.DeriveMenus(permissions)

	return &rbac.UserPermission{
		Roles:       roleBriefs,
		Permissions: permissions,
		Menus:       menus,
	}, nil
}

// ---- 命令对象 ----

// CreateUserCmd 创建用户命令
type CreateUserCmd struct {
	Email    string
	Name     string
	Password string
	RoleIDs  []string
}

// UpdateUserCmd 更新用户命令
type UpdateUserCmd struct {
	UserID  string
	Name    string
	Email   string
	RoleIDs []string // nil 表示不更新角色
}

// CreateRoleCmd 创建角色命令
type CreateRoleCmd struct {
	Name        string
	Code        string
	Description string
}

// UpdateRoleCmd 更新角色命令
type UpdateRoleCmd struct {
	RoleID      string
	Name        string
	Description string
}

// ---- DTO ----

// UserDTO 用户数据传输对象
type UserDTO struct {
	ID            string           `json:"id"`
	Email         string           `json:"email"`
	Name          string           `json:"name"`
	EmailVerified bool             `json:"email_verified"`
	Locked        bool             `json:"locked"`
	Roles         []rbac.RoleBrief `json:"roles"`
	LastLoginAt   *time.Time       `json:"last_login_at,omitempty"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
}

// UserListDTO 用户列表 DTO
type UserListDTO struct {
	Users []*UserDTO `json:"users"`
	Total int64      `json:"total"`
}

// RoleDTO 角色数据传输对象
type RoleDTO struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Code        string    `json:"code"`
	Description string    `json:"description"`
	Status      bool      `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ---- 转换函数 ----

func toUserDTO(u *user.User) *UserDTO {
	return &UserDTO{
		ID:            u.ID,
		Email:         u.Email,
		Name:          u.Name,
		EmailVerified: u.EmailVerified,
		Locked:        u.Locked,
		Roles:         []rbac.RoleBrief{},
		LastLoginAt:   u.LastLoginAt,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
	}
}

func toRoleDTO(r *rbac.Role) *RoleDTO {
	return &RoleDTO{
		ID:          r.ID,
		Name:        r.Name,
		Code:        r.Code,
		Description: r.Description,
		Status:      r.Status,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

func rolesToBriefs(roles []*rbac.Role) []rbac.RoleBrief {
	briefs := make([]rbac.RoleBrief, 0, len(roles))
	for _, r := range roles {
		briefs = append(briefs, rbac.RoleBrief{
			ID:   r.ID,
			Name: r.Name,
			Code: r.Code,
		})
	}
	return briefs
}
