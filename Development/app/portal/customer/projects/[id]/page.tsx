'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { TechnicianService } from '@/app/services/technicianService';
import { ActiveProject, ProjectStatus } from '@/lib/types';
import DocumentList from '@/components/DocumentList';
import { ReviewModal } from '@/components/ReviewModal';
import { ReviewService } from '@/app/services/reviewService';
import { useSearchParams } from 'next/navigation';

export default function CustomerProjectDetail() {
    const { id } = useParams();
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { language } = useLanguage();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastDocUpdate, setLastDocUpdate] = useState<number>(0);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const [hasReviewed, setHasReviewed] = useState(false);

    // Review State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Scheduling State
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const [schedulingDate, setSchedulingDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            if (!user || !id) return;

            try {
                const projectData = await ActiveProjectService.getById(id as string);

                if (!projectData) {
                    router.push('/portal/customer');
                    return;
                }

                // Security: Check if this project belongs to the current user
                if (projectData.clientId !== user.id && projectData.userId !== user.id) {
                    if (projectData.clientEmail !== user.email) {
                        console.warn('Unauthorized access attempt to project', id);
                        router.push('/portal/customer');
                        return;
                    }
                }

                setProject(projectData);

                // Check if already reviewed (if project has assigned technician)
                if (projectData.assignedTo && Array.isArray(projectData.assignedTo) && projectData.assignedTo.length > 0) {
                    // For simplicity, we check if ANY review exists for this project by this user
                    // In a real scenario, we might want to check specifically against the technician and project combo
                    // Assuming one main technician per project for rating purposes:
                    const technicianId = projectData.assignedTo[0];
                    // We need a way to check if I reviewed this project. 
                    // We can add a method to ReviewService or just query simply.
                    // Let's assume ReviewService has a check or we try to fetch reviews for this project.
                    // Ideally ActiveProjectService or ReviewService handles this check.
                    // For now, I'll update ReviewService or simuate a check.
                    // Let's optimistically assume false unless we persist it in local state or fetch it.
                    // TODO: Implement `ReviewService.hasUserReviewedProject(projectId)`
                }

            } catch (error) {
                console.error('Error fetching project:', error);
                router.push('/portal/customer');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, user, router]);

    // Fetch available slots when date changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (!schedulingDate) return;
            setLoadingSlots(true);
            try {
                const slots = await TechnicianService.getAvailableTimeSlots(schedulingDate);
                setAvailableSlots(slots);
            } catch (error) {
                console.error('Error fetching slots:', error);
                showToast('Error loading availability', 'error');
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [schedulingDate]);

    const handleSchedulingSubmit = async () => {
        if (!project || !schedulingDate || !selectedSlot) return;
        setIsScheduling(true);
        try {
            // Start efficient projects as active after scheduling (scheduling is now the last step)
            // Or pending_assignment if manual assignment is needed?
            // "Active" implies ready for work.
            const nextStatus: ProjectStatus = 'active';

            await ActiveProjectService.update(project.id!, {
                scheduledDate: schedulingDate,
                scheduledTime: selectedSlot,
                status: nextStatus,
                progress: 100 // Project is fully set up
            });

            // Add timeline entry
            await ActiveProjectService.addTimelineEntry(project.id!, {
                title: language === 'es' ? 'Visita Programada' : 'Visit Scheduled',
                description: language === 'es'
                    ? `Visita programada para el ${schedulingDate} a las ${selectedSlot}`
                    : `Visit scheduled for ${schedulingDate} at ${selectedSlot}`,
                timestamp: new Date().toISOString()
            });

            setProject({ ...project, scheduledDate: schedulingDate, scheduledTime: selectedSlot, status: nextStatus });
            showToast(
                language === 'es' ? '¡Visita programada exitosamente!' : 'Visit scheduled successfully!',
                'success'
            );

            // If Efficiency, remain on page to upload docs
            if (nextStatus === 'active') {
                router.push('/portal/customer');
            }
        } catch (error) {
            console.error('Error scheduling:', error);
            showToast('Failed to schedule visit', 'error');
        } finally {
            setIsScheduling(false);
        }
    };

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!project || !project.assignedTo || project.assignedTo.length === 0) return;
        setIsSubmittingReview(true);
        try {
            await ReviewService.submitReview({
                technicianId: project.assignedTo[0], // Review the first assigned tech
                projectId: project.id!,
                rating,
                comment
            });
            setHasReviewed(true);
            // await fetchProject(); // This line was not in the original code, but was in the instruction.
            showToast(
                language === 'es' ? '¡Gracias por tu calificación!' : 'Thank you for your review!',
                'success'
            );
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Failed to submit review', 'error');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const content = {
        en: {
            backToProjects: 'Back to My Projects',
            projectDetails: 'Project Details',
            service: 'Service',
            status: 'Status',
            progress: 'Progress',
            started: 'Started',
            estimatedCompletion: 'Estimated Completion',
            projectValue: 'Project Value',
            timeline: 'Project Timeline',
            noUpdates: 'No updates yet',
            documents: 'Documents',
            statusActive: 'Active',
            statusPaused: 'Paused',
            statusPendingClient: 'Pending Your Input',
            statusInReview: 'In Review',
            statusCompleted: 'Completed',
            statusPendingScheduling: 'Pending Scheduling',
            statusPendingDocuments: 'Pending Documents',
            statusPendingPayment: 'Pending Payment',
            consulting: 'Consulting',
            efficiency: 'Energy Efficiency',
            advocacy: 'Energy Advocacy',
            projectInfo: 'Project Information',
            description: 'Description',
            challenge: 'Challenge',
            solution: 'Solution',
            result: 'Result',
            // Invoice
            invoiceSection: 'Invoice',
            viewInvoice: 'View Invoice',
            downloadInvoice: 'Download Invoice',
            noInvoice: 'Invoice not available yet',
            paymentPending: 'Payment Pending',
            paymentPaid: 'Paid',
            leaveReview: 'Rate Technician',
            reviewSubmitted: 'Review Submitted',
            actionRequired: 'Action Required',
            schedulingTitle: 'Schedule Your Site Visit',
            schedulingDesc: 'Select a preferred date and time for our technician to visit your location.',
            selectDate: 'Select Date',
            selectTime: 'Select Time',
            confirmSchedule: 'Confirm Schedule',
            noSlots: 'No available slots for this date. Please try another.',
            billUploadTitle: 'Upload Your Electricity Bills',
            billUploadDesc: 'To activate your Energy Efficiency project, please upload your last 3 electricity bills.',
            activateProject: 'Activate Project',
            scheduledVisit: 'Scheduled Site Visit',
            installationAddress: 'Installation Address',
            noDocuments: 'No documents uploaded yet',
            propertyType: 'Property Type',
            budget: 'Budget',
            deviceOption: 'Device Option',
            connectivity: 'Connectivity',
            projectDescription: 'Project Description',
            pendingPaymentTitle: 'Initial Payment Required',
            pendingPaymentDesc: 'Please complete the initial payment to proceed.',
            payNow: 'Pay Now (Simulated)',
            contactUs: 'Contact Us',
            phases: 'Project Phases',
            phaseName: 'Phase',
            phaseAmount: 'Amount',
            phaseStatus: 'Status'
        },
        es: {
            backToProjects: 'Volver a Mis Proyectos',
            projectDetails: 'Detalles del Proyecto',
            service: 'Servicio',
            status: 'Estado',
            progress: 'Progreso',
            started: 'Iniciado',
            estimatedCompletion: 'Finalización Estimada',
            projectValue: 'Valor del Proyecto',
            timeline: 'Línea de Tiempo del Proyecto',
            noUpdates: 'Sin actualizaciones aún',
            documents: 'Documentos',
            statusActive: 'Activo',
            statusPaused: 'Pausado',
            statusPendingClient: 'Esperando Tu Respuesta',
            statusInReview: 'En Revisión',
            statusCompleted: 'Completado',
            statusPendingScheduling: 'Pendiente de Agenda',
            statusPendingDocuments: 'Pendiente de Documentos',
            statusPendingPayment: 'Pendiente de Pago',
            consulting: 'Consultoría',
            efficiency: 'Eficiencia Energética',
            advocacy: 'Abogacía Energética',
            projectInfo: 'Información del Proyecto',
            description: 'Descripción',
            challenge: 'Desafío',
            solution: 'Solución',
            result: 'Resultado',
            // Invoice
            invoiceSection: 'Factura',
            viewInvoice: 'Ver Factura',
            downloadInvoice: 'Descargar Factura',
            noInvoice: 'Factura no disponible aún',
            paymentPending: 'Pago Pendiente',
            paymentPaid: 'Pagado',
            leaveReview: 'Calificar Técnico',
            reviewSubmitted: 'Calificación Enviada',
            actionRequired: 'Acción Requerida',
            schedulingTitle: 'Programa tu Visita Técnica',
            schedulingDesc: 'Selecciona una fecha y hora preferida para que nuestro técnico visite tu ubicación.',
            selectDate: 'Seleccionar Fecha',
            selectTime: 'Seleccionar Hora',
            confirmSchedule: 'Confirmar Cita',
            noSlots: 'No hay horarios disponibles para esta fecha. Intenta con otra.',
            billUploadTitle: 'Sube tus Facturas de Luz',
            billUploadDesc: 'Para activar tu proyecto de Eficiencia Energética, por favor sube tus últimas 3 facturas de electricidad.',
            activateProject: 'Activar Proyecto',
            scheduledVisit: 'Visita Técnica Programada',
            installationAddress: 'Dirección de Instalación',
            noDocuments: 'No se han subido documentos aún',
            propertyType: 'Tipo de Propiedad',
            budget: 'Presupuesto',
            deviceOption: 'Opción de Dispositivo',
            connectivity: 'Conectividad',
            projectDescription: 'Descripción del Proyecto',
            pendingPaymentTitle: 'Depósito Inicial Requerido',
            pendingPaymentDesc: 'Para iniciar tu proyecto de Eficiencia Energética, se requiere un depósito inicial (simulado).',
            payNow: 'Pagar Ahora (Simulado)',
            contactUs: 'Contáctanos',
            phases: 'Fases del Proyecto',
            phaseName: 'Fase',
            phaseAmount: 'Monto',
            phaseStatus: 'Estado'
        }
    };

    const t = content[language as 'en' | 'es'];

    const getStatusBadge = (status: string | undefined): React.ReactNode => {
        if (!status) return null;
        const badges: { [key: string]: React.ReactNode } = {
            active: <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">{t.statusActive}</span>,
            paused: <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPaused}</span>,
            pending_client: <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusPendingClient}</span>,
            in_review: <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">{t.statusInReview}</span>,
            completed: <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">{t.statusCompleted}</span>,
            pending_scheduling: <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800 font-medium">{t.statusPendingScheduling}</span>,
            pending_documents: <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 font-medium">{t.statusPendingDocuments}</span>,
            pending_payment: <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">{t.statusPendingPayment || 'Pending Payment'}</span>
        };
        return badges[status] || badges.active;
    };

    const getServiceName = (service: string) => {
        const services: { [key: string]: string } = {
            consulting: t.consulting,
            efficiency: t.efficiency,
            advocacy: t.advocacy
        };
        return services[service] || service;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-PA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.projectDetails} />;
    }

    if (!project) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleReviewSubmit}
                isSubmitting={isSubmittingReview}
            />

            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/portal/customer')}
                    className="group text-[#004a90] hover:text-[#c3d021] mb-6 flex items-center text-sm font-bold transition-colors"
                >
                    <i className="ri-arrow-left-s-line mr-1 text-lg group-hover:-translate-x-1 transition-transform"></i>
                    {t.backToProjects}
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#004a90] tracking-tight">{project.projectName}</h1>
                        <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#c3d021] rounded-full"></span>
                            {getServiceName(project.service)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(project.status)}
                        {project.status === 'completed' && project.assignedTo && project.assignedTo.length > 0 && (
                            hasReviewed ? (
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold border border-green-200 rounded-lg flex items-center gap-1">
                                    <i className="ri-star-smile-line"></i>
                                    {t.reviewSubmitted}
                                </span>
                            ) : (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="px-4 py-2 bg-[#c3d021] text-[#194271] text-sm font-bold rounded-lg shadow-sm hover:bg-[#b0bc1e] transition-colors flex items-center gap-2"
                                >
                                    <i className="ri-star-line"></i>
                                    {t.leaveReview}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="space-y-6">

                {/* Pending Payment Section (Efficiency) */}
                {project.status === 'pending_payment' && (
                    <div id="payment-section" className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 shadow-md animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i className="ri-secure-payment-line text-purple-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-purple-900">{t.pendingPaymentTitle || 'Initial Payment Required'}</h2>
                                <p className="text-purple-700 font-medium">{t.pendingPaymentDesc || 'Please complete the initial payment to proceed.'}</p>
                            </div>
                        </div>

                        <div className="flex justify-center py-8">
                            <button
                                onClick={async () => {
                                    // Simulate Payment
                                    const nextStatus = 'pending_documents';
                                    await ActiveProjectService.update(project.id!, {
                                        status: nextStatus,
                                        paymentStatus: 'paid',
                                        progress: 25
                                    });
                                    setProject({ ...project, status: nextStatus, paymentStatus: 'paid', progress: 25 });
                                    showToast(language === 'es' ? 'Pago recibido' : 'Payment received', 'success');
                                }}
                                className="px-8 py-4 bg-[#004a90] hover:bg-[#194271] text-white text-lg font-black rounded-xl shadow-lg transition-all flex items-center gap-3"
                            >
                                <i className="ri-bank-card-line"></i>
                                {t.payNow || 'Pay Now (Simulated)'}
                            </button>
                        </div>
                    </div>
                )}

                {project.status === 'pending_scheduling' && (
                    <div id="scheduling-section" className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 shadow-md animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i className="ri-calendar-event-line text-orange-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-orange-900">{t.schedulingTitle}</h2>
                                <p className="text-orange-700 font-medium">{t.schedulingDesc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-orange-900 mb-2 uppercase tracking-tight">{t.selectDate}</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-white border-2 border-orange-100 rounded-xl outline-none focus:border-[#004a90] transition-colors font-bold text-lg text-gray-900 cursor-pointer"
                                    value={schedulingDate}
                                    onChange={(e) => setSchedulingDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-orange-900 mb-2 uppercase tracking-tight">{t.selectTime}</label>
                                {!schedulingDate ? (
                                    <div className="h-[52px] flex items-center justify-center bg-white/50 border-2 border-dashed border-orange-200 rounded-xl text-orange-400 text-sm italic">
                                        {language === 'es' ? 'Selecciona una fecha primero' : 'Select a date first'}
                                    </div>
                                ) : loadingSlots ? (
                                    <div className="h-[52px] flex items-center justify-center bg-white border-2 border-orange-100 rounded-xl">
                                        <i className="ri-loader-4-line animate-spin text-orange-600 text-xl"></i>
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-3 rounded-xl text-sm font-bold transition-all ${selectedSlot === slot
                                                    ? 'bg-[#004a90] text-white shadow-lg scale-105'
                                                    : 'bg-white text-gray-700 border-2 border-orange-100 hover:border-orange-300'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                                        {t.noSlots}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={!schedulingDate || !selectedSlot || isScheduling}
                                onClick={handleSchedulingSubmit}
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                            >
                                {isScheduling ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-check-double-line"></i>}
                                {t.confirmSchedule}
                            </button>
                        </div>
                    </div>
                )}

                {project.status === 'pending_documents' && (
                    <div id="upload-section" className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 shadow-md animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i className="ri-file-warning-line text-blue-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-blue-900">{t.billUploadTitle}</h2>
                                <p className="text-blue-700 font-medium">{t.billUploadDesc}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border-2 border-blue-100 mb-6">
                            {/* Instructions / Checklist */}
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <i className="ri-checkbox-circle-fill text-green-500"></i>
                                    {language === 'es' ? 'Últimas 3 facturas de electricidad' : 'Last 3 electricity bills'}
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <i className="ri-checkbox-circle-fill text-green-500"></i>
                                    {language === 'es' ? 'Formato PDF o Imagen nítida' : 'PDF format or clear image'}
                                </li>
                            </ul>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => document.getElementById('customer-upload-bill')?.click()}
                                    className="px-8 py-4 bg-[#004a90] hover:bg-[#194271] text-white text-lg font-black rounded-xl shadow-lg transition-all flex items-center gap-3"
                                >
                                    <i className="ri-upload-cloud-2-line"></i>
                                    {language === 'es' ? 'Seleccionar Archivos' : 'Select Files'}
                                </button>
                            </div>
                        </div>

                        {/* Show Activate button if documents are uploaded */}
                        {/* In a real scenario, we'd check if specific 'bill' documents exist */}
                        <div className="flex justify-end">
                            <button
                                onClick={async () => {
                                    await ActiveProjectService.update(project.id!, {
                                        status: 'pending_scheduling',
                                        progress: 50
                                    });
                                    setProject({ ...project, status: 'pending_scheduling', progress: 50 });
                                    showToast(
                                        language === 'es' ? 'Documentos enviados. ¡Agenda tu visita!' : 'Documents sent. Schedule your visit!',
                                        'success'
                                    );
                                    // Removed router.push to let user schedule immediately
                                }}
                                className="px-6 py-3 bg-[#c3d021] hover:bg-[#b0bc1e] text-[#194271] font-black rounded-xl shadow-sm transition-all"
                            >
                                {language === 'es' ? 'Continuar a Agenda' : 'Proceed to Scheduling'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.projectDetails}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            {t.progress}
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-[#c3d021] to-[#a3b011] h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${project.progress || 0}%` }}
                                ></div>
                            </div>
                            <span className="text-2xl font-black text-[#004a90] tabular-nums">{project.progress || 0}%</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                            {t.started}
                        </label>
                        <p className="text-base text-gray-900 font-semibold">{formatDate(project.createdAt)}</p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                            {t.estimatedCompletion}
                        </label>
                        <p className="text-base text-gray-900 font-semibold">-</p>
                    </div>

                    {/* Service Specific Details */}
                    {project.propertyType && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.propertyType}
                            </label>
                            <p className="text-base text-gray-900 font-semibold">{project.propertyType}</p>
                        </div>
                    )}

                    {project.deviceOption && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.deviceOption}
                            </label>
                            <p className="text-base text-gray-900 font-semibold">{project.deviceOption}</p>
                        </div>
                    )}

                    {project.connectivity && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.connectivity}
                            </label>
                            <p className="text-base text-gray-900 font-semibold">{project.connectivity}</p>
                        </div>
                    )}

                    {project.clientTimeline && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.timeline}
                            </label>
                            <p className="text-base text-gray-900 font-semibold">{project.clientTimeline}</p>
                        </div>
                    )}

                    {project.budget && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.budget}
                            </label>
                            <p className="text-base text-gray-900 font-semibold">{project.budget}</p>
                        </div>
                    )}

                    {project.projectDescription && (
                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
                                {t.projectDescription}
                            </label>
                            <p className="text-sm text-gray-700 italic border-l-4 border-gray-200 pl-3 py-1 bg-gray-50 rounded-r">{project.projectDescription}</p>
                        </div>
                    )}

                    {project.scheduledDate && (
                        <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
                            <label className="text-xs font-bold text-blue-800 uppercase block mb-2 flex items-center gap-2">
                                <i className="ri-calendar-event-line"></i>
                                {t.scheduledVisit}
                            </label>
                            <p className="text-lg font-bold text-[#004a90]">
                                {project.scheduledDate} {project.scheduledTime ? `@ ${project.scheduledTime}` : ''}
                            </p>
                            {project.address && (
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">{t.installationAddress}:</span> {typeof project.address === 'string' ? project.address : JSON.stringify(project.address)}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-lg font-bold text-[#004a90] flex items-center gap-2">
                        <i className="ri-file-list-3-line"></i>
                        {t.documents}
                    </h2>

                    {/* Customer Upload Button */}
                    <div className={`flex flex-col gap-3 transition-all duration-300 ${selectedFiles.length > 0 ? 'w-full sm:ml-8' : 'items-end'}`}>
                        <div className="relative w-full flex justify-end">
                            <input
                                type="file"
                                multiple
                                id="customer-upload-bill"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const newFiles = Array.from(e.target.files);
                                        setSelectedFiles(prev => [...prev, ...newFiles]);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            {selectedFiles.length === 0 ? (
                                <label
                                    htmlFor="customer-upload-bill"
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#004a90] text-white rounded-lg text-sm font-medium hover:bg-[#194271] transition-colors shadow-sm"
                                >
                                    <i className="ri-upload-cloud-line"></i>
                                    {language === 'es' ? 'Subir Factura de Luz' : 'Upload Electric Bill'}
                                </label>
                            ) : (
                                <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs text-gray-500 font-medium">
                                            {selectedFiles.length} {language === 'es' ? 'archivos seleccionados' : 'files selected'}
                                        </div>
                                        <label
                                            htmlFor="customer-upload-bill"
                                            className="cursor-pointer text-xs font-bold text-[#004a90] hover:text-[#003870] flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                        >
                                            <i className="ri-add-circle-line"></i>
                                            {language === 'es' ? 'Añadir más' : 'Add more'}
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full mb-4 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-2 truncate">
                                                    <i className="ri-file-line text-blue-500"></i>
                                                    <span className="truncate">{file.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                                                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => setSelectedFiles([])}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                                            disabled={isUploading}
                                        >
                                            {language === 'es' ? 'Cancelar' : 'Cancel'}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setIsUploading(true);
                                                let uploadedCount = 0;
                                                for (const file of selectedFiles) {
                                                    try {
                                                        await ActiveProjectService.uploadDocument(file, 'active_projects', project.id!, 'bill');
                                                        uploadedCount++;
                                                    } catch (err) { console.error('Upload failed', err); }
                                                }
                                                if (uploadedCount > 0) {
                                                    setLastDocUpdate(Date.now());
                                                    setSelectedFiles([]);
                                                }
                                                setIsUploading(false);
                                            }}
                                            disabled={isUploading}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#c3d021] text-[#194271] rounded-lg text-sm font-bold hover:bg-[#b0bc1e] transition-colors shadow-sm disabled:opacity-50"
                                        >
                                            {isUploading ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-check-line"></i>}
                                            {language === 'es' ? 'Confirmar Subida' : 'Confirm Upload'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DocumentList
                    entityType="active_projects"
                    entityId={project.id!}
                    title=""
                    emptyMessage={language === 'es' ? 'No hay documentos aún' : 'No documents yet'}
                    showCategory={true}
                    lastUpdate={lastDocUpdate}
                />
            </div>

            {/* Phases Section (Consulting/Advocacy) */}
            {(project.phases && project.phases.length > 0) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[#004a90] mb-4 flex items-center gap-2">
                        <i className="ri-stack-line"></i>
                        {t.phases}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">{t.phaseName}</th>
                                    <th className="px-4 py-3">{t.phaseAmount}</th>
                                    <th className="px-4 py-3">{t.phaseStatus}</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.phases.map((phase: any, index: number) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{phase.name}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-700">${phase.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${phase.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {phase.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {phase.status !== 'paid' && (
                                                <button
                                                    onClick={() => showToast(language === 'es' ? 'Iniciando pago...' : 'Starting payment...', 'info')}
                                                    className="text-[#004a90] hover:text-[#c3d021] font-bold text-xs underline"
                                                >
                                                    {t.payNow}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoice Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#004a90] mb-4 flex items-center gap-2">
                    <i className="ri-file-text-line"></i>
                    {t.invoiceSection}
                </h2>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {project.paymentStatus === 'paid' ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                                <i className="ri-check-line"></i>
                                {t.paymentPaid}
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
                                <i className="ri-time-line"></i>
                                {t.paymentPending}
                            </span>
                        )}
                    </div>

                    <span className="text-sm text-gray-500 italic">
                        {t.noInvoice}
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-extrabold text-[#004a90] flex items-center gap-3">
                        <i className="ri-history-line text-[#c3d021]"></i>
                        {t.timeline}
                    </h2>
                </div>

                <div className="p-8">
                    {(!project.timeline || project.timeline.length === 0) ? (
                        <EmptyState
                            title={t.noUpdates}
                            description={language === 'es' ? 'Pronto verás actualizaciones aquí' : 'You will see updates here soon'}
                            icon="ri-history-line"
                        />
                    ) : (
                        <div className="relative pl-8 border-l-2 border-gray-100 space-y-8">
                            {project.timeline.map((update: any, index: number) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#c3d021] border-4 border-white shadow-sm"></div>
                                    <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-[#194271]">{update.title || 'Update'}</span>
                                            <span className="text-xs text-gray-500">
                                                {update.timestamp ? new Date(update.timestamp).toLocaleString() : new Date().toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{update.description || update.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Persistent Contact Us Button */}
            <a
                href="/contact"
                className="fixed bottom-6 right-6 px-6 py-3 bg-[#004a90] text-white rounded-full shadow-xl hover:bg-[#194271] transition-all z-50 flex items-center gap-2 font-bold hover:scale-105 border-4 border-white"
            >
                <i className="ri-customer-service-2-line text-xl"></i>
                {t.contactUs}
            </a>
        </div>
    );
}
