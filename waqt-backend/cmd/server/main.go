package server

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type App struct {
	config *Config
	db     *gorm.DB
	fiber  *fiber.App
}

func NewApp() (*App, error) {
	// Load configuration
	config, err := LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("error loading config: %v", err)
	}

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Waqt API",
	})

	// Connect to database
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Password,
		config.Database.DBName,
		config.Database.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("error connecting to database: %v", err)
	}

	return &App{
		config: config,
		db:     db,
		fiber:  app,
	}, nil
}

func (a *App) Start() error {
	// Setup routes
	setupRoutes(a.fiber)

	// Start server
	addr := fmt.Sprintf(":%s", a.config.Server.Port)
	log.Printf("Server starting on %s", addr)
	return a.fiber.Listen(addr)
}

func main() {
	app, err := NewApp()
	if err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	if err := app.Start(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
