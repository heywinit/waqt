package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	Email     string `json:"email" gorm:"unique;not null"`
	Password  string `json:"-" gorm:"not null"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	
	// Preferences
	TimeZone       string `json:"time_zone" gorm:"default:'UTC'"`
	WorkStartTime  string `json:"work_start_time" gorm:"default:'09:00'"`
	WorkEndTime    string `json:"work_end_time" gorm:"default:'17:00'"`
	WorkDays       string `json:"work_days" gorm:"default:'1,2,3,4,5'"` // 0=Sunday, 1=Monday, etc.
	
	// Relations
	Tasks     []Task     `json:"tasks,omitempty" gorm:"foreignKey:UserID"`
	Schedules []Schedule `json:"schedules,omitempty" gorm:"foreignKey:UserID"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}