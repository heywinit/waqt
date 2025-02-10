package models

type UserCreateRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Username string `json:"username" validate:"required,min=3"`
	FirstName string `json:"first_name" validate:"required,min=3"`
}

type LoginRequest struct {
	Identifier string `json:"identifier" validate:"required"`
	Password   string `json:"password" validate:"required,min=8"`
}

type GoogleLoginRequest struct {
	Token string `json:"token" validate:"required"`
}

type GoogleCallbackRequest struct {
	Code string `json:"code" validate:"required"`
	State string `json:"state" validate:"required"`
	
}

type LogoutRequest struct {}

