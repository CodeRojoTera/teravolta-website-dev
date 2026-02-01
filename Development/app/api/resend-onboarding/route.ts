import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    try {
        const { email, fullName, service, language = 'es', role } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Generate secure random token
        const token = randomBytes(32).toString('hex');

        // 2. Set expiry to 24 hours from now
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // 3. Store magic link in Supabase
        const { error: magicError } = await supabaseAdmin.from('magic_links').insert({
            token,
            email,
            full_name: fullName || '',
            role: role || 'customer',
            service: service || '',
            expires_at: expiresAt,
            used: false
        });

        if (magicError) throw magicError;

        // 4. Generate the magic link URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const magicLink = `${baseUrl}/onboard/${token}`;

        // 5. Send onboarding email via Resend (reusing existing logic)
        const emailRes = await fetch(`${baseUrl}/api/send-onboarding-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                fullName,
                magicLink,
                service,
                language,
                role
            })
        });

        if (!emailRes.ok) {
            const errorData = await emailRes.json();
            throw new Error(errorData.error || 'Failed to send onboarding email');
        }

        return NextResponse.json({
            success: true,
            message: 'Onboarding email resent successfully'
        });
    } catch (error: any) {
        console.error('Error resending onboarding email:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to resend onboarding email' },
            { status: 500 }
        );
    }
}
