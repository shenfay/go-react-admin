package repository

import (
	"context"
	"time"

	"github.com/shenfay/kiqi/internal/domain/operation"
	"github.com/shenfay/kiqi/pkg/utils"
	"gorm.io/gorm"
)

// operationLogPO GORM 持久化对象
type operationLogPO struct {
	ID        string                 `json:"id" gorm:"primaryKey"`
	UserID    string                 `json:"user_id" gorm:"not null;index:idx_user_id"`
	Email     string                 `json:"email" gorm:"index:idx_email"`
	Action    string                 `json:"action" gorm:"not null;index:idx_action"`
	Category  string                 `json:"category" gorm:"not null;index:idx_category"`
	Status    string                 `json:"status" gorm:"not null;index:idx_status"`
	IP        string                 `json:"ip" gorm:"size:45"`
	UserAgent string                 `json:"user_agent" gorm:"size:500"`
	Device    string                 `json:"device" gorm:"size:100"`
	Browser   string                 `json:"browser" gorm:"size:50"`
	OS        string                 `json:"os" gorm:"size:50"`
	Metadata  map[string]interface{} `json:"metadata" gorm:"type:jsonb;default:'{}'::jsonb;serializer:json"`
	CreatedAt time.Time              `json:"created_at" gorm:"not null;index:idx_created_at"`
}

// TableName 指定表名
func (operationLogPO) TableName() string {
	return "operation_logs"
}

// toDomain 将持久化对象转换为领域模型
func (po *operationLogPO) toDomain() *operation.OperationLog {
	return &operation.OperationLog{
		ID:        po.ID,
		UserID:    po.UserID,
		Email:     po.Email,
		Action:    po.Action,
		Category:  po.Category,
		Status:    po.Status,
		IP:        po.IP,
		UserAgent: po.UserAgent,
		Device:    po.Device,
		Browser:   po.Browser,
		OS:        po.OS,
		Metadata:  po.Metadata,
		CreatedAt: po.CreatedAt,
	}
}

// fromDomain 将领域模型转换为持久化对象
func fromDomain(log *operation.OperationLog) *operationLogPO {
	return &operationLogPO{
		ID:        log.ID,
		UserID:    log.UserID,
		Email:     log.Email,
		Action:    log.Action,
		Category:  log.Category,
		Status:    log.Status,
		IP:        log.IP,
		UserAgent: log.UserAgent,
		Device:    log.Device,
		Browser:   log.Browser,
		OS:        log.OS,
		Metadata:  log.Metadata,
		CreatedAt: log.CreatedAt,
	}
}

// operationLogRepository GORM 实现
type operationLogRepository struct {
	db *gorm.DB
}

// NewOperationLogRepository 创建操作日志仓储
func NewOperationLogRepository(db *gorm.DB) operation.LogRepository {
	return &operationLogRepository{db: db}
}

// Save 保存操作日志
func (r *operationLogRepository) Save(ctx context.Context, log *operation.OperationLog) error {
	if log.ID == "" {
		log.ID = utils.GenerateID()
	}

	return r.db.WithContext(ctx).Create(fromDomain(log)).Error
}

// FindByUserID 根据用户 ID 查找日志
func (r *operationLogRepository) FindByUserID(ctx context.Context, userID string, limit int, offset int) ([]*operation.OperationLog, error) {
	var pos []*operationLogPO

	query := r.db.WithContext(ctx).Model(&operationLogPO{})
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&pos).Error

	return toDomainList(pos), err
}

// FindByCategory 根据分类查找日志
func (r *operationLogRepository) FindByCategory(ctx context.Context, category string, limit int, offset int) ([]*operation.OperationLog, error) {
	var pos []*operationLogPO

	err := r.db.WithContext(ctx).
		Where("category = ?", category).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&pos).Error

	return toDomainList(pos), err
}

// FindByAction 根据操作类型查找日志
func (r *operationLogRepository) FindByAction(ctx context.Context, action string, limit int, offset int) ([]*operation.OperationLog, error) {
	var pos []*operationLogPO

	err := r.db.WithContext(ctx).
		Where("action = ?", action).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&pos).Error

	return toDomainList(pos), err
}

// FindAll 查找所有日志（支持分页）
func (r *operationLogRepository) FindAll(ctx context.Context, limit int, offset int) ([]*operation.OperationLog, error) {
	var pos []*operationLogPO

	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&pos).Error

	return toDomainList(pos), err
}

// Count 统计日志总数（支持按 category/action/userID 筛选）
func (r *operationLogRepository) Count(ctx context.Context, category, action, userID string) (int64, error) {
	query := r.db.WithContext(ctx).Model(&operationLogPO{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	if action != "" {
		query = query.Where("action = ?", action)
	}
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	var count int64
	err := query.Count(&count).Error
	return count, err
}

// toDomainList 批量转换持久化对象为领域模型
func toDomainList(pos []*operationLogPO) []*operation.OperationLog {
	result := make([]*operation.OperationLog, len(pos))
	for i, po := range pos {
		result[i] = po.toDomain()
	}
	return result
}
