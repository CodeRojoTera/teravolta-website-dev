-- 1. Drop existing policies that depend on the columns
DROP POLICY IF EXISTS "Users can view their own requests" ON admin_requests;
DROP POLICY IF EXISTS "Users can create requests" ON admin_requests;

-- 2. Remove the foreign key constraint
ALTER TABLE admin_requests
  DROP CONSTRAINT IF EXISTS admin_requests_requester_id_fkey;

-- 3. Change columns from UUID to TEXT
-- For admin_requests
ALTER TABLE admin_requests 
  ALTER COLUMN requester_id TYPE text;

-- For technicians table (if exists)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technicians' AND column_name = 'uid') THEN
    ALTER TABLE technicians ALTER COLUMN uid TYPE text;
  END IF;
END $$;

-- For appointments table (if exists)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'technician_uid') THEN
    ALTER TABLE appointments ALTER COLUMN technician_uid TYPE text;
  END IF;
END $$;

-- For active_projects table (if exists)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'active_projects' AND column_name = 'technician_uid') THEN
    ALTER TABLE active_projects ALTER COLUMN technician_uid TYPE text;
  END IF;
END $$;

-- 4. Re-create the policies with correct type casting
-- Note: auth.uid() returns uuid, so we cast it to text to compare with requester_id (text)
CREATE POLICY "Users can view their own requests" ON admin_requests
    FOR SELECT USING (auth.uid()::text = requester_id);

CREATE POLICY "Users can create requests" ON admin_requests
    FOR INSERT WITH CHECK (auth.uid()::text = requester_id);
