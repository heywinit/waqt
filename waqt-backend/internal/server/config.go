package server

import (
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Auth     AuthConfig
	AI       AIConfig
	Redis    RedisConfig
}

type ServerConfig struct {
	Port string
	Env  string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type AuthConfig struct {
	JWTSecret       string
	TokenExpiration time.Duration
}

type AIConfig struct {
	OpenAIKey string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		// Allow missing .env file in production
		if os.Getenv("ENV") != "production" {
			return nil, err
		}
	}

	config := &Config{
		Server: ServerConfig{
			Port: GetEnv("PORT", "8080"),
			Env:  GetEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			Host:     GetEnv("DB_HOST", "localhost"),
			Port:     GetEnv("DB_PORT", "5432"),
			User:     GetEnv("DB_USER", ""),
			Password: GetEnv("DB_PASSWORD", ""),
			DBName:   GetEnv("DB_NAME", "waqt_db"),
			SSLMode:  GetEnv("DB_SSLMODE", "disable"),
		},
		Auth: AuthConfig{
			JWTSecret:       GetEnv("JWT_SECRET", ""),
			TokenExpiration: ParseDuration(GetEnv("TOKEN_EXPIRATION", "24h")),
		},
		AI: AIConfig{
			OpenAIKey: GetEnv("OPENAI_API_KEY", ""),
		},
		Redis: RedisConfig{
			Host:     GetEnv("REDIS_HOST", "localhost"),
			Port:     GetEnv("REDIS_PORT", "6379"),
			Password: GetEnv("REDIS_PASSWORD", ""),
		},
	}

	return config, nil
}

func GetEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func ParseDuration(duration string) time.Duration {
	d, err := time.ParseDuration(duration)
	if err != nil {
		return 24 * time.Hour // Default to 24 hours
	}
	return d
} 