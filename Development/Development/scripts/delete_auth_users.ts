
import { createClient } from '@supabase/supabase-js';

// Hardcoding keys temporarily to bypass dotenv issues in this environment
const supabaseUrl = 'https://oqnyfnyvxuxgovwwyxci.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbnlmbnl2eHV4Z292d3d5eGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgyNjgzMiwiZXhwIjoyMDgzNDAyODMyfQ.tOMQ05DdOkGoeFwP0xjK-qw9j7cz3xv0f1KXZRNDqPk';

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function deleteAuthUsers() {
    console.log('Fetching users to delete...');

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const usersToDelete = users.filter(u =>
        u.email === 'superadmin@teravolta.com' ||
        u.email === 'martines.aquiles.64@outlook.com'
    );

    for (const user of usersToDelete) {
        console.log(`Deleting Auth user: ${user.email} (${user.id})`);
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) {
            console.error(`Failed to delete ${user.email}:`, error);
        } else {
            console.log(`Successfully deleted ${user.email}`);
        }
    }
}

deleteAuthUsers();
