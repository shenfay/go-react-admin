package repository

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/shenfay/kiqi/internal/domain/user"
	userErr "github.com/shenfay/kiqi/pkg/errors/user"
	"github.com/shenfay/kiqi/pkg/utils"
)

// UserPO 用户持久化对象
type UserPO struct {
	ID             string    `gorm:"primaryKey;type:varchar(50)" json:"id"`
	Email          string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"email"`
	Name           string    `gorm:"type:varchar(100);default:''" json:"name"`
	Password       string    `gorm:"type:varchar(255);not null" json:"-"`
	EmailVerified  bool      `gorm:"default:false" json:"email_verified"`
	Locked         bool      `gorm:"default:false" json:"locked"`
	FailedAttempts int       `gorm:"default:0" json:"failed_attempts"`
	LastLoginAt    *TimeNull `json:"last_login_at"`
	CreatedAt      TimeNull  `json:"created_at"`
	UpdatedAt      TimeNull  `json:"updated_at"`
}

// TableName 指定表名为 users
func (UserPO) TableName() string {
	return "users"
}

// TimeNull 可空的时间类型
type TimeNull struct {
	Time  time.Time
	Valid bool
}

// Value 实现 driver.Valuer 接口
func (t TimeNull) Value() (driver.Value, error) {
	if !t.Valid {
		return nil, nil
	}
	return t.Time, nil
}

// Scan 实现 sql.Scanner 接口
func (t *TimeNull) Scan(value interface{}) error {
	if value == nil {
		t.Time = time.Time{}
		t.Valid = false
		return nil
	}

	switch v := value.(type) {
	case time.Time:
		t.Time = v
		t.Valid = true
		return nil
	default:
		return fmt.Errorf("failed to scan TimeNull: %v", value)
	}
}

// MarshalJSON 实现 JSON 序列化
func (t TimeNull) MarshalJSON() ([]byte, error) {
	if t.Valid {
		return json.Marshal(utils.FormatRFC3339(t.Time))
	}
	return json.Marshal(nil)
}

// UnmarshalJSON 实现 JSON 反序列化
func (t *TimeNull) UnmarshalJSON(data []byte) error {
	var s interface{}
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	if s == nil {
		t.Valid = false
		return nil
	}

	str, ok := s.(string)
	if !ok {
		return fmt.Errorf("invalid time value")
	}

	parsed, err := utils.ParseRFC3339(str)
	if err != nil {
		return err
	}

	t.Time = parsed
	t.Valid = true
	return nil
}

// ToDomain 转换为领域模型
func (po *UserPO) ToDomain() *user.User {
	if po == nil {
		return nil
	}

	createdAt := time.Time{}
	updatedAt := time.Time{}

	if po.CreatedAt.Valid {
		createdAt = po.CreatedAt.Time
	}
	if po.UpdatedAt.Valid {
		updatedAt = po.UpdatedAt.Time
	}

	u := &user.User{
		ID:             po.ID,
		Email:          po.Email,
		Name:           po.Name,
		Password:       po.Password,
		EmailVerified:  po.EmailVerified,
		Locked:         po.Locked,
		FailedAttempts: po.FailedAttempts,
		CreatedAt:      createdAt,
		UpdatedAt:      updatedAt,
	}

	if lastLogin := po.LastLoginAt; lastLogin != nil && lastLogin.Valid {
		u.LastLoginAt = &lastLogin.Time
	}

	return u
}

// ToPO 从领域模型转换
func ToPO(u *user.User) *UserPO {
	po := &UserPO{
		ID:             u.ID,
		Email:          u.Email,
		Name:           u.Name,
		Password:       u.Password,
		EmailVerified:  u.EmailVerified,
		Locked:         u.Locked,
		FailedAttempts: u.FailedAttempts,
		CreatedAt:      TimeNull{Time: u.CreatedAt, Valid: true},
		UpdatedAt:      TimeNull{Time: u.UpdatedAt, Valid: true},
	}

	if u.LastLoginAt != nil {
		po.LastLoginAt = &TimeNull{Time: *u.LastLoginAt, Valid: true}
	}

	return po
}

// userRepository GORM 实现
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建用户仓储实例
func NewUserRepository(db *gorm.DB) user.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, u *user.User) error {
	po := ToPO(u)
	return r.db.WithContext(ctx).Create(po).Error
}

// Save 保存用户（使用 GORM Save 的 UPSERT 语义，避免 SELECT-then-INSERT 竞态）
func (r *userRepository) Save(ctx context.Context, u *user.User) error {
	po := ToPO(u)
	return r.db.WithContext(ctx).Save(po).Error
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	var po UserPO
	err := r.db.WithContext(ctx).First(&po, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, userErr.ErrNotFound
		}
		return nil, err
	}
	return po.ToDomain(), nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	var po UserPO
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&po).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, userErr.ErrNotFound
		}
		return nil, err
	}
	return po.ToDomain(), nil
}

func (r *userRepository) ExistsByEmail(ctx context.Context, email string) bool {
	var count int64
	r.db.Model(&UserPO{}).Where("email = ?", email).Count(&count)
	return count > 0
}

func (r *userRepository) Update(ctx context.Context, u *user.User) error {
	po := ToPO(u)
	return r.db.WithContext(ctx).Save(po).Error
}

// List 分页查询用户列表
func (r *userRepository) List(ctx context.Context, params user.UserListParams) (*user.UserListResult, error) {
	query := r.db.WithContext(ctx).Model(&UserPO{})

	if params.Keyword != "" {
		keyword := "%" + params.Keyword + "%"
		query = query.Where("name ILIKE ? OR email ILIKE ?", keyword, keyword)
	}
	if params.RoleID != "" {
		query = query.Where("id IN (SELECT user_id FROM user_roles WHERE role_id = ?)", params.RoleID)
	}
	if params.Status != nil {
		query = query.Where("locked = ?", !*params.Status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	page := params.Page
	if page < 1 {
		page = 1
	}
	pageSize := params.PageSize
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	var pos []UserPO
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&pos).Error; err != nil {
		return nil, err
	}

	users := make([]*user.User, 0, len(pos))
	for i := range pos {
		users = append(users, pos[i].ToDomain())
	}

	return &user.UserListResult{
		Users: users,
		Total: total,
	}, nil
}
