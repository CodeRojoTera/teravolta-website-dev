-- Change columns from UUID to TEXT to support Firebase UIDs
-- For admin_requests
ALTER TABLE admin_requests 
  ALTER COLUMN requester_id TYPE text;

-- Remove the foreign key constraint because Firebase UIDs won't match Supabase auth.users
ALTER TABLE admin_requests
  DROP CONSTRAINT IF EXISTS admin_requests_requester_id_fkey;

-- For technicians table (if exists and used)
ALTER TABLE technicians
  ALTER COLUMN uid TYPE text;

-- For appointments table (if exists and used)
ALTER TABLE appointments
  ALTER COLUMN technician_uid TYPE text;

-- For active_projects table (legacy reference)
ALTER TABLE active_projects
  ALTER COLUMN technician_uid TYPE text;
