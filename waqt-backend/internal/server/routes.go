package server

import (
	"github.com/axiom-svgu/waqt/internal/handlers"
	"github.com/axiom-svgu/waqt/internal/middleware"
	"github.com/axiom-svgu/waqt/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func SetupRoutes(app *fiber.App, config *Config) {
	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
		})
	})

	// API routes
	api := app.Group("/api")
	v1 := api.Group("/v1")

	auth := v1.Group("/auth")
	//Other than these, all routes are protected and require authentication header
	auth.Use(middleware.AuthMiddleware([]byte(config.Auth.JWTSecret), "/signup", "/login", "/google/login", "/google/callback"))
	
	
	// Auth routes
	auth.Post("/signup", middleware.ValidatorMiddleware(models.UserCreateRequest{}), handlers.SignUp)
	auth.Post("/login", middleware.ValidatorMiddleware(models.LoginRequest{}), handlers.Login)
	auth.Post("/google/login", middleware.ValidatorMiddleware(models.GoogleLoginRequest{}), handlers.GoogleLogin)
	auth.Post("/google/callback", middleware.ValidatorMiddleware(models.GoogleCallbackRequest{}), handlers.GoogleCallback)
	auth.Post("/logout", middleware.ValidatorMiddleware(models.LogoutRequest{}), handlers.Logout)


	// Settings routes
	settings := v1.Group("/settings")
	settings.Get("/", nil)
	settings.Put("/update", nil)
} 