-- 1. DROP ALL POLICIES (Aggressive & Complete)
-- Admin Requests
DROP POLICY IF EXISTS "Users can view their own requests" ON admin_requests;
DROP POLICY IF EXISTS "Users can create requests" ON admin_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON admin_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON admin_requests;

-- Technicians
DROP POLICY IF EXISTS "Technicians can read own profile" ON technicians;
DROP POLICY IF EXISTS "Technicians can update own profile" ON technicians;

-- Appointments (The trouble makers)
DROP POLICY IF EXISTS "Technicians can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Technicians can update own appointments" ON appointments; -- The one that failed last time
DROP POLICY IF EXISTS "Technicians can view own appointments" ON appointments;   -- Variation
DROP POLICY IF EXISTS "Enable read access for all users" ON appointments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON appointments;
DROP POLICY IF EXISTS "Enable update for users based on email" ON appointments;

-- Active Projects
DROP POLICY IF EXISTS "Technicians can view assigned projects" ON active_projects;


-- 2. Drop Foreign Key Constraints
ALTER TABLE admin_requests DROP CONSTRAINT IF EXISTS admin_requests_requester_id_fkey;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_uid_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_technician_uid_fkey;
ALTER TABLE active_projects DROP CONSTRAINT IF EXISTS active_projects_technician_uid_fkey;


-- 3. Change columns from UUID to TEXT
ALTER TABLE admin_requests ALTER COLUMN requester_id TYPE text;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technicians' AND column_name = 'uid') THEN
    ALTER TABLE technicians ALTER COLUMN uid TYPE text;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'technician_uid') THEN
    ALTER TABLE appointments ALTER COLUMN technician_uid TYPE text;
  END IF;
END $$;

DO $$ BEGIN
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
CREATE POLICY "Admins can view all requests" ON admin_requests
    FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins can update requests" ON admin_requests
    FOR UPDATE USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Technicians
CREATE POLICY "Technicians can read own profile" ON technicians
    FOR SELECT USING (auth.uid()::text = uid);
CREATE POLICY "Technicians can update own profile" ON technicians
    FOR UPDATE USING (auth.uid()::text = uid);

-- Appointments (Simplified)
CREATE POLICY "Technicians can read own appointments" ON appointments
    FOR SELECT USING (auth.uid()::text = technician_uid);
CREATE POLICY "Technicians can update own appointments" ON appointments
    FOR UPDATE USING (auth.uid()::text = technician_uid);
