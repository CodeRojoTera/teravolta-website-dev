-- Migration: Add notes column to deletion_audit_log
-- Phase: 01-foundation--data-integrity
-- Created: 2026-02-01

ALTER TABLE deletion_audit_log
  ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN deletion_audit_log.notes IS 'Optional notes describing the deletion event or source.';
