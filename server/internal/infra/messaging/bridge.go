package messaging

import (
	"context"
	"encoding/json"

	"github.com/hibiken/asynq"
	"github.com/shenfay/kiqi/internal/domain/shared/events"
	"github.com/shenfay/kiqi/pkg/constants"
)

// DomainToIntegrationBridge 领域事件到集成事件的桥接器
// 订阅 InProcessBus 中的领域事件，转换为 Asynq 集成任务入队
type DomainToIntegrationBridge struct {
	client   *asynq.Client
	queueMap map[constants.EventName]constants.QueueName
}

// NewBridge 创建桥接器
func NewBridge(client *asynq.Client) *DomainToIntegrationBridge {
	return &DomainToIntegrationBridge{
		client: client,
		queueMap: map[constants.EventName]constants.QueueName{
			// 所有操作日志类事件统一路由到 logs 队列
			constants.EventUserRegistered:     constants.QueueLogs,
			constants.EventUserLoggedIn:       constants.QueueLogs,
			constants.EventUserLoginFailed:    constants.QueueLogs,
			constants.EventUserAccountLocked:  constants.QueueLogs,
			constants.EventUserLoggedOut:      constants.QueueLogs,
			constants.EventUserTokenRefreshed: constants.QueueLogs,
			constants.EventUserProfileUpdated: constants.QueueLogs,
			constants.EventOperationLog:       constants.QueueLogs, // 统一操作日志事件
		},
	}
}

// SubscribeTo 订阅 InProcessBus 中的所有领域事件
func (b *DomainToIntegrationBridge) SubscribeTo(bus events.Bus) {
	if b.client == nil {
		return // nil client 模式仅用于事件类型发现，不执行订阅
	}
	for eventName := range b.queueMap {
		name := eventName // capture for closure
		bus.Subscribe(string(name), func(ctx context.Context, evt events.DomainEvent) error {
			return b.enqueue(ctx, name, evt)
		})
	}
}

// LogEventTypes 返回路由到 logs 队列的所有事件类型
// 作为事件注册表的单一真相来源，供 Worker 进程统一注册
func (b *DomainToIntegrationBridge) LogEventTypes() []constants.EventName {
	types := make([]constants.EventName, 0, len(b.queueMap))
	for eventName, queue := range b.queueMap {
		if queue == constants.QueueLogs {
			types = append(types, eventName)
		}
	}
	return types
}

// enqueue 将领域事件入队到 Asynq
func (b *DomainToIntegrationBridge) enqueue(ctx context.Context, eventName constants.EventName, evt events.DomainEvent) error {
	if b.client == nil {
		return nil
	}
	payload, err := json.Marshal(evt)
	if err != nil {
		return err
	}

	queue := b.queueMap[eventName]
	maxRetry := 3
	if queue == constants.QueueCritical {
		maxRetry = 5
	}

	_, err = b.client.EnqueueContext(ctx,
		asynq.NewTask(string(eventName), payload),
		asynq.Queue(string(queue)),
		asynq.MaxRetry(maxRetry),
	)
	return err
}
