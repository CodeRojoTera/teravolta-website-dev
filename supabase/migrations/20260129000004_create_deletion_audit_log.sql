-- Migration: Create deletion audit log table
-- Phase: 01-foundation--data-integrity
-- Plan: 01-01
-- Created: 2026-01-29

-- Create comprehensive audit log for tracking all deletions
-- This captures soft deletes, hard deletes, and cascade deletions
-- See RESEARCH.md Pattern 3 for audit trigger patterns

CREATE TABLE IF NOT EXISTS deletion_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What was deleted
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  record_data JSONB NOT NULL, -- Snapshot of deleted record

  -- Deletion metadata
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_by UUID REFERENCES users(id),
  delete_reason TEXT CHECK (
    delete_reason IS NULL OR
    delete_reason IN ('user_request', 'admin_action', 'inactivity', 'violation', 'cascade')
  ),
  deletion_type TEXT NOT NULL CHECK (
    deletion_type IN ('soft', 'hard', 'cascade', 'scheduled')
  ),

  -- For tracking cascade deletions
  parent_deletion_id UUID REFERENCES deletion_audit_log(id),
  related_deletions JSONB DEFAULT '[]'::jsonb -- Array of {table, id} for child records
);

-- Index for querying by deleted entity
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record
  ON deletion_audit_log(table_name, record_id);

-- Index for querying by actor
CREATE INDEX IF NOT EXISTS idx_audit_log_deleted_by
  ON deletion_audit_log(deleted_by);

-- Index for querying by time
CREATE INDEX IF NOT EXISTS idx_audit_log_deleted_at
  ON deletion_audit_log(deleted_at DESC);

-- Index for cascade tracking
CREATE INDEX IF NOT EXISTS idx_audit_log_parent
  ON deletion_audit_log(parent_deletion_id)
  WHERE parent_deletion_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE deletion_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view audit log
CREATE POLICY "Only admins can view deletion audit log" ON deletion_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE uid = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policy: Admins can insert audit entries
CREATE POLICY "Admins can create audit entries" ON deletion_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE uid = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Add table comment for documentation
COMMENT ON TABLE deletion_audit_log IS 'Comprehensive audit trail for all deletion operations (soft, hard, cascade). Restricted to admin access only.';
COMMENT ON COLUMN deletion_audit_log.record_data IS 'JSONB snapshot of the deleted record for audit purposes';
COMMENT ON COLUMN deletion_audit_log.parent_deletion_id IS 'References parent deletion when this is a cascade delete';
COMMENT ON COLUMN deletion_audit_log.related_deletions IS 'Array of related entities deleted in cascade: [{table: string, id: string}]';
