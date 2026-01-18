/**
 * TeraVolta Data Model Types
 * 
 * This file contains the standardized TypeScript interfaces for client data
 * used across all collections (users, quotes, inquiries, activeProjects).
 * 
 * @version 1.1.0
 * @created 2026-01-04
 * @updated 2026-01-07 - Migrated to Supabase (Timestamp -> string)
 */

// ============================================================================
// Address Types
// ============================================================================

/**
 * Country-aware address schema.
 * 
 * Note: zipCode and state are optional because:
 * - Panama and many Latin American countries don't use postal codes
 * - Some countries have provinces instead of states
 */
export interface Address {
    /** ISO 3166-1 alpha-2 country code (e.g., 'PA', 'US', 'MX') */
    country: string;

    /** Street address */
    street: string;

    /** City name */
    city: string;

    /** Province/State - optional for countries that don't use states */
    state?: string;

    /** Postal/ZIP code - optional, not used in Panama, etc. */
    zipCode?: string;
}

// ============================================================================
// Client Reference Types
// ============================================================================

/**
 * Standard client reference used across all collections.
 * This ensures consistent client identification and data access.
 */
export interface ClientReference {
    /** 
     * FK to users.uid. 
     * null if client hasn't completed onboarding yet.
     */
    userId: string | null;

    /** Client's email - always required for communication */
    clientEmail: string;

    /** Client's full name - always required for display */
    clientName: string;

    /** Client's phone number in E.164 format - always required */
    clientPhone: string;

    /** Company name - optional, required if clientType is 'business' */
    clientCompany?: string;
}

/**
 * Extended client profile with additional details.
 * Used for quotes and project creation.
 */
export interface ClientProfile extends ClientReference {
    /** Type of client for service differentiation */
    clientType: 'residential' | 'business';

    /** Client's address - optional, used for installations */
    address?: Address;
}

// ============================================================================
// Project Types
// ============================================================================

/** Service types offered by TeraVolta */
export type ServiceType = 'efficiency' | 'consulting' | 'advocacy';

/** Project status values */
export const PROJECT_STATUSES = [
    'pending_onboarding',
    'pending_payment',
    'pending_scheduling',
    'scheduled',
    'pending_documents',
    'pending_assignment',
    'pending_installation',
    'in_progress',
    'active',
    'paused',
    'pending_client',
    'in_review',
    'completed',
    'cancelled',
    'urgent_reschedule',
    'incomplete'
] as const;

export type ProjectStatus = typeof PROJECT_STATUSES[number];

/** Payment status values */
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';


export interface ProjectPhase {
    id: string;
    name: string;
    amount: number;
    status: 'pending' | 'paid';
    invoiceUrl?: string; // Link to stripe invoice
    receiptUrl?: string; // Link to receipt
}

/**
 * Active project record in Firestore/Supabase.
 * Maps to 'active_projects' table.
 */
export interface ActiveProject extends ClientReference {
    /** UUID Primary Key */
    id?: string;

    /** Project Name (calculated) */
    projectName: string;

    /** Optional Quote ID if created from a quote */
    quoteId?: string;

    /** 
     * Inherited from ClientReference: 
     * userId: string | null; 
     */

    /** Optional Client ID (legacy/guest support) */
    clientId?: string;

    /** Service type */
    service: ServiceType;

    /** Package selected (e.g. basic, pro) */
    package?: string;

    /** Current project status */
    status: ProjectStatus;

    /** Payment status */
    paymentStatus: PaymentStatus;

    /** Progress percentage (0-100) - Calculated or Stored */
    progress: number;

    /** Dates */
    startDate?: string;
    estimatedEndDate?: string;
    amount?: number;
    createdAt: string;
    updatedAt?: string;

    /** Address */
    address?: string;

    /** Project Details */
    description?: string;
    challenge?: string;
    solution?: string;
    result?: string;
    timeline?: any[];

    // Service Specific Data (Added 2026-01-09)
    propertyType?: string;
    propertySize?: string;
    monthlyBill?: string;
    connectivityType?: 'wifi' | '3g';
    deviceOption?: 'purchase' | 'rent';
    city?: string;
    state?: string;
    zipCode?: string;
    budget?: string;
    clientTimeline?: string; // Renamed from timeline to avoid conflict
    projectDescription?: string;
    phases?: ProjectPhase[]; // For Consulting/Advocacy


    // Installation / Schedule
    scheduledDate?: string; // YYYY-MM-DD
    scheduledTime?: string; // HH:mm:ss
    appointmentId?: string; // Link to appointment

