-- Add user_id to inquiries table to allow linking to auth.users
ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);
