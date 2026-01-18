-- Add service-specific columns to quotes table
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS timeline text,
ADD COLUMN IF NOT EXISTS budget text,
ADD COLUMN IF NOT EXISTS project_description text,
ADD COLUMN IF NOT EXISTS property_type text,
ADD COLUMN IF NOT EXISTS property_size text,
ADD COLUMN IF NOT EXISTS device_option text,
ADD COLUMN IF NOT EXISTS connectivity_type text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS preferred_contact text;

-- Add comment
COMMENT ON COLUMN quotes.timeline IS 'Desired timeline for the project (Consulting/Advocacy)';
COMMENT ON COLUMN quotes.budget IS 'Estimated budget (Consulting/Advocacy)';
