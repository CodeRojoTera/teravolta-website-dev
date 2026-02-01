import { supabaseAdmin } from '../supabase-admin';

export type DeletionType = 'soft' | 'hard' | 'cascade' | 'scheduled';
export type DeletionReason = 'user_request' | 'admin_action' | 'inactivity' | 'violation' | 'system' | 'gdpr';

export interface DeletionLogEntry {
    tableName: string;
    recordId: string;
    recordData: Record<string, unknown>;
    deletedBy: string | null;
    deletionType: DeletionType;
    deletionReason: DeletionReason;
    parentDeletionId?: string;
    notes?: string;
}

/**
 * Log a deletion to the audit log.
 * Use this for cascade or non-triggered tables; primary user/doc deletes are captured by DB triggers.
 */
export async function logDeletion(entry: DeletionLogEntry): Promise<string | null> {
    const { data, error } = await supabaseAdmin
        .from('deletion_audit_log')
        .insert({
            table_name: entry.tableName,
            record_id: entry.recordId,
            record_data: entry.recordData,
            deleted_by: entry.deletedBy,
            deletion_type: entry.deletionType,
            deletion_reason: entry.deletionReason,
            parent_deletion_id: entry.parentDeletionId,
            notes: entry.notes
        })
        .select('id')
        .single();

    if (error) {
        console.error('Failed to log deletion:', error);
        return null;
    }

    return data?.id || null;
}

/**
 * Log cascade deletions (child records deleted due to parent deletion).
 * Updates the parent deletion record with related deletion IDs.
 */
export async function logCascadeDeletions(
    parentDeletionId: string,
    cascadeEntries: Omit<DeletionLogEntry, 'parentDeletionId' | 'deletionType'>[]
): Promise<string[]> {
    const childIds: string[] = [];

    for (const entry of cascadeEntries) {
        const id = await logDeletion({
            ...entry,
            deletionType: 'cascade',
            parentDeletionId
        });
        if (id) childIds.push(id);
    }

    if (childIds.length > 0) {
        await supabaseAdmin
            .from('deletion_audit_log')
            .update({ related_deletions: childIds })
            .eq('id', parentDeletionId);
    }

    return childIds;
}

/**
 * Fetch user's complete data for audit log before deletion.
 * Returns all related records that will be affected.
 */
export async function fetchUserDataForAudit(userId: string): Promise<{
    user: Record<string, unknown> | null;
    projects: Record<string, unknown>[];
    appointments: Record<string, unknown>[];
    documents: Record<string, unknown>[];
    invoices: Record<string, unknown>[];
    notifications: Record<string, unknown>[];
}> {
    const [userResult, projectsResult, invoicesResult, notificationsResult] = await Promise.all([
        supabaseAdmin.from('users').select('*').eq('id', userId).single(),
        supabaseAdmin.from('active_projects').select('*').eq('user_id', userId),
        supabaseAdmin.from('invoices').select('*').eq('user_id', userId),
        supabaseAdmin.from('notifications').select('*').eq('user_id', userId)
    ]);

    const projectIds = (projectsResult.data || []).map((project: any) => project.id).filter(Boolean);
    const [appointmentsResult, documentsResult] = await Promise.all([
        projectIds.length > 0
            ? supabaseAdmin.from('appointments').select('*').in('project_id', projectIds)
            : Promise.resolve({ data: [] as Record<string, unknown>[], error: null }),
        supabaseAdmin.from('documents').select('*').or(`user_id.eq.${userId},uploaded_by.eq.${userId}`)
    ]);

    if (appointmentsResult.error) {
        console.error('Failed to fetch appointments for audit:', appointmentsResult.error);
    }
    if (documentsResult.error) {
        console.error('Failed to fetch documents for audit:', documentsResult.error);
    }

    return {
        user: userResult.data || null,
        projects: projectsResult.data || [],
        appointments: appointmentsResult.data || [],
        documents: documentsResult.data || [],
        invoices: invoicesResult.data || [],
        notifications: notificationsResult.data || []
    };
}
