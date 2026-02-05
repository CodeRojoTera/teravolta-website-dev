-- Migration: Add soft delete columns to documents table
-- Phase: 01-foundation--data-integrity
-- Created: 2026-02-01

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

COMMENT ON COLUMN documents.deleted_at IS 'Timestamp when document was soft deleted. NULL means document is active.';
COMMENT ON COLUMN documents.deleted_by IS 'User ID who initiated the document deletion. FK to users(id).';

CREATE INDEX IF NOT EXISTS idx_documents_deleted_at
  ON documents(deleted_at)
  WHERE deleted_at IS NULL;
