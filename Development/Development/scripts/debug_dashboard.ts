
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load envs
const supabaseUrl = 'https://oqnyfnyvxuxgovwwyxci.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbnlmbnl2eHV4Z292d3d5eGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgyNjgzMiwiZXhwIjoyMDgzNDAyODMyfQ.tOMQ05DdOkGoeFwP0xjK-qw9j7cz3xv0f1KXZRNDqPk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testQueries() {
    console.log('Testing Admin Dashboard Queries...');

    try {
        console.log('1. Testing Pending Inquiries count...');
        const { count: pendingInquiries, error: err1 } = await supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'new');

        if (err1) console.error('Error 1:', err1);
        else console.log('Pending Inquiries:', pendingInquiries);

    } catch (e) { console.error('Crash 1:', e); }

    try {
        console.log('2. Testing Pending Quotes count...');
        const { count: pendingQuotes, error: err2 } = await supabase
            .from('quotes')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending')
            .neq('service', 'efficiency')
            .neq('service', '');

        if (err2) console.error('Error 2:', err2);
        else console.log('Pending Quotes:', pendingQuotes);
    } catch (e) { console.error('Crash 2:', e); }

    try {
        console.log('3. Testing Urgent Incidents count...');
        const { count: urgentIncidents, error: err3 } = await supabase
            .from('active_projects')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'urgent_reschedule');

        if (err3) console.error('Error 3:', err3);
        else console.log('Urgent Incidents:', urgentIncidents);
    } catch (e) { console.error('Crash 3:', e); }

    try {
        console.log('4. Testing Total Inquiries count...');
        const { count: totalInquiries, error: err4 } = await supabase
            .from('inquiries')
            .select('created_at', { count: 'exact', head: true });

        if (err4) console.error('Error 4:', err4);
        else console.log('Total Inquiries:', totalInquiries);
    } catch (e) { console.error('Crash 4:', e); }
}

testQueries();
