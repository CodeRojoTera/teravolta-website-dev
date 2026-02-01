-- ============================================================================
-- Deletion Audit Triggers
-- Purpose: Log DELETE and soft-delete UPDATE operations in database
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_deletion_audit()
RETURNS TRIGGER AS $$
DECLARE
  actor_id uuid;
  deletion_reason text;
  deletion_type text;
  record_snapshot jsonb;
BEGIN
  actor_id := current_setting('app.current_user_id', true)::uuid;
  deletion_reason := current_setting('app.deletion_reason', true);
  deletion_type := current_setting('app.deletion_type', true);

  IF TG_OP = 'UPDATE' THEN
    -- Soft delete detected when deleted_at transitions from NULL to non-NULL
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      record_snapshot := row_to_json(OLD)::jsonb;
      INSERT INTO public.deletion_audit_log (
        table_name,
        record_id,
        record_data,
        deleted_at,
        deleted_by,
        deletion_type,
        deletion_reason,
        notes
      ) VALUES (
        TG_TABLE_NAME,
        OLD.id,
        record_snapshot,
        COALESCE(NEW.deleted_at, NOW()),
        COALESCE((to_jsonb(NEW) ->> 'deleted_by')::uuid, actor_id),
        COALESCE(deletion_type, 'soft'),
        deletion_reason,
        'Logged by database trigger (soft delete)'
      );
    END IF;
    RETURN NEW;
  END IF;

  -- Hard delete path
  IF TG_OP = 'DELETE' THEN
    record_snapshot := row_to_json(OLD)::jsonb;
    INSERT INTO public.deletion_audit_log (
      table_name,
      record_id,
      record_data,
      deleted_at,
      deleted_by,
      deletion_type,
      deletion_reason,
      notes
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id,
      record_snapshot,
      NOW(),
      actor_id,
      COALESCE(deletion_type, 'hard'),
      deletion_reason,
      'Logged by database trigger (hard delete)'
    );
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to tables with soft delete columns
DROP TRIGGER IF EXISTS users_deletion_audit_trigger ON public.users;
CREATE TRIGGER users_deletion_audit_trigger
AFTER UPDATE OF deleted_at OR DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.log_deletion_audit();

DROP TRIGGER IF EXISTS documents_deletion_audit_trigger ON public.documents;
CREATE TRIGGER documents_deletion_audit_trigger
AFTER UPDATE OF deleted_at OR DELETE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.log_deletion_audit();
