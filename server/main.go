package main

import (
	"task-management-backend/handlers"
	"task-management-backend/middlewares"
	"task-management-backend/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	utils.ConnectDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://task-management-mu-hazel.vercel.app", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-Requested-With", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Auth Routes
	r.POST("/signup", handlers.Signup)
	r.POST("/login", handlers.Login)
	r.GET("/check-auth", handlers.CheckAuthentication)
	r.POST("/logout", handlers.Logout)

	// Task Routes
	r.GET("/dashboard", middlewares.AuthMiddleware(), handlers.Dashboard)
	r.POST("/create", middlewares.AuthMiddleware(), handlers.CreateTask)
	r.PUT("/update/:id", middlewares.AuthMiddleware(), handlers.UpdateTask)
	r.GET("/gettask", middlewares.AuthMiddleware(), handlers.GetTask)
	r.DELETE("/delete/:id", middlewares.AuthMiddleware(), handlers.DeleteTask)

	r.Run(":8080")
}
