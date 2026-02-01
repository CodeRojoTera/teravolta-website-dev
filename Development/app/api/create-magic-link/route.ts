import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    try {
        const { email, fullName, phone, company, role, inquiryId, quoteId, service } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate secure random token
        const token = randomBytes(32).toString('hex');

        // Set expiry to 24 hours from now
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // Store magic link in Supabase
        const { error } = await supabaseAdmin.from('magic_links').insert({
            token,
            email,
            full_name: fullName || '',
            phone: phone || '',
            company: company || '',
            role: role || 'customer',
            inquiry_id: inquiryId || null,
            quote_id: quoteId || null,
            service: service || '',
            expires_at: expiresAt,
            used: false
        });

        if (error) throw error;

        // Generate the magic link URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const magicLink = `${baseUrl}/onboard/${token}`;

        return NextResponse.json({
            success: true,
            token,
            magicLink,
            expiresAt
        });
    } catch (error) {
        console.error('Error creating magic link:', error);
        return NextResponse.json(
            { error: 'Failed to create magic link' },
            { status: 500 }
        );
    }
}
