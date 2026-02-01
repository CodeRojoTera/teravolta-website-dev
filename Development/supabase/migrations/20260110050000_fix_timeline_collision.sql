-- Rename timeline text column to avoid conflict with history array
ALTER TABLE active_projects 
RENAME COLUMN timeline TO client_timeline;

-- Explicitly cast or handle if content was mixed (unlikely as it's new)
-- If strictly new, this simple rename is sufficient.

COMMENT ON COLUMN active_projects.client_timeline IS 'Desired timeline from customer (e.g. "immediately", "3 months")';
