package user

import (
	"context"
	"time"

	"github.com/shenfay/kiqi/internal/domain/shared/events"
	"github.com/shenfay/kiqi/internal/domain/user"
	"github.com/shenfay/kiqi/pkg/logger"
	"go.uber.org/zap"
)

// CreateUserCommand 创建用户命令
type CreateUserCommand struct {
	Email    string
	Name     string
	Password string
}

// UpdateProfileCommand 更新资料命令
type UpdateProfileCommand struct {
	UserID string
	Email  string
}

// UserDTO 用户数据传输对象
type UserDTO struct {
	ID            string     `json:"id"`
	Email         string     `json:"email"`
	Name          string     `json:"name"`
	EmailVerified bool       `json:"email_verified"`
	Locked        bool       `json:"locked"`
	LastLoginAt   *time.Time `json:"last_login_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// Service 用户应用服务
type Service struct {
	userRepo user.UserRepository
	eventBus events.Bus
}

// NewService 创建用户应用服务
func NewService(userRepo user.UserRepository, eventBus events.Bus) *Service {
	return &Service{
		userRepo: userRepo,
		eventBus: eventBus,
	}
}

// CreateUser 创建用户
func (s *Service) CreateUser(ctx context.Context, cmd CreateUserCommand) (*UserDTO, error) {
	// 1. 创建领域实体
	u, err := user.NewUser(cmd.Email, cmd.Name, cmd.Password)
	if err != nil {
		return nil, err
	}

	// 2. 持久化
	if err := s.userRepo.Save(ctx, u); err != nil {
		return nil, err
	}

	// 3. 记录操作日志
	s.recordOperation(ctx, "USER.REGISTER", "USER", "SUCCESS",
		u.ID, u.Email, "", "", "", "", "",
		map[string]interface{}{"email": u.Email},
	)

	// 4. 返回DTO
	return toUserDTO(u), nil
}

// GetUserByID 根据ID获取用户
func (s *Service) GetUserByID(ctx context.Context, userID string) (*UserDTO, error) {
	u, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return toUserDTO(u), nil
}

// UpdateProfile 更新用户资料
func (s *Service) UpdateProfile(ctx context.Context, cmd UpdateProfileCommand) (*UserDTO, error) {
	// 1. 加载聚合根
	u, err := s.userRepo.FindByID(ctx, cmd.UserID)
	if err != nil {
		return nil, err
	}

	// 2. 更新资料
	if err := u.UpdateEmail(cmd.Email); err != nil {
		return nil, err
	}

	// 3. 持久化
	if err := s.userRepo.Save(ctx, u); err != nil {
		return nil, err
	}

	// 4. 记录操作日志
	s.recordOperation(ctx, "USER.PROFILE.UPDATED", "USER", "SUCCESS",
		u.ID, u.Email, "", "", "", "", "",
		map[string]interface{}{"email": u.Email},
	)

	return toUserDTO(u), nil
}

// toUserDTO 实体转DTO
func toUserDTO(u *user.User) *UserDTO {
	return &UserDTO{
		ID:            u.ID,
		Email:         u.Email,
		Name:          u.Name,
		EmailVerified: u.EmailVerified,
		Locked:        u.Locked,
		LastLoginAt:   u.LastLoginAt,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
	}
}

// recordOperation 统一操作日志记录方法
// 发布 OperationEvent 到事件总线，通过 Bridge → Asynq → Worker 异步写入数据库
// 日志记录失败不影响主流程，仅输出 warn 级别日志
func (s *Service) recordOperation(ctx context.Context, action, category, status string, userID, email, ip, userAgent, device, browser, os string, metadata map[string]interface{}) {
	if s.eventBus == nil {
		return
	}
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
