package notification

import (
	"context"

	domain "github.com/shenfay/kiqi/internal/domain/notification"
)

// AppService 消息应用服务
type AppService struct {
	domainSvc *domain.Service
}

// NewAppService 创建消息应用服务
func NewAppService(domainSvc *domain.Service) *AppService {
	return &AppService{domainSvc: domainSvc}
}

// GetMessages 获取用户消息列表
func (s *AppService) GetMessages(ctx context.Context, recipientID string, msgType domain.MessageType, category domain.MessageCategory, isRead *bool, limit, offset int) (*MessageListDTO, error) {
	params := domain.MessageListParams{
		RecipientID: recipientID,
		Type:        msgType,
		Category:    category,
		IsRead:      isRead,
		Limit:       limit,
		Offset:      offset,
	}

	msgs, total, err := s.domainSvc.GetMessages(ctx, params)
	if err != nil {
		return nil, err
	}

	return &MessageListDTO{
		Messages: toMessageDTOList(msgs),
		Total:    total,
	}, nil
}

// GetUnreadCount 获取未读消息计数
func (s *AppService) GetUnreadCount(ctx context.Context, recipientID string) (*UnreadCountDTO, error) {
	counts, err := s.domainSvc.GetUnreadCount(ctx, recipientID)
	if err != nil {
		return nil, err
	}

	var total int64
	for _, c := range counts {
		total += c.Count
	}

	return &UnreadCountDTO{
		Counts: counts,
		Total:  total,
	}, nil
}

// MarkAsRead 标记单条消息已读
func (s *AppService) MarkAsRead(ctx context.Context, id, recipientID string) error {
	return s.domainSvc.MarkAsRead(ctx, id, recipientID)
}

// MarkAllAsRead 标记全部已读
func (s *AppService) MarkAllAsRead(ctx context.Context, recipientID string, msgType domain.MessageType) error {
	return s.domainSvc.MarkAllAsRead(ctx, recipientID, msgType)
}

// GetAllMessages 管理员查询所有消息
func (s *AppService) GetAllMessages(ctx context.Context, msgType domain.MessageType, category domain.MessageCategory, limit, offset int) (*MessageListDTO, error) {
	msgs, total, err := s.domainSvc.GetAllMessages(ctx, msgType, category, limit, offset)
	if err != nil {
		return nil, err
	}

	return &MessageListDTO{
		Messages: toMessageDTOList(msgs),
		Total:    total,
	}, nil
}

// SendSystemNotification 发送系统通知（供其他模块调用）
func (s *AppService) SendSystemNotification(ctx context.Context, recipientID string, category domain.MessageCategory, title, content string) error {
	return s.domainSvc.SendSystemNotification(ctx, recipientID, category, title, content)
}

// SendCompanionMessage 发送伙伴对话消息（供其他模块调用）
func (s *AppService) SendCompanionMessage(ctx context.Context, senderID, recipientID string, category domain.MessageCategory, title, content string) error {
	return s.domainSvc.SendCompanionMessage(ctx, senderID, recipientID, category, title, content)
}
