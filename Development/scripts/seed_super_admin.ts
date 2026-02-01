
import { createClient } from '@supabase/supabase-js';

// Hardcoding keys temporarily to bypass dotenv issues
const supabaseUrl = 'https://oqnyfnyvxuxgovwwyxci.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbnlmbnl2eHV4Z292d3d5eGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgyNjgzMiwiZXhwIjoyMDgzNDAyODMyfQ.tOMQ05DdOkGoeFwP0xjK-qw9j7cz3xv0f1KXZRNDqPk';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seedSuperAdmin() {
    const email = 'superadmin@teravolta.com';
    const password = 'TeravoltaSuperAdmin2026!';
    const fullName = 'Super Admin TeraVolta';

    console.log(`Seeding Super Admin: ${email}`);

    // 1. Create User
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName,
            role: 'super_admin'
        }
    });

    if (error) {
        console.error('Error creating Super Admin:', error);
    } else {
        console.log('Super Admin Auth User Created:', data.user.id);

        // 2. Ensure Public Profile Exists
        const { error: profileError } = await supabase
            .from('users')
            .upsert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: 'super_admin',
                status: 'active'
            });

        if (profileError) {
            console.error('Error creating public profile:', profileError);
        } else {
            console.log('Super Admin Public Profile Verified.');
        }
    }
}

seedSuperAdmin();
