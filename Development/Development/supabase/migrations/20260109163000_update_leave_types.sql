-- Add leave_type column if it updates legacy schema
ALTER TABLE technician_leave_requests 
ADD COLUMN IF NOT EXISTS leave_type text DEFAULT 'other';

-- Update check constraint to include new types (unplanned, suspension)
ALTER TABLE technician_leave_requests 
DROP CONSTRAINT IF EXISTS technician_leave_requests_leave_type_check;

ALTER TABLE technician_leave_requests 
ADD CONSTRAINT technician_leave_requests_leave_type_check 
CHECK (leave_type IN ('vacation', 'sickness', 'other', 'unplanned', 'suspension'));
