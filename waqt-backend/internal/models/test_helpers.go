package models

import (
	"log"
	"os"
	"testing"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var testDB *gorm.DB

// SetupTestDB creates a test database connection and runs migrations
func SetupTestDB(t *testing.T) *gorm.DB {
	if testDB != nil {
		return testDB
	}

	// Use test database configuration
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=waqt_test port=5432 sslmode=disable"
	}

	// Configure GORM
	config := &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				LogLevel: logger.Silent, // Silent for tests
			},
		),
	}

	// Connect to database
	db, err := gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		t.Fatalf("failed to connect to test database: %v", err)
	}

	// Run migrations
	err = db.AutoMigrate(&User{}, &Task{}, &Schedule{}, &TimeBlock{})
	if err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	testDB = db
	return db
}

// ClearTestDB cleans up all test data
func ClearTestDB(t *testing.T, db *gorm.DB) {
	tables := []string{"time_blocks", "schedules", "tasks", "users"}
	for _, table := range tables {
		err := db.Exec("TRUNCATE TABLE " + table + " CASCADE").Error
		if err != nil {
			t.Fatalf("failed to clear table %s: %v", table, err)
		}
	}
} 