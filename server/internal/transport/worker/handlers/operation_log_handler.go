package handlers

import (
	"context"
	"encoding/json"

	"github.com/hibiken/asynq"
	"github.com/shenfay/kiqi/internal/infra/repository"
	"github.com/shenfay/kiqi/pkg/constants"
	"github.com/shenfay/kiqi/pkg/logger"
	"github.com/shenfay/kiqi/pkg/utils"
	"go.uber.org/zap"
)

// OperationLogHandler 统一操作日志 Worker 处理器
type OperationLogHandler struct {
	repo repository.OperationLogRepository
}

// NewOperationLogHandler 创建操作日志处理器
func NewOperationLogHandler(repo repository.OperationLogRepository) *OperationLogHandler {
	return &OperationLogHandler{repo: repo}
}

// ProcessTask 处理操作日志任务
func (h *OperationLogHandler) ProcessTask(ctx context.Context, task *asynq.Task) error {
	// 根据任务类型分发处理
	switch task.Type() {
	case string(constants.AsynqTaskOperationLog), string(constants.EventOperationLog):
		return h.processOperationLog(ctx, task)
	default:
		// 兼容旧的事件类型（user.registered, user.logged_in 等）
		return h.processDomainEvent(ctx, task)
	}
}

// processOperationLog 处理统一操作日志
func (h *OperationLogHandler) processOperationLog(ctx context.Context, task *asynq.Task) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		logger.Error("Failed to unmarshal operation log payload", zap.Error(err))
		return err
	}

	log := &repository.OperationLog{
		UserID:    utils.ToString(payload["user_id"]),
		Email:     utils.ToString(payload["email"]),
		Action:    utils.ToString(payload["action"]),
		Category:  utils.ToString(payload["category"]),
		Status:    utils.ToString(payload["status"]),
		IP:        utils.ToString(payload["ip"]),
		UserAgent: utils.ToString(payload["user_agent"]),
		Device:    utils.ToString(payload["device"]),
		Browser:   utils.ToString(payload["browser"]),
		OS:        utils.ToString(payload["os"]),
	}

	// metadata 字段单独处理
	if metadata, ok := payload["metadata"].(map[string]interface{}); ok {
		log.Metadata = metadata
	}

	if err := h.repo.Save(ctx, log); err != nil {
		logger.Error("Failed to save operation log",
			zap.String("action", log.Action),
			zap.Error(err),
		)
		return err
	}

	logger.Debug("Operation log saved",
		zap.String("action", log.Action),
		zap.String("user_id", log.UserID),
	)
	return nil
}

// processDomainEvent 处理领域事件（兼容旧格式）
// 将领域事件转换为统一操作日志
func (h *OperationLogHandler) processDomainEvent(ctx context.Context, task *asynq.Task) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		logger.Error("Failed to unmarshal domain event payload", zap.Error(err))
		return err
	}

	// 从事件类型映射到 action 和 category
	eventType := task.Type()
	action, category, status := mapEventToActionCategoryStatus(eventType)

	log := &repository.OperationLog{
		UserID:    utils.ToString(payload["user_id"]),
		Email:     utils.ToString(payload["email"]),
		Action:    action,
		Category:  category,
		Status:    status,
		IP:        utils.ToString(payload["ip"]),
		UserAgent: utils.ToString(payload["user_agent"]),
		Device:    utils.ToString(payload["device"]),
		Browser:   utils.ToString(payload["browser"]),
		OS:        utils.ToString(payload["os"]),
		Metadata:  payload,
	}

	if err := h.repo.Save(ctx, log); err != nil {
		logger.Error("Failed to save operation log from domain event",
			zap.String("action", action),
			zap.Error(err),
		)
		return err
	}

	logger.Debug("Operation log saved from domain event",
		zap.String("action", action),
		zap.String("user_id", log.UserID),
	)
	return nil
}

// mapEventToActionCategoryStatus 将事件类型映射到 action、category 和 status
func mapEventToActionCategoryStatus(eventType string) (action, category, status string) {
	switch eventType {
	case string(constants.EventUserRegistered):
		return "USER.REGISTER", "USER", "SUCCESS"
	case string(constants.EventUserLoggedIn):
		return "AUTH.LOGIN.SUCCESS", "AUTH", "SUCCESS"
	case string(constants.EventUserLoginFailed):
		return "AUTH.LOGIN.FAILED", "AUTH", "FAILED"
	case string(constants.EventUserAccountLocked):
		return "AUTH.ACCOUNT.LOCKED", "AUTH", "FAILED"
	case string(constants.EventUserLoggedOut):
		return "AUTH.LOGOUT", "AUTH", "SUCCESS"
	case string(constants.EventUserTokenRefreshed):
		return "AUTH.TOKEN.REFRESHED", "AUTH", "SUCCESS"
	case string(constants.EventUserProfileUpdated):
		return "USER.PROFILE.UPDATED", "USER", "SUCCESS"
	default:
		return eventType, "BIZ", "SUCCESS"
	}
}
