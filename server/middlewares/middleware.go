package middlewares

import (
	"net/http"
	"task-management-backend/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks if a user is authenticated
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token from the cookie
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
			c.Abort() // Stop request from continuing
			return
		}
		// Verify the token
		userID, err := utils.VerifyToken(token)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store userID in the context for other handlers to use
		c.Set("userID", userID)

		// Continue to the next middleware/handler
		c.Next()
	}
}
