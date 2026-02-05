-- Insert Active Projects from Firestore Backup

INSERT INTO active_projects (
    id, user_id, client_name, client_email, client_phone, address, service, 
    payment_status, scheduled_date, scheduled_time, progress, created_at, 
    appointment_id, assigned_to, status, description
) VALUES 
(
    'Fq7CPjYlhlAcQttzpMmQ', 
    '57d3e428-23df-4f7d-b4d8-7d1d38b2f7ec', 
    'AGUSTIN O LEDESMA', 
    'martines.aquiles.64@outlook.com', 
    '+17869091141', 
    '1000 W Brevard St', 
    'efficiency', 
    'paid', 
    '2026-02-03', 
    '15:00', 
    0, 
    to_timestamp(1767851420), 
    'KLkn5sbJR5ih3gLHIq7Q', 
    ARRAY['e8ISvmPWAFQ79yexuUws'], 
    'pending_installation',
    'Eficiencia Energética - AGUSTIN O LEDESMA'
),
(
    'Rnwd0C2mFhZt8GVDnCzG', 
    '57d3e428-23df-4f7d-b4d8-7d1d38b2f7ec', 
    'AGUSTIN O LEDESMA', 
    'martines.aquiles.64@outlook.com', 
    '+17869091141', 
    '1000 W Brevard St', 
    'efficiency', 
    'paid', 
    '2026-01-28', 
    '08:00', 
    0, 
    to_timestamp(1767843661), 
    'WD3q5JkI0abC3v1LAJZx', 
    ARRAY['e8ISvmPWAFQ79yexuUws'], 
    'pending_installation',
    'Eficiencia Energética - AGUSTIN O LEDESMA'
),
(
    'b2egritIi0PX926vpFbR', 
    NULL, -- userId is null in backup
    'Juan Valdes', 
    'aal35v@outlook.com', 
    '66762542', 
    'Panama', 
    'efficiency', 
    'paid', 
    '2026-01-07', 
    '10:00', 
    0, 
    to_timestamp(1767512098), 
    NULL, -- No appointmentId in backup
    NULL, -- No assignedTo in backup
    'pending_installation',
    'Eficiencia Energética - Juan Valdes'
)
ON CONFLICT (id) DO NOTHING;
