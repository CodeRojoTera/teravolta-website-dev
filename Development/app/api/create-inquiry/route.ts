import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['full_name', 'email', 'phone', 'service', 'project_description', 'city', 'state', 'address'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Insert inquiry using admin client (bypasses RLS)
        const { data, error } = await supabaseAdmin.from('inquiries').insert({
            full_name: body.full_name,
            email: body.email,
            phone: body.phone,
            company: body.company || null,
            service: body.service,
            project_description: body.project_description,
            timeline: body.timeline || null,
            budget: body.budget || null,
            property_type: body.property_type || null,
            preferred_contact: body.preferred_contact || 'email',
            status: 'new',
            city: body.city,
            state: body.state,
            zip_code: body.zip_code || null,
            address: body.address
        }).select().single();

        if (error) {
            console.error('Error creating inquiry:', error);
            return NextResponse.json(
                { error: 'Failed to create inquiry' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            inquiry: data
        });

    } catch (error) {
        console.error('Error in create-inquiry API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
