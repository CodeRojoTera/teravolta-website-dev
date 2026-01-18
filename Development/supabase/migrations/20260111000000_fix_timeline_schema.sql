-- Fix timeline column collision
-- 1. Add new column for client's preferred timeline (e.g. 'ASAP')
ALTER TABLE active_projects ADD COLUMN IF NOT EXISTS client_timeline TEXT;

-- 2. Move existing text data from 'timeline' to 'client_timeline'
-- (Only if it's not already a JSON array structure, though current 'timeline' is text)
UPDATE active_projects 
SET client_timeline = timeline 
WHERE timeline IS NOT NULL AND timeline NOT LIKE '[%';

-- 3. Reset 'timeline' to empty JSON array where it was text
UPDATE active_projects 
SET timeline = '[]'::jsonb 
WHERE timeline IS NOT NULL AND timeline NOT LIKE '[%';

-- 4. Convert 'timeline' to JSONB for Project History
ALTER TABLE active_projects 
ALTER COLUMN timeline TYPE JSONB USING timeline::jsonb;

-- 5. Set default
ALTER TABLE active_projects 
ALTER COLUMN timeline SET DEFAULT '[]'::jsonb;
