import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['id', 'service', 'client_name', 'client_email', 'client_phone'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Insert quote using admin client (bypasses RLS)
        const { data, error } = await supabaseAdmin.from('quotes').insert({
            id: body.id,
            service: body.service,
            property_type: body.property_type || null,
            property_size: body.property_size || null,
            client_name: body.client_name,
            client_email: body.client_email,
            client_phone: body.client_phone,
            client_company: body.client_company || null,
            message: body.message || null,
            address: body.address || null,
            bill_files: body.bill_files || [],
            status: 'pending',
            user_id: body.user_id || null,
            booking_preference: body.booking_preference || null,

            // Inquiry/Consulting Fields
            project_description: body.project_description || null,
            timeline: body.timeline || null,
            budget: body.budget || null
        }).select().single();

        if (error) {
            console.error('Error creating quote:', error);
            return NextResponse.json(
                { error: 'Failed to create quote', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            quote: data
        });

    } catch (error) {
        console.error('Error in create-quote API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
