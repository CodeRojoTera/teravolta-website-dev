-- Migration: Add soft delete columns to users table
-- Phase: 01-foundation--data-integrity
-- Plan: 01-01
-- Created: 2026-01-29

-- Add soft delete infrastructure to users table
-- This enables 15-day grace period before hard deletion with full audit trail

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deletion_scheduled_for TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

-- Add comment for documentation
COMMENT ON COLUMN users.deleted_at IS 'Timestamp when user was soft deleted. NULL means user is active.';
COMMENT ON COLUMN users.deletion_scheduled_for IS 'Scheduled timestamp for hard deletion (15-day grace period). NULL means no deletion scheduled.';
COMMENT ON COLUMN users.deleted_by IS 'User ID (admin or self) who initiated the deletion. FK to users(id).';

-- Create index for efficient querying of scheduled deletions (for cron jobs)
CREATE INDEX IF NOT EXISTS idx_users_deletion_scheduled
  ON users(deletion_scheduled_for)
  WHERE deletion_scheduled_for IS NOT NULL;

-- Create index for filtering active users
CREATE INDEX IF NOT EXISTS idx_users_deleted_at
  ON users(deleted_at)
  WHERE deleted_at IS NULL;
