
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Hardcoding keys for reliability in this script only
const supabaseUrl = 'https://oqnyfnyvxuxgovwwyxci.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbnlmbnl2eHV4Z292d3d5eGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgyNjgzMiwiZXhwIjoyMDgzNDAyODMyfQ.tOMQ05DdOkGoeFwP0xjK-qw9j7cz3xv0f1KXZRNDqPk';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function seed() {
    console.log('🌱 Seeding Demo Data...');
    const password = 'password123';
    let output = '';

    // 1. Technician
    const techEmail = `tech_${Date.now()}@test.com`;
    const { data: techAuth, error: techErr } = await supabase.auth.admin.createUser({
        email: techEmail, password: password, email_confirm: true, user_metadata: { full_name: 'Test Technician' }
    });
    if (techErr) console.error('Tech create failed:', techErr.message);
    else {
        const userId = techAuth.user.id;
        await supabase.from('users').upsert({ id: userId, email: techEmail, role: 'technician', full_name: 'Test Technician', status: 'active' });
        await supabase.from('technicians').upsert({ uid: userId, email: techEmail, name: 'Test Technician', specialization: 'Solar', status: 'active', is_active: true });
        output += `TECHNICIAN:\nEmail: ${techEmail}\nPassword: ${password}\n\n`;
    }

    // 2. Customer
    const custEmail = `cust_${Date.now()}@test.com`;
    const { data: custAuth, error: custErr } = await supabase.auth.admin.createUser({
        email: custEmail, password: password, email_confirm: true, user_metadata: { full_name: 'Test Customer' }
    });
    let customerId = '';
    if (custErr) console.error('Customer create failed:', custErr.message);
    else {
        customerId = custAuth.user.id;
        await supabase.from('users').upsert({ id: customerId, email: custEmail, role: 'customer', full_name: 'Test Customer', status: 'active' });
        output += `CUSTOMER:\nEmail: ${custEmail}\nPassword: ${password}\n\n`;
    }

    // 3. Completed Project (For Review)
    if (techAuth?.user?.id && customerId) {
        const { data: techData } = await supabase.from('technicians').select('id').eq('uid', techAuth.user.id).single();
        if (techData) {
            const { data: proj, error: projErr } = await supabase.from('active_projects').insert({
                user_id: customerId,
                description: 'Initial Installation (Test)',
                status: 'completed',
                payment_status: 'paid',
                assigned_to: [techData.id],
                type: 'installation',
                scheduled_date: new Date().toISOString(),
                scheduled_time: '14:00'
            }).select().single();

            if (projErr) console.error('Project create failed:', projErr.message);
            else output += `PROJECT CREATED: ${proj.id} (For Review Testing)\n`;
        }
    }

    fs.writeFileSync('creds.txt', output);
    console.log('Credentials written to creds.txt');
}

seed();
