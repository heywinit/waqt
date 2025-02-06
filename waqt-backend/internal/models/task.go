package models

import (
	"time"
)

type TaskPriority string
type TaskStatus string

const (
	PriorityLow    TaskPriority = "low"
	PriorityMedium TaskPriority = "medium"
	PriorityHigh   TaskPriority = "high"

	StatusTodo       TaskStatus = "todo"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

type Task struct {
	BaseModel


	Title       string       `json:"title" gorm:"not null"`
	Description string       `json:"description"`
	DueDate     *time.Time   `json:"due_date"`
	Priority    TaskPriority `json:"priority" gorm:"type:varchar(10);default:'medium'"`
	Status      TaskStatus   `json:"status" gorm:"type:varchar(20);default:'todo'"`
	Duration    int          `json:"duration" gorm:"default:60"` // Duration in minutes

	// AI-generated fields
	AITags        []string `json:"ai_tags" gorm:"type:text[]"`
	AIComplexity  float64  `json:"ai_complexity" gorm:"default:0"`
	AISuggestions string   `json:"ai_suggestions"`

	// Relations
	UserID uint `json:"user_id" gorm:"not null"`
	User   User `json:"-" gorm:"foreignKey:UserID"`
}
