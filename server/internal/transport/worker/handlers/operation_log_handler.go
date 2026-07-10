package handlers

import (
	"context"
	"encoding/json"

	"github.com/hibiken/asynq"
	"github.com/shenfay/kiqi/internal/domain/operation"
	"github.com/shenfay/kiqi/pkg/logger"
	"github.com/shenfay/kiqi/pkg/utils"
	"go.uber.org/zap"
)

// OperationLogHandler 统一操作日志 Worker 处理器
type OperationLogHandler struct {
	repo operation.LogRepository
}

// NewOperationLogHandler 创建操作日志处理器
func NewOperationLogHandler(repo operation.LogRepository) *OperationLogHandler {
	return &OperationLogHandler{repo: repo}
}

// ProcessTask 处理操作日志任务
func (h *OperationLogHandler) ProcessTask(ctx context.Context, task *asynq.Task) error {
	return h.processOperationLog(ctx, task)
}

// processOperationLog 处理统一操作日志
func (h *OperationLogHandler) processOperationLog(ctx context.Context, task *asynq.Task) error {
	var payload map[string]interface{}
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		logger.Error("Failed to unmarshal operation log payload", zap.Error(err))
		return err
	}

	log := &operation.OperationLog{
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
