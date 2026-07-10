package metrics

// Recorder 指标记录器接口
// 业务层通过此接口记录指标，无需依赖 prometheus 具体实现
type Recorder interface {
	IncUserRegistration()
	IncAuthSuccess(authType string)
	IncAuthFailure(authType, reason string)
	UpdateDBConnections(open, max int)
}

// NoopRecorder 空操作指标记录器（Nil Object 模式）
// 用于测试或指标未初始化时静默跳过
type NoopRecorder struct{}

func (NoopRecorder) IncUserRegistration()                  {}
func (NoopRecorder) IncAuthSuccess(_ string)               {}
func (NoopRecorder) IncAuthFailure(_, _ string)            {}
func (NoopRecorder) UpdateDBConnections(_, _ int)          {}

// compile-time check: *Metrics implements Recorder
var _ Recorder = (*Metrics)(nil)
