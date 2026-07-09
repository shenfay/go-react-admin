package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/shenfay/kiqi/internal/domain/operation"
	_ "github.com/shenfay/kiqi/internal/transport/http/middleware" // for swagger doc type resolution
	"github.com/shenfay/kiqi/internal/transport/http/response"
	"github.com/shenfay/kiqi/pkg/utils"
)

// OperationLogHandler 统一操作日志 HTTP 处理器（查询）
type OperationLogHandler struct {
	operationLogRepo operation.LogRepository
}

// NewOperationLogHandler 创建操作日志处理器
func NewOperationLogHandler(operationLogRepo operation.LogRepository) *OperationLogHandler {
	return &OperationLogHandler{
		operationLogRepo: operationLogRepo,
	}
}

// RegisterRoutes 注册操作日志路由（路由组已由外部创建，此处注册子路由）
func (h *OperationLogHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.ListOperationLogs)
	rg.GET("/user/:user_id", h.GetUserOperationLogs)
	rg.GET("/category/:category", h.GetCategoryOperationLogs)
}

// ListOperationLogs 查询操作日志列表
// 支持分页和可选的 category/action 筛选
// @Summary 查询操作日志列表
// @Tags OperationLogs
// @Produce json
// @Security BearerAuth
// @Param limit query int false "每页条数" default(20)
// @Param offset query int false "偏移量" default(0)
// @Param category query string false "按分类筛选"
// @Param action query string false "按操作筛选"
// @Success 200 {object} middleware.SuccessResponse "操作日志列表"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 500 {object} middleware.ErrorResponse "服务器内部错误"
// @Router /operation-logs [get]
func (h *OperationLogHandler) ListOperationLogs(c *gin.Context) {
	limit := utils.ToInt(c.DefaultQuery("limit", "20"))
	offset := utils.ToInt(c.DefaultQuery("offset", "0"))
	category := c.Query("category")
	action := c.Query("action")

	var logs []*operation.OperationLog
	var err error

	switch {
	case category != "":
		logs, err = h.operationLogRepo.FindByCategory(c.Request.Context(), category, limit, offset)
	case action != "":
		logs, err = h.operationLogRepo.FindByAction(c.Request.Context(), action, limit, offset)
	default:
		logs, err = h.operationLogRepo.FindAll(c.Request.Context(), limit, offset)
	}

	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{
		"data":   logs,
		"limit":  limit,
		"offset": offset,
	})
}

// GetUserOperationLogs 查询用户操作日志
// @Summary 查询指定用户的操作日志
// @Tags OperationLogs
// @Produce json
// @Security BearerAuth
// @Param user_id path string true "用户ID"
// @Param limit query int false "每页条数" default(20)
// @Param offset query int false "偏移量" default(0)
// @Success 200 {object} middleware.SuccessResponse "用户操作日志"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 500 {object} middleware.ErrorResponse "服务器内部错误"
// @Router /operation-logs/user/{user_id} [get]
func (h *OperationLogHandler) GetUserOperationLogs(c *gin.Context) {
	userID := c.Param("user_id")
	limit := utils.ToInt(c.DefaultQuery("limit", "20"))
	offset := utils.ToInt(c.DefaultQuery("offset", "0"))

	logs, err := h.operationLogRepo.FindByUserID(c.Request.Context(), userID, limit, offset)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{
		"data":   logs,
		"limit":  limit,
		"offset": offset,
	})
}

// GetCategoryOperationLogs 按分类查询操作日志
// @Summary 按分类查询操作日志
// @Tags OperationLogs
// @Produce json
// @Security BearerAuth
// @Param category path string true "操作分类"
// @Param limit query int false "每页条数" default(20)
// @Param offset query int false "偏移量" default(0)
// @Success 200 {object} middleware.SuccessResponse "分类操作日志"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 500 {object} middleware.ErrorResponse "服务器内部错误"
// @Router /operation-logs/category/{category} [get]
func (h *OperationLogHandler) GetCategoryOperationLogs(c *gin.Context) {
	category := c.Param("category")
	limit := utils.ToInt(c.DefaultQuery("limit", "20"))
	offset := utils.ToInt(c.DefaultQuery("offset", "0"))

	logs, err := h.operationLogRepo.FindByCategory(c.Request.Context(), category, limit, offset)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{
		"data":   logs,
		"limit":  limit,
		"offset": offset,
	})
}
