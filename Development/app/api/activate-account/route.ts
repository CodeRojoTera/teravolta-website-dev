import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const {
            token,
            password,
            email,
            fullName,
            phone,
            company,
            role,
            service,
            inquiryId,
            quoteId
        } = await request.json();

        if (!token || !password || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Verify Token
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
                { status: 400 }
            );
        }

        const expiresAt = new Date(linkData.expires_at);
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 400 }
            );
        }

        let userId = '';

        // 2. Create or Get User (Supabase Auth)
        // 2. Create or Get User (Supabase Auth)

        // First, check if they exist in public.users (Linked User)
        const { data: existingPublicUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingPublicUser) {
            userId = existingPublicUser.id;
            console.log(`User already exists in public table (${userId}). Updating credentials...`);
            // Update password & confirm email
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                password,
                email_confirm: true,
                user_metadata: { full_name: fullName }
            });
        } else {
            // Not in public table. Try to create in Auth.
            try {
                const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true, // Auto confirm
                    user_metadata: { full_name: fullName }
                });

                if (createError) throw createError;
                if (!authUser.user) throw new Error('No user returned from create');

                userId = authUser.user.id;
            } catch (e: any) {
                // Check for "User already registered" error
                const msg = e.message || e.toString();
                if (msg.includes('already registered')) {
                    console.log('User exists in Auth (Shadow User). Finding ID...');
                    // Fallback: search in listUsers (Shadow user case)
                    // Note: This is an admin operation. Scan first 1000 users.
                    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
                    const found = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

                    if (found) {
                        userId = found.id;
                        await supabaseAdmin.auth.admin.updateUserById(userId, {
                            password,
                            email_confirm: true,
                            user_metadata: { full_name: fullName }
                        });
                    } else {
                        throw new Error(`User exists in Auth but could not be found via admin list for email: ${email}`);
                    }
                } else {
                    throw new Error(`Auth Creation Error: ${msg}`);
                }
            }
        }

        // 3. Create/Update Public User Profile (Supabase)
        const userRole = role || 'customer';
        await supabaseAdmin.from('users').upsert({
            id: userId,
            email,
            full_name: fullName,
            phone,
            company: company || '',
            role: userRole,
            // created_at handles itself or update
        });

        // 4. Associate Quotes (Customer Only - Supabase)
        // 4. Associate Quotes (Customer Only - Supabase)
        if (userRole === 'customer') {
            // Update Quotes with this email
            const { data: quotes } = await supabaseAdmin
                .from('quotes')
                .select('id, property_type')
                .eq('email', email);

            if (quotes && quotes.length > 0) {
                await supabaseAdmin
                    .from('quotes')
                    .update({ user_id: userId })
                    .eq('email', email);
            }

            // Update Inquiries with this email OR by specific ID
            // 1. If explicit ID provided, link it.
            if (inquiryId) {
                const { error: inquiryError } = await supabaseAdmin
                    .from('inquiries')
                    .update({ user_id: userId })
                    .eq('id', inquiryId);

                if (inquiryError) console.error('Error linking specific inquiry:', inquiryError);
            }

            // 2. Also catch-all link any 'orphan' inquiries with this email that have no user_id yet
            const { error: emailInqError } = await supabaseAdmin
                .from('inquiries')
                .update({ user_id: userId })
                .eq('email', email)
                .is('user_id', null);

            if (emailInqError) console.error('Error linking orphan inquiries by email:', emailInqError);

        } else if (userRole === 'technician') {
            // Link Technician Profile
            const { error: techError } = await supabaseAdmin
                .from('technicians')
                .update({ uid: userId, active: true })
                .eq('email', email);

            if (techError) {
                console.error('Error linking technician profile:', techError);
            } else {
                console.log(`Linked technician profile for ${email} with User ID ${userId}`);
            }
        }

        // Link Inquiry/Quote to User Project if needed?
        // "Active Project" creation is usually handled by Admin or acceptance.
        // But if we need to link inquiry/quote to the USER, we just did via email->id.
        // 5. Mark Token Used
        await supabaseAdmin
            .from('magic_links')
            .update({ used: true, used_at: new Date().toISOString() })
            .eq('id', linkData.id);

        return NextResponse.json({
            success: true,
            userId: userId,
            message: 'Account activated successfully'
        });

    } catch (error: any) {
        console.error('Activation error:', error);
        return NextResponse.json(
            { error: error.message || 'Activation failed' },
            { status: 500 }
        );
    }
}
