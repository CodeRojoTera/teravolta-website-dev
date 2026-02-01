import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Prevent caching for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
        }

        // 1. Get All Active Technicians
        const { count: activeTechsCount, error: techError } = await supabaseAdmin
            .from('technicians')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        if (techError) {
            console.error('Error fetching technicians:', techError);
            throw techError;
        }

        if (!activeTechsCount || activeTechsCount === 0) {
            return NextResponse.json({ slots: [] });
        }

        // 2. Get Appointments for Date Range
        // Parse input date (YYYY-MM-DD)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Query using admin client (bypasses RLS)
        const { data: appointments, error: appError } = await supabaseAdmin
            .from('appointments')
            .select('date')
            .gte('date', startOfDay.toISOString())
            .lte('date', endOfDay.toISOString());

        if (appError) {
            console.error('Error fetching appointments:', appError);
            throw appError;
        }

        // 3. Define Standard Slots
        const allSlots = [
            '08:00', '09:00', '10:00', '11:00',
            '13:00', '14:00', '15:00', '16:00', '17:00'
        ];

        // 4. Calculate Availability
        const availableSlots = allSlots.filter(slot => {
            // Count bookings for this slot
            const bookedCount = (appointments || []).filter(app => {
                if (!app.date) return false;

                // Handle ISO string from Supabase
                const appDate = new Date(app.date);

                const appTime = appDate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Panama' // Ensure consistent timezone if deployed
                });

                // Match HH:MM
                return appTime.startsWith(slot);
            }).length;

            return bookedCount < activeTechsCount;
        });

        return NextResponse.json({ slots: availableSlots });

    } catch (error) {
        console.error('Error in availability API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
