'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

interface Inquiry {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    message: string;
    status?: 'pending' | 'in_process' | 'completed' | 'closed';
    created_at: string;
    internal_notes?: string;
    // Mapped properties
    fullName?: string;
    internalNotes?: string;
    createdAt?: Date; // Mapped from string
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    propertyType?: string;
    timeline?: string;
    budget?: string;
    attachments?: Array<{
        name: string;
        downloadURL?: string;
        url?: string;
        storagePath?: string;
        contentType?: string;
        size?: number;
    }>;
}

export default function ClientInquiriesPage() {
    const { clientId } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [clientInfo, setClientInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [internalNotes, setInternalNotes] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);
    const [sendingOnboarding, setSendingOnboarding] = useState(false);
    const [converting, setConverting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchClientInquiries = async () => {
            try {
                // Fetch all inquiries sorted by date
                const { data, error } = await supabase
                    .from('inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map Supabase data to local interface
                const allInquiries: Inquiry[] = (data || []).map(item => ({
                    ...item,
                    fullName: item.full_name,
                    internalNotes: item.internal_notes,
                    createdAt: new Date(item.created_at),
                    // Map snake_case database fields to camelCase interface if needed
                    // (Assuming DB columns exist as per supabase reference: address, city, state, zip_code, property_type, timeline, budget)
                    zipCode: item.zip_code,
                    propertyType: item.property_type
                }));

                // Filter by client (matching email/phone logic)
                const clientInquiries = allInquiries.filter(inq => {
                    const inqClientId = `${inq.email}_${inq.phone}`.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                    return inqClientId === clientId;
                });

                if (clientInquiries.length > 0) {
                    setClientInfo({
                        name: clientInquiries[0].fullName,
                        email: clientInquiries[0].email,
                        phone: clientInquiries[0].phone,
                        company: clientInquiries[0].company
                    });
                    setInquiries(clientInquiries);
                    // Select most recent or previously selected? Default to most recent (index 0)
                    if (clientInquiries.length > 0) {
                        setSelectedInquiry(clientInquiries[0]);
                    }
                } else {
                    router.push('/portal/admin/inquiries');
                }
            } catch (error) {
                console.error('Error fetching client inquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchClientInquiries();
        }
    }, [clientId, router]);

    // Sync internal notes when selected inquiry changes
    useEffect(() => {
        if (selectedInquiry) {
            setInternalNotes(selectedInquiry.internalNotes || '');
        }
    }, [selectedInquiry]);

    const handleStatusChange = async (inquiryId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ status: newStatus })
                .eq('id', inquiryId);

            if (error) throw error;

            // Update local state
            setInquiries(prev => prev.map(inq =>
                inq.id === inquiryId ? { ...inq, status: newStatus as any } : inq
            ));

            if (selectedInquiry?.id === inquiryId) {
                setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
            }

            showToast(language === 'es' ? 'Estado actualizado' : 'Status updated', 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showToast(language === 'es' ? 'Error actualizando estado' : 'Error updating status', 'error');
        }
    };

    const content = {
        en: {
            backToList: 'Back to Inquiries',
            clientInquiries: 'Client Inquiries',
            totalInquiries: 'Total Inquiries',
            contactInfo: 'Contact Information',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Company',
            inquiryDetails: 'Inquiry Details',
            service: 'Service',
            message: 'Message',
            date: 'Date',
            status: 'Status',
            changeStatus: 'Change Status',
            statusPending: 'Pending',
            statusContacted: 'Contacted',
            statusCompleted: 'Completed',
            inquiryHistory: 'Inquiry History',
            internalNotes: 'Internal Notes',
            internalNotesPlaceholder: 'Add notes about this inquiry (only visible to admins)...',
            saveNotes: 'Save Notes',
            notesSaved: 'Notes saved!',
            completeAndOnboard: 'Complete & Send Onboarding',
            sendingOnboarding: 'Sending onboarding email...',
            onboardingSent: 'Onboarding email sent!',
            onboardingError: 'Error sending onboarding email',
            attachments: 'Attachments',
            noAttachments: 'No attachments',
            viewFile: 'View'
        },
        es: {
            backToList: 'Volver a Consultas',
            clientInquiries: 'Consultas del Cliente',
            totalInquiries: 'Total de Consultas',
            contactInfo: 'Información de Contacto',
            name: 'Nombre',
            email: 'Correo',
            phone: 'Teléfono',
            company: 'Empresa',
            inquiryDetails: 'Detalles de la Consulta',
            service: 'Servicio',
            message: 'Mensaje',
            date: 'Fecha',
            status: 'Estado',
            changeStatus: 'Cambiar Estado',
            statusPending: 'Pendiente',
            statusContacted: 'Contactado',
            statusCompleted: 'Completado',
            inquiryHistory: 'Historial de Consultas',
            internalNotes: 'Notas Internas',
            internalNotesPlaceholder: 'Agregar notas sobre esta consulta (solo visibles para admins)...',
            saveNotes: 'Guardar Notas',
            notesSaved: '¡Notas guardadas!',
            completeAndOnboard: 'Completar y Enviar Onboarding',
            sendingOnboarding: 'Enviando email de onboarding...',
            onboardingSent: '¡Email de onboarding enviado!',
            onboardingError: 'Error al enviar email de onboarding',
            attachments: 'Archivos Adjuntos',
            noAttachments: 'Sin archivos adjuntos',
            viewFile: 'Ver'
        }
    };

    const t = content[language];

    const handleCompleteAndOnboard = async () => {
        if (!selectedInquiry) return;
        setSendingOnboarding(true);
        try {
            // Logic handled by API now if we used handleConvertToProject?
            // But this is specifically "Magic Link + Onboarding Email" only.
            // Keeping existing logic as is.

            // 1. Create magic link
            const linkResponse = await fetch('/api/create-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedInquiry.email,
                    fullName: selectedInquiry.fullName,
                    phone: selectedInquiry.phone,
                    company: selectedInquiry.company || '',
                    inquiryId: selectedInquiry.id,
                    service: selectedInquiry.service
                })
            });

            if (!linkResponse.ok) throw new Error('Failed to create magic link');
            const { magicLink } = await linkResponse.json();

            // 2. Send onboarding email
            const emailResponse = await fetch('/api/send-onboarding-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedInquiry.email,
                    fullName: selectedInquiry.fullName,
                    magicLink,
                    service: selectedInquiry.service,
                    language
                })
            });

            if (!emailResponse.ok) throw new Error('Failed to send email');

            // 3. Update inquiry status to completed
            await handleStatusChange(selectedInquiry.id, 'completed');

            // Show success toast
            showToast(t.onboardingSent, 'success');
        } catch (error) {
            console.error('Error sending onboarding:', error);
            showToast(t.onboardingError, 'error');
        } finally {
            setSendingOnboarding(false);
        }
    };

    const handleConvertToProject = async () => {
        if (!selectedInquiry) return;
        setConverting(true);
        try {
            const response = await fetch('/api/create-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // User Mapping (API will find/create user by email)
                    clientEmail: selectedInquiry.email,
                    clientName: selectedInquiry.fullName,
                    clientPhone: selectedInquiry.phone,
                    clientCompany: selectedInquiry.company || '',

                    // Project Details
                    service: selectedInquiry.service,
                    description: selectedInquiry.message,
                    address: selectedInquiry.address,
                    city: selectedInquiry.city,
                    state: selectedInquiry.state, // Caution: mapped?
                    zipCode: selectedInquiry.zipCode,
                    propertyType: selectedInquiry.propertyType,
                    timeline: selectedInquiry.timeline,
                    budget: selectedInquiry.budget,

                    status: 'active'
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to convert');
            }

            const { id: projectId } = await response.json();

            // Update status
            await handleStatusChange(selectedInquiry.id, 'completed');

            showToast('Project created successfully!', 'success');

            // Redirect to project
            router.push(`/portal/admin/active-projects/${projectId}`);

        } catch (error: any) {
            console.error('Error converting to project:', error);
            showToast(error.message || 'Error converting to project', 'error');
        } finally {
            setConverting(false);
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">{t.statusCompleted}</span>;
            case 'contacted':
                return <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusContacted}</span>;
            default:
                return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPending}</span>;
        }
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.clientInquiries} />;
    }

    if (!clientInfo) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/portal/admin/inquiries')}
                    className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                >
                    <i className="ri-arrow-left-line mr-1"></i>
                    {t.backToList}
                </button>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.clientInquiries}</h1>
                <p className="text-gray-600 mt-1">{inquiries.length} {t.totalInquiries}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Client Info + Inquiry List */}
                <div className="space-y-6">
                    {/* Client Info Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.contactInfo}</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.name}</label>
                                <p className="text-base font-medium text-gray-900">{clientInfo.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.email}</label>
                                <p className="text-base text-gray-900">{clientInfo.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">{t.phone}</label>
                                <p className="text-base text-gray-900">{clientInfo.phone}</p>
                            </div>
                            {clientInfo.company && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.company}</label>
                                    <p className="text-base text-gray-900">{clientInfo.company}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inquiry List */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.inquiryHistory}</h2>
                        <div className="space-y-2">
                            {inquiries.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedInquiry?.id === inquiry.id
                                        ? 'bg-[#004a90] text-white'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">
                                            {inquiry.createdAt?.toLocaleDateString(language === 'es' ? 'es-PA' : 'en-US')}
                                        </span>
                                        {inquiry.status === 'pending' && selectedInquiry?.id !== inquiry.id && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        )}
                                    </div>
                                    <div className="text-xs opacity-80">
                                        {inquiry.createdAt?.toLocaleTimeString(language === 'es' ? 'es-PA' : 'en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="text-xs mt-1">
                                        {inquiry.service}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Selected Inquiry Details */}
                <div className="lg:col-span-2">
                    {selectedInquiry && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#004a90]">{t.inquiryDetails}</h2>
                                {getStatusBadge(selectedInquiry.status)}
                            </div>

                            <div className="space-y-6">
                                {/* Service */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">{t.service}</label>
                                    <p className="mt-1">
                                        <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#c3d021]/20 text-[#194271] font-medium">
                                            {selectedInquiry.service}
                                        </span>
                                    </p>
                                </div>

                                {/* Date and Time */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">{t.date}</label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {selectedInquiry.createdAt?.toLocaleString(language === 'es' ? 'es-PA' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">{t.message}</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">{t.attachments}</label>
                                    {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 ? (
                                        <div className="mt-2 space-y-2">
                                            {selectedInquiry.attachments.map((file: any, index: number) => {
                                                const getFileIcon = (contentType?: string, name?: string) => {
                                                    if (contentType?.includes('pdf') || name?.endsWith('.pdf')) return 'ri-file-pdf-line text-red-500';
                                                    if (contentType?.includes('image') || name?.match(/\.(jpg|jpeg|png|gif)$/i)) return 'ri-image-line text-green-500';
                                                    return 'ri-file-line text-[#004a90]';
                                                };

                                                return (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <i className={`${getFileIcon(file.contentType, file.name)} text-2xl`}></i>
                                                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
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
                                        <div className="mt-2 text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                                            <i className="ri-attachment-line text-2xl mb-1 block"></i>
                                            <p className="text-sm">{t.noAttachments}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Status Management */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-2">{t.changeStatus}</label>
                                    <select
                                        value={selectedInquiry.status || 'pending'}
                                        onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                                    >
                                        <option value="pending">{t.statusPending}</option>
                                        <option value="contacted">{t.statusContacted}</option>
                                        <option value="completed">{t.statusCompleted}</option>
                                    </select>
                                </div>

                                {/* Internal Notes */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-2">{t.internalNotes}</label>
                                    <textarea
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder={t.internalNotesPlaceholder}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent resize-none"
                                        rows={4}
                                    />
                                    <button
                                        onClick={async () => {
                                            setSavingNotes(true);
                                            try {
                                                const { error } = await supabase
                                                    .from('inquiries')
                                                    .update({ internal_notes: internalNotes })
                                                    .eq('id', selectedInquiry.id);

                                                if (error) throw error;

                                                // Update local state
                                                setSelectedInquiry(prev => prev ? { ...prev, internalNotes } : null);
                                                setInquiries(prev => prev.map(inq =>
                                                    inq.id === selectedInquiry.id ? { ...inq, internalNotes } : inq
                                                ));

                                                showToast(t.notesSaved, 'success');
                                            } catch (error) {
                                                console.error('Error saving notes:', error);
                                                showToast(language === 'es' ? 'Error guardando notas' : 'Error saving notes', 'error');
                                            } finally {
                                                setSavingNotes(false);
                                            }
                                        }}
                                        disabled={savingNotes}
                                        className="mt-2 px-4 py-2 bg-[#004a90] text-white rounded-lg hover:bg-[#194271] disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {savingNotes && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                        <i className="ri-save-line"></i>
                                        {t.saveNotes}
                                    </button>
                                </div>

                                {/* Complete & Send Onboarding Button */}
                                {selectedInquiry.status !== 'completed' && (
                                    <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            onClick={handleConvertToProject}
                                            disabled={converting || sendingOnboarding}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#004a90] text-white rounded-lg font-bold hover:bg-[#194271] disabled:opacity-50 transition-colors"
                                        >
                                            {converting ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <i className="ri-folder-add-line text-xl"></i>
                                                    {language === 'es' ? 'Convertir a Proyecto' : 'Convert to Project'}
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={handleCompleteAndOnboard}
                                            disabled={sendingOnboarding || converting}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#c3d021] text-[#194271] rounded-lg font-bold hover:bg-[#b0bc1e] disabled:opacity-50 transition-colors"
                                        >
                                            {sendingOnboarding ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-[#194271] border-t-transparent rounded-full animate-spin"></div>
                                                    {t.sendingOnboarding}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-user-add-line text-xl"></i>
                                                    {t.completeAndOnboard}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
