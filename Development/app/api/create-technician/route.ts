
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomBytes, randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const { fullName, email, phone, specialties, active } = await request.json();

        if (!email || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const to = email;

        // 1. Check if technician email already exists
        const { data: existing } = await supabaseAdmin
            .from('technicians')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Technician with this email already exists' }, { status: 400 });
        }

        // 2. Insert into technicians table (with uid = null initially)
        // We explicitly generate ID since DB default might be missing
        const newTechId = randomUUID();

        const { data: newTech, error: dbError } = await supabaseAdmin
            .from('technicians')
            .insert({
                id: newTechId,
                name: fullName,
                email,
                phone,
                specialties: specialties || [],
                is_active: active !== undefined ? active : true,
                uid: null // Explicitly null, waiting for activation
            })
            .select()
            .single();

        if (dbError) {
            console.error('Error creating technician profile:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 3. Generate Magic Link
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const { error: magicError } = await supabaseAdmin.from('magic_links').insert({
            token,
            email,
            full_name: fullName || '',
            role: 'technician',
            service: 'Field Service',
            expires_at: expiresAt,
            used: false
        });

        if (magicError) {
            console.error('Error creating magic link:', magicError);
            // Should we rollback tech? For now, just error.
            return NextResponse.json({ error: 'Failed to create invitation link' }, { status: 500 });
        }

        // 4. Send Invite Email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const magicLink = `${baseUrl}/onboard/${token}`;

        await fetch(`${baseUrl}/api/send-onboarding-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                fullName,
                magicLink,
                role: 'technician',
                language: 'es' // Default to ES for now or pass from frontend
            })
        });

        return NextResponse.json({
            success: true,
            technicianId: newTech.id,
            message: 'Invitation sent successfully'
        });

    } catch (error: any) {
        console.error('Error in create-technician API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
