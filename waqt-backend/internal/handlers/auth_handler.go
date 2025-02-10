package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Login successful",
	})
}

func SignUp(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "SignUp successful",
	})
}

func Logout(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Logout successful",
	})
}

func GoogleCallback(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Google callback successful",
	})
}
