package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSchedule_Creation(t *testing.T) {
	db := setupTestDB(t)
	defer clearTestDB(t, db)

	// Create test user
	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}
	require.NoError(t, db.Create(user).Error)

	tests := []struct {
		name     string
		schedule *Schedule
		wantErr  bool
		validate func(*testing.T, *Schedule)
	}{
		{
			name: "valid schedule",
			schedule: &Schedule{
				Date:        time.Now().Truncate(24 * time.Hour),
				IsGenerated: true,
				UserID:      user.ID,
			},
			wantErr: false,
			validate: func(t *testing.T, s *Schedule) {
				assert.True(t, s.IsGenerated)
				assert.Equal(t, user.ID, s.UserID)
			},
		},
		{
			name: "schedule with default values",
			schedule: &Schedule{
				Date:   time.Now(),
				UserID: user.ID,
			},
			wantErr: false,
			validate: func(t *testing.T, s *Schedule) {
				assert.False(t, s.IsGenerated)
			},
		},
		{
			name: "schedule without user ID",
			schedule: &Schedule{
				Date: time.Now(),
			},
			wantErr: true,
		},
		{
			name: "schedule without date",
			schedule: &Schedule{
				UserID: user.ID,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := db.Create(tt.schedule).Error
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)

			// Validate timestamps
			assert.False(t, tt.schedule.CreatedAt.IsZero())
			assert.False(t, tt.schedule.UpdatedAt.IsZero())

			if tt.validate != nil {
				tt.validate(t, tt.schedule)
			}
		})
	}
}

func TestTimeBlock_Creation(t *testing.T) {
	db := setupTestDB(t)
	defer clearTestDB(t, db)

	// Create test user
	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}
	require.NoError(t, db.Create(user).Error)

	// Create test schedule
	schedule := &Schedule{
		Date:   time.Now(),
		UserID: user.ID,
	}
	require.NoError(t, db.Create(schedule).Error)

	// Create test task
	task := &Task{
		Title:  "Test Task",
		UserID: user.ID,
	}
	require.NoError(t, db.Create(task).Error)

	startTime := time.Now().Add(time.Hour)
	endTime := startTime.Add(30 * time.Minute)

	tests := []struct {
		name      string
		timeBlock *TimeBlock
		wantErr   bool
		validate  func(*testing.T, *TimeBlock)
	}{
		{
			name: "valid time block with task",
			timeBlock: &TimeBlock{
				StartTime:  startTime,
				EndTime:    endTime,
				Title:     "Work on project",
				Type:      "task",
				ScheduleID: schedule.ID,
				TaskID:    &task.ID,
			},
			wantErr: false,
			validate: func(t *testing.T, tb *TimeBlock) {
				assert.Equal(t, startTime.Unix(), tb.StartTime.Unix())
				assert.Equal(t, endTime.Unix(), tb.EndTime.Unix())
				assert.Equal(t, "task", tb.Type)
				assert.NotNil(t, tb.TaskID)
				assert.Equal(t, task.ID, *tb.TaskID)
			},
		},
		{
			name: "valid break block",
			timeBlock: &TimeBlock{
				StartTime:  startTime,
				EndTime:    endTime,
				Title:     "Lunch Break",
				Type:      "break",
				ScheduleID: schedule.ID,
			},
			wantErr: false,
			validate: func(t *testing.T, tb *TimeBlock) {
				assert.Equal(t, "break", tb.Type)
				assert.Nil(t, tb.TaskID)
			},
		},
		{
			name: "invalid time block (end before start)",
			timeBlock: &TimeBlock{
				StartTime:  endTime,
				EndTime:    startTime,
				Title:     "Invalid Time",
				ScheduleID: schedule.ID,
			},
			wantErr: true,
		},
		{
			name: "time block without schedule ID",
			timeBlock: &TimeBlock{
				StartTime: startTime,
				EndTime:   endTime,
				Title:    "No Schedule",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := db.Create(tt.timeBlock).Error
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)

			if tt.validate != nil {
				tt.validate(t, tt.timeBlock)
			}

			// Test loading relations
			if !tt.wantErr {
				var loadedBlock TimeBlock
				err = db.Preload("Schedule").Preload("Task").First(&loadedBlock, tt.timeBlock.ID).Error
				require.NoError(t, err)
				assert.Equal(t, schedule.ID, loadedBlock.Schedule.ID)
				
				if tt.timeBlock.TaskID != nil {
					assert.NotNil(t, loadedBlock.Task)
					assert.Equal(t, task.ID, loadedBlock.Task.ID)
				}
			}
		})
	}
} 