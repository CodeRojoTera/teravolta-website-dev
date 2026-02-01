import { addDays } from 'date-fns';
import { supabaseAdmin } from '../supabase-admin';
import {
    DeletionReason,
    DeletionLogEntry,
    logCascadeDeletions,
    logDeletion,
    fetchUserDataForAudit
} from './deletion-audit';

const GRACE_PERIOD_DAYS = 15;

export interface UserDeletionOptions {
    requestedBy: string | null;
    reason: DeletionReason;
    forceDelete?: boolean;
    notes?: string;
}

export interface DeletionResult {
    success: boolean;
    error?: string;
    scheduledFor?: string;
    softDeleted?: boolean;
    hardDeleted?: boolean;
    cancelled?: boolean;
    auditDeletionId?: string | null;
    cascadeDeletionIds?: string[];
    activeProjects?: {
        count: number;
        projects: Array<{ id: string; status: string; clientName?: string | null }>;
    };
}

export async function scheduleUserDeletion(userId: string, options: UserDeletionOptions): Promise<DeletionResult> {
    try {
        const activeCheck = await checkUserHasActiveProjects(userId);
        if (activeCheck.hasActive && !options.forceDelete) {
            return {
                success: false,
                error: 'User has active projects and requires admin override',
                activeProjects: {
                    count: activeCheck.count,
                    projects: activeCheck.projects
                }
            };
        }

        const scheduledFor = addDays(new Date(), GRACE_PERIOD_DAYS).toISOString();
        const { data: updatedUser, error: userError } = await supabaseAdmin
            .from('users')
            .update({
                deletion_scheduled_for: scheduledFor,
                deleted_by: options.requestedBy
            })
            .eq('id', userId)
            .is('deleted_at', null)
            .select('id')
            .maybeSingle();

        if (userError) throw userError;
        if (!updatedUser) {
            return { success: false, error: 'User not found or already deleted' };
        }

        const { data: cancelledProjects, error: projectError } = await supabaseAdmin
            .from('active_projects')
            .update({ status: 'cancelled' })
            .eq('user_id', userId)
            .not('status', 'in', '("completed","cancelled")')
            .select('*');

        if (projectError) throw projectError;

        if (cancelledProjects && cancelledProjects.length > 0) {
            for (const project of cancelledProjects) {
                await logDeletion({
                    tableName: 'active_projects',
                    recordId: project.id,
                    recordData: project,
                    deletedBy: options.requestedBy,
                    deletionType: 'scheduled',
                    deletionReason: options.reason,
                    notes: options.notes
                });
            }
        }

        return { success: true, scheduledFor };
    } catch (error: any) {
        console.error('Error scheduling user deletion:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

export async function cancelScheduledDeletion(userId: string): Promise<DeletionResult> {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .update({
                deletion_scheduled_for: null,
                deleted_by: null
            })
            .eq('id', userId)
            .is('deleted_at', null)
            .select('id')
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            return { success: false, error: 'User not found or already deleted' };
        }

        return { success: true, cancelled: true };
    } catch (error: any) {
        console.error('Error cancelling scheduled deletion:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

export async function executeSoftDelete(userId: string, options: UserDeletionOptions): Promise<DeletionResult> {
    try {
        const activeCheck = await checkUserHasActiveProjects(userId);
        if (activeCheck.hasActive && !options.forceDelete) {
            return {
                success: false,
                error: 'User has active projects and requires admin override',
                activeProjects: {
                    count: activeCheck.count,
                    projects: activeCheck.projects
                }
            };
        }

        await fetchUserDataForAudit(userId);

        const { data: updatedUser, error: userError } = await supabaseAdmin
            .from('users')
            .update({
                deleted_at: new Date().toISOString(),
                deleted_by: options.requestedBy,
                deletion_scheduled_for: null
            })
            .eq('id', userId)
            .select('id')
            .maybeSingle();

        if (userError) throw userError;
        if (!updatedUser) {
            return { success: false, error: 'User not found or already deleted' };
        }

        const { error: projectError } = await supabaseAdmin
            .from('active_projects')
            .update({ status: 'cancelled' })
            .eq('user_id', userId)
            .not('status', 'in', '("completed","cancelled")');

        if (projectError) throw projectError;

        return { success: true, softDeleted: true };
    } catch (error: any) {
        console.error('Error executing soft delete:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

export async function executeHardDelete(userId: string, options: UserDeletionOptions): Promise<DeletionResult> {
    try {
        const activeCheck = await checkUserHasActiveProjects(userId);
        if (activeCheck.hasActive && !options.forceDelete) {
            return {
                success: false,
                error: 'User has active projects and requires admin override',
                activeProjects: {
                    count: activeCheck.count,
                    projects: activeCheck.projects
                }
            };
        }

        const auditData = await fetchUserDataForAudit(userId);

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (authError) {
            console.warn('Auth delete failed, falling back to public.users delete:', authError);
        }

        const { error: userDeleteError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);

        if (userDeleteError) throw userDeleteError;

        const { error: notificationError } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('user_id', userId);

        if (notificationError) {
            console.warn('Failed to delete notifications during user deletion:', notificationError);
        }

        const { error: documentError } = await supabaseAdmin
            .from('documents')
            .update({ uploaded_by: null })
            .eq('uploaded_by', userId);

        if (documentError) {
            console.warn('Failed to clear documents.uploaded_by:', documentError);
        }

        const { data: auditRow, error: auditError } = await supabaseAdmin
            .from('deletion_audit_log')
            .select('id')
            .eq('table_name', 'users')
            .eq('record_id', userId)
            .order('deleted_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (auditError) {
            console.warn('Failed to locate primary deletion audit entry:', auditError);
        }

        const cascadeDeletionIds = await logUserCascadeDeletions(auditData, options, auditRow?.id || null);

        return {
            success: true,
            hardDeleted: true,
            auditDeletionId: auditRow?.id || null,
            cascadeDeletionIds
        };
    } catch (error: any) {
        console.error('Error executing hard delete:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

async function checkUserHasActiveProjects(userId: string): Promise<{
    hasActive: boolean;
    count: number;
    projects: Array<{ id: string; status: string; clientName?: string | null }>;
}> {
    const { data, error } = await supabaseAdmin
        .from('active_projects')
        .select('id, status, client_name')
        .eq('user_id', userId)
        .not('status', 'in', '("completed","cancelled")');

    if (error) throw error;

    const projects = (data || []).map((project: any) => ({
        id: project.id,
        status: project.status,
        clientName: project.client_name || null
    }));

    return {
        hasActive: projects.length > 0,
        count: projects.length,
        projects
    };
}

async function logUserCascadeDeletions(
    auditData: {
        user: Record<string, unknown> | null;
        projects: Record<string, unknown>[];
        appointments: Record<string, unknown>[];
        documents: Record<string, unknown>[];
        invoices: Record<string, unknown>[];
        notifications: Record<string, unknown>[];
    },
    options: UserDeletionOptions,
    parentDeletionId: string | null
): Promise<string[]> {
    const cascadeEntries: Omit<DeletionLogEntry, 'parentDeletionId' | 'deletionType'>[] = [];

    for (const project of auditData.projects) {
        cascadeEntries.push({
            tableName: 'active_projects',
            recordId: String(project.id),
            recordData: project,
            deletedBy: options.requestedBy,
            deletionReason: options.reason,
            notes: options.notes
        });
    }

    for (const appointment of auditData.appointments) {
        cascadeEntries.push({
            tableName: 'appointments',
            recordId: String(appointment.id),
            recordData: appointment,
            deletedBy: options.requestedBy,
            deletionReason: options.reason,
            notes: options.notes
        });
    }

    for (const invoice of auditData.invoices) {
        cascadeEntries.push({
            tableName: 'invoices',
            recordId: String(invoice.id),
            recordData: invoice,
            deletedBy: options.requestedBy,
            deletionReason: options.reason,
            notes: options.notes
        });
    }

    for (const notification of auditData.notifications) {
        cascadeEntries.push({
            tableName: 'notifications',
            recordId: String(notification.id),
            recordData: notification,
            deletedBy: options.requestedBy,
            deletionReason: options.reason,
            notes: options.notes
        });
    }

    if (cascadeEntries.length === 0) {
        return [];
    }

    if (parentDeletionId) {
        return logCascadeDeletions(parentDeletionId, cascadeEntries);
    }

    const childIds: string[] = [];
    for (const entry of cascadeEntries) {
        const id = await logDeletion({
            ...entry,
            deletionType: 'cascade'
        });
        if (id) childIds.push(id);
    }

    return childIds;
}
