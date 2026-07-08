package http

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/shenfay/kiqi/internal/app/authentication"
	"github.com/shenfay/kiqi/internal/infra/authorize"
	"github.com/shenfay/kiqi/internal/transport/http/handlers"
	"github.com/shenfay/kiqi/internal/transport/http/middleware"
)

// Router 路由配置
type Router struct {
	engine              *gin.Engine
	authHandler         *handlers.AuthHandler
	adminHandler        *handlers.AdminHandler
	operationLogHandler *handlers.OperationLogHandler
	tokenService        authentication.TokenService
	enforcer            *authorize.Enforcer
}

// NewRouter 创建路由器
func NewRouter(
	engine *gin.Engine,
	authHandler *handlers.AuthHandler,
	adminHandler *handlers.AdminHandler,
	operationLogHandler *handlers.OperationLogHandler,
	tokenService authentication.TokenService,
	enforcer *authorize.Enforcer,
) *Router {
	return &Router{
		engine:              engine,
		authHandler:         authHandler,
		adminHandler:        adminHandler,
		operationLogHandler: operationLogHandler,
		tokenService:        tokenService,
		enforcer:            enforcer,
	}
}

// Setup 配置所有路由
func (r *Router) Setup() {
	// 注册全局中间件（顺序很重要！）
	r.engine.Use(middleware.TraceID())       // 1. 生成 trace_id
	r.engine.Use(middleware.ErrorHandling()) // 2. 错误处理

	// 健康检查
	r.engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	// Prometheus 指标端点
	r.engine.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API v1 路由组
	v1 := r.engine.Group("/api/v1")
	{
		r.setupAuthRoutes(v1)
		r.setupUserRoutes(v1)
		r.setupAdminRoutes(v1)
		r.setupOperationLogRoutes(v1)
	}

	// 注册 Swagger UI 路由（开发环境）
	middleware.RegisterSwagger(r.engine, middleware.DefaultSwaggerConfig())
}

// setupAuthRoutes 配置认证相关路由
func (r *Router) setupAuthRoutes(v1 *gin.RouterGroup) {
	auth := v1.Group("/auth")
	{
		// 公开路由
		auth.POST("/register", r.authHandler.Register)
		auth.POST("/login", middleware.LoginRateLimit(), r.authHandler.Login)
		auth.POST("/logout", r.authHandler.Logout)
		auth.POST("/refresh", r.authHandler.RefreshToken)

		// 需要认证的路由
		authMiddleware := middleware.JWTAuthMiddleware(middleware.JWTAuthConfig{
			TokenService: r.tokenService,
		})
		auth.GET("/me", authMiddleware, r.authHandler.GetCurrentUser)
		auth.GET("/devices", authMiddleware, r.authHandler.GetUserDevices)
		auth.DELETE("/devices/:token", authMiddleware, r.authHandler.RevokeDevice)
		auth.POST("/logout-all", authMiddleware, r.authHandler.LogoutAllDevices)
	}
}

// setupUserRoutes 配置用户相关路由
func (r *Router) setupUserRoutes(v1 *gin.RouterGroup) {
	users := v1.Group("/users")
	users.Use(middleware.JWTAuthMiddleware(middleware.JWTAuthConfig{
		TokenService: r.tokenService,
	}))
	{
		users.GET("/:id", r.authHandler.GetUserByID)
	}
}

// setupAdminRoutes 配置管理员路由组
func (r *Router) setupAdminRoutes(v1 *gin.RouterGroup) {
	authMiddleware := middleware.JWTAuthMiddleware(middleware.JWTAuthConfig{
		TokenService: r.tokenService,
	})
	permMiddleware := middleware.PermissionMiddleware(r.enforcer)

	adminGroup := v1.Group("/admin")
	adminGroup.Use(authMiddleware, permMiddleware)
	{
		// 用户管理
		adminGroup.GET("/users", r.adminHandler.ListUsers)
		adminGroup.POST("/users", r.adminHandler.CreateUser)
		adminGroup.PUT("/users/:id", r.adminHandler.UpdateUser)
		adminGroup.PATCH("/users/:id/status", r.adminHandler.ToggleUserStatus)

		// 角色管理
		adminGroup.GET("/roles", r.adminHandler.ListRoles)
		adminGroup.POST("/roles", r.adminHandler.CreateRole)
		adminGroup.PUT("/roles/:id", r.adminHandler.UpdateRole)
		adminGroup.DELETE("/roles/:id", r.adminHandler.DeleteRole)
		adminGroup.PATCH("/roles/:id/status", r.adminHandler.ToggleRoleStatus)

		// 权限管理
		adminGroup.GET("/roles/:id/permissions", r.adminHandler.GetRolePermissions)
		adminGroup.PUT("/roles/:id/permissions", r.adminHandler.UpdateRolePermissions)

		// 菜单管理
		adminGroup.GET("/menus", r.adminHandler.ListMenus)
		adminGroup.POST("/menus", r.adminHandler.CreateMenu)
		adminGroup.PUT("/menus/:id", r.adminHandler.UpdateMenu)
		adminGroup.DELETE("/menus/:id", r.adminHandler.DeleteMenu)
		adminGroup.PATCH("/menus/:id/status", r.adminHandler.ToggleMenuStatus)
		adminGroup.PUT("/menus/sort", r.adminHandler.UpdateMenuSort)
	}

	// 当前用户权限和菜单（放在 auth 组下，只需登录即可）
	auth := v1.Group("/auth")
	auth.Use(authMiddleware)
	{
		auth.GET("/permissions", r.adminHandler.GetCurrentUserPermissions)
		auth.GET("/menus", r.adminHandler.GetUserMenuTree)
	}
}

// setupOperationLogRoutes 配置操作日志路由（需要认证 + 管理员权限）
func (r *Router) setupOperationLogRoutes(v1 *gin.RouterGroup) {
	authMiddleware := middleware.JWTAuthMiddleware(middleware.JWTAuthConfig{
		TokenService: r.tokenService,
	})
	permMiddleware := middleware.PermissionMiddleware(r.enforcer)

	operationLogs := v1.Group("/operation-logs")
	operationLogs.Use(authMiddleware, permMiddleware)
	{
		r.operationLogHandler.RegisterRoutes(operationLogs)
	}
}
