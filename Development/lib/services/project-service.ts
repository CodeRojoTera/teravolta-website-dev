import { supabaseAdmin } from '../supabase-admin';
import {
  canTransition,
  getValidTransitions,
  getStatusLabel,
  getStatusColor,
  getCustomerLabel,
} from '../state-machines/project-states';
import type { ServiceType, ProjectStatus } from '../state-machines/types';

export interface StatusUpdateResult {
  success: boolean;
  error?: string;
  warning?: string;
  previousStatus?: ProjectStatus;
  newStatus?: ProjectStatus;
  wasOverride?: boolean;
}

export interface ProjectWithStatus {
  id: string;
  status: ProjectStatus;
  service: ServiceType;
  client_name: string;
  user_id: string;
}

/**
 * Update a project's status with state machine validation.
 *
 * @param projectId - The project to update
 * @param newStatus - The desired new status
 * @param userId - The user making the change
 * @param isAdmin - Whether the user has admin privileges
 * @param notes - Optional notes about the status change
 * @returns StatusUpdateResult with success/error and transition details
 */
export async function updateProjectStatus(
  projectId: string,
  newStatus: ProjectStatus,
  userId: string,
  isAdmin: boolean,
  notes?: string
): Promise<StatusUpdateResult> {
  // Fetch current project state
  const { data: project, error: fetchError } = await supabaseAdmin
    .from('active_projects')
    .select('id, status, service, client_name, user_id')
    .eq('id', projectId)
    .single();

  if (fetchError || !project) {
    return {
      success: false,
      error: 'Project not found',
    };
  }

  const currentStatus = project.status as ProjectStatus;
  const serviceType = project.service as ServiceType;

  // Validate the transition using state machine
  const transitionResult = canTransition(currentStatus, newStatus, serviceType, isAdmin);

  if (!transitionResult.valid) {
    return {
      success: false,
      error: transitionResult.reason,
      previousStatus: currentStatus,
    };
  }

  // Check if this was an admin override
  const wasOverride = transitionResult.reason === 'admin_override';

  // Update the status
  const { error: updateError } = await supabaseAdmin
    .from('active_projects')
    .update({
      status: newStatus,
      progress: calculateProgressFromStatus(newStatus, serviceType),
    })
    .eq('id', projectId);

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
      previousStatus: currentStatus,
    };
  }

  if (wasOverride) {
    console.warn(
      `[STATE MACHINE] Admin override: ${currentStatus} -> ${newStatus} for project ${projectId} by user ${userId}`
    );
  }

  await logStatusChange(projectId, currentStatus, newStatus, userId, wasOverride, notes);

  return {
    success: true,
    previousStatus: currentStatus,
    newStatus,
    wasOverride,
    warning: wasOverride
      ? 'Status changed via admin override. This transition is not normally allowed.'
      : undefined,
  };
}

/**
 * Get valid next statuses for a project (for UI dropdown).
 */
export async function getValidNextStatuses(
  projectId: string,
  language: 'en' | 'es' = 'en'
): Promise<{
  currentStatus: ProjectStatus;
  validStatuses: Array<{
    status: ProjectStatus;
    label: string;
    color: string;
  }>;
} | null> {
  const { data: project, error } = await supabaseAdmin
    .from('active_projects')
    .select('status, service')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    return null;
  }

  const currentStatus = project.status as ProjectStatus;
  const serviceType = project.service as ServiceType;
  const validStatuses = getValidTransitions(currentStatus, serviceType);

  return {
    currentStatus,
    validStatuses: validStatuses.map((status) => ({
      status,
      label: getStatusLabel(status, language),
      color: getStatusColor(status),
    })),
  };
}

/**
 * Get project status details for display.
 */
export function getProjectStatusDisplay(
  status: ProjectStatus,
  service: ServiceType,
  language: 'en' | 'es' = 'en',
  forCustomer: boolean = false
): {
  label: string;
  color: string;
  customerLabel?: string;
} {
  return {
    label: getStatusLabel(status, language),
    color: getStatusColor(status),
    customerLabel: forCustomer ? getCustomerLabel(status, service, language) : undefined,
  };
}

/**
 * Calculate progress percentage based on status and service type.
 */
function calculateProgressFromStatus(status: ProjectStatus, service: ServiceType): number {
  const progressMap: Record<ServiceType, Partial<Record<ProjectStatus, number>>> = {
    efficiency: {
      pending_onboarding: 5,
      pending_payment: 10,
      pending_scheduling: 15,
      scheduled: 20,
      pending_assignment: 25,
      pending_installation: 30,
      in_progress: 50,
      active: 60,
      paused: 50,
      on_hold: 40,
      pending_documents: 70,
      pending_client: 75,
      in_review: 85,
      completed: 100,
      cancelled: 0,
    },
    consulting: {
      pending_onboarding: 5,
      pending_requirements: 10,
      requirements_defined: 20,
      rfp_preparation: 35,
      rfp_published: 45,
      offers_evaluation: 60,
      supplier_selection: 75,
      contract_negotiation: 90,
      in_progress: 50,
      on_hold: 40,
      completed: 100,
      cancelled: 0,
    },
    advocacy: {
      pending_onboarding: 5,
      pending_audit: 10,
      audit_in_progress: 20,
      audit_complete: 30,
      claim_formulation: 40,
      claim_ready: 50,
      claim_filed: 60,
      distributor_negotiating: 70,
      asep_filed: 75,
      asep_negotiating: 80,
      resolved: 90,
      recovery_received: 95,
      in_progress: 50,
      on_hold: 40,
      completed: 100,
      cancelled: 0,
    },
  };

  return progressMap[service]?.[status] ?? 0;
}

/**
 * Log status change for audit trail.
 */
async function logStatusChange(
  projectId: string,
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus,
  changedBy: string,
  wasOverride: boolean,
  notes?: string
): Promise<void> {
  const logEntry = {
    projectId,
    fromStatus,
    toStatus,
    changedBy,
    wasOverride,
    notes,
    timestamp: new Date().toISOString(),
  };

  console.log('[STATUS CHANGE]', JSON.stringify(logEntry));
}
