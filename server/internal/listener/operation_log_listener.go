package listener

import (
	"context"

	"github.com/shenfay/kiqi/internal/domain/shared/events"
	"github.com/shenfay/kiqi/internal/domain/user"
	"github.com/shenfay/kiqi/internal/infra/repository"
	"github.com/shenfay/kiqi/pkg/utils"
)

// eventCategoryMap 事件类型到分类的映射
var eventCategoryMap = map[string]string{
	"user.logged_in":       "AUTH",
	"user.login_failed":    "AUTH",
	"user.account_locked":  "AUTH",
	"user.logged_out":      "AUTH",
	"user.token_refreshed": "AUTH",
	"user.registered":      "USER",
	"user.profile_updated": "USER",
}

// eventActionMap 事件类型到 action 的映射
var eventActionMap = map[string]string{
	"user.logged_in":       "AUTH.LOGIN.SUCCESS",
	"user.login_failed":    "AUTH.LOGIN.FAILED",
	"user.account_locked":  "AUTH.ACCOUNT.LOCKED",
	"user.logged_out":      "AUTH.LOGOUT",
	"user.token_refreshed": "AUTH.TOKEN.REFRESHED",
	"user.registered":      "USER.REGISTER",
	"user.profile_updated": "USER.PROFILE.UPDATED",
}

// eventStatusMap 事件类型到状态的映射
var eventStatusMap = map[string]string{
	"user.login_failed":   "FAILED",
	"user.account_locked": "FAILED",
}

// OperationLogListener 统一操作日志事件监听器
// 替代原 AuditLogListener 和 ActivityLogListener，统一处理所有操作日志
type OperationLogListener struct {
	repo repository.OperationLogRepository
}

// NewOperationLogListener 创建操作日志监听器实例
func NewOperationLogListener(repo repository.OperationLogRepository) *OperationLogListener {
	return &OperationLogListener{repo: repo}
}

// getCategory 获取事件分类
func (l *OperationLogListener) getCategory(eventName string) string {
	if category, ok := eventCategoryMap[eventName]; ok {
		return category
	}
	return "BIZ" // 默认为业务分类
}

// getAction 获取事件 action
func (l *OperationLogListener) getAction(eventName string) string {
	if action, ok := eventActionMap[eventName]; ok {
		return action
	}
	return eventName // 如果没有映射，使用事件名本身
}

// getStatus 获取事件状态
func (l *OperationLogListener) getStatus(eventName string) string {
	if status, ok := eventStatusMap[eventName]; ok {
		return status
	}
	return "SUCCESS"
}

// HandleUserRegistered 处理用户注册事件
func (l *OperationLogListener) HandleUserRegistered(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.UserRegistered)
	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Email:    e.Email,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		Metadata: map[string]interface{}{
			"email":     e.Email,
			"timestamp": e.Timestamp,
		},
	})
}

// HandleUserLoggedIn 处理用户登录成功事件
func (l *OperationLogListener) HandleUserLoggedIn(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.UserLoggedIn)
	uaInfo := utils.ParseUserAgent(e.UserAgent)

	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:    e.UserID,
		Email:     e.Email,
		Action:    l.getAction(e.EventName()),
		Category:  l.getCategory(e.EventName()),
		Status:    l.getStatus(e.EventName()),
		IP:        e.IP,
		UserAgent: e.UserAgent,
		Device:    uaInfo.Device,
		Browser:   uaInfo.Browser,
		OS:        uaInfo.OS,
		Metadata: map[string]interface{}{
			"email":      e.Email,
			"ip":         e.IP,
			"user_agent": e.UserAgent,
			"device":     uaInfo.Device,
			"browser":    uaInfo.Browser,
			"os":         uaInfo.OS,
			"timestamp":  e.Timestamp,
		},
	})
}

// HandleLoginFailed 处理用户登录失败事件
func (l *OperationLogListener) HandleLoginFailed(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.LoginFailed)

	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Email:    e.Email,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		IP:       e.IP,
		Metadata: map[string]interface{}{
			"email":     e.Email,
			"ip":        e.IP,
			"reason":    e.Reason,
			"timestamp": e.Timestamp,
		},
	})
}

// HandleAccountLocked 处理账户锁定事件
func (l *OperationLogListener) HandleAccountLocked(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.AccountLocked)

	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Email:    e.Email,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		Metadata: map[string]interface{}{
			"email":           e.Email,
			"failed_attempts": e.FailedAttempts,
			"locked_until":    e.LockedUntil,
			"timestamp":       e.Timestamp,
		},
	})
}

// HandleUserLoggedOut 处理用户登出事件
func (l *OperationLogListener) HandleUserLoggedOut(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.UserLoggedOut)
	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Email:    e.Email,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		Metadata: map[string]interface{}{
			"email":     e.Email,
			"timestamp": e.Timestamp,
		},
	})
}

// HandleTokenRefreshed 处理Token刷新事件（已脱敏，不记录 token 明文）
func (l *OperationLogListener) HandleTokenRefreshed(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.TokenRefreshed)
	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		Metadata: map[string]interface{}{
			"timestamp": e.Timestamp,
		},
	})
}

// HandleUserProfileUpdated 处理用户资料更新事件
func (l *OperationLogListener) HandleUserProfileUpdated(ctx context.Context, evt events.DomainEvent) error {
	e := evt.(*user.UserProfileUpdated)
	return l.repo.Save(ctx, &repository.OperationLog{
		UserID:   e.UserID,
		Email:    e.Email,
		Action:   l.getAction(e.EventName()),
		Category: l.getCategory(e.EventName()),
		Status:   l.getStatus(e.EventName()),
		Metadata: map[string]interface{}{
			"email":     e.Email,
			"timestamp": e.Timestamp,
		},
	})
}
