'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { uploadMultipleDocuments, getDocumentsForEntity } from '@/lib/documentUtils';
import DocumentList from '@/components/DocumentList';
import { DocumentEntityType } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';

interface DocumentManagerProps {
    entityType: DocumentEntityType;
    entityId: string;
    title?: string;
    allowedCategories?: string[];
    readonly?: boolean;
}

export default function DocumentManager({
    entityType,
    entityId,
    title,
    allowedCategories,
    readonly = false
}: DocumentManagerProps) {
    const { language } = useLanguage();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [category, setCategory] = useState<any>('other');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(0);

    const t = {
        en: {
            uploadTitle: 'Upload Documents',
            dragDrop: 'Drag & drop files here or click to select',
            selected: 'Selected Files',
            category: 'Category',
            description: 'Description (Optional)',
            uploadBtn: 'Upload Files',
            uploading: 'Uploading...',
            success: 'Documents uploaded successfully',
            error: 'Failed to upload documents',
            remove: 'Remove',
            categories: {
                bill: 'Utility Bill',
                contract: 'Contract',
                invoice: 'Invoice',
                report: 'Report',
                monthly_report: 'Monthly Report',
                deliverable: 'Project Deliverable',
                payment_proof: 'Proof of Payment',
                site_plan: 'Site Plan',
                meter_reading: 'Meter Reading (CSV)',
                other: 'Other'
            }
        },
        es: {
            uploadTitle: 'Subir Documentos',
            dragDrop: 'Arrastra archivos aquí o haz clic para seleccionar',
            selected: 'Archivos Seleccionados',
            category: 'Categoría',
            description: 'Descripción (Opcional)',
            uploadBtn: 'Subir Archivos',
            uploading: 'Subiendo...',
            success: 'Documentos subidos exitosamente',
            error: 'Error al subir documentos',
            remove: 'Eliminar',
            categories: {
                bill: 'Factura de Luz',
                contract: 'Contrato',
                invoice: 'Factura',
                report: 'Reporte',
                monthly_report: 'Reporte Mensual',
                deliverable: 'Entregable del Proyecto',
                payment_proof: 'Comprobante de Pago',
                site_plan: 'Plano del Sitio',
                meter_reading: 'Lectura de Medidor (CSV)',
                other: 'Otro'
            }
        }
    }[language as 'en' | 'es'] || { en: {} as any }.en; // Fallback

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);

        try {
            const results = await uploadMultipleDocuments(
                selectedFiles,
                entityType,
                entityId,
                user?.id || 'system',
                category
            );

            // Check if all succeeded
            const failures = results.filter(r => !r.success);
            if (failures.length > 0) {
                console.error('Some uploads failed:', failures);
                showToast(`${failures.length} files failed to upload`, 'error');
            } else {
                showToast(t.success, 'success');
            }

            // If we could pass description to uploadMultipleDocuments, we would.
            // Currently uploadMultipleDocuments helper doesn't accept description in the loop easily 
            // without modifying it or looping manually here.
            // Wait! I checked documentUtils.ts earlier, uploadDocument accepts description options.
            // But uploadMultipleDocuments signature in existing code (that I saw) might not.
            // Let's re-read documentUtils.ts signature in my head or check.

            // To be safe and support description which IS required by the plan:
            // I will implement the loop manually here instead of using uploadMultipleDocuments 
            // IF uploadMultipleDocuments doesn't support description. 
            // In the file view earlier, `uploadMultipleDocuments` took (files, type, id, uploader, category).
            // It did NOT take description.
            // So I should loop manually here to support description.

            /* 
               Manual Loop Implementation for Description Support 
            */
            /*
            for (const file of selectedFiles) {
                 await uploadDocument({
                     file, entityType, entityId, uploadedBy: user?.id, category, description
                 });
            }
            */

            // However, for now I'll stick to what I can do. I'll use the loop approach.
        } catch (error) {
            console.error(error);
            showToast(t.error, 'error');
        } finally {
            setIsUploading(false);
            setSelectedFiles([]);
            const fileInput = document.getElementById('dm-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            setLastUpdate(Date.now()); // Trigger list refresh
        }
    };

    // Better upload function with description support
    const processUpload = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);

        try {
            // Dynamic import to avoid circular dep issues if any, or just use direct import
            const { uploadDocument } = await import('@/lib/documentUtils');

            let successCount = 0;
            for (const file of selectedFiles) {
                const result = await uploadDocument({
                    file,
                    entityType,
                    entityId,
                    uploadedBy: user?.id || 'system',
                    category,
                    description: description || undefined
                });
                if (result.success) successCount++;
            }

            if (successCount === selectedFiles.length) {
                showToast(t.success, 'success');
            } else {
                showToast(`Uploaded ${successCount}/${selectedFiles.length} files`, 'warning');
            }

            setSelectedFiles([]);
            setDescription('');
            const fileInput = document.getElementById('dm-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            setLastUpdate(Date.now());

        } catch (error) {
            console.error(error);
            showToast(t.error, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const categories = allowedCategories || [
        'bill', 'contract', 'invoice', 'report',
        'deliverable', 'payment_proof', 'site_plan', 'meter_reading', 'other'
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-[#004a90] text-lg mb-4">{title || t.uploadTitle}</h3>

                {/* Upload Area */}
                {!readonly && (
                    <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t.category}</label>
                                <select
                                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {t.categories[cat as keyof typeof t.categories] || cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-[2]">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t.description}</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                                    placeholder="e.g. Q1 Report signed"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div
                            className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('dm-file-input')?.click()}
                        >
                            <i className="ri-upload-cloud-2-line text-3xl text-blue-300 mb-2 block"></i>
                            <span className="text-sm text-gray-500 font-medium">{t.dragDrop}</span>
                            <input
                                id="dm-file-input"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.selected}</h4>
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <i className="ri-file-line text-gray-400"></i>
                                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(idx)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <i className="ri-close-line"></i>
                                        </button>
                                    </div>
                                ))}

                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={processUpload}
                                        disabled={isUploading}
                                        className="px-6 py-2 bg-[#004a90] text-white rounded-lg font-bold text-sm shadow-md hover:bg-[#003870] disabled:opacity-50 transition-all flex items-center gap-2"
                                    >
                                        {isUploading && <i className="ri-loader-4-line animate-spin"></i>}
                                        {t.uploadBtn}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Document List View */}
            <div className="p-6 pt-0">
                <DocumentList
                    entityType={entityType}
                    entityId={entityId}
                    showCategory={true}
                    lastUpdate={lastUpdate} // Triggers refresh
                    title=" " // Hide title as we have header
                    allowDelete={!readonly}
                />
            </div>
        </div>
    );
}
