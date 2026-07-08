package operation

import "context"

// LogRepository 操作日志仓储接口
type LogRepository interface {
	// Save 保存操作日志
	Save(ctx context.Context, log *OperationLog) error

	// FindByUserID 根据用户 ID 查找日志
	FindByUserID(ctx context.Context, userID string, limit int, offset int) ([]*OperationLog, error)

	// FindByCategory 根据分类查找日志
	FindByCategory(ctx context.Context, category string, limit int, offset int) ([]*OperationLog, error)

	// FindByAction 根据操作类型查找日志
	FindByAction(ctx context.Context, action string, limit int, offset int) ([]*OperationLog, error)

	// FindAll 查找所有日志（支持分页）
	FindAll(ctx context.Context, limit int, offset int) ([]*OperationLog, error)
}
