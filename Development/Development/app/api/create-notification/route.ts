import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * API Route: Create Notification
 * 
 * Used by client-side services to create notifications for other users
 * (which they wouldn't be able to do directly due to RLS)
 */
export async function POST(request: Request) {
    try {
        const { userId, type, title, message, link } = await request.json();

        if (!userId || !title) {
            return NextResponse.json(
                { error: 'userId and title are required' },
                { status: 400 }
            );
        }

        // Check user preferences before creating notification (in_app channel)
        const { data: settings } = await supabaseAdmin
            .from('user_settings')
            .select('preferences')
            .eq('user_id', userId)
            .single();

        const preferences = settings?.preferences;

        // Check global in_app preference
        if (preferences?.in_app === false) {
            console.log(`Notification suppressed for user ${userId}: in_app disabled`);
            return NextResponse.json({ suppressed: true, reason: 'in_app_disabled' });
        }

        // Check type-specific preference
        const notificationType = type || 'info';
        if (preferences?.types?.[notificationType] === false) {
            console.log(`Notification suppressed for user ${userId}: ${notificationType} disabled`);
            return NextResponse.json({ suppressed: true, reason: `${notificationType}_disabled` });
        }

        // Create the notification
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: userId,
                type: notificationType,
                title,
                message: message || '',
                link: link || null,
                read: false
            })
            .select('id')
            .single();

        if (error) throw error;

        return NextResponse.json({ id: data.id, created: true });

    } catch (error: any) {
        console.error('Error creating notification:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create notification' },
            { status: 500 }
        );
    }
}
