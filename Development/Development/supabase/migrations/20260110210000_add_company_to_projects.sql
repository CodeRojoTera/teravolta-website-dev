-- Add client_company field to active_projects table
-- This allows a single user to manage projects for different companies/entities
ALTER TABLE active_projects 
ADD COLUMN IF NOT EXISTS client_company TEXT;
