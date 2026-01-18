import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const { projectId, date, time, clientName, clientAddress, clientPhone } = await request.json();

        if (!projectId || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log(`Auto-assigning for Project: ${projectId} on ${date} at ${time}`);

        // 1. Get All Active Technicians
        const { data: technicians, error: techError } = await supabaseAdmin
            .from('technicians')
            .select('*')
            .eq('is_active', true);

        if (techError) throw techError;

        if (!technicians || technicians.length === 0) {
            return NextResponse.json({ assigned: false, reason: 'No active technicians' });
        }

        // 2. Check Availability (Get appointments for conflict detection)
        const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);

        const { data: appointments, error: appError } = await supabaseAdmin
            .from('appointments')
            .select('technician_id, date')
            .gte('date', startOfDay.toISOString())
            .lte('date', endOfDay.toISOString());

        if (appError) throw appError;

        const busyTechIds = new Set();
        (appointments || []).forEach(app => {
            if (!app.date) return;
            const appDate = new Date(app.date);
            const appTime = appDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Panama'
            });

            if (appTime === time) {
                busyTechIds.add(app.technician_id);
            }
        });

        // 3. Select Candidate
        const candidates = technicians.filter(tech => !busyTechIds.has(tech.id));

        if (candidates.length === 0) {
            console.warn('No technicians available for selected slot.');

            // Update Project to Urgent
            await supabaseAdmin
                .from('active_projects')
                .update({ status: 'urgent_reschedule' })
                .eq('id', projectId);

            return NextResponse.json({ assigned: false, reason: 'No slots available' });
        }

        // Pick Random
        const assignedTech = candidates[Math.floor(Math.random() * candidates.length)];

        // 4. Create Appointment
        // Parse target time for full ISO string
        const targetDate = new Date(`${date}T${time}`);
        // Adjust for timezone if needed, but assuming input is somewhat ISO compliant or local aware

        const appointmentPayload = {
            project_id: projectId,
            technician_id: assignedTech.id,
            technician_name: assignedTech.name,
            date: targetDate.toISOString(),
            status: 'scheduled',
            client_name: clientName || 'Client',
            client_address: clientAddress || '',
            client_phone: clientPhone || '',
            notes: 'Auto-assigned by Direct Hiring Flow',
            created_by: 'system'
        };

        const { data: appointment, error: createError } = await supabaseAdmin
            .from('appointments')
            .insert(appointmentPayload)
            .select('id')
            .single();

        if (createError) throw createError;

        // 5. Update Project
        const { error: updateError } = await supabaseAdmin
            .from('active_projects')
            .update({
                status: 'pending_installation',
                assigned_to: [assignedTech.id],
                appointment_id: appointment.id,
                scheduled_date: date,
                scheduled_time: time
            })
            .eq('id', projectId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            assigned: true,
            technicianId: assignedTech.id,
            appointmentId: appointment.id
        });

    } catch (error: any) {
        console.error('Error in assign-technician API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
