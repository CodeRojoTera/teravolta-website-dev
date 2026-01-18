import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client with SSR cookie support
// This ensures the session is properly synced with the middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase environment variables');
}

// Use createBrowserClient for proper cookie handling in Next.js
// This client automatically handles:
// - Setting cookies on sign-in
// - Refreshing tokens via cookies
// - Syncing session with server middleware
export const supabase = supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createBrowserClient('https://placeholder.supabase.co', 'placeholder');

