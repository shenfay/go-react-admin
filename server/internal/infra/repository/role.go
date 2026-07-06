package repository

import (
	"context"
	"errors"
	"time"

	"gorm.io/gorm"

	"github.com/shenfay/kiqi/internal/domain/rbac"
	"github.com/shenfay/kiqi/pkg/utils"
)

// RolePO 角色持久化对象
type RolePO struct {
	ID          string   `gorm:"primaryKey;type:varchar(50)" json:"id"`
	Name        string   `gorm:"type:varchar(100);not null" json:"name"`
	Code        string   `gorm:"uniqueIndex;type:varchar(50);not null" json:"code"`
	Description string   `gorm:"type:text;default:''" json:"description"`
	Status      bool     `gorm:"default:true" json:"status"`
	CreatedAt   TimeNull `json:"created_at"`
	UpdatedAt   TimeNull `json:"updated_at"`
}

func (RolePO) TableName() string { return "roles" }

// UserRolePO 用户角色关联持久化对象
type UserRolePO struct {
	UserID    string   `gorm:"primaryKey;type:varchar(50)" json:"user_id"`
	RoleID    string   `gorm:"primaryKey;type:varchar(50)" json:"role_id"`
	CreatedAt TimeNull `json:"created_at"`
}

func (UserRolePO) TableName() string { return "user_roles" }

// RolePermissionPO 角色权限持久化对象
type RolePermissionPO struct {
	ID            int    `gorm:"primaryKey;autoIncrement" json:"id"`
	RoleID        string `gorm:"uniqueIndex:idx_role_perm;type:varchar(50);not null" json:"role_id"`
	PermissionKey string `gorm:"uniqueIndex:idx_role_perm;type:varchar(100);not null" json:"permission_key"`
	MenuKey       string `gorm:"type:varchar(100);default:''" json:"menu_key"`
}

func (RolePermissionPO) TableName() string { return "role_permissions" }

// ToDomain 转换为领域模型
func (po *RolePO) ToDomain() *rbac.Role {
	if po == nil {
		return nil
	}
	createdAt := time.Time{}
	updatedAt := time.Time{}
	if po.CreatedAt.Valid {
		createdAt = po.CreatedAt.Time
	}
	if po.UpdatedAt.Valid {
		updatedAt = po.UpdatedAt.Time
	}
	return &rbac.Role{
		ID:          po.ID,
		Name:        po.Name,
		Code:        po.Code,
		Description: po.Description,
		Status:      po.Status,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}
}

// RolePOFromDomain 从领域模型转换
func RolePOFromDomain(r *rbac.Role) *RolePO {
	return &RolePO{
		ID:          r.ID,
		Name:        r.Name,
		Code:        r.Code,
		Description: r.Description,
		Status:      r.Status,
		CreatedAt:   TimeNull{Time: r.CreatedAt, Valid: true},
		UpdatedAt:   TimeNull{Time: r.UpdatedAt, Valid: true},
	}
}

// roleRepository 角色仓储 GORM 实现
type roleRepository struct {
	db *gorm.DB
}

// NewRoleRepository 创建角色仓储实例
func NewRoleRepository(db *gorm.DB) rbac.RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) Create(ctx context.Context, role *rbac.Role) error {
	po := RolePOFromDomain(role)
	return r.db.WithContext(ctx).Create(po).Error
}

func (r *roleRepository) Update(ctx context.Context, role *rbac.Role) error {
	po := RolePOFromDomain(role)
	return r.db.WithContext(ctx).Save(po).Error
}

func (r *roleRepository) Delete(ctx context.Context, roleID string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 删除角色权限
		if err := tx.Where("role_id = ?", roleID).Delete(&RolePermissionPO{}).Error; err != nil {
			return err
		}
		// 删除用户角色关联
		if err := tx.Where("role_id = ?", roleID).Delete(&UserRolePO{}).Error; err != nil {
			return err
		}
		// 删除角色
		if err := tx.Delete(&RolePO{}, "id = ?", roleID).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *roleRepository) FindByID(ctx context.Context, id string) (*rbac.Role, error) {
	var po RolePO
	err := r.db.WithContext(ctx).First(&po, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}
	return po.ToDomain(), nil
}

func (r *roleRepository) FindByCode(ctx context.Context, code string) (*rbac.Role, error) {
	var po RolePO
	err := r.db.WithContext(ctx).Where("code = ?", code).First(&po).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}
	return po.ToDomain(), nil
}

func (r *roleRepository) FindAll(ctx context.Context) ([]*rbac.Role, error) {
	var pos []RolePO
	if err := r.db.WithContext(ctx).Order("created_at ASC").Find(&pos).Error; err != nil {
		return nil, err
	}
	roles := make([]*rbac.Role, 0, len(pos))
	for i := range pos {
		roles = append(roles, pos[i].ToDomain())
	}
	return roles, nil
}

