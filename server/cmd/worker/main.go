package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/shenfay/kiqi/internal/infra/config"
	"github.com/shenfay/kiqi/internal/infra/repository"
	workerhandlers "github.com/shenfay/kiqi/internal/transport/worker/handlers"
	"github.com/shenfay/kiqi/pkg/constants"
	"github.com/shenfay/kiqi/pkg/logger"
)

func main() {
	// 1. 加载配置
	cfg, err := config.Load("development")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// 2. 初始化日志系统
	if err := logger.Init(cfg.Logger.Level); err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	logger.Info("Starting Asynq Worker...")

	// 3. 初始化 Redis 客户端和数据库
	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Addr,
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
		PoolSize: cfg.Redis.PoolSize,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := redisClient.Ping(ctx).Err(); err != nil {
		logger.Error("Failed to connect to Redis: ", err)
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	logger.Info("Redis connection established")

	// 初始化数据库
	db, err := gorm.Open(postgres.Open(cfg.Database.DSN()), &gorm.Config{})
	if err != nil {
		logger.Error("Failed to connect to database: ", err)
		log.Fatalf("Failed to connect to database: %v", err)
	}
	logger.Info("Database connection established")

	// 4. 初始化仓储（统一操作日志）
	operationLogRepo := repository.NewOperationLogRepository(db)

	// 5. 创建统一操作日志处理器
	operationLogHandler := workerhandlers.NewOperationLogHandler(operationLogRepo)

	// 6. 注册 Asynq 任务处理器
	mux := asynq.NewServeMux()

	// 注册统一操作日志处理器（处理 log:operation 任务）
	mux.HandleFunc(string(constants.AsynqTaskOperationLog), operationLogHandler.ProcessTask)

	// 兼容旧领域事件（user.registered, user.logged_in 等）
	// 这些事件类型也会被 OperationLogHandler 处理
	for _, eventName := range []constants.EventName{
		constants.EventUserRegistered,
		constants.EventUserLoggedIn,
		constants.EventUserLoginFailed,
		constants.EventUserAccountLocked,
		constants.EventUserLoggedOut,
		constants.EventUserTokenRefreshed,
		constants.EventUserProfileUpdated,
		constants.EventOperationLog, // 统一操作日志事件
	} {
		mux.HandleFunc(string(eventName), operationLogHandler.ProcessTask)
	}

	// 7. 创建 Asynq 服务器
	srv := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     cfg.Asynq.Addr,
			Password: cfg.Redis.Password,
			DB:       cfg.Redis.DB,
		},
		asynq.Config{
			Concurrency: cfg.Asynq.Concurrency,
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"logs":     4, // 操作日志专用队列
				"low":      1,
			},
			StrictPriority: true,
		},
	)

	logger.Info("Asynq server created with concurrency=", cfg.Asynq.Concurrency)

	// 8. 启动 Worker
	go func() {
		logger.Info("Starting Asynq Worker processor...")
		if err := srv.Run(mux); err != nil {
			logger.Error("Failed to run Asynq server: ", err)
			log.Fatalf("Failed to run Asynq server: %v", err)
		}
	}()

	// 9. 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down worker...")

	// 10. 优雅关闭
	srv.Shutdown()
	logger.Info("Worker stopped gracefully")
}
