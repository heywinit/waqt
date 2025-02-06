package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUser_BeforeCreate(t *testing.T) {
	db := SetupTestDB(t)
	defer ClearTestDB(t, db)

	tests := []struct {
		name     string
		user     *User
		wantErr  bool
		validate func(*testing.T, *User)
	}{
		{
			name: "valid user",
			user: &User{
				Email:     "test@example.com",
				Password:  "password123",
				FirstName: "Test",
				LastName:  "User",
			},
			wantErr: false,
			validate: func(t *testing.T, u *User) {
				assert.NotEqual(t, "password123", u.Password, "password should be hashed")
				assert.NoError(t, u.ComparePassword("password123"), "should be able to compare password")
			},
		},
		{
			name: "with default preferences",
			user: &User{
				Email:    "test2@example.com",
				Password: "password123",
			},
			wantErr: false,
			validate: func(t *testing.T, u *User) {
				assert.Equal(t, "UTC", u.TimeZone, "should have default timezone")
				assert.Equal(t, "09:00", u.WorkStartTime, "should have default work start time")
				assert.Equal(t, "17:00", u.WorkEndTime, "should have default work end time")
				assert.Equal(t, "1,2,3,4,5", u.WorkDays, "should have default work days")
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := db.Create(tt.user).Error
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)
			
			// Validate timestamps
			assert.False(t, tt.user.CreatedAt.IsZero(), "CreatedAt should be set")
			assert.False(t, tt.user.UpdatedAt.IsZero(), "UpdatedAt should be set")
			
			if tt.validate != nil {
				tt.validate(t, tt.user)
			}
		})
	}
}

func TestUser_ComparePassword(t *testing.T) {
	db := SetupTestDB(t)
	defer ClearTestDB(t, db)

	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}

	// Create user
	require.NoError(t, db.Create(user).Error)

	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "correct password",
			password: "password123",
			wantErr:  false,
		},
		{
			name:     "incorrect password",
			password: "wrongpassword",
			wantErr:  true,
		},
		{
			name:     "empty password",
			password: "",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := user.ComparePassword(tt.password)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestUser_Relations(t *testing.T) {
	db := SetupTestDB(t)
	defer ClearTestDB(t, db)

	// Create test user
	user := &User{
		Email:    "test@example.com",
		Password: "password123",
	}
	require.NoError(t, db.Create(user).Error)

	// Create test task
	task := &Task{
		Title:  "Test Task",
		UserID: user.ID,
	}
	require.NoError(t, db.Create(task).Error)

	// Create test schedule
	schedule := &Schedule{
		Date:   time.Now(),
		UserID: user.ID,
	}
	require.NoError(t, db.Create(schedule).Error)

	// Test loading relations
	var loadedUser User
	err := db.Preload("Tasks").Preload("Schedules").First(&loadedUser, user.ID).Error
	require.NoError(t, err)

	assert.Len(t, loadedUser.Tasks, 1, "should have one task")
	assert.Equal(t, task.Title, loadedUser.Tasks[0].Title)

	assert.Len(t, loadedUser.Schedules, 1, "should have one schedule")
	assert.Equal(t, schedule.Date.Unix(), loadedUser.Schedules[0].Date.Unix())
} 