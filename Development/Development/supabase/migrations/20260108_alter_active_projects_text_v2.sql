-- Drop incoming FKs
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_project_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_project_id_fkey;

-- Alter referencing columns to TEXT
ALTER TABLE appointments ALTER COLUMN project_id TYPE text;
ALTER TABLE invoices ALTER COLUMN project_id TYPE text;

-- Alter active_projects columns to TEXT
ALTER TABLE active_projects
  ALTER COLUMN id TYPE text,
  ALTER COLUMN source_quote_id TYPE text,
  ALTER COLUMN source_inquiry_id TYPE text,
  ALTER COLUMN appointment_id TYPE text;
