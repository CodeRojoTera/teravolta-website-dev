'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { AppointmentService } from '@/app/services/appointmentService';
import { TechnicianService } from '@/app/services/technicianService';
import { ActiveProject, ProjectStatus, ProjectPhase } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import DocumentManager from '@/components/DocumentManager';
import InspectionViewer from '@/components/admin/InspectionViewer';

interface ProjectUI extends ActiveProject {
    timeline?: any[];
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [project, setProject] = useState<ProjectUI | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [progressValue, setProgressValue] = useState(0);

    const [assignedTechnician, setAssignedTechnician] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'inspection'>('overview');

    const [manualSchedule, setManualSchedule] = useState({ date: '', time: '' });
    const [isResending, setIsResending] = useState(false);

    const [reassignModal, setReassignModal] = useState<{
        isOpen: boolean;
        step: 'confirm' | 'searching' | 'result_found' | 'result_none';
        candidate?: { id: string; name: string; email: string };
    }>({
        isOpen: false,
        step: 'confirm'
    });

    const projectId = Array.isArray(id) ? id[0] : id;

    const t = {
        en: {
            back: 'Back to Projects',
            details: 'Project Details',
            clientInfo: 'Client Information',
            progress: 'Progress',
            timeline: 'Timeline',
            updateProgress: 'Update Progress',
            addNote: 'Add Note',
            submit: 'Submit',
            scheduling: 'Schedule Visit',
            resendOnboarding: 'Resend Onboarding',
            activateManually: 'Activate Manually',
            statusActive: 'Active',
            statusPaused: 'Paused',
            statusPending: 'Pending',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            service: 'Service',
            budget: 'Budget',
            projectDescription: 'Description',
            propertyType: 'Property Type',
            propertySize: 'Property Size',
            clientTimeline: 'Client Timeline',
            amount: 'Amount',
            phases: 'Payment Phases',
            viewed: 'Viewed',
            statusPendingReview: 'Pending Review',
            statusInReview: 'In Review',
            statusApproved: 'Approved',
            statusFailed: 'Failed',
            statusCompleted: 'Completed',
            statusCancelled: 'Cancelled',
            technician: 'Assigned Technician',
            noTechnician: 'No technician assigned',
            reassign: 'Reassign',
        },
        es: {
            back: 'Volver a Proyectos',
            details: 'Detalles del Proyecto',
            clientInfo: 'Información del Cliente',
            progress: 'Progreso',
            timeline: 'Línea de Tiempo',
            updateProgress: 'Actualizar Progreso',
            addNote: 'Agregar Nota',
            submit: 'Enviar',
            scheduling: 'Agendar Visita',
            resendOnboarding: 'Re-enviar Onboarding',
            activateManually: 'Activar Manualmente',
            statusActive: 'Activo',
            statusPaused: 'Pausado',
            statusPending: 'Pendiente',
            name: 'Nombre',
            email: 'Correo',
            phone: 'Teléfono',
            address: 'Dirección',
            service: 'Servicio',
            budget: 'Presupuesto',
            projectDescription: 'Descripción',
            propertyType: 'Tipo de Propiedad',
            propertySize: 'Tamaño',
            clientTimeline: 'Tiempo Estimado',
            amount: 'Monto',
            phases: 'Fases de Pago',
            viewed: 'Visto',
            statusPendingReview: 'Pendiente',
            statusInReview: 'En Revisión',
            statusApproved: 'Aprobado',
            statusFailed: 'Fallido',
            statusCompleted: 'Completado',
            statusCancelled: 'Cancelado',
            technician: 'Técnico Asignado',
            noTechnician: 'Sin técnico asignado',
            reassign: 'Reasignar',
        }
    }[language as 'en' | 'es'] || {
        en: {
            back: 'Back to Projects',
            details: 'Project Details'
        }
    }['en'];

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const data = await ActiveProjectService.getById(projectId);
                if (data) {
                    setProject(data);
                    setProgressValue(data.progress || 0);

                    if (data.assignedTo && data.assignedTo.length > 0) {
                        const { data: tech } = await supabase
                            .from('users')
                            .select('id, full_name, email')
                            .eq('id', data.assignedTo[0])
                            .single();
                        if (tech) setAssignedTechnician(tech);
                    }
                }
            } catch (err) {
                console.error(err);
                showToast('Error loading project', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, showToast]);

    const handleStatusChange = async (newStatus: ProjectStatus) => {
        if (!project || updating) return;
        setUpdating(true);
        try {
            await ActiveProjectService.update(project.id!, { status: newStatus });
            const note = {
                id: crypto.randomUUID(),
                adminName: user?.email || 'Admin',
                description: `Status changed to ${newStatus}`,
                timestamp: new Date().toISOString()
            };
            await ActiveProjectService.addTimelineEntry(project.id!, note);
            setProject({ ...project, status: newStatus, timeline: [note, ...(project.timeline || [])] });
            showToast('Status updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error updating status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleProgressUpdate = async () => {
        if (!project || updating) return;
        setUpdating(true);
        try {
            await ActiveProjectService.update(project.id!, { progress: progressValue });
            const note = {
                id: crypto.randomUUID(),
                adminName: user?.email || 'Admin',
                description: `Progress updated to ${progressValue}%`,
                timestamp: new Date().toISOString()
            };
            await ActiveProjectService.addTimelineEntry(project.id!, note);
            setProject({ ...project, progress: progressValue, timeline: [note, ...(project.timeline || [])] });
            showToast('Progress updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error updating progress', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!project || !newNote.trim() || updating) return;
        setUpdating(true);
        try {
            const note = {
                id: crypto.randomUUID(),
                adminName: user?.email || 'Admin',
                description: newNote,
                timestamp: new Date().toISOString()
            };
            await ActiveProjectService.addTimelineEntry(project.id!, note);
            setProject({ ...project, timeline: [note, ...(project.timeline || [])] });
            setNewNote('');
            showToast('Note added', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error adding note', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleResendOnboarding = async () => {
        if (!project || isResending) return;
        setIsResending(true);
        try {
            const response = await fetch('/api/resend-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: project.clientEmail,
                    fullName: project.clientName,
                    service: project.service,
                    language
                })
            });
            if (response.ok) {
                showToast('Email resent', 'success');
            } else {
                throw new Error('Failed to resend');
            }
        } catch (err) {
            console.error(err);
            showToast('Error resending email', 'error');
        } finally {
            setIsResending(false);
        }
    };

    const performReassignSearch = async () => {
        if (!project || !project.scheduledDate || !project.scheduledTime) return;
        setReassignModal({ ...reassignModal, step: 'searching' });
        try {
            const techs = await TechnicianService.findAvailableTechnicians(
                project.scheduledDate,
                project.scheduledTime,
                project.assignedTo?.[0]
            );
            if (techs && techs.length > 0) {
                setReassignModal({
                    isOpen: true,
                    step: 'result_found',
                    candidate: { id: techs[0].id, name: techs[0].full_name, email: techs[0].email }
                });
            } else {
                setReassignModal({ ...reassignModal, step: 'result_none' });
            }
        } catch (err) {
            console.error(err);
            showToast('Error searching techs', 'error');
            setReassignModal({ ...reassignModal, isOpen: false });
        }
    };

    const confirmReassignment = async () => {
        if (!reassignModal.candidate || !project) return;
        setUpdating(true);
        try {
            const tech = reassignModal.candidate;
            if (project.appointmentId) {
                await AppointmentService.reassign(project.appointmentId, tech.id, project.id!);
            } else {
                const date = new Date(`${project.scheduledDate}T${project.scheduledTime || '09:00'}`);
                await AppointmentService.create({
                    projectId: project.id!,
                    technicianId: tech.id,
                    technicianName: tech.name,
                    date: date as any,
                    status: 'scheduled',
                    clientName: project.clientName,
                    clientAddress: project.address || '',
                    clientPhone: project.clientPhone || '',
                    notes: 'Manual reassignment',
                    createdBy: 'admin'
                });
            }
            await ActiveProjectService.update(project.id!, {
                assignedTo: [tech.id],
                status: 'pending_installation'
            });
            showToast('Technician assigned', 'success');
            window.location.reload();
        } catch (err) {
            console.error(err);
            showToast('Error assigning technician', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const updatePhases = async (updatedPhases: ProjectPhase[]) => {
        if (!project) return;
        setUpdating(true);
        try {
            await ActiveProjectService.update(project.id!, { phases: updatedPhases });

            // Calculate total paid/pending for note
            const total = updatedPhases.reduce((sum, p) => sum + p.amount, 0);
            const paid = updatedPhases.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

            const note = {
                id: crypto.randomUUID(),
                adminName: user?.email || 'Admin',
                description: `Updated payment phases. Total: $${total}, Paid: $${paid}`,
                timestamp: new Date().toISOString()
            };
            await ActiveProjectService.addTimelineEntry(project.id!, note);

            setProject({ ...project, phases: updatedPhases, timeline: [note, ...(project.timeline || [])] });
            showToast('Phases updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error updating phases', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <PageLoadingSkeleton title={t.details} />;
    if (!project) return null;

    const getStatusBadge = (status: ProjectStatus) => {
        const badges = {
            active: <span className="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">{t.statusActive}</span>,
            pending_onboarding: <span className="px-4 py-2 text-sm rounded-full bg-orange-100 text-orange-800 font-medium">Pending Onboarding</span>,
            pending_scheduling: <span className="px-4 py-2 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">Pending Scheduling</span>,
            scheduled: <span className="px-4 py-2 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">Scheduled</span>,
            in_progress: <span className="px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">In Progress</span>,
            completed: <span className="px-4 py-2 text-sm rounded-full bg-green-100 text-green-800 font-medium">{t.statusCompleted}</span>,
            cancelled: <span className="px-4 py-2 text-sm rounded-full bg-red-100 text-red-800 font-medium">{t.statusCancelled}</span>,
            pending_planning: <span className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">Pending Planning</span>,
            pending_installation: <span className="px-4 py-2 text-sm rounded-full bg-indigo-100 text-indigo-800 font-medium">Pending Installation</span>,
            paused: <span className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">{t.statusPaused}</span>,
        };
        // @ts-ignore
        return badges[status] || <span className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">{status}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <button
                        onClick={() => router.push('/portal/admin/active-projects')}
                        className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm transition-colors"
                    >
                        <i className="ri-arrow-left-line mr-1"></i> {t.back}
                    </button>
                    <h1 className="text-3xl font-bold text-[#004a90]">{project.projectName}</h1>
                </div>
                <div className="flex gap-2 items-center">
                    {(project.status === 'pending_onboarding' || project.status === 'pending_scheduling') && (
                        <button onClick={handleResendOnboarding} disabled={isResending} className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-bold text-sm transition-colors">
                            {t.resendOnboarding}
                        </button>
                    )}

                    {/* Status Dropdown */}
                    <div className="relative">
                        <select
                            value={project.status}
                            onChange={(e) => {
                                if (confirm('Are you sure you want to change the project status?')) {
                                    handleStatusChange(e.target.value as ProjectStatus);
                                }
                            }}
                            className={`appearance-none pl-4 pr-8 py-2 text-sm rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004a90] cursor-pointer
                                ${project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            project.status === 'paused' ? 'bg-gray-100 text-gray-800' :
                                                'bg-gray-100 text-gray-800'}`}
                        >
                            <option value="active">{t.statusActive}</option>
                            <option value="paused">{t.statusPaused}</option>
                            <option value="completed">{t.statusCompleted}</option>
                            <option value="cancelled">{t.statusCancelled}</option>
                            <option value="pending_onboarding" disabled>Pending Onboarding</option>
                            <option value="pending_scheduling" disabled>Pending Scheduling</option>
                            <option value="pending_installation" disabled>Pending Installation</option>
                            <option value="in_review" disabled>In Review</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <i className="ri-arrow-down-s-line"></i>
                        </div>
                    </div>
                </div>
            </div>

            {(project.status === 'pending_onboarding' || project.status === 'pending_scheduling') && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-orange-800">Pending Setup</h3>
                        <p className="text-sm text-orange-700">Manually activate or edit details below.</p>
                    </div>
                    <button onClick={() => handleStatusChange('active')} className="bg-[#004a90] text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-[#003870] transition-colors">
                        {t.activateManually}
                    </button>
                </div>
            )}


            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-[#004a90] text-[#004a90]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                </button>
                {project.service === 'efficiency' && (
                    <button
                        onClick={() => setActiveTab('inspection')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'inspection' ? 'border-b-2 border-[#004a90] text-[#004a90]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Inspection Results
                    </button>
                )}
            </div>

            {activeTab === 'inspection' && project.appointmentId ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[#004a90] mb-4">Technical Inspection Data</h2>
                    <InspectionViewer appointmentId={project.appointmentId} />

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2">Pricing & Proposal</h3>
                        <p className="text-sm text-gray-600 mb-4">Review the boards above and update the Project Amount or Payment Phases accordingly.</p>
                        <button onClick={() => setActiveTab('overview')} className="px-4 py-2 bg-[#004a90] text-white rounded hover:bg-[#003870]">
                            Go to Overview to Update Pricing
                        </button>
                    </div>
                </div>
            ) : activeTab === 'inspection' ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-500 italic">
                    No inspection appointment linked to this project yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Client Info & Documents */}
                    <div className="space-y-6">
                        {/* Client Info Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4 border-b pb-2">{t.clientInfo}</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.name}</label>
                                    <p className="text-base font-medium text-gray-900">{project.clientName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.email}</label>
                                    <p className="text-base text-gray-900">{project.clientEmail}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.phone}</label>
                                    <p className="text-base text-gray-900">{project.clientPhone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.address}</label>
                                    <p className="text-base text-gray-900">{project.address || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.service}</label>
                                    <p className="mt-1">
                                        <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#c3d021]/20 text-[#194271] font-medium capitalize">
                                            {project.service}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <DocumentManager
                                entityType="active_projects"
                                entityId={project.id!}
                                title="Documents"
                                allowedCategories={
                                    project.service === 'efficiency'
                                        ? ['bill', 'meter_reading', 'contract', 'site_plan', 'report', 'other']
                                        : ['deliverable', 'payment_proof', 'contract', 'report', 'other']
                                }
                            />
                        </div>
                    </div>

                    {/* Center Column: Project Details & Tech Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4 border-b pb-2">{t.details}</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">{t.projectDescription}</label>
                                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                                        {project.projectDescription || project.description || 'No description available.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">{t.amount}</label>
                                        <p className="text-base font-bold text-[#004a90]">{project.amount ? `$${project.amount.toLocaleString()}` : '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">{t.budget}</label>
                                        <p className="text-base text-gray-900">{project.budget || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">{t.propertyType}</label>
                                        <p className="text-base text-gray-900 capitalize">{project.propertyType || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">{t.propertySize}</label>
                                        <p className="text-base text-gray-900">{project.propertySize || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase">{t.clientTimeline}</label>
                                        <p className="text-base text-gray-900">{project.clientTimeline || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Technician */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-lg font-bold text-[#004a90]">{t.technician}</h2>
                                {(project.status === 'scheduled' || project.status === 'pending_installation') && (
                                    <button onClick={performReassignSearch} className="text-xs text-blue-600 hover:underline">{t.reassign}</button>
                                )}
                            </div>
                            {assignedTechnician ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {assignedTechnician.full_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{assignedTechnician.full_name}</p>
                                        <p className="text-sm text-gray-500">{assignedTechnician.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">{t.noTechnician}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Progress, Phases, Timeline */}
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4 border-b pb-2">{t.progress}</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Completed</span>
                                    <span>{progressValue}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#c3d021] h-2.5 rounded-full" style={{ width: `${progressValue}%` }}></div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progressValue}
                                    onChange={(e) => setProgressValue(Number(e.target.value))}
                                    className="w-full accent-[#004a90]"
                                />
                                <button onClick={handleProgressUpdate} disabled={updating} className="w-full bg-[#004a90] text-white py-2 rounded-lg font-bold hover:bg-[#003870] transition-colors">
                                    {updating ? '...' : t.updateProgress}
                                </button>
                            </div>
                        </div>

                        {/* Payment Phases Section for Consulting/Advocacy */}
                        {(project.service === 'consulting' || project.service === 'advocacy') && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="font-bold text-[#004a90]">{t.phases}</h2>
                                    <button
                                        onClick={() => {
                                            const newPhase: ProjectPhase = {
                                                id: crypto.randomUUID(),
                                                name: 'New Phase',
                                                amount: 0,
                                                status: 'pending'
                                            };
                                            updatePhases([...(project.phases || []), newPhase]);
                                        }}
                                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors font-bold"
                                    >
                                        + Add Phase
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(!project.phases || project.phases.length === 0) ? (
                                        <p className="text-gray-400 italic text-sm">No phases defined.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {(project.phases || []).map((phase: ProjectPhase, idx: number) => (
                                                <div key={phase.id} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="flex justify-between items-center w-full gap-2">
                                                        <input
                                                            type="text"
                                                            value={phase.name}
                                                            onChange={(e) => {
                                                                const newPhases = [...(project.phases || [])];
                                                                newPhases[idx].name = e.target.value;
                                                                setProject({ ...project, phases: newPhases });
                                                            }}
                                                            onBlur={() => updatePhases(project.phases!)}
                                                            className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-medium text-gray-800 text-sm"
                                                            placeholder="Phase Name"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this phase?')) {
                                                                    const newPhases = (project.phases || []).filter((p: ProjectPhase) => p.id !== phase.id);
                                                                    updatePhases(newPhases);
                                                                }
                                                            }}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-500 mr-1 text-sm">$</span>
                                                            <input
                                                                type="number"
                                                                value={phase.amount}
                                                                onChange={(e) => {
                                                                    const newPhases = [...(project.phases || [])];
                                                                    newPhases[idx].amount = Number(e.target.value);
                                                                    setProject({ ...project, phases: newPhases });
                                                                }}
                                                                onBlur={() => updatePhases(project.phases!)}
                                                                className="w-20 bg-transparent border-none focus:ring-0 p-0 font-bold text-gray-700 text-sm"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newPhases = [...(project.phases || [])];
                                                                newPhases[idx].status = phase.status === 'paid' ? 'pending' : 'paid';
                                                                updatePhases(newPhases);
                                                            }}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${phase.status === 'paid'
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                }`}
                                                        >
                                                            {phase.status}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                                                <span className="text-sm font-medium text-gray-500">Total</span>
                                                <span className="text-sm font-bold text-gray-900">${(project.phases || []).reduce((sum: number, p: ProjectPhase) => sum + p.amount, 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes & Timeline */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-[#004a90] mb-4 border-b pb-2">{t.addNote}</h2>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="flex-1 border p-2 rounded-lg text-sm focus:ring-2 focus:ring-[#004a90] focus:outline-none"
                                        rows={2}
                                        placeholder={t.addNote + '...'}
                                    />
                                    <button onClick={handleAddNote} disabled={updating} className="bg-[#004a90] text-white px-4 rounded-lg font-bold text-sm hover:bg-[#003870] transition-colors">
                                        <i className="ri-send-plane-fill"></i>
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {project.timeline?.map((item: any, idx: number) => (
                                        <div key={idx} className="border-l-2 border-blue-100 pl-4 py-1 relative">
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-400"></div>
                                            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                                                <span>{item.adminName}</span>
                                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-700">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {reassignModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
                        <h3 className="font-bold text-xl mb-4 text-[#004a90]">Reassign Visit</h3>
                        {reassignModal.step === 'confirm' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Are you sure you want to search for a new technician for this slot?</p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button onClick={performReassignSearch} className="bg-[#004a90] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#003870]">Search Available Techs</button>
                                </div>
                            </div>
                        )}
                        {reassignModal.step === 'searching' && <div className="text-center py-8 text-gray-500"><i className="ri-loader-4-line animate-spin text-2xl mb-2 block"></i>Searching...</div>}
                        {reassignModal.step === 'result_found' && (
                            <div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                                    <p className="text-sm text-green-800 font-medium mb-1">Generic Match Found:</p>
                                    <p className="text-lg font-bold text-green-900">{reassignModal.candidate?.name}</p>
                                    <p className="text-xs text-green-700">{reassignModal.candidate?.email}</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button onClick={confirmReassignment} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-sm">Confirm Reassignment</button>
                                </div>
                            </div>
                        )}
                        {reassignModal.step === 'result_none' && (
                            <div className="text-center">
                                <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4 text-red-700">
                                    No available technicians found for this time slot.
                                </div>
                                <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="text-gray-600 underline text-sm">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Add simple style for custom scrollbar if needed or rely on global CSS
// .custom-scrollbar definitions usually in global.css
