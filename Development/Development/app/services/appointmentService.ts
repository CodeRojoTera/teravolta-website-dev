import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus } from '@/lib/types';

const TABLE_NAME = 'appointments';

export const AppointmentService = {
    /**
     * Create a new appointment
     */
    create: async (data: Omit<Appointment, 'id' | 'createdAt' | 'status'> & { status?: AppointmentStatus }): Promise<string> => {
        try {
            const { data: inserted, error } = await supabase
                .from(TABLE_NAME)
                .insert({
                    technician_id: data.technicianId,
                    project_id: data.projectId,
                    date: data.date,
                    status: data.status || 'scheduled',
                    notes: data.notes,
                    address: data.clientAddress,
                    client_name: data.clientName,
                })
                .select('id')
                .single();

            if (error) throw error;
            return inserted.id;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    /**
     * Get appointments for a specific technician
     */
    getByTechnician: async (technicianId: string): Promise<Appointment[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('technician_id', technicianId)
                .order('date', { ascending: true });

            if (error) throw error;

            return (data || []).map(row => AppointmentService.mapRowToAppointment(row));
        } catch (error) {
            console.error('Error fetching appointments for technician:', error);
            throw error;
        }
    },

    /**
     * Get appointments by Technician UID (Auth User ID)
     */
    getByTechnicianUid: async (uid: string): Promise<Appointment[]> => {
        try {
            // 1. Resolve Technician ID from Auth UID
            const { data: tech, error: techError } = await supabase
                .from('technicians')
                .select('id')
                .eq('uid', uid)
                .maybeSingle();

            if (techError || !tech) {
                console.warn('Technician profile not found for user:', uid);
                return [];
            }

            // 2. Query Appointments using resolved internal ID
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*, active_projects(client_email, user_id)')
                .eq('technician_id', tech.id)
                .order('date', { ascending: true });

            if (error) throw error;

            return (data || []).map(row => AppointmentService.mapRowToAppointment(row));
        } catch (error) {
            console.error('Error fetching appointments by UID:', error);
            throw error;
        }
    },

    /**
     * Get appointments for a specific project
     */
    getByProject: async (projectId: string): Promise<Appointment[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('project_id', projectId)
                .order('date', { ascending: false });

            if (error) throw error;

            return (data || []).map(row => AppointmentService.mapRowToAppointment(row));
        } catch (error) {
            console.error('Error fetching appointments for project:', error);
            throw error;
        }
    },

    /**
     * Update appointment status or details
     */
    update: async (id: string, data: Partial<Appointment>): Promise<void> => {
        try {
            const payload: any = {};
            if (data.technicianId !== undefined) payload.technician_id = data.technicianId;
            // if (data.technicianUid !== undefined) payload.technician_uid = data.technicianUid; // Removed
            if (data.projectId !== undefined) payload.project_id = data.projectId;
            if (data.date !== undefined) payload.date = data.date;
            if (data.status !== undefined) payload.status = data.status;
            if (data.notes !== undefined) payload.notes = data.notes;
            if (data.clientAddress !== undefined) payload.address = data.clientAddress;
            if (data.clientName !== undefined) payload.client_name = data.clientName;
            if (data.checkInTime !== undefined) payload.check_in_time = data.checkInTime;
            if (data.checkOutTime !== undefined) payload.check_out_time = data.checkOutTime;
            if (data.photos !== undefined) payload.photos = data.photos;

            const { error } = await supabase
                .from(TABLE_NAME)
                .update(payload)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    },

    /**
     * Update status with specific side effects (timestamps)
     */
    updateStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
        try {
            const payload: any = { status };
            const now = new Date().toISOString();

            if (status === 'in_progress') {
                payload.check_in_time = now;
            } else if (status === 'completed') {
                payload.check_out_time = now;
            }

            const { error } = await supabase
                .from(TABLE_NAME)
                .update(payload)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    },

    /**
     * Add photo evidence URL to appointment
     */
    addPhotoEvidence: async (id: string, photoUrl: string): Promise<void> => {
        try {
            // Fetch current photos first to append
            const { data, error: fetchError } = await supabase
                .from(TABLE_NAME)
                .select('photos')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            const currentPhotos = data?.photos || [];
            const updatedPhotos = [...currentPhotos, photoUrl];

            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ photos: updatedPhotos })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error adding photo evidence:', error);
            throw error;
        }
    },

    /**
     * Get appointments for a specific date (YYYY-MM-DD or ISO)
     */
    getByDate: async (dateString: string): Promise<Appointment[]> => {
        try {
            const startOfDay = new Date(dateString);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(dateString);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .gte('date', startOfDay.toISOString())
                .lte('date', endOfDay.toISOString());

            if (error) throw error;

            return (data || []).map(row => AppointmentService.mapRowToAppointment(row));
        } catch (error) {
            console.error('Error fetching appointments by date:', error);
            throw error;
        }
    },

    // Helper to map DB snake_case to App camelCase
    mapRowToAppointment: (row: any): Appointment => ({
        id: row.id,
        technicianId: row.technician_id,
        technicianUid: row.technician_uid,
        projectId: row.project_id,
        date: row.date, // Keep as returned (ISO string)
        status: row.status,
        notes: row.notes,
        clientAddress: row.address || row.client_address || '', // Map DB address to clientAddress
        clientName: row.client_name || '',
        clientPhone: row.client_phone || '',
        clientEmail: row.active_projects?.client_email || '', // Map joined email
        clientUserId: row.active_projects?.user_id || null, // Map joined user_id
        technicianName: row.technician_name || 'Technician', // Fallback or denormalized
        photos: row.photos,
        checkInTime: row.check_in_time,
        checkOutTime: row.check_out_time,
        createdAt: row.created_at,
        createdBy: row.created_by || 'system'
    } as Appointment),

    /**
     * Report an incident for an appointment
     */
    reportIncident: async (appointmentId: string, reason: string, comment: string, technicianUid: string): Promise<{ outcome: 'reassigned' | 'request_created'; newTechnician?: string }> => {
        try {
            // 1. Fetch Appointment data
            const { data: appointment, error: aptError } = await supabase
                .from(TABLE_NAME)
                .select('date, technician_id, project_id') // Needed project_id for reassign
                .eq('id', appointmentId)
                .single();

            if (aptError) throw aptError;

            let outcome: 'reassigned' | 'request_created' = 'request_created';
            let newTechnicianName = '';

            // 2. Search for replacement
            if (appointment && appointment.date) {
                const dateObj = new Date(appointment.date);
                const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

                // Dynamic import to avoid circular dependency
                const { TechnicianService } = await import('./technicianService');

                const availableTechs = await TechnicianService.findAvailableTechnicians(
                    dateStr,
                    timeStr,
                    appointment.technician_id
                );

                // 3a. Auto-Reassign if found
                if (availableTechs.length > 0) {
                    const replacement = availableTechs[0];
                    console.log(`Auto-reassigning appointment ${appointmentId} to ${replacement.name}`);

                    // Perform Reassignment
                    await AppointmentService.reassign(appointmentId, replacement.id, appointment.project_id);

                    outcome = 'reassigned';
                    newTechnicianName = replacement.name;

                    // Log the incident as "resolved" request for audit trail
                    await supabase.from('admin_requests').insert({
                        type: 'incident_report',
                        priority: 'high',
                        status: 'auto_resolved',
                        requester_id: technicianUid,
                        related_entity_id: appointmentId,
                        related_entity_type: 'appointment',
                        details: {
                            reason,
                            comment,
                            timestamp: new Date().toISOString(),
                            resolution: `Auto-reassigned to ${replacement.name}`,
                            original_technician_id: appointment.technician_id,
                            new_technician_id: replacement.id
                        }
                    });

                    return { outcome: 'reassigned', newTechnician: newTechnicianName };
                }
            }

            // 3b. Manual Intervention fallback
            await supabase.from('admin_requests').insert({
                type: 'reschedule_request',
                priority: 'high',
                status: 'pending',
                requester_id: technicianUid,
                related_entity_id: appointmentId,
                related_entity_type: 'appointment',
                details: {
                    reason,
                    comment,
                    timestamp: new Date().toISOString(),
                    suggested_action: 'Manual Reschedule Needed'
                }
            });

            return { outcome: 'request_created' };

        } catch (error) {
            console.error('Error reporting incident:', error);
            throw error;
        }
    },

    /**
     * Reassign an appointment to a new technician.
     * Updates both the appointment record and the parent active_project.
     */
    reassign: async (appointmentId: string, newTechnicianId: string, projectId: string): Promise<void> => {
        try {
            // 1. Update Appointment
            const { error: aptError } = await supabase
                .from(TABLE_NAME)
                .update({
                    technician_id: newTechnicianId,
                    status: 'scheduled' // Reset status to scheduled for the new tech
                })
                .eq('id', appointmentId);

            if (aptError) throw aptError;

            // 2. Update Active Project (Sync assigned_to array)
            // Note: This logic assumes single-technician assignment or complete replacement.
            // For multi-tech, we would need to remove old ID and add new ID.
            if (projectId) {
                const { error: projError } = await supabase
                    .from('active_projects')
                    .update({
                        assigned_to: [newTechnicianId] // UUID Array
                    })
                    .eq('id', projectId);

                if (projError) throw projError;
            }

            // 3. Notify the new technician
            try {
                await fetch('/api/create-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: newTechnicianId,
                        type: 'info',
                        title: 'Appointment Reassigned',
                        message: 'You have been assigned to a new appointment.',
                        link: '/portal/technician'
                    })
                });
            } catch (notifErr) {
                console.error('Failed to notify technician:', notifErr);
            }

        } catch (error) {
            console.error('Error reassigning appointment:', error);
            throw error;
        }
    }
};
