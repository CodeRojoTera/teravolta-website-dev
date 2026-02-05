import { supabase } from '@/lib/supabase';
import { addDays, format, isAfter, isBefore, parseISO, setHours, setMinutes } from 'date-fns';
import { TechnicianService } from './technicianService';
import { EmailService } from './emailService';

export const RescheduleService = {
    /**
     * Creates a secure reschedule token for an appointment.
     * Token is valid for 48 hours by default.
     */
    async createToken(appointmentId: string, adminId: string) {
        // 48 hours from now
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('reschedule_tokens')
            .insert({
                appointment_id: appointmentId,
                created_by: adminId,
                expires_at: expiresAt
            })
            .select('token')
            .single();

        if (error) throw error;
        return data.token;
    },

    /**
     * Send reschedule link to customer associated with the appointment
     */
    async sendToCustomer(appointmentId: string, token: string) {
        try {
            // 1. Fetch Appointment and Customer details
            // We need to join with active_projects -> clients/users to get email
            // Or if appointments has user_id directly.

            // First check appointment to get project_id or user_id
            const { data: apt, error: aptError } = await supabase
                .from('appointments')
                .select(`
                    *,
                    active_projects (
                        client_email,
                        client_name
                    )
                `)
                .eq('id', appointmentId)
                .single();

            if (aptError || !apt) throw new Error('Appointment not found');

            const email = apt.active_projects?.client_email;
            const name = apt.active_projects?.client_name || 'Customer';

            if (!email) {
                throw new Error('Customer email not found for this appointment');
            }

            const link = `${window.location.origin}/reschedule/${token}`;

            // 2. Send Email
            await EmailService.sendRescheduleLink(email, link, name);

            return { success: true, email };
        } catch (error) {
            console.error('Failed to send reschedule email:', error);
            throw error;
        }
    },

    /**
     * Validates a token and returns the associated appointment details.
     * Throws error if invalid or expired.
     */
    async validateToken(token: string) {
        const { data, error } = await supabase
            .from('reschedule_tokens')
            .select(`
                *,
                appointments (
                    id, project_id, date, technician_id,
                    active_projects (
                        client_name, address, service
                    )
                )
            `)
            .eq('token', token)
            .single();

        if (error) throw new Error('Invalid token');

        if (!data) throw new Error('Token not found');
        if (data.used_at) throw new Error('This link has already been used');
        if (new Date(data.expires_at) < new Date()) throw new Error('This link has expired');

        return data; // Returns token object with expanded appointment details
    },

    /**
     * Confirms the reschedule: updates appointment and marks token as used.
     */
    async confirmReschedule(token: string, newDate: Date, newTechId: string) {
        const tokenData = await this.validateToken(token);
        const appointmentId = tokenData.appointment_id;

        // 1. Update Appointment
        const { error: appError } = await supabase
            .from('appointments')
            .update({
                date: newDate.toISOString(),
                technician_id: newTechId,
                status: 'scheduled'
            })
            .eq('id', appointmentId);

        if (appError) throw appError;

        // 2. Mark Token as Used
        const { error: tokenError } = await supabase
            .from('reschedule_tokens')
            .update({ used_at: new Date().toISOString() })
            .eq('id', tokenData.id);

        if (tokenError) console.error("Error invalidating token:", tokenError);

        return true;
    }
};
