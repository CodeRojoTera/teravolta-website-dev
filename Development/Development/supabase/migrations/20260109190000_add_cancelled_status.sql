-- Add 'cancelled' to the check constraint for status
ALTER TABLE technician_leave_requests 
DROP CONSTRAINT IF EXISTS technician_leave_requests_status_check;

ALTER TABLE technician_leave_requests 
ADD CONSTRAINT technician_leave_requests_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));
