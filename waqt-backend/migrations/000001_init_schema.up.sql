-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    time_zone VARCHAR(50) DEFAULT 'UTC',
    work_start_time VARCHAR(5) DEFAULT '09:00',
    work_end_time VARCHAR(5) DEFAULT '17:00',
    work_days VARCHAR(20) DEFAULT '1,2,3,4,5'
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(10) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'todo',
    duration INTEGER DEFAULT 60,
    ai_tags TEXT[],
    ai_complexity FLOAT DEFAULT 0,
    ai_suggestions TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Create schedules table
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    date DATE NOT NULL,
    is_generated BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Create time_blocks table
CREATE TABLE time_blocks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'task',
    schedule_id INTEGER NOT NULL REFERENCES schedules(id),
    task_id INTEGER REFERENCES tasks(id)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_time_blocks_schedule_id ON time_blocks(schedule_id);
CREATE INDEX idx_time_blocks_task_id ON time_blocks(task_id); 