'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface Inquiry {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    message: string;
    status?: 'pending' | 'in_process' | 'completed' | 'closed';
    createdAt: any;
    isNew?: boolean;
    attachments?: Array<{
        name: string;
        downloadURL?: string;
        url?: string;
        storagePath?: string;
        contentType?: string;
        size?: number;
    }>;
}

export default function InquiryDetailPage() {
    const { language } = useLanguage();
    const { id } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const [inquiry, setInquiry] = useState<any>(null);
    const [relatedInquiries, setRelatedInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchInquiry = async () => {
            if (!id) return;

            try {
                // Fetch the inquiry
                const { data: inquiryData, error } = await supabase
                    .from('inquiries')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !inquiryData) {
                    console.error('Error fetching inquiry:', error);
                    router.push('/portal/admin/inquiries');
                    return;
                }

                setInquiry(inquiryData);

                // Smart linking: Find other inquiries with same email or phone
                let related: any[] = [];

                if (inquiryData.email) {
                    const { data: byEmail } = await supabase
                        .from('inquiries')
                        .select('*')
                        .eq('email', inquiryData.email)
                        .neq('id', id);
                    if (byEmail) related = [...related, ...byEmail];
                }

                if (inquiryData.phone) {
                    const { data: byPhone } = await supabase
                        .from('inquiries')
                        .select('*')
                        .eq('phone', inquiryData.phone)
                        .neq('id', id);
                    if (byPhone) related = [...related, ...byPhone];
                }

                // Deduplicate
                const uniqueRelated = Array.from(new Map(related.map(item => [item.id, item])).values());
                setRelatedInquiries(uniqueRelated);

            } catch (error) {
                console.error('Error fetching inquiry:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiry();
    }, [id, router]);

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showToast(language === 'es' ? 'Consulta eliminada' : 'Inquiry deleted', 'success');
            router.push('/portal/admin/inquiries');
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            showToast('Error deleting inquiry', 'error');
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleDelete = () => setShowDeleteModal(true);

    const content = {
        en: {
            title: 'Inquiry Details',
            backToList: 'Back to Inquiries',
            delete: 'Delete Inquiry',
            contactInfo: 'Contact Information',
            inquiryInfo: 'Inquiry Information',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Company',
            service: 'Service',
            message: 'Message',
            date: 'Submitted',
            relatedInquiries: 'Related Inquiries',
            relatedDesc: 'Other inquiries from the same email or phone number',
            noRelated: 'No related inquiries found',
            viewDetails: 'View Details',
            smartMatch: 'Smart Match Detected',
            sameEmail: 'Same Email',
            samePhone: 'Same Phone',
            possibleDuplicate: 'Possible duplicate user',
            attachments: 'Attachments',
            noAttachments: 'No attachments',
            viewFile: 'View'
        },
        es: {
            title: 'Detalles de Consulta',
            backToList: 'Volver a Consultas',
            delete: 'Eliminar Consulta',
            contactInfo: 'Información de Contacto',
            inquiryInfo: 'Información de la Consulta',
            name: 'Nombre',
            email: 'Correo',
            phone: 'Teléfono',
            company: 'Empresa',
            service: 'Servicio',
            message: 'Mensaje',
            date: 'Enviado',
            relatedInquiries: 'Consultas Relacionadas',
            relatedDesc: 'Otras consultas del mismo correo o número de teléfono',
            noRelated: 'No se encontraron consultas relacionadas',
            viewDetails: 'Ver Detalles',
            smartMatch: 'Coincidencia Inteligente Detectada',
            sameEmail: 'Mismo Correo',
            samePhone: 'Mismo Teléfono',
            possibleDuplicate: 'Posible usuario duplicado',
            attachments: 'Archivos Adjuntos',
            noAttachments: 'Sin archivos adjuntos',
            viewFile: 'Ver'
        }
    };

    const t = content[language];

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    if (!inquiry) {
        return null;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.push('/portal/admin/inquiries')}
                        className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                    >
                        <i className="ri-arrow-left-line mr-1"></i>
                        {t.backToList}
                    </button>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                    {deleting ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {language === 'es' ? 'Eliminando...' : 'Deleting...'}
                        </span>
                    ) : (
                        <>
                            <i className="ri-delete-bin-line mr-2"></i>
                            {t.delete}
                        </>
                    )}
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in animate-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 zoom-in animate-in">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {language === 'es' ? 'Confirmar Eliminación' : 'Confirm Deletion'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {language === 'es'
                                ? '¿Estás seguro de que deseas eliminar esta consulta? Esta acción no se puede deshacer.'
                                : 'Are you sure you want to delete this inquiry? This action cannot be undone.'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                {deleting && <i className="ri-loader-4-line animate-spin"></i>}
                                {language === 'es' ? 'Eliminar' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Match Alert */}
            {relatedInquiries.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start">
                        <i className="ri-alert-line text-yellow-600 text-xl mr-3 mt-0.5"></i>
                        <div>
                            <h3 className="font-bold text-yellow-800">{t.smartMatch}</h3>
                            <p className="text-sm text-yellow-700 mt-1">{t.possibleDuplicate}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[#004a90] mb-4">{t.contactInfo}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">{t.name}</label>
                            <p className="text-lg text-[#004a90] font-medium">{inquiry.fullName || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">{t.email}</label>
                            <p className="text-lg text-gray-800">{inquiry.email || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">{t.phone}</label>
                            <p className="text-lg text-gray-800">{inquiry.phone || 'N/A'}</p>
                        </div>
                        {inquiry.company && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">{t.company}</label>
                                <p className="text-lg text-gray-800">{inquiry.company}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Inquiry Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[#004a90] mb-4">{t.inquiryInfo}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">{t.service}</label>
                            <p className="text-lg">
                                <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#c3d021]/20 text-[#194271]">
                                    {inquiry.service || 'General'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">{t.date}</label>
                            <p className="text-lg text-gray-800">
                                {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : (inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'Recently')}
                            </p>
                        </div>
                        {inquiry.message && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">{t.message}</label>
                                <p className="text-gray-800 mt-2 p-4 bg-gray-50 rounded-lg">{inquiry.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#004a90] mb-4">{t.attachments}</h2>

                {inquiry.attachments && inquiry.attachments.length > 0 ? (
                    <div className="space-y-2">
                        {inquiry.attachments.map((file: any, index: number) => {
                            const getFileIcon = (contentType?: string, name?: string) => {
                                if (contentType?.includes('pdf') || name?.endsWith('.pdf')) return 'ri-file-pdf-line text-red-500';
                                if (contentType?.includes('image') || name?.match(/\.(jpg|jpeg|png|gif)$/i)) return 'ri-image-line text-green-500';
                                if (contentType?.includes('spreadsheet') || name?.match(/\.(xlsx|xls)$/i)) return 'ri-file-excel-line text-green-600';
                                if (contentType?.includes('word') || name?.match(/\.(docx|doc)$/i)) return 'ri-file-word-line text-blue-600';
                                return 'ri-file-line text-[#004a90]';
                            };

                            const formatSize = (bytes?: number) => {
                                if (!bytes) return '';
                                if (bytes < 1024) return `${bytes} B`;
                                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                                return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                            };

                            return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <i className={`${getFileIcon(file.contentType, file.name)} text-2xl`}></i>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            {file.size && (
                                                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={file.downloadURL || file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <i className="ri-download-line"></i>
                                        {t.viewFile}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400">
                        <i className="ri-attachment-line text-3xl mb-2 block"></i>
                        <p className="text-sm">{t.noAttachments}</p>
                    </div>
                )}
            </div>

            {/* Related Inquiries */}
            {relatedInquiries.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[#004a90] mb-2">{t.relatedInquiries}</h2>
                    <p className="text-sm text-gray-600 mb-4">{t.relatedDesc}</p>

                    <div className="space-y-3">
                        {relatedInquiries.map((related) => (
                            <div
                                key={related.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-[#004a90]">{related.fullName || 'Anonymous'}</div>
                                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                                        {related.email === inquiry.email && (
                                            <span className="flex items-center text-green-600">
                                                <i className="ri-check-line mr-1"></i>
                                                {t.sameEmail}
                                            </span>
                                        )}
                                        {related.phone === inquiry.phone && (
                                            <span className="flex items-center text-green-600">
                                                <i className="ri-check-line mr-1"></i>
                                                {t.samePhone}
                                            </span>
                                        )}
                                        <span className="text-gray-400">
                                            {related.created_at ? new Date(related.created_at).toLocaleDateString() : (related.createdAt?.toDate ? related.createdAt.toDate().toLocaleDateString() : new Date(related.createdAt || Date.now()).toLocaleDateString())}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/portal/admin/inquiries/${related.id}`)}
                                    className="text-[#004a90] hover:text-[#c3d021] text-sm font-medium"
                                >
                                    {t.viewDetails} →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
