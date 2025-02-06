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
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", ""),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "waqt_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Auth: AuthConfig{
			JWTSecret:       getEnv("JWT_SECRET", ""),
			TokenExpiration: parseDuration(getEnv("TOKEN_EXPIRATION", "24h")),
		},
		AI: AIConfig{
			OpenAIKey: getEnv("OPENAI_API_KEY", ""),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
		},
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDuration(duration string) time.Duration {
	d, err := time.ParseDuration(duration)
	if err != nil {
		return 24 * time.Hour // Default to 24 hours
	}
	return d
}