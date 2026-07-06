package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/shenfay/kiqi/internal/app/authentication"
)

// JWTAuthConfig JWT 认证中间件配置
type JWTAuthConfig struct {
	TokenService authentication.TokenService
}

// JWTAuthMiddleware JWT 认证中间件
func JWTAuthMiddleware(config JWTAuthConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			RespondError(c, http.StatusUnauthorized, "SYSTEM.UNAUTHORIZED", "缺少认证信息")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			RespondError(c, http.StatusUnauthorized, "SYSTEM.UNAUTHORIZED", "认证格式不正确")
			return
		}

		tokenString := parts[1]

		claims, err := config.TokenService.ValidateAccessToken(tokenString)
		if err != nil {
			RespondError(c, http.StatusUnauthorized, "AUTH.INVALID_TOKEN", "无效的认证令牌")
			return
		}

		// 将用户信息注入到上下文
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Next()
	}
}
