import { supabase } from '@/lib/supabase';
import { ActiveProject, ProjectStatus, ServiceType } from '@/lib/types';

const TABLE_NAME = 'active_projects';

export const ActiveProjectService = {
    /**
     * Fetch all active projects
     */
    getAll: async (): Promise<ActiveProject[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(mapToType);
        } catch (error) {
            console.error('Error fetching active projects:', error);
            throw error;
        }
    },

    /**
     * Fetch a single project by ID
     */
    getById: async (id: string): Promise<ActiveProject | null> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return null;

            return mapToType(data);
        } catch (error) {
            console.error('Error fetching active project:', error);
            throw error;
        }
    },

    /**
     * Fetch projects by User ID (for Customer Dashboard)
     */
    getByUserId: async (userId: string): Promise<ActiveProject[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(mapToType);
        } catch (error: any) {
            // Only log non-abort errors
            if (!error.message?.includes('AbortError') && error.name !== 'AbortError') {
                console.error('Error fetching user projects:', error);
            }
            throw error;
        }
    },

    /**
     * Fetch projects assigned to a specific technician
     */
    getByTechnicianId: async (technicianId: string): Promise<ActiveProject[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .contains('assigned_to', [technicianId])
                .order('scheduled_date', { ascending: false });

            if (error) throw error;

            return (data || []).map(mapToType);
        } catch (error) {
            console.error('Error fetching technician projects:', error);
            throw error;
        }
    },

    /**
     * Create a new project
     */
    create: async (data: Omit<ActiveProject, 'id' | 'createdAt' | 'progress'>): Promise<string> => {
        try {
            // Use API route to bypass RLS issues for guest users
            const dbPayload = mapToDB(data);

            const response = await fetch('/api/create-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dbPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            const cloned = await response.json();
            return cloned.id || 'unknown';
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    /**
     * Update an existing project
     */
    update: async (id: string, updates: Partial<ActiveProject>): Promise<void> => {
        try {
            const dbPayload = mapToDB(updates as any); // Type assertion needed as partial might miss required fields for full mapping

            // Remove undefined fields to avoid overwriting with null if that's not intended
            Object.keys(dbPayload).forEach(key => dbPayload[key] === undefined && delete dbPayload[key]);

            const { error } = await supabase
                .from(TABLE_NAME)
                .update(dbPayload)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    },

    /**
     * Add an update/note to a project (Simulated via JSON array or subcollection replacement)
     * For now, we'll assume 'updates' is a JSONB column or we create a separate table.
     * Given the schema, we likely have an 'updates' table or we just append to a JSON field.
     * Let's check schema: usually it's a separate table 'project_updates' or 'active_project_updates'.
     * If not existing, we can store it in a JSON column 'timeline' on active_projects.
     */
    addTimelineEntry: async (projectId: string, entry: any): Promise<void> => {
        try {
            // Fetch current timeline
            const { data: currentProject } = await supabase
                .from(TABLE_NAME)
                .select('timeline')
                .eq('id', projectId)
                .single();

            const currentTimeline = currentProject?.timeline || [];
            const newTimeline = [entry, ...currentTimeline];

            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ timeline: newTimeline })
                .eq('id', projectId);

            if (error) throw error;
        } catch (error) {
            console.error('Error adding timeline entry:', error);
            throw error;
        }
    },





    /**
     * Assign technicians to a project
     */
    assignTechnicians: async (projectId: string, technicianIds: string[]): Promise<void> => {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({
                    assigned_to: technicianIds,
                    status: 'pending_installation' // Auto-update status logic if needed
                })
                .eq('id', projectId);

            if (error) throw error;

            // Notify each assigned technician
            for (const techId of technicianIds) {
                try {
                    await fetch('/api/create-notification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: techId,
                            type: 'info',
                            title: 'New Assignment',
                            message: 'You have been assigned to a new project.',
                            link: '/portal/technician'
                        })
                    });
                } catch (notifErr) {
                    console.error('Failed to notify technician:', notifErr);
                }
            }
        } catch (error) {
            console.error('Error assigning technicians:', error);
            throw error;
        }
    },

    /**
     * Upload a document to Supabase Storage and create a record in 'documents' table
     */
    uploadDocument: async (
        file: File,
        entityType: 'active_projects' | 'quotes' | 'inquiries' | 'users',
        entityId: string,
        category: string = 'other'
    ): Promise<any> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${entityId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            // 3. Create Record in 'documents' table
            const { data: doc, error: dbError } = await supabase
                .from('documents')
                .insert({
                    entity_type: entityType,
                    entity_id: entityId,
                    file_name: file.name,
                    storage_path: filePath,
                    download_url: publicUrl,
                    content_type: file.type,
                    size: file.size,
                    category: category,
                    uploaded_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (dbError) throw dbError;
            return doc;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    },

    /**
     * Get documents for an entity
     */
    getDocuments: async (entityType: string, entityId: string): Promise<any[]> => {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    },

    /**
     * Delete a document
     */
    deleteDocument: async (documentId: string, storagePath: string): Promise<void> => {
        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([storagePath]);

            if (storageError) console.error('Error deleting file from storage:', storageError);

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

            if (dbError) throw dbError;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
};

/**
 * Helper: Map DB row to TypeScript Interface
 */
function mapToType(row: any): ActiveProject {
    // Calculate progress as dummy logic if not in DB, 
    // or use status to infer progress if needed.
    // For now, let's assume 'status' drives progress if column missing.
    let progress = 0;
    switch (row.status) {
        case 'pending_assignment': progress = 10; break;
        case 'pending_installation': progress = 30; break;
        case 'in_progress': progress = 50; break;
        case 'active': progress = 100; break;
        case 'completed': progress = 100; break;
    }

    return {
        id: row.id,
        userId: row.user_id,
        clientId: row.client_id,
        clientName: row.client_name,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        clientCompany: row.client_company,
        address: row.address,
        service: row.service as ServiceType,
        package: row.package,
        status: row.status as ProjectStatus,
        paymentStatus: row.payment_status,
        sourceQuoteId: row.source_quote_id,
        sourceInquiryId: row.source_inquiry_id,
        appointmentId: row.appointment_id,
        assignedTo: row.assigned_to || [],
        scheduledDate: row.scheduled_date,
        scheduledTime: row.scheduled_time,
        invoiceSentAt: row.invoice_sent_at,
        createdAt: row.created_at,

        // Joined/Calculated
        projectName: `${row.service} - ${row.client_name}`, // Fallback naming
        progress: row.progress !== undefined ? row.progress : progress, // Use DB progress if available
        description: row.description,
        challenge: row.challenge,
        solution: row.solution,
        result: row.result,
        timeline: row.timeline || [],

        // Service Specifics (Added 2026-01-09)
        propertyType: row.property_type || undefined,
        propertySize: row.property_size || undefined,
        monthlyBill: row.monthly_bill || undefined,
        connectivityType: row.connectivity_type || undefined,
        deviceOption: row.device_option || undefined,
        city: row.city || undefined,
        state: row.state || undefined,
        zipCode: row.zip_code || undefined,
        budget: row.budget || undefined,
        clientTimeline: row.client_timeline || undefined,
        projectDescription: row.project_description || undefined,
        phases: row.phases || [],
        amount: row.amount || 0,
    };
}

/**
 * Helper: Map TypeScript Interface to DB Row
 */
function mapToDB(data: Partial<ActiveProject>, isUpdate = false): any {
    const payload: any = {};

    if (data.userId) payload.user_id = data.userId;
    if (data.clientId) payload.client_id = data.clientId;
    if (data.clientName) payload.client_name = data.clientName;
    if (data.clientEmail !== undefined) payload.client_email = data.clientEmail;
    if (data.clientPhone !== undefined) payload.client_phone = data.clientPhone;
    if (data.clientCompany !== undefined) payload.client_company = data.clientCompany;
    if (data.address !== undefined) payload.address = data.address;
    if (data.service !== undefined) payload.service = data.service;
    if (data.package !== undefined) payload.package = data.package;
    if (data.status !== undefined) payload.status = data.status;
    if (data.paymentStatus !== undefined) payload.payment_status = data.paymentStatus;
    if (data.sourceQuoteId !== undefined) payload.source_quote_id = data.sourceQuoteId;
    if (data.sourceInquiryId !== undefined) payload.source_inquiry_id = data.sourceInquiryId;
    if (data.appointmentId !== undefined) payload.appointment_id = data.appointmentId;
    if (data.assignedTo !== undefined) payload.assigned_to = data.assignedTo;
    if (data.scheduledDate !== undefined) payload.scheduled_date = data.scheduledDate;
    if (data.scheduledTime !== undefined) payload.scheduled_time = data.scheduledTime;
    if (data.invoiceSentAt !== undefined) payload.invoice_sent_at = data.invoiceSentAt;

    // New Fields
    if (data.progress !== undefined) payload.progress = data.progress;
    if (data.description !== undefined) payload.description = data.description;
    if (data.challenge !== undefined) payload.challenge = data.challenge;
    if (data.solution !== undefined) payload.solution = data.solution;
    if (data.result !== undefined) payload.result = data.result;
    if (data.timeline !== undefined) payload.timeline = data.timeline;

    // Service Specifics
    if (data.propertyType !== undefined) payload.property_type = data.propertyType;
    if (data.propertySize !== undefined) payload.property_size = data.propertySize;
    if (data.monthlyBill !== undefined) payload.monthly_bill = data.monthlyBill;
    if (data.connectivityType !== undefined) payload.connectivity_type = data.connectivityType;
    if (data.deviceOption !== undefined) payload.device_option = data.deviceOption;
    if (data.city !== undefined) payload.city = data.city;
    if (data.state !== undefined) payload.state = data.state;
    if (data.zipCode !== undefined) payload.zip_code = data.zipCode;
    if (data.budget !== undefined) payload.budget = data.budget;
    if (data.budget !== undefined) payload.budget = data.budget;
    if (data.clientTimeline !== undefined) payload.client_timeline = data.clientTimeline;
    if (data.projectDescription !== undefined) payload.project_description = data.projectDescription;
    if (data.phases !== undefined) payload.phases = data.phases;
    if (data.amount !== undefined) payload.amount = data.amount;

    return payload;
}
