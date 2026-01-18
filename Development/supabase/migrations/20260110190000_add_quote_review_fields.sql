-- Add review tracking fields to quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by TEXT;

-- Update RLS policies if necessary (quotes are generally admin-read-all, so existing policies might suffice, 
-- but ensuring admins can UPDATE these fields is implied by the column addition if they have UPDATE permission on the table)
