// lib/state-machines/types.ts

export type ServiceType = 'efficiency' | 'consulting' | 'advocacy';

// Common statuses shared across all services
export type CommonStatus =
  | 'pending_onboarding'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

// Efficiency-specific statuses
export type EfficiencyStatus =
  | CommonStatus
  | 'pending_payment'
  | 'pending_scheduling'
  | 'scheduled'
  | 'pending_installation'
  | 'pending_documents'
  | 'pending_assignment'
  | 'active'
  | 'paused'
  | 'pending_client'
  | 'in_review'
  | 'urgent_reschedule'
  | 'incomplete';

// Consulting-specific statuses
export type ConsultingStatus =
  | CommonStatus
  | 'pending_requirements'
  | 'requirements_defined'
  | 'rfp_preparation'
  | 'rfp_published'
  | 'offers_evaluation'
  | 'supplier_selection'
  | 'contract_negotiation';

// Advocacy-specific statuses
export type AdvocacyStatus =
  | CommonStatus
  | 'pending_audit'
  | 'audit_in_progress'
  | 'audit_complete'
  | 'claim_formulation'
  | 'claim_ready'
  | 'claim_filed'
  | 'distributor_negotiating'
  | 'asep_filed'
  | 'asep_negotiating'
  | 'resolved'
  | 'recovery_received';

// Union of all possible statuses
export type ProjectStatus = EfficiencyStatus | ConsultingStatus | AdvocacyStatus;

// Transition result
export interface TransitionResult {
  valid: boolean;
  reason?: string;
}

// Status info for UI
export interface StatusInfo {
  status: ProjectStatus;
  label: {
    en: string;
    es: string;
  };
  color: string; // Tailwind color class
  serviceTypes: ServiceType[];
}
