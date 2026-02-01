import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { quoteId, userId } = payload;

        if (!quoteId || !userId) {
            return NextResponse.json(
                { error: 'Missing quoteId or userId' },
                { status: 400 }
            );
        }

        console.log(`Claiming quote ${quoteId} for user ${userId}`);

        // Update the quote with the user_id
        const { error } = await supabaseAdmin
            .from('quotes')
            .update({ user_id: userId })
            .eq('id', quoteId);

        if (error) {
            console.error('Error claiming quote:', error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('API Error claiming quote:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to claim quote' },
            { status: 500 }
        );
    }
}
