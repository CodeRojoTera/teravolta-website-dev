-- ============================================================================
-- Remove legacy deletion_requests table
-- Replaced by proper soft delete columns on users, documents tables
-- ============================================================================

-- First, migrate any existing data to deletion_audit_log for historical record
-- (Only if deletion_audit_log exists and deletion_requests has data)
DO $$
BEGIN
  -- Check if deletion_audit_log exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'deletion_audit_log'
  ) THEN
    -- Migrate any existing deletion requests to audit log
    INSERT INTO public.deletion_audit_log (
      table_name,
      record_id,
      record_data,
      deleted_at,
      deleted_by,
      deletion_type,
      deletion_reason,
      notes
    )
    SELECT
      COALESCE(resource_type, 'unknown'),
      COALESCE(resource_id, id),
      jsonb_build_object(
        'original_table', 'deletion_requests',
        'user_id', user_id,
        'resource_type', resource_type,
        'resource_id', resource_id,
        'reason', reason,
        'status', status,
        'requested_at', requested_at
      ),
      COALESCE(requested_at, NOW()),
      user_id,
      'soft',
      'user_request',
      'Migrated from legacy deletion_requests table'
    FROM public.deletion_requests
    WHERE NOT EXISTS (
      SELECT 1 FROM public.deletion_audit_log
      WHERE table_name = 'deletion_requests' AND record_id = deletion_requests.id
    );
  END IF;
END $$;

-- Now drop the legacy table
DROP TABLE IF EXISTS public.deletion_requests;

-- Add comment explaining the removal
COMMENT ON TABLE public.deletion_audit_log IS 'Audit trail for all deletion operations. Replaced legacy deletion_requests table as of 2026-01-30.';
