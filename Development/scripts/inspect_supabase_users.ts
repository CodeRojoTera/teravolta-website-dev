
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSupabaseUsers() {
    console.log('--- Inspecting Supabase Data ---');

    // 1. Check public.users
    const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('id, email, full_name, role');

    if (publicError) {
        console.error('Error fetching public.users:', publicError);
    } else {
        console.log(`\nFound ${publicUsers.length} users in 'public.users':`);
        publicUsers.forEach(u => console.log(` - [${u.role}] ${u.email} (ID: ${u.id})`));
    }

    // 2. Check auth.users (requires service role)
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Error fetching auth.users:', authError);
    } else {
        console.log(`\nFound ${authUsers.length} users in 'auth.users':`);
        authUsers.forEach(u => console.log(` - ${u.email} (ID: ${u.id})`));
    }
}

inspectSupabaseUsers();
