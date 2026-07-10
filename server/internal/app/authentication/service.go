package authentication

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/shenfay/kiqi/internal/domain/rbac"
	"github.com/shenfay/kiqi/internal/domain/shared/events"
	"github.com/shenfay/kiqi/internal/domain/user"
	"github.com/shenfay/kiqi/internal/infra/authorize"
	authErr "github.com/shenfay/kiqi/pkg/errors/auth"
	userErr "github.com/shenfay/kiqi/pkg/errors/user"
	"github.com/shenfay/kiqi/pkg/logger"
	"github.com/shenfay/kiqi/pkg/metrics"
	"github.com/shenfay/kiqi/pkg/utils"
	"go.uber.org/zap"
)

// JWTClaims JWT 自定义声明
type JWTClaims struct {
	UserID    string `json:"user_id"`
	Email     string `json:"email"`
	TokenType string `json:"token_type"`
	jwt.RegisteredClaims
}

// TokenService Token 服务接口
type TokenService interface {
	GenerateTokens(ctx context.Context, userID, email string) (*TokenPair, error)
	RevokeToken(ctx context.Context, tokenID string) error
	ValidateRefreshTokenWithDevice(ctx context.Context, token string) (*DeviceInfo, error)
	ValidateAccessToken(tokenString string) (*JWTClaims, error)
	StoreDeviceInfo(ctx context.Context, token string, deviceInfo DeviceInfo) error
	LinkAccessToDevice(ctx context.Context, accessToken, deviceTokenID string) error
	GetCurrentDeviceTokenID(ctx context.Context, accessToken string) (string, error)
	RevokeDeviceByToken(ctx context.Context, token string) error
	RevokeAllDevices(ctx context.Context, userID string) error
	GetUserDevices(ctx context.Context, userID string) ([]DeviceInfo, error)
}

// TokenPair 访问令牌和刷新令牌对
type TokenPair struct {
	AccessToken  string
	RefreshToken string
	ExpiresIn    time.Duration
}

// DeviceInfo 设备会话信息
type DeviceInfo struct {
	TokenID    string `json:"token_id"`
	UserID     string `json:"user_id"`
	IP         string `json:"ip"`
	UserAgent  string `json:"user_agent"`
	DeviceType string `json:"device_type"`
	CreatedAt  string `json:"created_at"`
}

// Service 认证应用服务
type Service struct {
	userRepo     user.UserRepository
	roleRepo     rbac.RoleRepository
	menuRepo     rbac.MenuRepository
	tokenService TokenService
	eventBus     events.Bus
	metrics      *metrics.Metrics
	maxAttempts  int
	enforcer     *authorize.Enforcer
}

// NewService 创建认证服务实例
func NewService(userRepo user.UserRepository, roleRepo rbac.RoleRepository, menuRepo rbac.MenuRepository, tokenService TokenService, eventBus events.Bus, m *metrics.Metrics, enforcer *authorize.Enforcer) *Service {
	return &Service{
		userRepo:     userRepo,
		roleRepo:     roleRepo,
		menuRepo:     menuRepo,
		tokenService: tokenService,
		eventBus:     eventBus,
		metrics:      m,
		maxAttempts:  5,
		enforcer:     enforcer,
	}
}

// Register 创建用户账户并返回认证令牌
//
// 注册流程：
// 1. 验证邮箱唯一性
// 2. 创建用户实体（密码已加密）
// 3. 生成访问令牌和刷新令牌
// 4. 发布 UserRegistered 领域事件
//
// 参数：
//   - ctx: 请求上下文
//   - cmd: 注册命令（包含邮箱和密码）
//
// 返回：
//   - *ServiceAuthResponse: 用户数据和认证令牌
//   - error: 注册失败时返回错误（邮箱已存在、验证错误等）
func (s *Service) Register(ctx context.Context, cmd RegisterCommand) (*ServiceAuthResponse, error) {
	// 1. 检查邮箱是否已存在
	if s.userRepo.ExistsByEmail(ctx, cmd.Email) {
		return nil, userErr.ErrEmailAlreadyExists
	}

	// 2. 创建用户实体
	u, err := user.NewUser(cmd.Email, "", cmd.Password)
	if err != nil {
		return nil, err
	}

	if err := s.userRepo.Create(ctx, u); err != nil {
		return nil, err
	}

	// 记录用户注册指标
	if s.metrics != nil {
		s.metrics.IncUserRegistration()
	}

	// 3. 生成 Token
	tokens, err := s.tokenService.GenerateTokens(ctx, u.ID, u.Email)
	if err != nil {
		return nil, err
	}

	// 4. 记录操作日志
	s.recordOperation(ctx, "USER.REGISTER", "USER", "SUCCESS",
		u.ID, u.Email,
		map[string]interface{}{"email": u.Email},
	)

	return &ServiceAuthResponse{
		User:         u,
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		ExpiresIn:    tokens.ExpiresIn,
	}, nil
}

