-- Migration: Create active_users view for filtering soft-deleted users
-- Phase: 01-foundation--data-integrity
-- Plan: 01-01
-- Created: 2026-01-29

-- Create view that filters out soft-deleted users
-- This provides clean abstraction for querying active users without RLS complications
-- See RESEARCH.md Pattern 2 for why views are preferred over RLS filtering

CREATE OR REPLACE VIEW active_users AS
  SELECT * FROM users
  WHERE deleted_at IS NULL;

-- Grant permissions on view to authenticated users
-- This allows the view to be used in place of the users table for most queries
GRANT SELECT, INSERT, UPDATE ON active_users TO authenticated;

-- Enable security invoker mode so RLS policies are evaluated
-- with the privileges of the user executing the query, not the view owner
ALTER VIEW active_users SET (security_invoker = on);

-- Add comment for documentation
COMMENT ON VIEW active_users IS 'View of users table excluding soft-deleted records. Use this for most queries instead of users table directly.';
