-- Add phases column to quotes table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS phases JSONB DEFAULT '[]'::jsonb;

-- Add phases column to active_projects table
ALTER TABLE public.active_projects 
ADD COLUMN IF NOT EXISTS phases JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN public.quotes.phases IS 'List of payment phases for Consulting/Advocacy services';
COMMENT ON COLUMN public.active_projects.phases IS 'List of payment phases for Consulting/Advocacy services';
