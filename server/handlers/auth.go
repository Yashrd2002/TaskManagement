package handlers

import (
	"context"
	"fmt"
	"net/http"
	"task-management-backend/models"
	"task-management-backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// Signup handler for registering a new user
func Signup(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password before saving it
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	// Replace plain text password with hashed password
	user.Password = string(hashedPassword)

	// Insert user into the database
	collection := utils.DB.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	// Respond with a success message and the email of the user
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "email": user.Email})
}

// Login handler for authenticating a user
func Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dbUser models.User
	collection := utils.DB.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Change from "username" to "email" for lookup in database
	err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare password with the stored hash
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT Token
	token, err := utils.GenerateToken(dbUser.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Set the token as an HTTP-only cookie
	c.SetCookie("token", token, 86400, "/", "", false, true) // Expires in 24 hours

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

// CheckAuthentication handler to verify if the user is authenticated and return user details
func CheckAuthentication(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	// Verify and extract user ID from JWT
	userID, err := utils.VerifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Convert to MongoDB ObjectID
	userIDObj, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}

	fmt.Println("Extracted User ID:", userIDObj) // Debugging output

	// Find user in MongoDB
	var user models.User
	collection := utils.DB.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, bson.M{"_id": userIDObj}).Decode(&user)
	if err != nil {
		fmt.Println("MongoDB Query Error:", err) // Print error for debugging
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Return user details
	c.JSON(http.StatusOK, gin.H{
		"username": user.Username,
		"email":    user.Email,
	})
}

func Logout(c *gin.Context) {
	// Set the token cookie with an empty value and expired time
	c.SetCookie("token", "", -1, "/", "", false, true)

	// Respond with a success message
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
