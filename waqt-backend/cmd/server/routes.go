package server

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func setupRoutes(app *fiber.App) {
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
			"status": "ok",
		})
	})

	// API routes
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Auth routes
	auth := v1.Group("/auth")
	auth.Post("/signup", nil) // TODO: Implement auth handlers
	auth.Post("/login", nil)
	auth.Post("/logout", nil)
	auth.Get("/me", nil)

	// Settings routes
	settings := v1.Group("/settings")
	settings.Get("/", nil)
	settings.Put("/update", nil)
}
