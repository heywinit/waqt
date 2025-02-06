package models

import (
	"time"
)

type Schedule struct {
	BaseModel 

	Date        time.Time `json:"date" gorm:"not null"`
	IsGenerated bool      `json:"is_generated" gorm:"default:false"`

	// Relations
	UserID uint          `json:"user_id" gorm:"not null"`
	User   User          `json:"-" gorm:"foreignKey:UserID"`
	Blocks []TimeBlock   `json:"blocks" gorm:"foreignKey:ScheduleID"`
}

type TimeBlock struct {
	BaseModel 
	
	StartTime time.Time `json:"start_time" gorm:"not null"`
	EndTime   time.Time `json:"end_time" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null"`
	Type      string    `json:"type" gorm:"default:'task'"` // task, break, meeting, etc.
	
	// Relations
	ScheduleID uint     `json:"schedule_id" gorm:"not null"`
	Schedule   Schedule `json:"-" gorm:"foreignKey:ScheduleID"`
	TaskID     *uint    `json:"task_id"`
	Task       *Task    `json:"task,omitempty" gorm:"foreignKey:TaskID"`
} 