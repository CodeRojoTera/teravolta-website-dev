-- ============================================================================
-- Migration: Add CASCADE ON DELETE to Foreign Keys
-- Phase: 01-foundation--data-integrity
-- Plan: 01-02
-- Created: 2026-01-29
-- ============================================================================
-- Purpose: Ensure database-level cascade for user and project deletion
-- Requirements: DATA-02, SCHEMA-02, SCHEMA-03
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. User -> Active Projects Cascade
-- ============================================================================
-- When a user is deleted, all their projects should be automatically deleted
-- This maintains data integrity and prevents orphaned projects

ALTER TABLE active_projects
  DROP CONSTRAINT IF EXISTS active_projects_user_id_fkey;

ALTER TABLE active_projects
  ADD CONSTRAINT active_projects_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- ============================================================================
-- 2. Project -> Appointments Cascade (SCHEMA-03)
-- ============================================================================
-- When a project is deleted, all related appointments should be automatically deleted
-- This prevents orphaned appointments and maintains referential integrity

ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_project_id_fkey;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_project_id_fkey
  FOREIGN KEY (project_id)
  REFERENCES active_projects(id)
  ON DELETE CASCADE;

-- ============================================================================
-- 3. Project -> Invoices Cascade
-- ============================================================================
-- When a project is deleted, related invoices should cascade
-- Note: May need to consider SET NULL for audit trail preservation in future

ALTER TABLE invoices
  DROP CONSTRAINT IF EXISTS invoices_project_id_fkey;

ALTER TABLE invoices
  ADD CONSTRAINT invoices_project_id_fkey
  FOREIGN KEY (project_id)
  REFERENCES active_projects(id)
  ON DELETE CASCADE;

-- ============================================================================
-- 4. User -> Notifications Cascade
-- ============================================================================
-- When a user is deleted, their notifications should be deleted
-- Note: notifications table references auth.users(id), which is automatically
-- synced with users.id via auth system

-- Check current constraint name and update it
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Re-create with CASCADE
-- Keep reference to auth.users(id) as that's the authoritative auth source
ALTER TABLE notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- ============================================================================
-- 5. Verify electrical_boards already has CASCADE (from 20260114180000)
-- ============================================================================
-- The electrical_boards.appointment_id FK was created with CASCADE in the
-- original migration, so no action needed. Adding comment for documentation.

COMMENT ON CONSTRAINT electrical_boards_appointment_id_fkey ON electrical_boards IS
  'CASCADE delete: When appointment deleted, electrical boards are also deleted (configured in 20260114180000)';

-- ============================================================================
-- 6. Check if quotes table exists and add CASCADE if needed
-- ============================================================================
-- The plan mentions quotes but we need to verify it exists

DO $$
BEGIN
  -- Check if quotes table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'quotes'
  ) THEN
    -- Check if user_id column exists in quotes
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'quotes'
      AND column_name = 'user_id'
    ) THEN
      -- Drop existing constraint if exists
      ALTER TABLE quotes
        DROP CONSTRAINT IF EXISTS quotes_user_id_fkey;

      -- Add CASCADE constraint
      ALTER TABLE quotes
        ADD CONSTRAINT quotes_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;

      RAISE NOTICE 'Added CASCADE to quotes.user_id';
    ELSE
      RAISE NOTICE 'quotes table exists but has no user_id column - skipping';
    END IF;
  ELSE
    RAISE NOTICE 'quotes table does not exist - skipping';
  END IF;
END $$;

-- ============================================================================
-- 7. Handle inquiries table if it has user_id
-- ============================================================================
-- Migration 20260116_add_userid_to_inquiries.sql added user_id to inquiries

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'inquiries'
    AND column_name = 'user_id'
  ) THEN
    -- Drop existing constraint if exists
    ALTER TABLE inquiries
      DROP CONSTRAINT IF EXISTS inquiries_user_id_fkey;

    -- Add CASCADE constraint
    -- Note: Using auth.users(id) as per 20260116_add_userid_to_inquiries.sql
    ALTER TABLE inquiries
      ADD CONSTRAINT inquiries_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;

    RAISE NOTICE 'Added CASCADE to inquiries.user_id';
  END IF;
END $$;

-- ============================================================================
-- Migration Complete
-- ============================================================================

COMMIT;

-- Document the changes
COMMENT ON TABLE active_projects IS 'User projects - CASCADE deletes when user is deleted';
COMMENT ON TABLE appointments IS 'Project appointments - CASCADE deletes when project is deleted';
COMMENT ON TABLE invoices IS 'Project invoices - CASCADE deletes when project is deleted';
COMMENT ON TABLE notifications IS 'User notifications - CASCADE deletes when user is deleted';
