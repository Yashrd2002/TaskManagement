package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"task-management-backend/models"
	"task-management-backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Dashboard handler
func Dashboard(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// Database connection
	collection := utils.DB.Collection("tasks")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Fetch tasks from MongoDB
	var tasks []models.Task
	cursor, err := collection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		log.Println("Error fetching tasks:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}
	defer cursor.Close(ctx)
	cursor.All(ctx, &tasks)

	// Initialize statistics
	totalTasks := len(tasks)
	completedTasks := 0
	pendingTasks := 0
	totalPendingTasks := 0
	totalLapsedTime := 0.0
	totalBalanceTime := 0.0
	pendingStats := make(map[int]map[string]float64) // Priority-wise stats
	var totalCompletionTime float64

	// Current time for calculations
	currentTime := time.Now()

	// Iterate through tasks
	for _, task := range tasks {
		startTime := task.StartTime
		endTime := task.EndTime

		// Handle completed tasks
		if task.Status == "finished" {
			completedTasks++
			totalCompletionTime += endTime.Sub(startTime).Hours()
		} else if task.Status == "pending" {
			pendingTasks++
			totalPendingTasks++

			// Calculate lapsed time and balance time
			lapsedTime := 0.0
			balanceTime := 0.0
			if currentTime.After(startTime) {
				lapsedTime = currentTime.Sub(startTime).Hours()
			}
			if currentTime.Before(endTime) {
				balanceTime = endTime.Sub(currentTime).Hours()
			}

			// Accumulate total lapsed and balance times
			totalLapsedTime += lapsedTime
			totalBalanceTime += balanceTime

			// Organize pending tasks by priority
			if _, exists := pendingStats[task.Priority]; !exists {
				pendingStats[task.Priority] = map[string]float64{"lapsed": 0, "balance": 0, "count": 0}
			}
			pendingStats[task.Priority]["lapsed"] += lapsedTime
			pendingStats[task.Priority]["balance"] += balanceTime
			pendingStats[task.Priority]["count"]++
		}
	}

	// Calculate percentages
	percentCompleted := 0.0
	percentPending := 0.0
	if totalTasks > 0 {
		percentCompleted = (float64(completedTasks) / float64(totalTasks)) * 100
		percentPending = (float64(pendingTasks) / float64(totalTasks)) * 100
	}

	// Calculate average completion time
	averageCompletionTime := 0.0
	if completedTasks > 0 {
		averageCompletionTime = totalCompletionTime / float64(completedTasks)
	}

	// Send JSON response
	c.JSON(http.StatusOK, gin.H{
		"totalTasks":            totalTasks,
		"percentCompleted":      percentCompleted,
		"percentPending":        percentPending,
		"pendingStats":          pendingStats,
		"totalPendingTasks":     totalPendingTasks,
		"totalLapsedTime":       formatFloat(totalLapsedTime),
		"totalBalanceTime":      formatFloat(totalBalanceTime),
		"averageCompletionTime": formatFloat(averageCompletionTime),
	})
}

// Helper function to format float values
func formatFloat(value float64) string {
	return fmt.Sprintf("%.2f", value)
}

// CreateTask handler
func CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	// Ensure userID exists and is of correct type
	userID, exists := c.Get("userID")
	fmt.Printf("User ID: %v, Type: %T\n", userID, userID)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "User ID not found"})
		return
	}

	task.ID = primitive.NewObjectID()
	task.UserID = userID
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	collection := utils.DB.Collection("tasks")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// UpdateTask handler
func UpdateTask(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID format"})
		return
	}

	var updateData models.Task
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
		return
	}

	collection := utils.DB.Collection("tasks")
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Construct update query
	updateFields := bson.M{}
	if updateData.Title != "" {
		updateFields["title"] = updateData.Title
	}
	if updateData.Status != "" {
		updateFields["status"] = updateData.Status
	}
	updateFields["updatedAt"] = time.Now()

	update := bson.M{"$set": updateFields}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating task"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task updated successfully"})
}

// GetTask handler
func GetTask(c *gin.Context) {
	userID, _ := c.Get("userID") // Assuming userID is stored in the context
	priorityStr := c.Query("priority")
	status := c.Query("status")

	// Convert priority to an integer
	var priority int
	if priorityStr != "" {
		var err error
		priority, err = strconv.Atoi(priorityStr) // Convert string to int
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid priority value"})
			return
		}
	}

	collection := utils.DB.Collection("tasks")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Construct filter
	filter := bson.M{"userId": userID}
	if priorityStr != "" { // Use priority as an integer in the filter
		filter["priority"] = priority
	}
	if status != "" {
		filter["status"] = status
	}

	var tasks []models.Task
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching tasks"})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &tasks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// DeleteTask handler
func DeleteTask(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	collection := utils.DB.Collection("tasks")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil || result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
