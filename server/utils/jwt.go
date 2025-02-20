package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JWTSecret = []byte("ddddb7c2a045755f5e9133a0f0ebee5d")

func GenerateToken(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString(JWTSecret)
}

func VerifyToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	userID := claims["userID"].(string)
	return userID, nil
}
