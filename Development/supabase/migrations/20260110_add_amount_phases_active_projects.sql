-- Add amount and phases columns to active_projects table
ALTER TABLE active_projects 
ADD COLUMN IF NOT EXISTS amount numeric,
ADD COLUMN IF NOT EXISTS phases jsonb DEFAULT '[]'::jsonb;

-- Add checking for amount validation if needed, but keeping it simple for now.
