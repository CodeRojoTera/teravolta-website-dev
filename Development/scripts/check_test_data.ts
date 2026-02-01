
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function checkData() {
    console.log('--- USERS ---');
    const { data: users } = await supabase.from('users').select('email, role, id');
    users?.forEach(u => console.log(`[${u.role}] ${u.email}`));

    console.log('\n--- TERMINATED PROJECTS (For Reviews) ---');
    const { data: projects } = await supabase.from('active_projects')
        .select('id, description, status, assigned_to')
        .eq('status', 'completed');

    if (projects && projects.length > 0) {
        projects.forEach(p => console.log(`[COMPLETED] ${p.description} (Assigned: ${p.assigned_to})`));
    } else {
        console.log('No completed projects found. Creating one...');
        // Find a customer and tech
        const cust = users?.find(u => u.role === 'customer');
        const tech = users?.find(u => u.role === 'technician');

        if (cust && tech) {
            const { data: newProj, error } = await supabase.from('active_projects').insert({
                user_id: cust.id,
                description: 'Test Completed Project',
                status: 'completed',
                payment_status: 'paid',
                assigned_to: [tech.id], // Use array
                type: 'installation',
                scheduled_date: new Date().toISOString()
            }).select().single();
            if (error) console.error(error);
            else console.log(`CREATED Project: ${newProj.id}`);
        } else {
            console.log('Need at least 1 customer and 1 technician to create a project.');
        }
    }
}

checkData();
