import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 });
        }

        const { data: linkData, error } = await supabaseAdmin
            .from('magic_links')
            .select('*')
            .eq('token', token)
            .single();

        if (error || !linkData) {
            return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 404 });
        }

        // Check used
        if (linkData.used) {
            return NextResponse.json({ valid: false, error: 'used', data: linkData });
        }

        // Check expired
        const expiresAt = new Date(linkData.expires_at);
        if (expiresAt < new Date()) {
            return NextResponse.json({ valid: false, error: 'expired', data: linkData });
        }

        // Valid
        // Map snake_case to camelCase for client
        const clientData = {
            id: linkData.id,
            token: linkData.token,
            email: linkData.email,
            fullName: linkData.full_name || linkData.email.split('@')[0], // Fallback
            phone: linkData.phone, // Might be undefined if not in table, assuming schema
            company: linkData.company,
            role: linkData.role,
            service: linkData.service,
            inquiryId: linkData.inquiry_id,
            quoteId: linkData.quote_id,
            expiresAt: linkData.expires_at,
            used: linkData.used
        };

        return NextResponse.json({ valid: true, data: clientData });

    } catch (error: any) {
        console.error('Verify token error:', error);
        return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
    }
}
