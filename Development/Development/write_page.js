const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('app/portal/admin/active-projects/[id]/page.tsx');
const content = `'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { AppointmentService } from '@/app/services/appointmentService';
import { TechnicianService } from '@/app/services/technicianService';
import { ActiveProject, ProjectStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import DocumentList from '@/components/DocumentList';

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
            statusPending: 'Pending'
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
            statusPending: 'Pendiente'
        }
    }[language as 'en' | 'es'] || {
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
            statusPending: 'Pending'
        }
    }.en;

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
                description: \`Status changed to \${newStatus}\`,
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
                description: \`Progress updated to \${progressValue}%\`,
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
                const date = new Date(\`\${project.scheduledDate}T\${project.scheduledTime || '09:00'}\`);
                await AppointmentService.create({
                    projectId: project.id!,
                    technicianId: tech.id,
                    technicianName: tech.name,
                    date: date,
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

    if (loading) return <PageLoadingSkeleton title={t.details} />;
    if (!project) return null;

    return (
        <div className="space-y-6">
            <button onClick={() => router.push('/portal/admin/active-projects')} className="text-[#004a90] flex items-center gap-1 text-sm">
                <i className="ri-arrow-left-line"></i> {t.back}
            </button>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#004a90]">{project.projectName}</h1>
                <div className="flex gap-2">
                    {(project.status === 'pending_onboarding' || project.status === 'pending_scheduling') && (
                        <button onClick={handleResendOnboarding} disabled={isResending} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold text-sm">
                            {t.resendOnboarding}
                        </button>
                    )}
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">{project.status}</span>
                </div>
            </div>

            {(project.status === 'pending_onboarding' || project.status === 'pending_scheduling') && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-orange-800">Pending Setup</h3>
                        <p className="text-sm text-orange-700">Manually activate or edit details below.</p>
                    </div>
                    <button onClick={() => handleStatusChange('active')} className="bg-[#004a90] text-white px-4 py-2 rounded-lg font-bold">
                        {t.activateManually}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-[#004a90] border-b pb-2 mb-4">{t.clientInfo}</h2>
                        <div className="space-y-3 text-sm">
                            <p><strong>Name:</strong> {project.clientName}</p>
                            <p><strong>Email:</strong> {project.clientEmail}</p>
                            <p><strong>Phone:</strong> {project.clientPhone || '-'}</p>
                            <p><strong>Address:</strong> {project.address || '-'}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-[#004a90] border-b pb-2 mb-4">{t.progress}</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Progress</span>
                                <span>{progressValue}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={progressValue} onChange={(e) => setProgressValue(Number(e.target.value))} className="w-full" />
                            <button onClick={handleProgressUpdate} disabled={updating} className="w-full bg-[#004a90] text-white py-2 rounded-lg font-bold">
                                {updating ? '...' : t.updateProgress}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-[#004a90] border-b pb-2 mb-4">Documents</h2>
                        <DocumentList entityType="active_projects" entityId={project.id!} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-[#004a90] mb-4">{t.addNote}</h2>
                        <div className="flex gap-2">
                            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className="flex-1 border p-2 rounded-lg" rows={3} />
                            <button onClick={handleAddNote} disabled={updating} className="bg-[#004a90] text-white px-6 rounded-lg font-bold">
                                {t.submit}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-[#004a90] mb-4">{t.timeline}</h2>
                        <div className="space-y-4">
                            {project.timeline?.map((item, idx) => (
                                <div key={idx} className="border-l-2 border-blue-100 pl-4 py-2">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{item.adminName}</span>
                                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {reassignModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="font-bold text-xl mb-4">Reassign Visit</h3>
                        {reassignModal.step === 'confirm' && (
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="px-4 py-2 text-gray-500">Cancel</button>
                                <button onClick={performReassignSearch} className="bg-[#004a90] text-white px-4 py-2 rounded-lg">Search</button>
                            </div>
                        )}
                        {reassignModal.step === 'searching' && <div className="text-center">Searching...</div>}
                        {reassignModal.step === 'result_found' && (
                            <div>
                                <p className="mb-4">Found: <strong>{reassignModal.candidate?.name}</strong></p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setReassignModal({ ...reassignModal, isOpen: false })} className="px-4 py-2 text-gray-500">Cancel</button>
                                    <button onClick={confirmReassignment} className="bg-green-600 text-white px-4 py-2 rounded-lg">Confirm</button>
                                </div>
                            </div>
                        )}
                        {reassignModal.step === 'result_none' && <div>No techs available.</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
\`;

try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('Successfully wrote file to:', targetPath);
} catch (err) {
    console.error('Error writing file:', err);
    process.exit(1);
}
