package notification

import (
	"context"
	"errors"
)

var (
	// ErrMessageNotFound 消息不存在
	ErrMessageNotFound = errors.New("message not found")
	// ErrMessageAccessDenied 无权操作该消息
	ErrMessageAccessDenied = errors.New("access denied: message belongs to another user")
)

// Service 消息领域服务
type Service struct {
	repo MessageRepository
}

// NewService 创建消息领域服务
func NewService(repo MessageRepository) *Service {
	return &Service{repo: repo}
}

// SendMessage 发送消息（持久化）
func (s *Service) SendMessage(ctx context.Context, msg *Message) error {
	return s.repo.Save(ctx, msg)
}

// SendSystemNotification 发送系统通知
func (s *Service) SendSystemNotification(ctx context.Context, recipientID string, category MessageCategory, title, content string) error {
	msg := NewSystemMessage(recipientID, category, title, content)
	return s.repo.Save(ctx, msg)
}

// SendCompanionMessage 发送伙伴对话消息
func (s *Service) SendCompanionMessage(ctx context.Context, senderID, recipientID string, category MessageCategory, title, content string) error {
	msg := NewCompanionMessage(senderID, recipientID, category, title, content)
	return s.repo.Save(ctx, msg)
}

// GetMessages 获取用户消息列表
func (s *Service) GetMessages(ctx context.Context, params MessageListParams) ([]*Message, int64, error) {
	return s.repo.FindByRecipient(ctx, params)
}

// GetUnreadCount 获取未读消息计数（按类型分组）
func (s *Service) GetUnreadCount(ctx context.Context, recipientID string) ([]UnreadCount, error) {
	return s.repo.CountUnread(ctx, recipientID)
}

// MarkAsRead 标记单条消息已读
func (s *Service) MarkAsRead(ctx context.Context, id, recipientID string) error {
	msg, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return ErrMessageNotFound
	}
	if msg.RecipientID != recipientID {
		return ErrMessageAccessDenied
	}
	if msg.IsRead {
		return nil // 已读则直接返回
	}
	return s.repo.MarkAsRead(ctx, id, recipientID)
}

// MarkAllAsRead 标记全部已读
func (s *Service) MarkAllAsRead(ctx context.Context, recipientID string, msgType MessageType) error {
	return s.repo.MarkAllAsRead(ctx, recipientID, msgType)
}

// GetAllMessages 管理员查询所有消息
func (s *Service) GetAllMessages(ctx context.Context, msgType MessageType, category MessageCategory, limit, offset int) ([]*Message, int64, error) {
	return s.repo.FindAll(ctx, msgType, category, limit, offset)
}
