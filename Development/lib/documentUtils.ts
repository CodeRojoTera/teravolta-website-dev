import { supabase } from './supabase';
import { Document, DocumentEntityType } from './types';
import { v4 as uuidv4 } from 'uuid'; // You might need to install uuid or use crypto.randomUUID

/**
 * Options for uploading a document
 */
export interface UploadDocumentOptions {
    /** The file to upload */
    file: File;

    /** Entity type this document belongs to */
    entityType: DocumentEntityType;

    /** ID of the entity this document belongs to */
    entityId: string;

    /** User ID of the uploader (use 'system' for automated uploads) */
    uploadedBy: string;

    /** Optional description */
    description?: string;

    /** Document category */
    category?: 'bill' | 'contract' | 'invoice' | 'report' | 'monthly_report' | 'deliverable' | 'payment_proof' | 'site_plan' | 'meter_reading' | 'other';

    /** Custom storage path prefix (default: documents/{entityType}/{entityId}) */
    customPath?: string;
}

/**
 * Result of a document upload
 */
export interface UploadDocumentResult {
    success: boolean;
    document?: Document;
    error?: string;
}

/**
 * Helper to determine bucket based on entity type
 */
function getBucketForEntity(entityType: DocumentEntityType | string): string {
    switch (entityType) {
        case 'inquiries':
        case 'inquiry':
            return 'inquiries';
        case 'quotes':
        case 'quote':
            return 'quotes';
        case 'portfolio':
        case 'portfolioProjects':
            return 'portfolio';
        case 'activeProjects':
        case 'project':
        case 'projects':
        case 'active_projects':
            return 'projects';
        default:
            return 'projects'; // Default to private projects bucket for safety
    }
}

/**
 * Upload a document to Supabase Storage and create a record in 'documents' table
 */
export async function uploadDocument(options: UploadDocumentOptions): Promise<UploadDocumentResult> {
    const { file, entityType, entityId, uploadedBy, description, category, customPath } = options;

    try {
        const bucket = getBucketForEntity(entityType);

        // Generate storage path
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

        // Path structure: {entityId}/{timestamp}_{filename} to keep folders clean
        // If customPath is provided, use it, but ensure it doesn't break bucket logic
        const path = customPath
            ? `${customPath}/${timestamp}_${sanitizedFileName}`
            : `${entityId}/${timestamp}_${sanitizedFileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        // Create DB record
        // Note: 'uploadedBy' might need to be UUID or null if 'system'
        let uploaderUuid: string | null = uploadedBy;
        if (uploadedBy === 'system') {
            uploaderUuid = null; // Or handle system user specific logic
        }

        const documentData = {
            file_name: file.name, // Map name -> file_name for DB
            storage_path: path,
            download_url: publicUrl,
            content_type: file.type,
            size: file.size,
            uploaded_by: uploaderUuid,
            entity_type: entityType,
            entity_id: entityId,
            description: description || null,
            category: category || null
        };

        const { data: docRecord, error: dbError } = await supabase
            .from('documents')
            .insert(documentData)
            .select()
            .single();

        if (dbError) throw dbError;

        return {
            success: true,
            document: {
                id: docRecord.id,
                name: docRecord.file_name, // Map file_name -> name
                storagePath: docRecord.storage_path,
                downloadURL: docRecord.download_url,
                contentType: docRecord.content_type,
                size: docRecord.size,
                uploadedAt: docRecord.created_at || new Date().toISOString(),
                uploadedBy: docRecord.uploaded_by || 'system',
                linkedTo: {
                    type: docRecord.entity_type as any,
                    id: docRecord.entity_id
                },
                description: docRecord.description || undefined,
                category: docRecord.category || undefined
            }
        };
    } catch (error: any) {
        console.error('Error uploading document:', error);
        return {
            success: false,
            error: error.message || 'Unknown error'
        };
    }
}

/**
 * Upload multiple documents at once
 */
export async function uploadMultipleDocuments(
    files: File[],
    entityType: DocumentEntityType,
    entityId: string,
    uploadedBy: string,
    category?: 'bill' | 'contract' | 'invoice' | 'report' | 'monthly_report' | 'deliverable' | 'payment_proof' | 'site_plan' | 'meter_reading' | 'other'
): Promise<UploadDocumentResult[]> {
    const results: UploadDocumentResult[] = [];

    for (const file of files) {
        const result = await uploadDocument({
            file,
            entityType,
            entityId,
            uploadedBy,
            category
        });
        results.push(result);
    }

    return results;
}

/**
 * Get all documents linked to an entity
 */
export async function getDocumentsForEntity(
    entityType: DocumentEntityType,
    entityId: string
): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error("Error fetching documents:", error);
        return [];
    }

    return data.map((d: any) => ({
        id: d.id,
        name: d.file_name, // Map file_name -> name
        storagePath: d.storage_path,
        downloadURL: d.download_url,
        contentType: d.content_type,
        size: d.size,
        uploadedAt: d.created_at,
        uploadedBy: d.uploaded_by || 'system',
        linkedTo: {
            type: d.entity_type as any,
            id: d.entity_id
        },
        description: d.description || undefined,
        category: d.category || undefined
    }));
}

/**
 * Delete a document from Storage and DB
 */
export async function deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Get document to find path and bucket
        const { data: docData, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .single();

        if (fetchError || !docData) {
            return { success: false, error: 'Document not found' };
        }

        const bucket = getBucketForEntity(docData.entity_type);
        const path = docData.storage_path;

        // Delete from Storage
        const { error: storageError } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (storageError) {
            console.warn("Error removing from storage (might be already deleted):", storageError);
        }

        // Delete from DB
        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId);

        if (dbError) throw dbError;

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting document:', error);
        return {
            success: false,
            error: error.message || 'Unknown error'
        };
    }
}

/**
 * Move a document to a different entity (relink) - Just DB update
 */
export async function relinkDocument(
    documentId: string,
    newEntityType: DocumentEntityType,
    newEntityId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('documents')
            .update({
                entity_type: newEntityType,
                entity_id: newEntityId
            })
            .eq('id', documentId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error relinking document:', error);
        return {
            success: false,
            error: error.message || 'Unknown error'
        };
    }
}

/**
 * Get documents by category for an entity
 */
export async function getDocumentsByCategory(
    entityType: DocumentEntityType,
    entityId: string,
    category: 'bill' | 'contract' | 'invoice' | 'report' | 'monthly_report' | 'deliverable' | 'payment_proof' | 'site_plan' | 'meter_reading' | 'other'
): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching documents by category:", error);
        return [];
    }

    return data.map((d: any) => ({
        id: d.id,
        name: d.file_name, // Map file_name -> name
        storagePath: d.storage_path,
        downloadURL: d.download_url,
        contentType: d.content_type,
        size: d.size,
        uploadedAt: d.created_at,
        uploadedBy: d.uploaded_by || 'system',
        linkedTo: {
            type: d.entity_type as any,
            id: d.entity_id
        },
        description: d.description || undefined,
        category: d.category || undefined
    }));
}
