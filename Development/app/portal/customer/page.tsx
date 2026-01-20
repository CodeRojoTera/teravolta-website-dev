'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { ActiveProject } from '@/lib/types';
import ProjectUpdates from '@/components/ProjectUpdates';
import { toJsDate, formatJsDate } from '@/lib/dateUtils';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const [projects, setProjects] = useState<ActiveProject[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!user?.id) return;

            try {
                // 1. Fetch Active Projects
                const projectsPromise = ActiveProjectService.getByUserId(user.id);

                // 2. Fetch Pending Quotes
                const quotesPromise = supabase
                    .from('quotes')
                    .select('*')
                    .eq('user_id', user.id)
                    .in('status', ['pending', 'reviewed']); // Show pending and reviewed

                // 3. Fetch Inquiries (match by email since inquiry might not have user_id linked yet)
                const inquiriesPromise = supabase
                    .from('inquiries')
                    .select('*')
                    .eq('email', user.email)
                    .in('status', ['pending', 'contacted']);

                const [projectsData, quotesResult, inquiriesResult] = await Promise.all([
                    projectsPromise,
                    quotesPromise,
                    inquiriesPromise
                ]);

                if (isMounted) {
                    setProjects(projectsData || []);

                    // Merge and format pending requests
                    const quotes = (quotesResult.data || []).map((q: any) => ({
                        type: 'quote',
                        id: q.id,
                        title: language === 'es' ? 'Solicitud de Cotización' : 'Quote Request',
                        service: q.service_type,
                        date: q.created_at,
                        status: q.status,
                        details: q.location_details || q.message
                    }));

                    const inquiries = (inquiriesResult.data || []).map((i: any) => ({
                        type: 'inquiry',
                        id: i.id,
                        title: language === 'es' ? 'Consulta General' : 'General Inquiry',
                        service: i.service,
                        date: i.created_at,
                        status: i.status,
                        details: i.message
                    }));

                    setPendingRequests([...quotes, ...inquiries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                }
            } catch (error: any) {
                if (isMounted) console.error('Error fetching dashboard data:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [user, language]);

    const content = {
        en: {
            title: 'My Projects',
            subtitle: 'Track your active projects and progress',
            pendingRequests: 'Pending Requests',
            pendingDesc: 'Quotes and inquiries waiting for review',
            noProjects: 'No active projects',
            noProjectsDesc: 'You don\'t have any active projects yet',
            project: 'Project',
            service: 'Service',
            status: 'Status',
            progress: 'Progress',
            startDate: 'Started',
            viewDetails: 'View Details',
            submitted: 'Submitted',
            // ... existing statuses ...
            statusActive: 'Active',
            statusPaused: 'Paused',
            statusPendingClient: 'Pending Your Input',
            statusInReview: 'In Review',
            statusCompleted: 'Completed',
            consulting: 'Consulting',
            efficiency: 'Energy Efficiency',
            advocacy: 'Energy Advocacy',
            documents: 'Documents',
            noDocuments: 'No documents yet',
            actionRequired: 'Action Required',
            completeScheduling: 'Schedule Visit',
            uploadRequiredDocs: 'Upload Bills',
            pendingScheduling: 'Pending Scheduling',
            pendingDocuments: 'Pending Documents',
            pendingOnboarding: 'Pending Onboarding'
        },
        es: {
            title: 'Mis Proyectos',
            subtitle: 'Rastrea tus proyectos activos y progreso',
            pendingRequests: 'Solicitudes Pendientes',
            pendingDesc: 'Cotizaciones y consultas esperando revisión',
            noProjects: 'Sin proyectos activos',
            noProjectsDesc: 'Aún no tienes proyectos activos',
            project: 'Proyecto',
            service: 'Servicio',
            status: 'Estado',
            progress: 'Progreso',
            startDate: 'Iniciado',
            viewDetails: 'Ver Detalles',
            submitted: 'Enviado',
            // ... existing statuses ...
            statusActive: 'Activo',
            statusPaused: 'Pausado',
            statusPendingClient: 'Esperando Tu Respuesta',
            statusInReview: 'En Revisión',
            statusCompleted: 'Completado',
            consulting: 'Consultoría',
            efficiency: 'Eficiencia Energética',
            advocacy: 'Abogacía Energética',
            documents: 'Documentos',
            noDocuments: 'Sin documentos todavía',
            actionRequired: 'Acción Requerida',
            completeScheduling: 'Agendar Visita',
            uploadRequiredDocs: 'Subir Facturas',
            pendingScheduling: 'Pendiente de Agenda',
            pendingDocuments: 'Pendiente de Documentos',
            pendingOnboarding: 'Pendiente de Onboarding'
        }
    };

    const t = content[language];

    const getStatusBadge = (status: string): React.ReactNode => {
        const badges: { [key: string]: React.ReactNode } = {
            active: <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">{t.statusActive}</span>,
            paused: <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.statusPaused}</span>,
            pending_client: <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusPendingClient}</span>,
            in_review: <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">{t.statusInReview}</span>,
            completed: <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">{t.statusCompleted}</span>,
            pending_scheduling: <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium flex items-center gap-1"><i className="ri-calendar-event-line"></i> {t.pendingScheduling}</span>,
            pending_documents: <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium flex items-center gap-1"><i className="ri-file-warning-line"></i> {t.pendingDocuments}</span>,
            pending_onboarding: <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium animate-pulse">{t.pendingOnboarding}</span>,
            // New statuses
            pending: <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">{language === 'es' ? 'Recibido' : 'Received'}</span>,
            contacted: <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">{language === 'es' ? 'Contactado' : 'Contacted'}</span>,
            reviewed: <span className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-600 font-medium">{language === 'es' ? 'Revisado' : 'Reviewed'}</span>
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

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => router.push('/portal/customer/request-service')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#c3d021] hover:bg-[#b0bc1e] rounded-lg text-[#194271] font-medium transition-colors"
                    >
                        <i className="ri-add-line"></i>
                        <span>{language === 'en' ? 'Request Service' : 'Solicitar Servicio'}</span>
                    </button>
                    <button
                        onClick={() => router.push('/portal/customer/settings')}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-[#004a90] transition-colors"
                    >
                        <i className="ri-settings-4-line"></i>
                    </button>
                </div>
            </div>

            {/* Pending Requests Section (New) */}
            {pendingRequests.length > 0 && (
                <div className="animate-fade-in">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="ri-time-line text-orange-500"></i>
                        {t.pendingRequests}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingRequests.map((req) => (
                            <div key={`${req.type}-${req.id}`} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative group">
                                <div className="absolute top-4 right-4">
                                    {getStatusBadge(req.status)}
                                </div>
                                <div className="mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${req.type === 'quote' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                        }`}>
                                        {req.type === 'quote' ? (language === 'es' ? 'Cotización' : 'Quote') : (language === 'es' ? 'Consulta' : 'Inquiry')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#004a90] mb-1">{req.service ? getServiceName(req.service) : req.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{req.details}</p>
                                <div className="text-xs text-gray-400 font-medium">
                                    {t.submitted}: {formatJsDate(req.date, language === 'es' ? 'es-PA' : 'en-US')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Required Banner */}
            {projects.some(p => p.status === 'pending_scheduling' || p.status === 'pending_documents') && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 animate-fade-in shadow-sm">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <i className="ri-error-warning-line text-orange-600 text-xl"></i>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-orange-900">{t.actionRequired}</h3>
                        <p className="text-orange-700 text-sm">
                            {language === 'en'
                                ? 'Some of your projects require your attention to proceed.'
                                : 'Algunos de tus proyectos requieren tu atención para continuar.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            <div>
                {projects.length > 0 && <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.title}</h2>}
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => router.push(`/portal/customer/projects/${project.id}`)}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer animate-fade-in hover-lift"
                            >
                                <div className="space-y-4">
                                    {/* Project Name & Service */}
                                    <div>
                                        <h3 className="text-lg font-bold text-[#004a90]">{project.projectName}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{getServiceName(project.service)}</p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {getStatusBadge(project.status)}
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">{t.progress}</span>
                                            <span className="font-semibold text-[#004a90]">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-[#c3d021] h-3 rounded-full transition-all"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Start Date */}
                                    <div className="text-sm text-gray-500">
                                        {t.startDate}: {formatJsDate(project.startDate, language === 'es' ? 'es-PA' : 'en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>

                                    {/* Project Updates / Notifications */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <ProjectUpdates
                                            projectId={project.id!}
                                            timeline={project.timeline}
                                        />
                                    </div>

                                    {/* View Details / Action Button */}
                                    <div className="flex gap-2 mt-4">
                                        {project.status === 'pending_scheduling' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/portal/customer/projects/${project.id}?action=schedule`);
                                                }}
                                                className="flex-1 px-4 py-2 bg-[#c3d021] hover:bg-[#b0bc1e] text-[#194271] rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="ri-calendar-event-line"></i>
                                                {t.completeScheduling}
                                            </button>
                                        ) : project.status === 'pending_documents' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/portal/customer/projects/${project.id}?action=upload`);
                                                }}
                                                className="flex-1 px-4 py-2 bg-[#c3d021] hover:bg-[#b0bc1e] text-[#194271] rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="ri-file-upload-line"></i>
                                                {t.uploadRequiredDocs}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/portal/customer/projects/${project.id}`);
                                                }}
                                                className="flex-1 px-4 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                                            >
                                                {t.viewDetails}
                                                <i className="ri-arrow-right-line ml-2"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    pendingRequests.length === 0 && (
                        <EmptyState
                            icon="ri-folder-add-line"
                            title={t.noProjects}
                            description={t.noProjectsDesc}
                            action={
                                <button
                                    onClick={() => router.push('/portal/customer/request-service')}
                                    className="px-6 py-2 bg-[#c3d021] hover:bg-[#b0bc1e] text-[#194271] rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <i className="ri-add-line"></i>
                                    {language === 'en' ? 'Request New Service' : 'Solicitar Nuevo Servicio'}
                                </button>
                            }
                        />
                    )
                )}
            </div>
        </div>
    );
}
