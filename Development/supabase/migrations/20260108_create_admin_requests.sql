-- Create admin_requests table
CREATE TABLE IF NOT EXISTS admin_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('incident_report', 'reassignment_request', 'reschedule_request')),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'normal', 'low')) DEFAULT 'normal',
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')) DEFAULT 'pending',
    requester_id UUID REFERENCES auth.users(id),
    related_entity_id UUID,
    related_entity_type TEXT CHECK (related_entity_type IN ('appointment', 'active_project')),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all requests" ON admin_requests
    FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

CREATE POLICY "Admins can update requests" ON admin_requests
    FOR UPDATE USING (auth.role() = 'service_role' OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

CREATE POLICY "Users can view their own requests" ON admin_requests
    FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Users can create requests" ON admin_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);
