import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const { email, password, token } = await request.json();

        if (!email || !password || !token) {
            return NextResponse.json(
                { error: 'Email, password, and token are required' },
                { status: 400 }
            );
        }

        // Verify the magic link token is valid and matches the email
        const { data: linkData, error: linkError } = await supabaseAdmin
            .from('magic_links')
            .select('*')
            .eq('token', token)
            .eq('email', email)
            .eq('used', false)
            .single();

        if (linkError || !linkData) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 403 }
            );
        }

        // Check expiration
        const expiresAt = new Date(linkData.expires_at);
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 403 }
            );
        }

        // Get the user by email (from users table to get ID)
        const { data: userRecord, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !userRecord) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update the user's password
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userRecord.id,
            { password: password }
        );

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            uid: userRecord.id,
            message: 'Password updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update password' },
            { status: 500 }
        );
    }
}
