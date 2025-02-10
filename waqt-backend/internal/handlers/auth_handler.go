package handlers

import (
	"log"

	"github.com/axiom-svgu/waqt/internal/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/markbates/goth/gothic"
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
	req, res := utils.FiberContextToHTTP(c)
	user, err := gothic.CompleteUserAuth(res, req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Authentication failed",
		})
	}

	log.Println(user)

	return c.JSON(fiber.Map{
		"message": "Google callback successful",
	})
}

func GoogleLogin(c *fiber.Ctx) error {
	req, res := utils.FiberContextToHTTP(c)
	gothic.BeginAuthHandler(res, req)
	return c.JSON(fiber.Map{
		"message": "Google login successful",
	})
}