    // Relations
    sourceQuoteId?: string;
    sourceInquiryId?: string;
    assignedTo?: string[]; // Array of Technician UUIDs

    invoiceSentAt?: string;
}



// ============================================================================
// Invoice Types
// ============================================================================

/**
 * Invoice phase within a project
 */
export interface InvoicePhase {
    /** Unique ID for the phase */
    id: string;

    /** Phase title */
    title: string;

    /** Invoice type */
    type: 'digital' | 'physical';

    /** Phase payment status */
    status: PaymentStatus;

    /** When the invoice was sent */
    sentAt?: string | null;

    /** Documents attached to this phase */
    documents?: InvoiceDocument[];

    /** Phase creation date */
    createdAt: string;
}

/**
 * Document attached to an invoice phase
 */
export interface InvoiceDocument {
    /** Document file name */
    name: string;

    /** Download URL */
    url: string;

    /** Document type */
    type?: 'digital' | 'physical';

    /** When the document was sent to client */
    sentAt?: string | null;
}

// ============================================================================
// Quote Types
// ============================================================================

/** Quote status values */
export type QuoteStatus =
    | 'pending_review'
    | 'in_review'
    | 'approved'
    | 'paid'
    | 'rejected'
    | 'cancelled';

/**
 * Quote/service request record
 */
export interface Quote extends ClientProfile {
    /** Firestore document ID */
    id?: string;

    /** Requested service */
    service: ServiceType;

    /** Quote status */
    status: QuoteStatus;

    // Property details (Energy Efficiency & Advocacy)
    propertyType?: string;
    propertySize?: string;
    currentBill?: string;

    // Device options (Energy Efficiency)
    deviceMode?: 'purchase' | 'rental';
    connectivity?: 'wifi' | 'cellular';

    // Consulting / Advocacy specific
    timeline?: string;
    budget?: string;
    projectDescription?: string;
    phases?: ProjectPhase[];

    // Address Details
    city?: string;
    state?: string;
    zipCode?: string;
    preferredContact?: string;

    /** Additional message/comments */
    message?: string;

    /** Linked user ID after onboarding */
    linkedUserId?: string | null;

    /** Linked project ID after project creation */
    linkedProjectId?: string | null;

    /** Quote amount (if applicable) */
    amount?: number;

    /** Uploaded documents/bills */
    documents?: QuoteDocument[];

    /** Submission timestamp */
    submittedAt?: string;

    /** Created timestamp */
    createdAt: string;

    /** Review information */
    reviewedBy?: string;
    reviewedAt?: string;
}

/**
 * Document uploaded with a quote
 */
export interface QuoteDocument {
    name: string;
    storagePath: string;
    contentType: string;
    size: number;
    uploadedAt: string;
}

// ============================================================================
// Inquiry Types (Contact Form)
// ============================================================================

/** Inquiry status values */
export type InquiryStatus = 'new' | 'in_progress' | 'responded' | 'closed';

/**
 * Contact form inquiry record
 */
export interface Inquiry {
    /** Firestore document ID */
    id?: string;

    /** Client type */
    clientType: 'residential' | 'business';

    /** Client's full name */
    fullName: string;

    /** Client's email */
    email: string;

    /** Client's phone */
    phoneNumber?: string;

    /** Company name (business only) */
    companyName?: string;

    /** Inquiry subject */
    subject: string;

    /** Inquiry message */
    message: string;

    /** Attached files */
    attachments?: InquiryAttachment[];

    /** Inquiry status */
    status: InquiryStatus;

    /** Source language */
    language: 'en' | 'es';

    /** Form source */
    source: string;

    /** Created timestamp */
    createdAt: string;
}

/**
 * Attachment on an inquiry
 */
export interface InquiryAttachment {
    fileName: string;
    storagePath: string;
    downloadURL: string;
    contentType: string;
    size: number;
    uploadedAt: string;
}

// ============================================================================
// User Types
// ============================================================================

/** User role values */
export type UserRole = 'customer' | 'admin' | 'super_admin' | 'technician';

/**
 * User account record
 */
export interface User {
    /** Auth UID (also used as doc ID) */
    uid: string;

    /** User's email */
    email: string;

    /** User's full name */
    fullName: string;

    /** User's phone */
    phone?: string;

    /** Company name */
    company?: string;

    /** User role */
    role: UserRole;

    /** Account creation timestamp */
    createdAt: string;
}

