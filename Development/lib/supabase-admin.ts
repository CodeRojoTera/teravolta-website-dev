import { createClient } from '@supabase/supabase-js'

// Server-side Admin Supabase client with Service Role Key
// DANGEROUS: Never import this in client-side components!
// Use only in API routes or Server Actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase Admin environment variables - API routes may fail');
}

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : createClient('https://placeholder.supabase.co', 'placeholder', {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
