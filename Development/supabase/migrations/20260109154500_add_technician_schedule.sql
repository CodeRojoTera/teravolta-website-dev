ALTER TABLE public.technicians 
ADD COLUMN IF NOT EXISTS working_schedule JSONB DEFAULT '{"start": "08:00", "end": "17:00", "days": [1, 2, 3, 4, 5]}'::jsonb;

COMMENT ON COLUMN public.technicians.working_schedule IS 'Stores working hours {start, end} and days [0-6]';