export interface NotificationPreferences {
    email: boolean;
    in_app: boolean;
    types: {
        info: boolean;
        success: boolean;
        warning: boolean;
        error: boolean;
    };
}

export interface UserSettings {
    user_id: string;
    preferences: NotificationPreferences;
    updated_at: string;
}

// ============================================================================
// Document Management Types
// ============================================================================

/** Document entity types that can have documents attached */
export type DocumentEntityType = 'activeProjects' | 'active_projects' | 'quotes' | 'inquiries' | 'users' | 'technicians';

/**
 * Centralized document record for the documents collection.
 * This provides unified document management across all entities.
 */
export interface Document {
    /** Firestore document ID */
    id?: string;

    /** Original file name */
    name: string;

    /** Firebase Storage path */
    storagePath: string;

    /** Public download URL */
    downloadURL: string;

    /** MIME type */
    contentType: string;

    /** File size in bytes */
    size: number;

    /** Upload timestamp */
    uploadedAt: string;

    /** User who uploaded (userId or 'system') */
    uploadedBy: string;

    /** Entity this document is linked to */
    linkedTo: {
        type: DocumentEntityType;
        id: string;
    };

    /** Optional description */
    description?: string;

    /** Document category for organization */
    category?: 'bill' | 'contract' | 'invoice' | 'report' | 'monthly_report' | 'deliverable' | 'payment_proof' | 'site_plan' | 'meter_reading' | 'other';
}

// ============================================================================
// Field Service Types (Technicians & Appointments)
// ============================================================================

export interface WorkingHours {
    start: string; // "09:00"
    end: string;   // "17:00"
    days: number[]; // 0-6 (Sunday-Saturday)
}

export interface Technician {
    id?: string;
    uid?: string; // Linked User UID if they have login access
    fullName: string;
    email: string;
    phone: string;
    specialties: string[]; // ['solar', 'electrical', 'audit']
    active: boolean;
    availabilityStatus?: 'available' | 'unavailable'; // Computed based on leaves
    workingHours: WorkingHours; // Now mapped from working_schedule
    vacationQuota: number; // Annual vacation days
    createdAt: any; // Timestamp or string
}

export type LeaveType = 'vacation' | 'sickness' | 'other' | 'unplanned' | 'suspension';

export interface TechnicianLeave {
    id: string;
    technicianId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    leaveType: LeaveType;
    createdAt: string;
}

export type AppointmentStatus = 'scheduled' | 'on_route' | 'in_progress' | 'completed' | 'cancelled' | 'incomplete';

export interface Appointment {
    id?: string;
    projectId: string; // Linked ActiveProject
    technicianId: string; // Linked Technician Document ID
    technicianUid?: string; // Linked User UID (for Security Rules efficiency)
    technicianName: string; // Denormalized for easy display
    date: string; // Scheduled Date
    status: AppointmentStatus;

    // Installation details (synced from project at creation)
    clientAddress: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    clientUserId?: string | null;

    // Field Service Updates (Mobile App Future)
    checkInTime?: string;
    checkOutTime?: string;
    locationStart?: { lat: number; lng: number };
    locationEnd?: { lat: number; lng: number };
    notes?: string;
    photos?: string[]; // Evidence photos URL list

    createdAt: string;
    createdBy: string;
}

// ============================================================================
// Technical Inspection Types (Efficiency 2.0)
// ============================================================================

export const SYSTEM_TYPES = ['monophase_120_240', 'triphase_208_120', 'triphase_480_277'] as const;
export const EMPORIA_CLASSIFICATIONS = ['standard', 'adjustments', 'incompatible'] as const;
export const INCOMPATIBILITY_REASONS = ['no_neutral', 'mv', 'space', 'other'] as const;
export const CT_STATUSES = ['fits', 'no_fit'] as const;
export const RECOMMENDED_SOLUTIONS = ['standard', 'special_cts', 'industrial'] as const;

export interface ElectricalBoard {
    id: string; // uuid
    appointment_id: string; // uuid FK
    name: string;
    system_type: typeof SYSTEM_TYPES[number];
    has_neutral: boolean;
    emporia_classification: typeof EMPORIA_CLASSIFICATIONS[number];
    incompatibility_reason?: typeof INCOMPATIBILITY_REASONS[number];
    ct_status: typeof CT_STATUSES[number];
    ct_issue?: string; // free text description of stricture
    recommended_solution: typeof RECOMMENDED_SOLUTIONS[number];
    observations?: string;
    photos: string[]; // JSONB array of strings
    created_at?: string;
    updated_at?: string;
}
