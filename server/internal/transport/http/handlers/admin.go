package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/shenfay/kiqi/internal/app/admin"
	"github.com/shenfay/kiqi/internal/domain/user"
	"github.com/shenfay/kiqi/internal/transport/http/response"
	validationErr "github.com/shenfay/kiqi/pkg/errors/validation"
)

// AdminHandler 管理员 HTTP 处理器
type AdminHandler struct {
	service *admin.Service
}

// NewAdminHandler 创建管理员处理器实例
func NewAdminHandler(service *admin.Service) *AdminHandler {
	return &AdminHandler{service: service}
}

// ---- 用户管理 ----

// ListUsers 用户列表
func (h *AdminHandler) ListUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	params := user.UserListParams{
		Page:     page,
		PageSize: pageSize,
		Keyword:  c.Query("keyword"),
		RoleID:   c.Query("role_id"),
	}

	if status := c.Query("status"); status != "" {
		b := status == "active"
		params.Status = &b
	}

	result, err := h.service.ListUsers(c.Request.Context(), params)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, result)
}

// CreateUser 创建用户
func (h *AdminHandler) CreateUser(c *gin.Context) {
	var req struct {
		Email    string   `json:"email" binding:"required,email"`
		Name     string   `json:"name" binding:"required"`
		Password string   `json:"password" binding:"required,min=8"`
		RoleIDs  []string `json:"role_ids"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	cmd := admin.CreateUserCmd{
		Email:    req.Email,
		Name:     req.Name,
		Password: req.Password,
		RoleIDs:  req.RoleIDs,
	}

	dto, err := h.service.CreateUser(c.Request.Context(), cmd)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Created(c, dto)
}

// UpdateUser 更新用户
func (h *AdminHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	var req struct {
		Name    string   `json:"name"`
		Email   string   `json:"email"`
		RoleIDs []string `json:"role_ids"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	cmd := admin.UpdateUserCmd{
		UserID:  userID,
		Name:    req.Name,
		Email:   req.Email,
		RoleIDs: req.RoleIDs,
	}

	dto, err := h.service.UpdateUser(c.Request.Context(), cmd)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, dto)
}

// ToggleUserStatus 启用/禁用用户
func (h *AdminHandler) ToggleUserStatus(c *gin.Context) {
	userID := c.Param("id")

	var req struct {
		Locked bool `json:"locked"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	if err := h.service.ToggleUserStatus(c.Request.Context(), userID, req.Locked); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{"message": "Status updated"})
}

// ---- 角色管理 ----

// ListRoles 角色列表
func (h *AdminHandler) ListRoles(c *gin.Context) {
	roles, err := h.service.ListRoles(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, roles)
}

// CreateRole 创建角色
func (h *AdminHandler) CreateRole(c *gin.Context) {
	var req struct {
		Name        string `json:"name" binding:"required"`
		Code        string `json:"code" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	cmd := admin.CreateRoleCmd{
		Name:        req.Name,
		Code:        req.Code,
		Description: req.Description,
	}

	dto, err := h.service.CreateRole(c.Request.Context(), cmd)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Created(c, dto)
}

// UpdateRole 更新角色
func (h *AdminHandler) UpdateRole(c *gin.Context) {
	roleID := c.Param("id")

	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	cmd := admin.UpdateRoleCmd{
		RoleID:      roleID,
		Name:        req.Name,
		Description: req.Description,
	}

	dto, err := h.service.UpdateRole(c.Request.Context(), cmd)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, dto)
}

// DeleteRole 删除角色
func (h *AdminHandler) DeleteRole(c *gin.Context) {
	roleID := c.Param("id")

	if err := h.service.DeleteRole(c.Request.Context(), roleID); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{"message": "Role deleted"})
}

// ToggleRoleStatus 切换角色状态
func (h *AdminHandler) ToggleRoleStatus(c *gin.Context) {
	roleID := c.Param("id")

	if err := h.service.ToggleRoleStatus(c.Request.Context(), roleID); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{"message": "Status toggled"})
}

// ---- 权限管理 ----

// GetRolePermissions 获取角色权限
func (h *AdminHandler) GetRolePermissions(c *gin.Context) {
	roleID := c.Param("id")

	perms, err := h.service.GetRolePermissions(c.Request.Context(), roleID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, perms)
}

// UpdateRolePermissions 更新角色权限
func (h *AdminHandler) UpdateRolePermissions(c *gin.Context) {
	roleID := c.Param("id")

	var req struct {
		Permissions []string `json:"permissions" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, validationErr.FromGinError(err))
		return
	}

	if err := h.service.UpdateRolePermissions(c.Request.Context(), roleID, req.Permissions); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{"message": "Permissions updated"})
}

// GetCurrentUserPermissions 获取当前用户权限
func (h *AdminHandler) GetCurrentUserPermissions(c *gin.Context) {
	userID := c.GetString("user_id")

	perms, err := h.service.GetUserPermissions(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, perms)
}
