-- Drop indexes
DROP INDEX IF EXISTS idx_time_blocks_task_id;
DROP INDEX IF EXISTS idx_time_blocks_schedule_id;
DROP INDEX IF EXISTS idx_schedules_date;
DROP INDEX IF EXISTS idx_schedules_user_id;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_tasks_user_id;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables
DROP TABLE IF EXISTS time_blocks;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users; 