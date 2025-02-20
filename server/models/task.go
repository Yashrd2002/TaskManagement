package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Task struct represents a task model in MongoDB
type Task struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`       // Task ID
	Title     string             `bson:"title,omitempty"`     // Task Title
	StartTime time.Time          `bson:"startTime"`           // Task Start Time
	EndTime   time.Time          `bson:"endTime"`             // Task End Time
	Priority  int                `bson:"priority"`            // Priority (1-5)
	Status    string             `bson:"status"`              // "pending" or "finished"
	UserID    any                `bson:"userId,omitempty"`    // Reference to User
	CreatedAt time.Time          `bson:"createdAt,omitempty"` // Auto Timestamp
	UpdatedAt time.Time          `bson:"updatedAt,omitempty"` // Auto Timestamp
}
