// lib/state-machines/project-states.ts

import type {
  ServiceType,
  ProjectStatus,
  EfficiencyStatus,
  ConsultingStatus,
  AdvocacyStatus,
  TransitionResult
} from './types';
import { STATUS_LABELS, STATUS_COLORS } from './types';

// ============================================================================
// Transition Maps - Define valid transitions for each service type
// ============================================================================

const EFFICIENCY_TRANSITIONS: Record<EfficiencyStatus, EfficiencyStatus[]> = {
  // Initial state
  'pending_onboarding': ['pending_payment', 'cancelled'],

  // Payment flow
  'pending_payment': ['pending_scheduling', 'cancelled'],
  'pending_scheduling': ['scheduled', 'cancelled'],
  'scheduled': ['pending_assignment', 'pending_installation', 'cancelled', 'urgent_reschedule'],

  // Assignment and installation
  'pending_assignment': ['pending_installation', 'cancelled'],
  'pending_installation': ['in_progress', 'cancelled', 'on_hold'],

  // Active work
  'in_progress': ['completed', 'paused', 'on_hold', 'cancelled', 'incomplete'],
  'active': ['completed', 'paused', 'cancelled'],
  'paused': ['in_progress', 'active', 'cancelled'],
  'on_hold': ['pending_installation', 'in_progress', 'cancelled'],

  // Document/review states
  'pending_documents': ['in_review', 'cancelled'],
  'pending_client': ['in_progress', 'cancelled'],
  'in_review': ['completed', 'pending_client', 'cancelled'],

  // Edge cases
  'urgent_reschedule': ['scheduled', 'cancelled'],
  'incomplete': ['in_progress', 'cancelled'],

  // Terminal states
  'completed': [],
  'cancelled': []
};

const CONSULTING_TRANSITIONS: Record<ConsultingStatus, ConsultingStatus[]> = {
  // Initial state
  'pending_onboarding': ['pending_requirements', 'cancelled'],
  'pending_requirements': ['requirements_defined', 'cancelled'],

  // RFP flow
  'requirements_defined': ['rfp_preparation', 'cancelled'],
  'rfp_preparation': ['rfp_published', 'cancelled'],
  'rfp_published': ['offers_evaluation', 'cancelled'],

  // Selection flow
  'offers_evaluation': ['supplier_selection', 'cancelled'],
  'supplier_selection': ['contract_negotiation', 'cancelled'],
  'contract_negotiation': ['completed', 'cancelled'],

  // Common states
  'in_progress': ['completed', 'on_hold', 'cancelled'],
  'on_hold': ['in_progress', 'cancelled'],

  // Terminal states
  'completed': [],
  'cancelled': []
};