// FindByUserID 查询用户的所有角色（通过 user_roles 关联表）
func (r *roleRepository) FindByUserID(ctx context.Context, userID string) ([]*rbac.Role, error) {
	var pos []RolePO
	err := r.db.WithContext(ctx).
		Joins("JOIN user_roles ON user_roles.role_id = roles.id").
		Where("user_roles.user_id = ? AND roles.status = ?", userID, true).
		Find(&pos).Error
	if err != nil {
		return nil, err
	}
	roles := make([]*rbac.Role, 0, len(pos))
	for i := range pos {
		roles = append(roles, pos[i].ToDomain())
	}
	return roles, nil
}

// FindPermissionsByUserID 查询用户的所有权限
func (r *roleRepository) FindPermissionsByUserID(ctx context.Context, userID string) (*rbac.UserPermission, error) {
	// 1. 查用户角色
	roles, err := r.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if len(roles) == 0 {
		return &rbac.UserPermission{
			Roles:       []rbac.RoleBrief{},
			Permissions: []string{},
			Menus:       []string{},
		}, nil
	}

	roleIDs := make([]string, 0, len(roles))
	roleBriefs := make([]rbac.RoleBrief, 0, len(roles))
	for _, role := range roles {
		roleIDs = append(roleIDs, role.ID)
		roleBriefs = append(roleBriefs, rbac.RoleBrief{
			ID:   role.ID,
			Name: role.Name,
			Code: role.Code,
		})
	}

	// 2. 查角色权限（去重）
	var perms []RolePermissionPO
	err = r.db.WithContext(ctx).
		Where("role_id IN ?", roleIDs).
		Find(&perms).Error
	if err != nil {
		return nil, err
	}

	permSet := make(map[string]bool)
	menuSet := make(map[string]bool)
	for _, p := range perms {
		permSet[p.PermissionKey] = true
		if p.MenuKey != "" {
			menuSet[p.MenuKey] = true
		}
	}

	permissions := make([]string, 0, len(permSet))
	for k := range permSet {
		permissions = append(permissions, k)
	}
	menus := make([]string, 0, len(menuSet))
	for k := range menuSet {
		menus = append(menus, k)
	}

	return &rbac.UserPermission{
		Roles:       roleBriefs,
		Permissions: permissions,
		Menus:       menus,
	}, nil
}

// FindRolePermissions 查询角色的权限列表
func (r *roleRepository) FindRolePermissions(ctx context.Context, roleID string) ([]rbac.RolePermission, error) {
	var pos []RolePermissionPO
	err := r.db.WithContext(ctx).Where("role_id = ?", roleID).Find(&pos).Error
	if err != nil {
		return nil, err
	}
	perms := make([]rbac.RolePermission, 0, len(pos))
	for _, p := range pos {
		perms = append(perms, rbac.RolePermission{
			ID:            p.ID,
			RoleID:        p.RoleID,
			PermissionKey: p.PermissionKey,
			MenuKey:       p.MenuKey,
		})
	}
	return perms, nil
}

// UpdateRolePermissions 更新角色权限（先删后插）
func (r *roleRepository) UpdateRolePermissions(ctx context.Context, roleID string, permissions []rbac.RolePermission) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 删除旧权限
		if err := tx.Where("role_id = ?", roleID).Delete(&RolePermissionPO{}).Error; err != nil {
			return err
		}
		// 插入新权限
		if len(permissions) > 0 {
			pos := make([]RolePermissionPO, 0, len(permissions))
			for _, p := range permissions {
				pos = append(pos, RolePermissionPO{
					RoleID:        roleID,
					PermissionKey: p.PermissionKey,
					MenuKey:       p.MenuKey,
				})
			}
			if err := tx.Create(&pos).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// AssignRolesToUser 分配角色给用户（先删后插 user_roles）
func (r *roleRepository) AssignRolesToUser(ctx context.Context, userID string, roleIDs []string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 删除旧角色
		if err := tx.Where("user_id = ?", userID).Delete(&UserRolePO{}).Error; err != nil {
			return err
		}
		// 插入新角色
		if len(roleIDs) > 0 {
			pos := make([]UserRolePO, 0, len(roleIDs))
			now := TimeNull{Time: utils.Now(), Valid: true}
			for _, rid := range roleIDs {
				pos = append(pos, UserRolePO{
					UserID:    userID,
					RoleID:    rid,
					CreatedAt: now,
				})
			}
			if err := tx.Create(&pos).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// HasRole 检查用户是否拥有指定角色
func (r *roleRepository) HasRole(ctx context.Context, userID string, roleCode string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&UserRolePO{}).
		Joins("JOIN roles ON roles.id = user_roles.role_id").
		Where("user_roles.user_id = ? AND roles.code = ?", userID, roleCode).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
