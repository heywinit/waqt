package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestTask_Creation(t *testing.T) {
	db := SetupTestDB(t)
	defer ClearTestDB(t, db)

	// Create test user first
	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}
	require.NoError(t, db.Create(user).Error)

	tests := []struct {
		name     string
		task     *Task
		wantErr  bool
		validate func(*testing.T, *Task)
	}{
		{
			name: "valid task with all fields",
			task: &Task{
				Title:       "Test Task",
				Description: "Test Description",
				DueDate:     &time.Time{},
				Priority:    PriorityHigh,
				Status:      StatusTodo,
				Duration:    120,
				UserID:      user.ID,
				AITags:      []string{"important", "urgent"},
				AIComplexity: 0.8,
			},
			wantErr: false,
			validate: func(t *testing.T, task *Task) {
				assert.Equal(t, "Test Task", task.Title)
				assert.Equal(t, PriorityHigh, task.Priority)
				assert.Equal(t, StatusTodo, task.Status)
				assert.Equal(t, 120, task.Duration)
				assert.Equal(t, []string{"important", "urgent"}, task.AITags)
				assert.Equal(t, 0.8, task.AIComplexity)
			},
		},
		{
			name: "task with default values",
			task: &Task{
				Title:  "Simple Task",
				UserID: user.ID,
			},
			wantErr: false,
			validate: func(t *testing.T, task *Task) {
				assert.Equal(t, "Simple Task", task.Title)
				assert.Equal(t, PriorityMedium, task.Priority)
				assert.Equal(t, StatusTodo, task.Status)
				assert.Equal(t, 60, task.Duration)
				assert.Equal(t, 0.0, task.AIComplexity)
			},
		},
		{
			name: "task without title",
			task: &Task{
				UserID: user.ID,
			},
			wantErr: true,
		},
		{
			name: "task without user ID",
			task: &Task{
				Title: "No User Task",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := db.Create(tt.task).Error
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)

			// Validate timestamps
			assert.False(t, tt.task.CreatedAt.IsZero(), "CreatedAt should be set")
			assert.False(t, tt.task.UpdatedAt.IsZero(), "UpdatedAt should be set")

			if tt.validate != nil {
				tt.validate(t, tt.task)
			}

			// Test loading the user relation
			var loadedTask Task
			err = db.Preload("User").First(&loadedTask, tt.task.ID).Error
			require.NoError(t, err)
			assert.Equal(t, user.ID, loadedTask.User.ID)
		})
	}
}

func TestTask_StatusTransitions(t *testing.T) {
	db := SetupTestDB(t)
	defer ClearTestDB(t, db)

	// Create test user
	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}
	require.NoError(t, db.Create(user).Error)

	// Create initial task
	task := &Task{
		Title:  "Status Test Task",
		UserID: user.ID,
		Status: StatusTodo,
	}
	require.NoError(t, db.Create(task).Error)

	tests := []struct {
		name        string
		fromStatus  TaskStatus
		toStatus    TaskStatus
		shouldWork  bool
	}{
		{
			name:       "todo to in_progress",
			fromStatus: StatusTodo,
			toStatus:   StatusInProgress,
			shouldWork: true,
		},
		{
			name:       "in_progress to done",
			fromStatus: StatusInProgress,
			toStatus:   StatusDone,
			shouldWork: true,
		},
		{
			name:       "done to todo",
			fromStatus: StatusDone,
			toStatus:   StatusTodo,
			shouldWork: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set initial status
			err := db.Model(task).Update("status", tt.fromStatus).Error
			require.NoError(t, err)

			// Update to new status
			err = db.Model(task).Update("status", tt.toStatus).Error
			if tt.shouldWork {
				require.NoError(t, err)
				
				// Verify status change
				var updatedTask Task
				err = db.First(&updatedTask, task.ID).Error
				require.NoError(t, err)
				assert.Equal(t, tt.toStatus, updatedTask.Status)
			} else {
				require.Error(t, err)
			}
		})
	}
} 