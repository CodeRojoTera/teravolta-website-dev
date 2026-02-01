'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Document } from '@/lib/types';
import { getDocumentsForEntity, deleteDocument } from '@/lib/documentUtils';
import { DocumentEntityType } from '@/lib/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface DocumentListProps {
    entityType: DocumentEntityType;
    entityId: string;
    title?: string;
    emptyMessage?: string;
    showCategory?: boolean;
    maxItems?: number;
    lastUpdate?: number;
    highlightClientId?: string;
    allowDelete?: boolean;
}

/**
 * Reusable component for displaying documents linked to an entity
 */
export default function DocumentList({
    entityType,
    entityId,
    title,
    emptyMessage,
    showCategory = false,
    maxItems,
    lastUpdate,
    highlightClientId,
    allowDelete = false
}: DocumentListProps) {
    const { language } = useLanguage();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    // Filtering & Sorting State
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const translations = {
        en: {
            defaultTitle: 'Documents',
            defaultEmpty: 'No documents available',
            loading: 'Loading documents...',
            view: 'View',
            download: 'Download',
            showMore: 'Show more',
            showLess: 'Show less'
        },
        es: {
            defaultTitle: 'Documentos',
            defaultEmpty: 'No hay documentos disponibles',
            loading: 'Cargando documentos...',
            view: 'Ver',
            download: 'Descargar',
            showMore: 'Ver más',
            showLess: 'Ver menos'
        }
    };

    const t = translations[language as keyof typeof translations] || translations.es;

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!entityId) {
                setLoading(false);
                return;
            }

            try {
                const docs = await getDocumentsForEntity(entityType, entityId);
                setDocuments(docs);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [entityType, entityId, lastUpdate]);

    const handleDelete = async (docId: string) => {
        if (!confirm(language === 'es' ? '¿Estás seguro de eliminar este documento?' : 'Are you sure you want to delete this document?')) return;

        try {
            const { success, error } = await deleteDocument(docId);
            if (success) {
                setDocuments(prev => prev.filter(d => d.id !== docId));
            } else {
                console.error('Failed to delete:', error);
                alert('Failed to delete document');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getFileIcon = (contentType?: string, name?: string) => {
        if (contentType?.includes('pdf') || name?.endsWith('.pdf')) {
            return 'ri-file-pdf-line text-red-500';
        }
        if (contentType?.includes('image') || name?.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return 'ri-image-line text-green-500';
        }
        if (contentType?.includes('spreadsheet') || name?.match(/\.(xlsx|xls|csv)$/i)) {
            return 'ri-file-excel-line text-green-600';
        }
        if (contentType?.includes('word') || name?.endsWith('.docx') || name?.endsWith('.doc')) {
            return 'ri-file-word-line text-blue-600';
        }
        return 'ri-file-line text-[#004a90]';
    };

    const getCategoryBadge = (category?: string) => {
        const categoryColors: Record<string, string> = {
            bill: 'bg-amber-100 text-amber-800',
            contract: 'bg-blue-100 text-blue-800',
            invoice: 'bg-green-100 text-green-800',
            report: 'bg-purple-100 text-purple-800',
            other: 'bg-gray-100 text-gray-800'
        };
        const color = categoryColors[category || 'other'] || categoryColors.other;
        return <span className={`px-2 py-0.5 text-xs rounded-full ${color}`}>{category || 'other'}</span>;
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString(language === 'es' ? 'es-PA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
            </div>
        );
    }



    // ... (rest of logic)

    const filteredDocs = documents
        .filter(doc => filterCategory === 'all' || doc.category === filterCategory)
        .sort((a, b) => {
            const dateA = new Date(a.uploadedAt).getTime();
            const dateB = new Date(b.uploadedAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    // Pagination logic applied to filtered docs
    const displayedDocs = maxItems && !expanded
        ? filteredDocs.slice(0, maxItems)
        : filteredDocs;
    const hasMore = maxItems && filteredDocs.length > maxItems;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm font-semibold text-[#004a90]">
                    {title || t.defaultTitle}
                    {documents.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                            ({documents.length})
                        </span>
                    )}
                </h3>

                {/* Filters */}
                {documents.length > 0 && (
                    <div className="flex items-center gap-2">
                        {showCategory && (
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="text-xs border-gray-200 rounded-lg focus:ring-[#004a90] py-1 pl-2 pr-6 bg-gray-50"
                            >
                                <option value="all">Todas las categorías</option>
                                <option value="bill">Factura de Luz</option>
                                <option value="report">Reporte Final</option>
                                <option value="monthly_report">Reporte Mensual</option>
                                <option value="contract">Contrato</option>
                                <option value="invoice">Facturas (Pago)</option>
                                <option value="other">Otros</option>
                            </select>
                        )}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="text-xs border-gray-200 rounded-lg focus:ring-[#004a90] py-1 pl-2 pr-6 bg-gray-50"
                        >
                            <option value="newest">Más recientes</option>
                            <option value="oldest">Más antiguos</option>
                        </select>
                    </div>
                )}
            </div>

            {filteredDocs.length > 0 ? (
                <div className="space-y-2">
                    {displayedDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <i className={`${getFileIcon(doc.contentType, doc.name)} text-xl flex-shrink-0`}></i>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                                        {doc.name}
                                        {((highlightClientId && doc.uploadedBy === highlightClientId) ||
                                            doc.uploadedBy === 'system' ||
                                            doc.uploadedBy === 'client_guest') && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c3d021] text-[#194271] uppercase tracking-wide">
                                                    {language === 'es' ? 'Cliente' : 'Client'}
                                                </span>
                                            )}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-gray-500">
                                            {formatDate(doc.uploadedAt)}
                                            {doc.size && ` · ${formatFileSize(doc.size)}`}
                                        </p>
                                        {doc.description && (
                                            <span className="text-xs text-gray-400 italic border-l pl-2 border-gray-300 truncate max-w-[200px]">
                                                {doc.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {showCategory && doc.category && getCategoryBadge(doc.category)}
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                                <a
                                    href={doc.downloadURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-[#004a90] hover:bg-blue-50 rounded-lg transition-colors"
                                    title={t.download}
                                >
                                    <i className="ri-download-line text-lg"></i>
                                </a>
                                {allowDelete && (
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full py-2 text-sm text-[#004a90] hover:text-[#194271] font-medium"
                        >
                            {expanded ? t.showLess : `${t.showMore} (${filteredDocs.length - (maxItems || 0)} more)`}
                        </button>
                    )}
                </div>
            ) : (
                <EmptyState
                    icon="ri-folder-open-line"
                    title={documents.length > 0 ? "No hay documentos con este filtro" : (emptyMessage || t.defaultEmpty)}
                    variant="compact"
                />
            )}
        </div>
    );
}