// Login 处理用户登录
func (s *Service) Login(ctx context.Context, cmd LoginCommand) (*ServiceAuthResponse, error) {
	// 1. 查找用户
	u, err := s.userRepo.FindByEmail(ctx, cmd.Email)
	if err != nil {
		return nil, authErr.ErrInvalidCredentials
	}

	// 2. 检查账户是否被锁定
	if u.IsLocked() {
		return nil, authErr.ErrAccountLocked
	}

	// 3. 验证密码
	if !u.VerifyPassword(cmd.Password) {
		u.IncrementFailedAttempts(s.maxAttempts)
		s.userRepo.Update(ctx, u)

		// 记录认证失败指标
		if s.metrics != nil {
			if u.IsLocked() {
				s.metrics.IncAuthFailure("password", "account_locked")
			} else {
				s.metrics.IncAuthFailure("password", "invalid_credentials")
			}
		}

		if u.IsLocked() {
			return nil, authErr.ErrAccountLocked
		}

		return nil, authErr.ErrInvalidCredentials
	}

	// 4. 重置失败次数，更新最后登录时间
	u.ResetFailedAttempts()
	u.UpdateLastLogin()
	if err := s.userRepo.Update(ctx, u); err != nil {
		return nil, err
	}

	// 5. 生成 Token
	tokens, err := s.tokenService.GenerateTokens(ctx, u.ID, u.Email)
	if err != nil {
		return nil, err
	}

	// 记录认证成功指标
	if s.metrics != nil {
		s.metrics.IncAuthSuccess("password")
	}

	// 6. 存储设备信息到 Redis
	if err := s.tokenService.StoreDeviceInfo(ctx, tokens.RefreshToken, DeviceInfo{
		TokenID:    tokens.RefreshToken,
		UserID:     u.ID,
		IP:         cmd.IP,
		UserAgent:  cmd.UserAgent,
		DeviceType: cmd.DeviceType,
	}); err != nil {
		// 设备信息存储失败不影响登录流程，仅记录警告
		// 日志已在 StoreDeviceInfo 内部处理
	}

	// 6.1 建立 access_token → device_token 映射，用于标识当前设备
	s.tokenService.LinkAccessToDevice(ctx, tokens.AccessToken, tokens.RefreshToken)

	// 7. 记录操作日志
	s.recordOperation(ctx, "AUTH.LOGIN.SUCCESS", "AUTH", "SUCCESS",
		u.ID, u.Email,
		nil,
	)

	// 8. 查询用户权限（通过 Casbin）
	var permissions *rbac.UserPermission
	if s.enforcer != nil {
		// 查询用户角色
		roles, _ := s.roleRepo.FindByUserID(ctx, u.ID)
		roleBriefs := make([]rbac.RoleBrief, 0, len(roles))
		for _, role := range roles {
			roleBriefs = append(roleBriefs, rbac.RoleBrief{
				ID:   role.ID,
				Name: role.Name,
				Code: role.Code,
			})
		}

		// 从 Casbin 查询权限
		perms, _ := s.enforcer.GetPermissionsForUser(u.ID)
		if perms == nil {
			perms = []string{}
		}

		// 从数据库查询所有菜单，动态推导菜单
		allMenus, _ := s.menuRepo.FindAll(ctx)
		menus := rbac.DeriveMenusFromMenus(perms, allMenus)

		permissions = &rbac.UserPermission{
			Roles:       roleBriefs,
			Permissions: perms,
			Menus:       menus,
		}
	}

	return &ServiceAuthResponse{
		User:         u,
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		ExpiresIn:    tokens.ExpiresIn,
		Permissions:  permissions,
	}, nil
}

