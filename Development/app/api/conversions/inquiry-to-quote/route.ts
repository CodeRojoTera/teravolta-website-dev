import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { inquiryId, userId } = payload;

        if (!inquiryId || !userId) {
            return NextResponse.json(
                { error: 'Missing inquiryId or userId' },
                { status: 400 }
            );
        }

        console.log(`Converting inquiry ${inquiryId} to quote for user ${userId}`);

        // 1. Fetch the Inquiry
        const { data: inquiry, error: fetchError } = await supabaseAdmin
            .from('inquiries')
            .select('*')
            .eq('id', inquiryId)
            .single();

        if (fetchError || !inquiry) {
            throw new Error('Inquiry not found');
        }

        // 2. Create the Quote
        const quoteId = uuidv4();
        const newQuote = {
            id: quoteId,
            user_id: userId,
            service: inquiry.service,
            property_type: inquiry.property_type,
            // Map other available fields
            client_name: inquiry.full_name,
            client_email: inquiry.email,
            client_phone: inquiry.phone,
            client_company: inquiry.company,
            project_description: inquiry.project_description,
            timeline: inquiry.timeline,
            budget: inquiry.budget,
            address: {
                street: inquiry.address,
                city: inquiry.city,
                state: inquiry.state,
                zip_code: inquiry.zip_code,
                country: 'PA' // Default based on form
            },
            status: 'pending', // Important: Starts as pending/draft
            created_at: new Date().toISOString()
        };

        const { error: insertError } = await supabaseAdmin
            .from('quotes')
            .insert(newQuote);

        if (insertError) {
            console.error("Error creating quote from inquiry:", insertError);
            throw insertError;
        }

        // 3. Mark Inquiry as processed/converted (optional, but good practice)
        // Assuming there might be a status field, or we just leave it.
        // For now, we update the inquiry with the user_id as well to link them.
        await supabaseAdmin
            .from('inquiries')
            .update({ user_id: userId })
            .eq('id', inquiryId);

        return NextResponse.json({ success: true, quoteId: quoteId });

    } catch (error: any) {
        console.error('API Error converting inquiry to quote:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to convert inquiry to quote' },
            { status: 500 }
        );
    }
}
