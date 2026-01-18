-- Drop constraints if they exist to allow type change (though for UUID to TEXT usually fine, FKs might block)
-- We might need to drop FKs first.
ALTER TABLE active_projects
  ALTER COLUMN id TYPE text,
  ALTER COLUMN source_quote_id TYPE text,
  ALTER COLUMN source_inquiry_id TYPE text,
  ALTER COLUMN appointment_id TYPE text;
