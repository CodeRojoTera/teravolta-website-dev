
import { createClient } from '@supabase/supabase-js';

// Force load envs
const supabaseUrl = 'https://oqnyfnyvxuxgovwwyxci.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbnlmbnl2eHV4Z292d3d5eGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgyNjgzMiwiZXhwIjoyMDgzNDAyODMyfQ.tOMQ05DdOkGoeFwP0xjK-qw9j7cz3xv0f1KXZRNDqPk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testQuery() {
    console.log('Testing Admin Inquiries HEAD query...');

    try {
        // Reproduce the failing query
        // .select('*', { count: 'exact', head: true })
        // .neq('status', 'resolved');

        const { count, error } = await supabase
            .from('admin_inquiries')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'resolved');

        if (error) {
            console.error('Query Failed:', error);
        } else {
            console.log('Query Success. Count:', count);
        }

    } catch (e) { console.error('Crash:', e); }
}

testQuery();
