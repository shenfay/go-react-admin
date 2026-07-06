package user

import (
	"net/http"

	"github.com/shenfay/kiqi/pkg/errors"
)

// 用户域预定义错误
var (
	// ErrNotFound 用户不存在
	ErrNotFound = &errors.AppError{
		Code:       errors.ErrCodeUserNotFound,
		Message:    "用户不存在",
		HTTPStatus: http.StatusNotFound,
	}

	// ErrEmailAlreadyExists 邮箱已注册
	ErrEmailAlreadyExists = &errors.AppError{
		Code:       errors.ErrCodeUserEmailAlreadyExists,
		Message:    "该邮箱已被注册",
		HTTPStatus: http.StatusConflict,
	}

	// ErrEmailNotVerified 邮箱未验证
	ErrEmailNotVerified = &errors.AppError{
		Code:       errors.ErrCodeUserEmailNotVerified,
		Message:    "邮箱尚未验证",
		HTTPStatus: http.StatusForbidden,
	}
)

// NewUserError 创建用户域错误（工厂方法）
func NewUserError(code string, message string) *errors.AppError {
	return &errors.AppError{
		Code:       "USER." + code,
		Message:    message,
		HTTPStatus: http.StatusBadRequest,
	}
}