const ADVOCACY_TRANSITIONS: Record<AdvocacyStatus, AdvocacyStatus[]> = {
  // Initial state
  'pending_onboarding': ['pending_audit', 'cancelled'],
  'pending_audit': ['audit_in_progress', 'cancelled'],

  // Audit flow
  'audit_in_progress': ['audit_complete', 'cancelled'],
  'audit_complete': ['claim_formulation', 'cancelled'],

  // Claim flow
  'claim_formulation': ['claim_ready', 'cancelled'],
  'claim_ready': ['claim_filed', 'cancelled'],
  'claim_filed': ['distributor_negotiating', 'asep_filed', 'cancelled'],

  // Resolution flow
  'distributor_negotiating': ['asep_filed', 'resolved', 'cancelled'],
  'asep_filed': ['asep_negotiating', 'resolved', 'cancelled'],
  'asep_negotiating': ['resolved', 'cancelled'],
  'resolved': ['recovery_received', 'completed'],
  'recovery_received': ['completed'],

  // Common states
  'in_progress': ['completed', 'on_hold', 'cancelled'],
  'on_hold': ['in_progress', 'cancelled'],

  // Terminal states
  'completed': [],
  'cancelled': []
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Check if a status transition is valid for the given service type.
 *
 * @param current - Current project status
 * @param next - Desired next status
 * @param service - Service type (efficiency, consulting, advocacy)
 * @param isAdmin - Whether the user is an admin (allows override)
 * @returns TransitionResult with valid flag and optional reason
 */
export function canTransition(
  current: ProjectStatus,
  next: ProjectStatus,
  service: ServiceType,
  isAdmin: boolean
): TransitionResult {
  // Get the appropriate transition map
  const transitions = getTransitionMap(service);

  // Check if current status exists in the map
  const validNextStatuses = transitions[current as keyof typeof transitions];

  if (!validNextStatuses) {
    // Unknown status - allow admin override
    if (isAdmin) {
      return { valid: true, reason: 'admin_override' };
    }
    return { valid: false, reason: `Unknown status: ${current}` };
  }

  // Check if transition is valid
  const isValid = validNextStatuses.includes(next as any);

  if (isValid) {
    return { valid: true };
  }

  // Not valid - check for admin override
  if (isAdmin) {
    return { valid: true, reason: 'admin_override' };
  }

  // Invalid transition
  return {
    valid: false,
    reason: `Invalid transition from '${current}' to '${next}' for ${service} service. Valid options: ${validNextStatuses.join(', ') || 'none'}`
  };
}

/**
 * Get all valid next statuses for a given current status and service type.
 *
 * @param current - Current project status
 * @param service - Service type
 * @returns Array of valid next statuses
 */
export function getValidTransitions(
  current: ProjectStatus,
  service: ServiceType
): ProjectStatus[] {
  const transitions = getTransitionMap(service);
  return (transitions[current as keyof typeof transitions] as ProjectStatus[]) || [];
}

/**
 * Get the initial status for a service type (used when creating projects).
 *
 * @param service - Service type
 * @returns Initial status for new projects of this service type
 */
export function getInitialStatus(service: ServiceType): ProjectStatus {
  switch (service) {
    case 'efficiency':
      return 'pending_onboarding';
    case 'consulting':
      return 'pending_requirements';
    case 'advocacy':
      return 'pending_audit';
    default:
      return 'pending_onboarding';
  }
}

/**
 * Check if a status is terminal (no transitions out).
 *
 * @param status - Status to check
 * @param service - Service type
 * @returns Whether the status is terminal
 */
export function isTerminalStatus(status: ProjectStatus, service: ServiceType): boolean {
  const transitions = getValidTransitions(status, service);
  return transitions.length === 0;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getTransitionMap(service: ServiceType) {
  switch (service) {
    case 'efficiency':
      return EFFICIENCY_TRANSITIONS;
    case 'consulting':
      return CONSULTING_TRANSITIONS;
    case 'advocacy':
      return ADVOCACY_TRANSITIONS;
    default:
      return EFFICIENCY_TRANSITIONS;
  }
}

/**
 * Get the display label for a status in the specified language.
 */
export function getStatusLabel(status: ProjectStatus, language: 'en' | 'es' = 'en'): string {
  return STATUS_LABELS[status]?.[language] || status;
}

/**
 * Get the Tailwind color classes for a status.
 */
export function getStatusColor(status: ProjectStatus): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get customer-friendly label (simplified version for customer-facing UI).
 */
export function getCustomerLabel(status: ProjectStatus, service: ServiceType, language: 'en' | 'es' = 'en'): string {
  // Map technical statuses to friendly customer labels
  const friendlyMappings: Partial<Record<ProjectStatus, { en: string; es: string }>> = {
    'pending_onboarding': { en: 'Getting Started', es: 'Comenzando' },
    'pending_payment': { en: 'Awaiting Your Payment', es: 'Esperando Tu Pago' },
    'pending_scheduling': { en: 'Schedule Your Appointment', es: 'Programa Tu Cita' },
    'scheduled': { en: 'Appointment Scheduled', es: 'Cita Programada' },
    'in_progress': { en: 'Work In Progress', es: 'Trabajo en Progreso' },
    'completed': { en: 'Project Complete', es: 'Proyecto Completado' },
  };

  return friendlyMappings[status]?.[language] || STATUS_LABELS[status]?.[language] || status;
}

// ============================================================================
// State Machine Class (Alternative API)
// ============================================================================

export class ProjectStateMachine {
  private service: ServiceType;
  private currentStatus: ProjectStatus;

  constructor(service: ServiceType, initialStatus?: ProjectStatus) {
    this.service = service;
    this.currentStatus = initialStatus || getInitialStatus(service);
  }

  get status(): ProjectStatus {
    return this.currentStatus;
  }

  canTransitionTo(next: ProjectStatus, isAdmin: boolean = false): TransitionResult {
    return canTransition(this.currentStatus, next, this.service, isAdmin);
  }

  getValidTransitions(): ProjectStatus[] {
    return getValidTransitions(this.currentStatus, this.service);
  }

  transition(next: ProjectStatus, isAdmin: boolean = false): TransitionResult {
    const result = this.canTransitionTo(next, isAdmin);
    if (result.valid) {
      this.currentStatus = next;
    }
    return result;
  }

  isTerminal(): boolean {
    return isTerminalStatus(this.currentStatus, this.service);
  }
}
