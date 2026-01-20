import { supabase } from '@/lib/supabase';
import { Technician } from '@/lib/types';

export const TechnicianService = {
    /**
     * Get all technicians
     */
    getAll: async (): Promise<Technician[]> => {
        try {
            // 1. Fetch all technicians
            const { data: technicians, error } = await supabase
                .from('technicians')
                .select('*')
                .order('name');

            if (error) throw error;

            // 2. Fetch all active leaves for today
            const today = new Date().toISOString().split('T')[0];
            const { data: leaves, error: leaveError } = await supabase
                .from('technician_leave_requests')
                .select('technician_id')
                .eq('status', 'approved')
                .lte('start_date', today)
                .gte('end_date', today);

            if (leaveError) throw leaveError;

            // 3. Create a set of unavailable technician IDs
            const unavailableTechIds = new Set((leaves || []).map((l: any) => l.technician_id));

            return (technicians || []).map(row => {
                const tech = mapToType(row);
                tech.availabilityStatus = unavailableTechIds.has(tech.id!) ? 'unavailable' : 'available';
                return tech;
            });
        } catch (error) {
            console.error('Error fetching technicians:', error);
            throw error;
        }
    },

    /**
     * Get all active technicians
     */
    getActive: async (): Promise<Technician[]> => {
        try {
            const { data, error } = await supabase
                .from('technicians')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;

            return (data || []).map(mapToType);
        } catch (error) {
            console.error('Error fetching active technicians:', error);
            throw error;
        }
    },

    /**
     * Get technician by ID
     */
    getById: async (id: string): Promise<Technician | null> => {
        try {
            const { data, error } = await supabase
                .from('technicians')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // Not found
                throw error;
            }

            const tech = mapToType(data);

            // Check if currently on leave
            const today = new Date().toISOString().split('T')[0];
            const { count } = await supabase
                .from('technician_leave_requests')
                .select('*', { count: 'exact', head: true })
                .eq('technician_id', id)
                .eq('status', 'approved')
                .lte('start_date', today)
                .gte('end_date', today);

            tech.availabilityStatus = count && count > 0 ? 'unavailable' : 'available';

            return tech;
        } catch (error) {
            console.error('Error fetching technician:', error);
            throw error;
        }
    },

    /**
     * Create a new technician (via API)
     */
    create: async (data: Partial<Technician>): Promise<void> => {
        try {
            const response = await fetch('/api/create-technician', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create technician');
            }
        } catch (error) {
            console.error('Error creating technician:', error);
            throw error;
        }
    },

    /**
     * Update a technician
     */
    update: async (id: string, data: Partial<Technician>): Promise<void> => {
        try {
            const payload: any = {};
            if (data.fullName) payload.name = data.fullName;
            if (data.email) payload.email = data.email;
            if (data.phone) payload.phone = data.phone;
            if (data.specialties) payload.specialties = data.specialties;
            if (data.active !== undefined) payload.is_active = data.active;
            if (data.workingHours) payload.working_schedule = data.workingHours;
            if (data.vacationQuota !== undefined) payload.vacation_quota = data.vacationQuota;

            const { error } = await supabase
                .from('technicians')
                .update(payload)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating technician:', error);
            throw error;
        }
    },

    /**
     * Delete a technician
     */
    delete: async (id: string): Promise<void> => {
        try {
            // 1. Delete Leaves
            await supabase.from('technician_leave_requests').delete().eq('technician_id', id);

            // 2. Delete Reviews
            await supabase.from('technician_reviews').delete().eq('technician_id', id);

            // 3. Unassign from active projects (optional, or handle elsewhere)
            // For now, let's assume constraints might block if we don't.
            // But we don't want to delete the project, just unassign?
            // If we are hard purging, we might leave it to the user or database cascades.
            // Let's stick to the direct owned data.

            const { error } = await supabase
                .from('technicians')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting technician:', error);
            throw error;
        }
    },

    /**
     * Search for available technicians for a specific date and time slot.
     * Excludes the currently assigned technician.
     */
    /**
     * Search for available technicians for a specific date and time slot.
     * Excludes the currently assigned technician and those on leave.
     */
    findAvailableTechnicians: async (
        date: string,
        time: string,
        excludeTechId?: string
    ): Promise<any[]> => {
        try {
            // 1. Get active technicians from technicians table
            const { data: allTechs, error: techError } = await supabase
                .from('technicians')
                .select('id, name, email, specialties')
                .eq('is_active', true);

            if (techError) throw techError;
            if (!allTechs || allTechs.length === 0) return [];

            // Map to standard format expected by callers (full_name for compatibility)
            const mappedTechs = allTechs.map(t => ({
                ...t,
                full_name: t.name,
                role: 'technician'
            }));

            // 2. Get busy technicians (active projects at same time)
            const { data: busyProjects, error: conflictError } = await supabase
                .from('active_projects')
                .select('assigned_to')
                .eq('scheduled_date', date)
                .eq('scheduled_time', time)
                .neq('assigned_to', null);

            if (conflictError) throw conflictError;

            const busyTechIds = new Set<string>();
            busyProjects?.forEach((p: any) => {
                if (Array.isArray(p.assigned_to)) {
                    p.assigned_to.forEach((id: string) => busyTechIds.add(id));
                }
            });

            // 3. Get technicians on leave
            const { data: leaves, error: leaveError } = await supabase
                .from('technician_leave_requests')
                .select('technician_id')
                .eq('status', 'approved')
                .lte('start_date', date)
                .gte('end_date', date);

            if (leaveError) throw leaveError;

            const onLeaveTechIds = new Set<string>();
            leaves?.forEach((l: any) => onLeaveTechIds.add(l.technician_id));


            // 4. Filter available techs
            return mappedTechs.filter((t: any) => {
                if (excludeTechId && t.id === excludeTechId) return false;
                if (busyTechIds.has(t.id)) return false;
                if (onLeaveTechIds.has(t.id)) return false;
                return true;
            });

        } catch (error) {
            console.error('Error finding available technicians:', error);
            throw error;
        }
    },

    /**
     * Request leave for a technician
     */
    requestLeave: async (
        technicianId: string,
        startDate: string,
        endDate: string,
        reason: string,
        leaveType: 'vacation' | 'sickness' | 'unplanned' | 'suspension' | 'other' = 'other',
        initialStatus: 'pending' | 'approved' = 'pending'
    ): Promise<void> => {
        try {
            const { error } = await supabase
                .from('technician_leave_requests')
                .insert({
                    technician_id: technicianId,
                    start_date: startDate,
                    end_date: endDate,
                    reason,
                    status: initialStatus,
                    leave_type: leaveType
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error requesting leave:', error);
            throw error;
        }
    },

    /**
     * Update leave request status
     */
    updateLeaveStatus: async (leaveId: string, status: 'approved' | 'rejected' | 'pending' | 'cancelled'): Promise<void> => {
        try {
            const { error } = await supabase
                .from('technician_leave_requests')
                .update({ status })
                .eq('id', leaveId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating leave status:', error);
            throw error;
        }
    },

    /**
     * Get leaves for a technician
     */
    getLeaves: async (technicianId: string): Promise<any[]> => {
        try {
            const { data, error } = await supabase
                .from('technician_leave_requests')
                .select('*')
                .eq('technician_id', technicianId)
                .order('start_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching leaves:', error);
            throw error;
        }
    },

    /**
     * Get ALL approved/pending leaves for calendar view
     */
    getAllLeaves: async (): Promise<any[]> => {
        try {
            const { data, error } = await supabase
                .from('technician_leave_requests')
                .select(`
                    *,
                    technicians!inner (
                        name,
                        is_active
                    )
                `)
                .neq('status', 'rejected')
                .neq('status', 'cancelled')
                .eq('technicians.is_active', true)
                .order('start_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching all leaves:', error);
            throw error;
        }
    },

    /**
     * Get available time slots for a specific date
     */
    /**
     * Get historical data for CSV export (completed jobs + approved leaves)
     */
    getHistory: async (technicianId: string): Promise<any[]> => {
        try {
            // 1. Fetch Completed/Incomplete/Cancelled Projects
            const { data: projects, error: projError } = await supabase
                .from('active_projects')
                .select('*')
                .contains('assigned_to', [technicianId])
                .in('status', ['completed', 'incomplete', 'cancelled'])
                .order('scheduled_date', { ascending: false });

            if (projError) throw projError;

            // 2. Fetch Approved Leaves
            const { data: leaves, error: leaveError } = await supabase
                .from('technician_leave_requests')
                .select('*')
                .eq('technician_id', technicianId)
                .eq('status', 'approved')
                .order('start_date', { ascending: false });

            if (leaveError) throw leaveError;

            // 3. Normalize and Combine
            const historyItems: any[] = [];

            // Add Projects
            projects?.forEach((p: any) => {
                historyItems.push({
                    type: 'Appointment',
                    date: p.scheduled_date || p.created_at,
                    endDate: '', // Appointments are single day usually
                    clientOrReason: p.project_name || 'Unknown Project',
                    status: p.status,
                    notes: p.description || '' // Or specific completion notes if available
                });
            });

            // Add Leaves
            leaves?.forEach((l: any) => {
                historyItems.push({
                    type: 'Leave',
                    date: l.start_date,
                    endDate: l.end_date,
                    clientOrReason: l.reason || 'No reason provided',
                    status: l.status, // 'approved'
                    notes: l.leave_type
                });
            });

            // Sort by date descending
            return historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    },

    /**
     * Get available time slots for a specific date
     */
    getAvailableTimeSlots: async (date: string): Promise<string[]> => {
        try {
            // Standard slots (can be configured elsewhere)
            const timeSlots = [
                '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
            ];

            // 1. Get total count of technicians
            const { count: totalTechs, error: countError } = await supabase
                .from('users')
                .select('id', { count: 'exact', head: true })
                .eq('role', 'technician');

            if (countError) throw countError;
            if (!totalTechs) return []; // No technicians = no slots

            // 2. Get Count of Technicians on Leave for this date
            const { count: leaveCount, error: leaveError } = await supabase
                .from('technician_leave_requests')
                .select('technician_id', { count: 'exact', head: true })
                .eq('status', 'approved')
                .lte('start_date', date)
                .gte('end_date', date);

            if (leaveError) throw leaveError;

            // Calculate Effective Capacity
            // Note: This assumes leaveCount is distinct technicians. 
            // Ideally we'd do a distinct count but supabase-js count is simple. 
            // For now, assuming overlapping APPROVED leaves for same tech is blocked elsewhere or rare.
            const effectiveTotal = (totalTechs || 0) - (leaveCount || 0);

            if (effectiveTotal <= 0) return []; // No one available at all today

            // 3. Get all scheduled projects for the date
            const { data: scheduled, error: scheduleError } = await supabase
                .from('active_projects')
                .select('scheduled_time, assigned_to')
                .eq('scheduled_date', date);

            if (scheduleError) throw scheduleError;

            // 4. Calculate availability per slot
            const slotsAvailability: Record<string, number> = {};

            // Initialize with 0 busy
            timeSlots.forEach(slot => slotsAvailability[slot] = 0);

            // Count busy techs per slot
            scheduled?.forEach((project: any) => {
                const time = project.scheduled_time?.substring(0, 5); // Ensure HH:MM
                if (slotsAvailability[time] !== undefined && Array.isArray(project.assigned_to)) {
                    slotsAvailability[time] += project.assigned_to.length;
                }
            });

            // 5. Return slots where busy < effective capacity
            return timeSlots.filter(slot => slotsAvailability[slot] < effectiveTotal);

        } catch (error) {
            console.error('Error getting available time slots:', error);
            return [];
        }
    }
};

/**
 * Helper: Map DB row to Technician type
 */
function mapToType(row: any): Technician {
    return {
        id: row.id,
        uid: row.uid,
        fullName: row.name || 'Unknown',
        email: row.email,
        phone: row.phone,
        specialties: row.specialties || [],
        active: row.is_active,
        createdAt: row.created_at || new Date().toISOString(), // Fallback
        workingHours: row.working_schedule || {
            start: '08:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5]
        },
        vacationQuota: row.vacation_quota || 15
    };
}
