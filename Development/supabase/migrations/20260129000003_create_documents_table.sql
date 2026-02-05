-- Migration: Create centralized documents table
-- Phase: 01-foundation--data-integrity
-- Plan: 01-01
-- Created: 2026-01-29

-- Create documents table for centralized document tracking (SCHEMA-01)
-- This table provides unified document management across all entities
-- Documents can be linked to projects, quotes, users, or technicians

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File metadata
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  download_url TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,

  -- Entity linking (polymorphic)
  linked_entity_type TEXT NOT NULL CHECK (
    linked_entity_type IN ('active_projects', 'quotes', 'users', 'technicians')
  ),
  linked_entity_id UUID NOT NULL,

  -- Document categorization
  category TEXT NOT NULL DEFAULT 'other' CHECK (
    category IN (
      'bill', 'contract', 'invoice', 'report', 'deliverable', 'payment_proof',
      'site_plan', 'meter_reading', 'claim_evidence', 'regulatory_filing', 'other'
    )
  ),

  -- Audit fields
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT,

  -- Soft delete support
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(linked_entity_type, linked_entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view documents they uploaded or documents linked to their entities
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM active_projects
      WHERE id::text = linked_entity_id::text AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM quotes
      WHERE id::text = linked_entity_id::text AND user_id = auth.uid()
    )
  );

-- RLS Policy: Authenticated users can upload documents
CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policy: Users can soft delete their own documents
CREATE POLICY "Users can delete their own documents" ON documents
  FOR UPDATE USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

-- RLS Policy: Admins can view all documents
CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE uid = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Add table comment for documentation
COMMENT ON TABLE documents IS 'Centralized document storage with polymorphic entity linking. Supports soft delete and comprehensive audit trail.';
COMMENT ON COLUMN documents.linked_entity_type IS 'Type of entity this document is linked to: active_projects, quotes, users, or technicians';
COMMENT ON COLUMN documents.linked_entity_id IS 'UUID of the linked entity';
COMMENT ON COLUMN documents.category IS 'Document category for organization and filtering';
