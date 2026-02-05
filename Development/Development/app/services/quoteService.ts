import { supabase } from '@/lib/supabase';
import { Quote, QuoteStatus, ServiceType, QuoteDocument } from '@/lib/types';

const TABLE_NAME = 'quotes';

export const QuoteService = {
    /**
     * Fetch all quotes
     */
    getAll: async (): Promise<Quote[]> => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(mapToType);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            throw error;
        }
    },

    /**
     * Fetch a single quote by ID
     */
    getById: async (id: string): Promise<Quote | null> => {
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
            console.error('Error fetching quote:', error);
            throw error;
        }
    },

    /**
     * Update a quote status
     */
    updateStatus: async (id: string, status: QuoteStatus): Promise<void> => {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ status })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating quote status:', error);
            throw error;
        }
    },

    /**
     * Create a new quote (if needed for admin)
     */
    create: async (data: Partial<Quote>): Promise<string> => {
        try {
            const dbPayload = mapToDB(data);
            const { data: inserted, error } = await supabase
                .from(TABLE_NAME)
                .insert(dbPayload)
                .select('id')
                .single();

            if (error) throw error;
            return inserted.id;
        } catch (error) {
            console.error('Error creating quote:', error);
            throw error;
        }
    }
};

/**
 * Helper: Map DB row to TypeScript Interface
 */
function mapToType(row: any): Quote {
    return {
        id: row.id,
        userId: row.user_id,
        // ClientReference
        clientName: row.client_name || 'Unknown',
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        clientCompany: row.client_company,

        // ClientProfile
        clientType: 'residential', // Default or need column? Schema doesn't show client_type explicitly maybe?
        // Checking schema again: no 'client_type'. But 'property_type' implies residential/business context.
        // We can default to 'residential' or infer.
        // Or check if 'client_company' is present?

        service: row.service as ServiceType,
        status: row.status as QuoteStatus,

        // Property / Efficiency
        propertyType: row.property_type,
        propertySize: row.property_size,
        currentBill: row.monthly_bill, // Mapped from monthly_bill

        deviceMode: row.device_mode,
        connectivity: row.connectivity_type, // Correctly map snake_case

        // Consulting / Advocacy
        timeline: row.timeline,
        budget: row.budget,
        projectDescription: row.project_description,

        // Address
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        preferredContact: row.preferred_contact,

        message: row.message,
        amount: row.amount, // if exists

        documents: row.bill_files || [], // jsonb

        linkedProjectId: row.linked_project_id,

        createdAt: row.created_at,
        submittedAt: row.created_at, // Use created_at as submitted fallback

        address: row.address // jsonb
    };
}

/**
 * Helper: Map TypeScript Interface to DB Row
 */
function mapToDB(data: Partial<Quote>): any {
    const payload: any = {};

    // Mapping logic similar to ActiveProject but for Quote columns
    if (data.userId) payload.user_id = data.userId;
    if (data.clientName) payload.client_name = data.clientName;
    if (data.clientEmail) payload.client_email = data.clientEmail;
    if (data.clientPhone) payload.client_phone = data.clientPhone;
    if (data.service) payload.service = data.service;
    if (data.status) payload.status = data.status;

    // Service specifics
    if (data.propertyType) payload.property_type = data.propertyType;
    if (data.propertySize) payload.property_size = data.propertySize;
    if (data.currentBill) payload.monthly_bill = data.currentBill;
    if (data.deviceMode) payload.device_mode = data.deviceMode;
    if (data.connectivity) payload.connectivity_type = data.connectivity;
    if (data.timeline) payload.timeline = data.timeline;
    if (data.budget) payload.budget = data.budget;
    if (data.projectDescription) payload.project_description = data.projectDescription;

    // Address
    if (data.city) payload.city = data.city;
    if (data.state) payload.state = data.state;
    if (data.zipCode) payload.zip_code = data.zipCode;
    if (data.preferredContact) payload.preferred_contact = data.preferredContact;

    return payload;
}
