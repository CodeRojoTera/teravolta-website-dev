 -- Fix Customer Dashboard 400 Error: Add RLS Policy for Inquiries
-- This allows authenticated customers to read their own inquiries (by email or user_id)

-- 1. Ensure RLS is enabled
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Customers can read their own inquiries (linked by email or user_id)
CREATE POLICY "Customers can read own inquiries"
ON inquiries
FOR SELECT
USING (
    email = auth.jwt() ->> 'email'
    OR user_id = auth.uid()
);

-- 3. Policy: Admins/Super Admins can read all inquiries
-- Assuming role is stored in user profiles or a separate admin check exists
CREATE POLICY "Admins can read all inquiries"
ON inquiries
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
);