// Logout 处理用户退出
func (s *Service) Logout(ctx context.Context, cmd LogoutCommand) error {
	// 1. 撤销 Refresh Token
	if err := s.tokenService.RevokeToken(ctx, cmd.UserID); err != nil {
		return err
	}

	// 2. 记录操作日志
	u, err := s.userRepo.FindByID(ctx, cmd.UserID)
	if err == nil {
		s.recordOperation(ctx, "AUTH.LOGOUT", "AUTH", "SUCCESS",
			u.ID, u.Email,
			nil,
		)
	}

	return nil
}

// RefreshToken 刷新 Access Token
func (s *Service) RefreshToken(ctx context.Context, cmd RefreshTokenCommand) (*ServiceAuthResponse, error) {
	// 1. 验证并解析 Refresh Token
	deviceInfo, err := s.tokenService.ValidateRefreshTokenWithDevice(ctx, cmd.RefreshToken)
	if err != nil {
		return nil, err
	}

	// 2. 查找用户
	u, err := s.userRepo.FindByID(ctx, deviceInfo.UserID)
	if err != nil {
		return nil, userErr.ErrNotFound
	}

	// 3. 撤销旧的 Refresh Token
	if err := s.tokenService.RevokeDeviceByToken(ctx, cmd.RefreshToken); err != nil {
		return nil, err
	}

	// 4. 生成新的 Token 对
	tokens, err := s.tokenService.GenerateTokens(ctx, u.ID, u.Email)
	if err != nil {
		return nil, err
	}

	// 5. 存储新设备信息
	if err := s.tokenService.StoreDeviceInfo(ctx, tokens.RefreshToken, DeviceInfo{
		TokenID:    tokens.RefreshToken,
		UserID:     u.ID,
		IP:         deviceInfo.IP,
		UserAgent:  deviceInfo.UserAgent,
		DeviceType: deviceInfo.DeviceType,
	}); err != nil {
		return nil, err
	}

	// 5.1 建立 access_token → device_token 映射
	s.tokenService.LinkAccessToDevice(ctx, tokens.AccessToken, tokens.RefreshToken)

	// 6. 更新最后登录时间
	u.UpdateLastLogin()
	if err := s.userRepo.Update(ctx, u); err != nil {
		return nil, err
	}

	// 7. 记录操作日志（已脱敏，不记录 token 明文）
	s.recordOperation(ctx, "AUTH.TOKEN.REFRESHED", "AUTH", "SUCCESS",
		u.ID, u.Email,
		nil,
	)

	return &ServiceAuthResponse{
		User:         u,
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		ExpiresIn:    tokens.ExpiresIn,
	}, nil
}

// GetUserByID 根据 ID 获取用户
func (s *Service) GetUserByID(ctx context.Context, userID string) (*user.User, error) {
	return s.userRepo.FindByID(ctx, userID)
}

// recordOperation 统一操作日志记录方法
// 发布 OperationEvent 到事件总线，通过 Bridge → Asynq → Worker 异步写入数据库
// userID/email 由调用方显式传入（认证场景用户信息尚未在 context 中），
// 请求元数据（IP/UA/设备）从 context 自动提取
// 日志记录失败不影响主流程，仅输出 warn 级别日志
func (s *Service) recordOperation(ctx context.Context, action, category, status string, userID, email string, metadata map[string]interface{}) {
	if s.eventBus == nil {
		return
	}
	ip := utils.GetRequestIP(ctx)
	userAgent := utils.GetRequestUserAgent(ctx)
	device := utils.GetRequestDevice(ctx)
	browser := utils.GetRequestBrowser(ctx)
	os := utils.GetRequestOS(ctx)

	evt := events.NewOperationEvent(action, category, status).
		WithUser(userID, email).
		WithRequestInfo(ip, userAgent, device, browser, os).
		WithMetadata(metadata)
	if err := s.eventBus.Publish(ctx, evt); err != nil {
		logger.Warn("Failed to record operation log",
			zap.String("action", action),
			zap.String("user_id", userID),
			zap.Error(err),
		)
	}
}
