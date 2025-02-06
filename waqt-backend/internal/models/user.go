package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	BaseModel     
	
	Email          string `json:"email" gorm:"unique;not null"`
	Password       string `json:"-" gorm:"not null"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	ProfilePicture string `json:"profile_picture"`

	GoogleID       *string   `json:"google_id,omitempty" gorm:"unique"`
	EmailVerified  bool      `json:"email_verified" gorm:"default:false"`
	LastLogin      time.Time `json:"last_login"`

	// Relations
	Tasks     []Task     `json:"tasks,omitempty" gorm:"foreignKey:UserID"`
	Schedules []Schedule `json:"schedules,omitempty" gorm:"foreignKey:UserID"`
	Settings  Settings   `json:"settings,omitempty" gorm:"foreignKey:UserID"`
}

type Settings struct {
	BaseModel

	ThemePreference             string    `json:"theme_preference"`
	NotificationLevel           string    `json:"notification_level"`
	Language                    string    `json:"language"`
	DefaultTaskDuration         time.Time `json:"default_task_duration"`
	TaskReminderIntervalMinutes int       `json:"task_reminder_interval_minutes"`
	
	Timezone                    string    `json:"timezone"`
	DateFormat   string `json:"date_format"`
	TimeFormat24 bool   `json:"time_format_24"`
	
	// Preferences
	WorkStartTime string `json:"work_start_time" gorm:"default:'09:00'"`
	WorkEndTime   string `json:"work_end_time" gorm:"default:'17:00'"`
	WorkDays      string `json:"work_days" gorm:"default:'1,2,3,4,5'"` // 0=Sunday, 1=Monday, etc.
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
