package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shenfay/kiqi/internal/domain/rbac"
)

// RBACMiddleware 基于角色的访问控制中间件
func RBACMiddleware(roleRepo rbac.RoleRepository, requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Missing user identity",
			})
			c.Abort()
			return
		}

		hasRole, err := roleRepo.HasRole(c.Request.Context(), userID, requiredRole)
		if err != nil || !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"code":    "FORBIDDEN",
				"message": "Insufficient permissions",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
