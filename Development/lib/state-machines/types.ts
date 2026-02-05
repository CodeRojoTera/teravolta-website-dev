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
  | 'pending_inspection'
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

// Status labels for UI display (bilingual per CONTEXT.md requirements)
export const STATUS_LABELS: Record<ProjectStatus, { en: string; es: string }> = {
  // Common
  'pending_onboarding': { en: 'Pending Onboarding', es: 'Pendiente de Registro' },
  'in_progress': { en: 'In Progress', es: 'En Progreso' },
  'completed': { en: 'Completed', es: 'Completado' },
  'cancelled': { en: 'Cancelled', es: 'Cancelado' },
  'on_hold': { en: 'On Hold', es: 'En Espera' },

  // Efficiency
  'pending_payment': { en: 'Awaiting Payment', es: 'Esperando Pago' },
  'pending_scheduling': { en: 'Ready to Schedule', es: 'Listo para Programar' },
  'scheduled': { en: 'Scheduled', es: 'Programado' },
  'pending_inspection': { en: 'Inspection Pending', es: 'Inspeccion Pendiente' },
  'pending_installation': { en: 'Installation Pending', es: 'Instalacion Pendiente' },
  'pending_documents': { en: 'Documents Required', es: 'Documentos Requeridos' },
  'pending_assignment': { en: 'Awaiting Technician', es: 'Esperando Tecnico' },
  'active': { en: 'Active', es: 'Activo' },
  'paused': { en: 'Paused', es: 'Pausado' },
  'pending_client': { en: 'Awaiting Client', es: 'Esperando Cliente' },
  'in_review': { en: 'Under Review', es: 'En Revision' },
  'urgent_reschedule': { en: 'Needs Rescheduling', es: 'Necesita Reprogramacion' },
  'incomplete': { en: 'Incomplete', es: 'Incompleto' },

  // Consulting
  'pending_requirements': { en: 'Defining Requirements', es: 'Definiendo Requisitos' },
  'requirements_defined': { en: 'Requirements Ready', es: 'Requisitos Listos' },
  'rfp_preparation': { en: 'Preparing RFP', es: 'Preparando RFP' },
  'rfp_published': { en: 'RFP Published', es: 'RFP Publicado' },
  'offers_evaluation': { en: 'Evaluating Offers', es: 'Evaluando Ofertas' },
  'supplier_selection': { en: 'Selecting Supplier', es: 'Seleccionando Proveedor' },
  'contract_negotiation': { en: 'Negotiating Contract', es: 'Negociando Contrato' },

  // Advocacy
  'pending_audit': { en: 'Awaiting Audit', es: 'Esperando Auditoria' },
  'audit_in_progress': { en: 'Audit In Progress', es: 'Auditoria en Progreso' },
  'audit_complete': { en: 'Audit Complete', es: 'Auditoria Completa' },
  'claim_formulation': { en: 'Formulating Claim', es: 'Formulando Reclamo' },
  'claim_ready': { en: 'Claim Ready', es: 'Reclamo Listo' },
  'claim_filed': { en: 'Claim Filed', es: 'Reclamo Presentado' },
  'distributor_negotiating': { en: 'Negotiating with Distributor', es: 'Negociando con Distribuidor' },
  'asep_filed': { en: 'Filed with ASEP', es: 'Presentado ante ASEP' },
  'asep_negotiating': { en: 'ASEP Review', es: 'Revision ASEP' },
  'resolved': { en: 'Resolved', es: 'Resuelto' },
  'recovery_received': { en: 'Recovery Received', es: 'Recuperacion Recibida' }
};

// Service-specific color schemes (per CONTEXT.md)
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  // Common (neutral)
  'pending_onboarding': 'bg-gray-100 text-gray-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'on_hold': 'bg-yellow-100 text-yellow-800',

  // Efficiency (blue palette)
  'pending_payment': 'bg-blue-50 text-blue-700',
  'pending_scheduling': 'bg-blue-100 text-blue-800',
  'scheduled': 'bg-blue-200 text-blue-900',
  'pending_inspection': 'bg-blue-100 text-blue-800',
  'pending_installation': 'bg-blue-100 text-blue-800',
  'pending_documents': 'bg-amber-100 text-amber-800',
  'pending_assignment': 'bg-blue-50 text-blue-700',
  'active': 'bg-blue-300 text-blue-900',
  'paused': 'bg-gray-200 text-gray-700',
  'pending_client': 'bg-amber-100 text-amber-800',
  'in_review': 'bg-blue-100 text-blue-800',
  'urgent_reschedule': 'bg-orange-100 text-orange-800',
  'incomplete': 'bg-red-100 text-red-800',

  // Consulting (purple palette)
  'pending_requirements': 'bg-purple-50 text-purple-700',
  'requirements_defined': 'bg-purple-100 text-purple-800',
  'rfp_preparation': 'bg-purple-100 text-purple-800',
  'rfp_published': 'bg-purple-200 text-purple-900',
  'offers_evaluation': 'bg-purple-200 text-purple-900',
  'supplier_selection': 'bg-purple-300 text-purple-900',
  'contract_negotiation': 'bg-purple-300 text-purple-900',

  // Advocacy (teal palette)
  'pending_audit': 'bg-teal-50 text-teal-700',
  'audit_in_progress': 'bg-teal-100 text-teal-800',
  'audit_complete': 'bg-teal-100 text-teal-800',
  'claim_formulation': 'bg-teal-200 text-teal-900',
  'claim_ready': 'bg-teal-200 text-teal-900',
  'claim_filed': 'bg-teal-300 text-teal-900',
  'distributor_negotiating': 'bg-teal-300 text-teal-900',
  'asep_filed': 'bg-teal-400 text-teal-900',
  'asep_negotiating': 'bg-teal-400 text-teal-900',
  'resolved': 'bg-green-200 text-green-900',
  'recovery_received': 'bg-green-300 text-green-900'
};
