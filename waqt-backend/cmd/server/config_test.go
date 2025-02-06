package server

import (
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLoadConfig(t *testing.T) {
	// Save current env vars and restore after test
	envVars := []string{
		"PORT", "ENV",
		"DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_SSLMODE",
		"JWT_SECRET", "TOKEN_EXPIRATION",
		"OPENAI_API_KEY",
		"REDIS_HOST", "REDIS_PORT", "REDIS_PASSWORD",
	}
	
	oldEnv := make(map[string]string)
	for _, env := range envVars {
		oldEnv[env] = os.Getenv(env)
	}
	defer func() {
		for k, v := range oldEnv {
			if v == "" {
				os.Unsetenv(k)
			} else {
				os.Setenv(k, v)
			}
		}
	}()

	// Clear environment
	for _, env := range envVars {
		os.Unsetenv(env)
	}

	tests := []struct {
		name     string
		envVars  map[string]string
		validate func(*testing.T, *Config)
	}{
		{
			name: "default values",
			envVars: map[string]string{},
			validate: func(t *testing.T, c *Config) {
				assert.Equal(t, "8080", c.Server.Port)
				assert.Equal(t, "development", c.Server.Env)
				assert.Equal(t, "localhost", c.Database.Host)
				assert.Equal(t, "5432", c.Database.Port)
				assert.Equal(t, "waqt_db", c.Database.DBName)
				assert.Equal(t, "disable", c.Database.SSLMode)
				assert.Equal(t, 24*time.Hour, c.Auth.TokenExpiration)
			},
		},
		{
			name: "custom values",
			envVars: map[string]string{
				"PORT":             "3000",
				"ENV":              "production",
				"DB_HOST":          "db.example.com",
				"DB_PORT":          "5433",
				"DB_USER":          "admin",
				"DB_PASSWORD":      "secret",
				"DB_NAME":          "waqt_prod",
				"DB_SSLMODE":       "require",
				"JWT_SECRET":       "mysecret",
				"TOKEN_EXPIRATION": "12h",
				"OPENAI_API_KEY":   "sk-123",
				"REDIS_HOST":       "redis.example.com",
				"REDIS_PORT":       "6380",
				"REDIS_PASSWORD":   "redispass",
			},
			validate: func(t *testing.T, c *Config) {
				assert.Equal(t, "3000", c.Server.Port)
				assert.Equal(t, "production", c.Server.Env)
				assert.Equal(t, "db.example.com", c.Database.Host)
				assert.Equal(t, "5433", c.Database.Port)
				assert.Equal(t, "admin", c.Database.User)
				assert.Equal(t, "secret", c.Database.Password)
				assert.Equal(t, "waqt_prod", c.Database.DBName)
				assert.Equal(t, "require", c.Database.SSLMode)
				assert.Equal(t, "mysecret", c.Auth.JWTSecret)
				assert.Equal(t, 12*time.Hour, c.Auth.TokenExpiration)
				assert.Equal(t, "sk-123", c.AI.OpenAIKey)
				assert.Equal(t, "redis.example.com", c.Redis.Host)
				assert.Equal(t, "6380", c.Redis.Port)
				assert.Equal(t, "redispass", c.Redis.Password)
			},
		},
		{
			name: "invalid token expiration",
			envVars: map[string]string{
				"TOKEN_EXPIRATION": "invalid",
			},
			validate: func(t *testing.T, c *Config) {
				assert.Equal(t, 24*time.Hour, c.Auth.TokenExpiration)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set environment variables
			for k, v := range tt.envVars {
				os.Setenv(k, v)
			}

			config, err := LoadConfig()
			require.NoError(t, err)
			require.NotNil(t, config)

			if tt.validate != nil {
				tt.validate(t, config)
			}

			// Clear environment variables
			for k := range tt.envVars {
				os.Unsetenv(k)
			}
		})
	}
}

func TestGetEnv(t *testing.T) {
	tests := []struct {
		name         string
		key          string
		defaultValue string
		envValue     string
		want         string
	}{
		{
			name:         "existing environment variable",
			key:          "TEST_KEY",
			defaultValue: "default",
			envValue:     "value",
			want:         "value",
		},
		{
			name:         "non-existing environment variable",
			key:          "NON_EXISTING_KEY",
			defaultValue: "default",
			envValue:     "",
			want:         "default",
		},
		{
			name:         "empty environment variable",
			key:          "EMPTY_KEY",
			defaultValue: "default",
			envValue:     "",
			want:         "default",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.envValue != "" {
				os.Setenv(tt.key, tt.envValue)
				defer os.Unsetenv(tt.key)
			}

			got := getEnv(tt.key, tt.defaultValue)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestParseDuration(t *testing.T) {
	tests := []struct {
		name     string
		duration string
		want     time.Duration
	}{
		{
			name:     "valid hours",
			duration: "24h",
			want:     24 * time.Hour,
		},
		{
			name:     "valid minutes",
			duration: "30m",
			want:     30 * time.Minute,
		},
		{
			name:     "invalid duration",
			duration: "invalid",
			want:     24 * time.Hour,
		},
		{
			name:     "empty duration",
			duration: "",
			want:     24 * time.Hour,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := parseDuration(tt.duration)
			assert.Equal(t, tt.want, got)
		})
	}
} 