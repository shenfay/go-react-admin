package utils

import "context"

// contextKey 自定义 Context 键类型
type contextKey string

const (
	// OperatorUserIDKey 操作人用户 ID 在 context 中的键
	OperatorUserIDKey contextKey = "operator_user_id"
	// OperatorEmailKey 操作人邮箱在 context 中的键
	OperatorEmailKey contextKey = "operator_email"
)

// WithOperator 将操作人信息注入到 context
func WithOperator(ctx context.Context, userID, email string) context.Context {
	ctx = context.WithValue(ctx, OperatorUserIDKey, userID)
	ctx = context.WithValue(ctx, OperatorEmailKey, email)
	return ctx
}

// GetOperatorUserID 从 context 获取操作人用户 ID（供 Service 层使用）
func GetOperatorUserID(ctx context.Context) string {
	if id, ok := ctx.Value(OperatorUserIDKey).(string); ok {
		return id
	}
	return ""
}

// GetOperatorEmail 从 context 获取操作人邮箱（供 Service 层使用）
func GetOperatorEmail(ctx context.Context) string {
	if email, ok := ctx.Value(OperatorEmailKey).(string); ok {
		return email
	}
	return ""
}
