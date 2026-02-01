import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ActiveProject } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        let userId = payload.userId;

        // Auto-resolve User ID if missing but email provided
        if (!userId && payload.clientEmail) {
            console.log(`Looking up user for ${payload.clientEmail}...`);

            // 1. Check existing users table
            const { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', payload.clientEmail)
                .single();

            if (existingUser) {
                console.log('Found existing user:', existingUser.id);
                userId = existingUser.id;
            } else {
                // 2. Create new Auth User
                console.log('Creating new user...');
                const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email: payload.clientEmail,
                    email_confirm: true,
                    user_metadata: { full_name: payload.clientName }
                });

                if (createError) throw createError;
                userId = newUser.user.id;
                console.log('Created new user:', userId);

                // Wait briefly for triggers to populate public.users if needed? 
                // Alternatively, we can assume specific DB triggers handle auth -> public.users sync.
                // Or insert manually if we suspect triggers might lag/fail.
                // For safety, let's insert into users table if it doesn't exist yet (upsert)
                const { error: upsertError } = await supabaseAdmin.from('users').upsert({
                    id: userId,
                    email: payload.clientEmail,
                    full_name: payload.clientName,
                    role: 'customer',
                    created_at: new Date().toISOString()
                });
                if (upsertError) console.error('Error syncing user profile:', upsertError);
            }
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Could not determine User ID. Please provide userId or valid clientEmail.' },
                { status: 400 }
            );
        }

        // Map camelCase payload to snake_case DB columns
        const dbPayload = {
            user_id: userId,
            client_name: payload.clientName,
            client_email: payload.clientEmail,
            client_phone: payload.clientPhone,
            client_company: payload.clientCompany, // Now supported by DB migration
            service: payload.service,
            amount: payload.amount || 0,
            status: payload.status || 'active',
            address: payload.address || '',

            // Missing mappings added:
            project_description: payload.description || '', // Map description
            property_type: payload.propertyType,
            property_size: payload.propertySize,
            client_timeline: payload.timeline, // Map text "ASAP" to client_timeline
            timeline: [], // Initialize history as empty array
            budget: payload.budget,
            source_quote_id: payload.quoteId, // Link original quote

            // Map address parts if available (assuming payload might have them split, if not they stay null)
            city: payload.city,
            state: payload.state,
            zip_code: payload.zipCode, // ensure camelCase matches payload

            // Map phases if they exist in payload
            phases: payload.phases ? payload.phases : undefined,
        };

        // If created from a quote, fetch the FULL quote data to ensure nothing is missed
        // This fixes the issue where the frontend might send incomplete data
        if (payload.quoteId) {
            const { data: quote, error: quoteError } = await supabaseAdmin
                .from('quotes')
                .select('*')
                .eq('id', payload.quoteId)
                .single();

            if (quote && !quoteError) {
                console.log('Enriching project with Quote data:', quote.id);
                // Overwrite/Fill missing fields with data from the Quote
                // Note: dbPayload is typed as object so we can extend it
                (dbPayload as any).project_description = quote.project_description || dbPayload.project_description;
                (dbPayload as any).property_type = quote.property_type;
                (dbPayload as any).property_size = quote.property_size;
                (dbPayload as any).client_timeline = quote.timeline; // Client timeline preference
                (dbPayload as any).budget = quote.budget;
                (dbPayload as any).amount = quote.amount || dbPayload.amount; // Use quote amount if set
                (dbPayload as any).created_at = new Date().toISOString();

                // Map address fields if quote has them structured
                (dbPayload as any).address = quote.address || dbPayload.address;
                (dbPayload as any).city = quote.city;
                (dbPayload as any).state = quote.state;
                (dbPayload as any).zip_code = quote.zip_code;

                // If quote table has phases (JSONB), copy them too
                if (quote.phases) {
                    (dbPayload as any).phases = quote.phases;
                }
            }
        }

        // Use admin client to insert, bypassing RLS
        const { data: inserted, error } = await supabaseAdmin
            .from('active_projects')
            .insert(dbPayload)
            .select('id')
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        // If created from a quote, transfer documents
        if (payload.quoteId) {
            console.log(`Transferring documents from Quote ${payload.quoteId} to Project ${inserted.id}`);

            // 1. Update documents table
            const { error: docError } = await supabaseAdmin
                .from('documents')
                .update({
                    entity_type: 'active_projects', // Use underscore to match database
                    entity_id: inserted.id
                })
                .eq('entity_id', payload.quoteId);

            if (docError) {
                console.error('Error transferring documents:', docError);
                // Don't fail the whole request, just log it
            }

            // 2. Ideally, we also update the quote status to 'converted' or similar
            // and link it to the project, but focus is on documents for now.
            if (payload.quoteId) {
                await supabaseAdmin.from('quotes').update({
                    status: 'approved',
                    linked_project_id: inserted.id
                }).eq('id', payload.quoteId);
            }
        }

        // Notify User
        try {
            await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                type: 'success',
                title: 'Project Created',
                message: `Your active project for ${payload.service} has been created and is now active.`,
                link: `/portal/customer`,
                read: false
            });
        } catch (notifError) {
            console.error('Error sending notification:', notifError);
        }

        return NextResponse.json({ id: inserted.id, userId: userId });

    } catch (error: any) {
        console.error('API Error creating project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}
