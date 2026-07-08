package repository

import (
	"context"
	"time"

	"github.com/shenfay/kiqi/pkg/utils"
	"gorm.io/gorm"
)

// OperationLog 统一操作日志实体
// 合并原 AuditLog（安全审计）与 ActivityLog（业务活动）
type OperationLog struct {
	ID        string                 `json:"id" gorm:"primaryKey"`
	UserID    string                 `json:"user_id" gorm:"not null;index:idx_user_id"`
	Email     string                 `json:"email" gorm:"index:idx_email"`
	Action    string                 `json:"action" gorm:"not null;index:idx_action"`     // AUTH.LOGIN.SUCCESS / USER.PROFILE.UPDATED / ...
	Category  string                 `json:"category" gorm:"not null;index:idx_category"` // AUTH / USER / SYSTEM / BIZ
	Status    string                 `json:"status" gorm:"not null;index:idx_status"`     // SUCCESS / FAILED
	IP        string                 `json:"ip" gorm:"size:45"`
	UserAgent string                 `json:"user_agent" gorm:"size:500"`
	Device    string                 `json:"device" gorm:"size:100"`
	Browser   string                 `json:"browser" gorm:"size:50"`
	OS        string                 `json:"os" gorm:"size:50"`
	Metadata  map[string]interface{} `json:"metadata" gorm:"type:jsonb;default:'{}'::jsonb;serializer:json"`
	CreatedAt time.Time              `json:"created_at" gorm:"not null;index:idx_created_at"`
}

// TableName 指定表名
func (OperationLog) TableName() string {
	return "operation_logs"
}

// OperationLogRepository 操作日志仓储接口
type OperationLogRepository interface {
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

// operationLogRepository GORM 实现
type operationLogRepository struct {
	db *gorm.DB
}

// NewOperationLogRepository 创建操作日志仓储
func NewOperationLogRepository(db *gorm.DB) OperationLogRepository {
	return &operationLogRepository{db: db}
}

// Save 保存操作日志
func (r *operationLogRepository) Save(ctx context.Context, log *OperationLog) error {
	if log.ID == "" {
		log.ID = utils.GenerateID()
	}

	return r.db.WithContext(ctx).Create(log).Error
}

// FindByUserID 根据用户 ID 查找日志
func (r *operationLogRepository) FindByUserID(ctx context.Context, userID string, limit int, offset int) ([]*OperationLog, error) {
	var logs []*OperationLog

	query := r.db.WithContext(ctx).Model(&OperationLog{})
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	return logs, err
}

// FindByCategory 根据分类查找日志
func (r *operationLogRepository) FindByCategory(ctx context.Context, category string, limit int, offset int) ([]*OperationLog, error) {
	var logs []*OperationLog

	err := r.db.WithContext(ctx).
		Where("category = ?", category).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	return logs, err
}

// FindByAction 根据操作类型查找日志
func (r *operationLogRepository) FindByAction(ctx context.Context, action string, limit int, offset int) ([]*OperationLog, error) {
	var logs []*OperationLog

	err := r.db.WithContext(ctx).
		Where("action = ?", action).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	return logs, err
}

// FindAll 查找所有日志（支持分页）
func (r *operationLogRepository) FindAll(ctx context.Context, limit int, offset int) ([]*OperationLog, error) {
	var logs []*OperationLog

	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	return logs, err
}
