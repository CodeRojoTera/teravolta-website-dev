-- 1. Drop conflicting policies from ALL tables involved
DROP POLICY IF EXISTS "Users can view their own requests" ON admin_requests;
DROP POLICY IF EXISTS "Users can create requests" ON admin_requests;
DROP POLICY IF EXISTS "Technicians can read own profile" ON technicians;
DROP POLICY IF EXISTS "Technicians can update own profile" ON technicians; -- Preemptive fix

-- 2. Remove FK constraint
ALTER TABLE admin_requests
  DROP CONSTRAINT IF EXISTS admin_requests_requester_id_fkey;

-- 3. Change columns from UUID to TEXT
ALTER TABLE admin_requests 
  ALTER COLUMN requester_id TYPE text;

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technicians' AND column_name = 'uid') THEN
    ALTER TABLE technicians ALTER COLUMN uid TYPE text;
  END IF;
END $$;

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'technician_uid') THEN
    ALTER TABLE appointments ALTER COLUMN technician_uid TYPE text;
  END IF;
END $$;

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'active_projects' AND column_name = 'technician_uid') THEN
    ALTER TABLE active_projects ALTER COLUMN technician_uid TYPE text;
  END IF;
END $$;

-- 4. Re-create policies with casting
-- Admin Requests
CREATE POLICY "Users can view their own requests" ON admin_requests
    FOR SELECT USING (auth.uid()::text = requester_id);

CREATE POLICY "Users can create requests" ON admin_requests
    FOR INSERT WITH CHECK (auth.uid()::text = requester_id);

-- Technicians
CREATE POLICY "Technicians can read own profile" ON technicians
    FOR SELECT USING (auth.uid()::text = uid);

CREATE POLICY "Technicians can update own profile" ON technicians
    FOR UPDATE USING (auth.uid()::text = uid);
