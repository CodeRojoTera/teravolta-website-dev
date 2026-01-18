'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/components/AuthProvider';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { AppointmentService } from '@/app/services/appointmentService';
import { TechnicianService } from '@/app/services/technicianService';
import { ReviewService } from '@/app/services/reviewService';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';
import { toJsDate, formatJsDate } from '@/lib/dateUtils';
import InspectionDashboard from '@/components/technician/InspectionDashboard';

export default function TechnicianDashboard() {
    const { language } = useLanguage();
    const { showToast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);

    // Incident Reporting State
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [selectedIncidentApt, setSelectedIncidentApt] = useState<Appointment | null>(null);
    const [incidentReason, setIncidentReason] = useState('');
    const [incidentComment, setIncidentComment] = useState('');
    const [reporting, setReporting] = useState(false);

    // Leave Management State
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [leaveStart, setLeaveStart] = useState('');
    const [leaveEnd, setLeaveEnd] = useState('');
    const [leaveType, setLeaveType] = useState<'vacation' | 'sickness' | 'other'>('other');
    const [leaveReason, setLeaveReason] = useState('');
    const [submittingLeave, setSubmittingLeave] = useState(false);

    const t = {
        welcome: language === 'es' ? 'Bienvenido,' : 'Welcome,',
        noVisits: language === 'es' ? 'No tienes visitas asignadas para hoy.' : 'No visits assigned for today.',
        upcoming: language === 'es' ? 'Próximas Visitas' : 'Upcoming Visits',
        startRoute: language === 'es' ? 'Ir con Waze' : 'Go with Waze',
        startJob: language === 'es' ? 'Iniciar Trabajo' : 'Start Job',
        completeJob: language === 'es' ? 'Terminar Trabajo' : 'Complete Job',
        uploadEvidence: language === 'es' ? 'Subir Evidencia' : 'Upload Evidence',
        client: language === 'es' ? 'Cliente' : 'Client',
        statusMap: {
            scheduled: { label: language === 'es' ? 'Programada' : 'Scheduled', color: 'bg-blue-100 text-blue-800' },
            on_route: { label: language === 'es' ? 'En Camino' : 'On Route', color: 'bg-yellow-100 text-yellow-800' },
            in_progress: { label: language === 'es' ? 'En Progreso' : 'In Progress', color: 'bg-purple-100 text-purple-800' },
            completed: { label: language === 'es' ? 'Completada' : 'Completed', color: 'bg-green-100 text-green-800' },
            cancelled: { label: language === 'es' ? 'Cancelada' : 'Cancelled', color: 'bg-red-100 text-red-800' }
        } as Record<AppointmentStatus, { label: string; color: string }>
    };

    const fetchAppointments = async (uid: string) => {
        try {
            const data = await AppointmentService.getByTechnicianUid(uid);
            setAppointments(data);
        } catch (error) {
            console.error("Error loading appointments:", error);
        }
    };

    const fetchLeaves = async (uid: string) => {
        try {
            // Need tech ID, not UID. Resolve first or assume service handles it?
            // TechnicianService.getLeaves expects technicianId (UUID from technicians table)
            // We need to get the tech profile first.
            const { data: tech } = await supabase.from('technicians').select('id').eq('uid', uid).single();
            if (tech) {
                const leaveData = await TechnicianService.getLeaves(tech.id);
                setLeaves(leaveData);
            }
        } catch (error) {
            console.error("Error loading leaves:", error);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchAppointments(user.id);
                fetchLeaves(user.id);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    const handleStatusUpdate = async (id: string, newStatus: AppointmentStatus) => {
        try {
            setLoading(true);
            await AppointmentService.updateStatus(id, newStatus);

            // Trigger Review Request on Completion
            if (newStatus === 'completed') {
                const apt = appointments.find(a => a.id === id);
                if (apt && apt.clientEmail && apt.projectId) {
                    ReviewService.requestReview(
                        apt.clientEmail,
                        apt.projectId,
                        apt.clientName,
                        apt.clientUserId
                    ).catch(err => console.error('Failed to auto-request review:', err));
                }
            }

            if (user) await fetchAppointments(user.id); // Refresh
        } catch (error) {
            console.error("Error updating status:", error);
            showToast(
                language === 'es' ? 'Error al actualizar estado' : 'Error updating status',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, appointmentId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(appointmentId);
            const fileExt = file.name.split('.').pop();
            const fileName = `${appointmentId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage 'appointments' bucket
            const { error: uploadError } = await supabase.storage
                .from('appointments')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('appointments')
                .getPublicUrl(fileName);

            await AppointmentService.addPhotoEvidence(appointmentId, publicUrl);
            if (user) await fetchAppointments(user.id);
            showToast(
                language === 'es' ? 'Foto subida correctamente' : 'Photo uploaded successfully',
                'success'
            );
        } catch (error) {
            console.error("Error uploading photo:", error);
            showToast(
                language === 'es' ? 'Error al subir foto' : 'Error uploading photo',
                'error'
            );
        } finally {
            setUploading(null);
        }
    };

    const openIncidentModal = (apt: Appointment) => {
        setSelectedIncidentApt(apt);
        setIncidentReason('');
        setIncidentComment('');
        setShowIncidentModal(true);
    };

    const submitIncident = async () => {
        if (!selectedIncidentApt || !incidentReason || !user) return;

        setReporting(true);
        try {
            const result = await AppointmentService.reportIncident(
                selectedIncidentApt.id!,
                incidentReason,
                incidentComment,
                user.id
            );

            if (result.outcome === 'reassigned') {
                const techName = result.newTechnician || 'another technician';
                showToast(
                    language === 'es'
                        ? `Incidente reportado. La visita ha sido reasignada automáticamente a ${techName}.`
                        : `Incident reported. The visit has been automatically reassigned to ${techName}.`,
                    'info',
                    5000
                );
            } else {
                showToast(
                    language === 'es'
                        ? 'Incidente reportado correctamente. El administrador ha sido notificado para reagendar.'
                        : 'Incident reported successfully. Admin has been notified to reschedule.',
                    'success',
                    5000
                );
            }

            setShowIncidentModal(false);
            fetchAppointments(user.id);
        } catch (error) {
            console.error("Error reporting incident:", error);
            showToast(
                language === 'es' ? 'Error al reportar incidente' : 'Error reporting incident',
                'error'
            );
        } finally {
            setReporting(false);
        }
    };

    const submitLeaveRequest = async () => {
        if (!leaveStart || !leaveEnd || !leaveReason || !user) return;

        setSubmittingLeave(true);
        try {
            // Resolve tech ID
            const { data: tech } = await supabase.from('technicians').select('id').eq('uid', user.id).single();
            if (!tech) throw new Error("Technician profile not found");

            await TechnicianService.requestLeave(tech.id, leaveStart, leaveEnd, leaveReason, leaveType);

            showToast(
                language === 'es' ? 'Solicitud enviada correctamente.' : 'Request sent successfully.',
                'success'
            );
            setLeaveStart('');
            setLeaveEnd('');
            setLeaveReason('');
            setLeaveType('other');
            fetchLeaves(user.id); // Refresh list
        } catch (error) {
            console.error("Error requesting leave:", error);
            showToast(
                language === 'es' ? 'Error al solicitar permiso.' : 'Error requesting leave.',
                'error'
            );
        } finally {
            setSubmittingLeave(false);
        }
    };

    if (loading) return <PageLoadingSkeleton title="Dashboard" />;
    if (!user) return <div className="p-8 text-center text-gray-500">{language === 'es' ? 'Inicia sesión.' : 'Please log in.'}</div>;

    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Technician';

    return (
        <div className="space-y-6 pb-20">
            <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#004a90]">
                        {t.welcome} <span className="text-[#c3d021]">{displayName}</span>
                    </h1>
                    <button
                        onClick={() => setShowLeaveModal(true)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-[#004a90] px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <i className="ri-calendar-event-line"></i>
                        {language === 'es' ? 'Mis Permisos' : 'My Leaves'}
                    </button>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                    {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </header>

            {appointments.length > 0 ? (
                <div className="grid gap-6">
                    {appointments.map((apt) => {
                        const statusConfig = t.statusMap[apt.status] || t.statusMap['scheduled'];

                        return (
                            <div key={apt.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-[#194271]">
                                            {formatJsDate(apt.date, language === 'es' ? 'es-PA' : 'en-US', { hour: '2-digit', minute: '2-digit' }) || 'TBD'}
                                        </p>
                                        <p className="text-gray-500 text-sm">{formatJsDate(apt.date, language === 'es' ? 'es-PA' : 'en-US')}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <i className="ri-user-line text-[#004a90]"></i>
                                        <span className="font-medium">{apt.clientName}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <i className="ri-map-pin-line text-[#004a90] mt-1"></i>
                                        <span>{apt.clientAddress}</span>
                                    </div>
                                    {apt.notes && (
                                        <div className="bg-gray-50 p-3 rounded text-gray-500 italic text-xs border border-gray-100">
                                            "{apt.notes}"
                                        </div>
                                    )}
                                    {apt.photos && apt.photos.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                            <i className="ri-image-line"></i>
                                            {apt.photos.length} {language === 'es' ? 'fotos' : 'photos'}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {(apt.status === 'scheduled' || apt.status === 'on_route' || apt.status === 'in_progress') && (
                                        <button
                                            onClick={() => openIncidentModal(apt)}
                                            className="col-span-2 text-red-600 text-xs font-semibold py-1 hover:underline flex items-center justify-center gap-1 mb-1"
                                        >
                                            <i className="ri-alarm-warning-line"></i>
                                            {language === 'es' ? 'Reportar Problema / No puedo asistir' : 'Report Issue / Unable to Attend'}
                                        </button>
                                    )}
                                    <a
                                        href={`https://waze.com/ul?q=${encodeURIComponent(apt.clientAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="col-span-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <i className="ri-road-map-line"></i> {t.startRoute}
                                    </a>

                                    {apt.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleStatusUpdate(apt.id!, 'on_route')}
                                            className="col-span-2 bg-[#004a90] text-white py-3 rounded-lg font-bold hover:bg-[#194271]"
                                        >
                                            En Camino
                                        </button>
                                    )}

                                    {apt.status === 'on_route' && (
                                        <button
                                            onClick={() => handleStatusUpdate(apt.id!, 'in_progress')}
                                            className="col-span-2 bg-[#c3d021] text-[#194271] py-3 rounded-lg font-bold hover:bg-[#b0bd1c]"
                                        >
                                            {t.startJob}
                                        </button>
                                    )}

                                    {apt.status === 'in_progress' && (
                                        <div className="col-span-2 space-y-4">
                                            <InspectionDashboard appointment={apt} />
                                            <button
                                                onClick={() => handleStatusUpdate(apt.id!, 'completed')}
                                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                                            >
                                                {t.completeJob}
                                            </button>
                                        </div>
                                    )}

                                    {apt.status === 'completed' && (
                                        <div className="col-span-2 text-center text-green-600 font-bold py-2 bg-green-50 rounded-lg">
                                            <i className="ri-checkbox-circle-line mr-2"></i>
                                            {language === 'es' ? 'Trabajo Completado' : 'Job Completed'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                    <p className="text-gray-500 font-medium">{t.noVisits}</p>
                </div>
            )}


            {/* Incident Modal */}
            {
                showIncidentModal && selectedIncidentApt && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {language === 'es' ? 'Reportar Incidente' : 'Report Incident'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {language === 'es' ? 'Notificar al administrador que no puedes realizar esta visita.' : 'Notify admin that you cannot complete this visit.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowIncidentModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'es' ? 'Motivo' : 'Reason'}
                                    </label>
                                    <select
                                        value={incidentReason}
                                        onChange={(e) => setIncidentReason(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent outline-none"
                                    >
                                        <option value="">{language === 'es' ? 'Seleccionar motivo...' : 'Select reason...'}</option>
                                        <option value="traffic">{language === 'es' ? 'Tráfico Pesado / Retraso' : 'Heavy Traffic / Delay'}</option>
                                        <option value="vehicle_issue">{language === 'es' ? 'Problema de Vehículo' : 'Vehicle Issue'}</option>
                                        <option value="illness">{language === 'es' ? 'Enfermedad / Personal' : 'Illness / Personal'}</option>
                                        <option value="client_issue">{language === 'es' ? 'Cliente No Está / No Acceso' : 'Client Not Home / No Access'}</option>
                                        <option value="weather">{language === 'es' ? 'Clima / Lluvia' : 'Weather / Rain'}</option>
                                        <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'es' ? 'Comentarios Adicionales' : 'Additional Comments'}
                                    </label>
                                    <textarea
                                        value={incidentComment}
                                        onChange={(e) => setIncidentComment(e.target.value)}
                                        placeholder={language === 'es' ? 'Describe el problema...' : 'Describe the issue...'}
                                        className="w-full p-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-[#004a90] focus:border-transparent outline-none resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowIncidentModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={submitIncident}
                                        disabled={!incidentReason || reporting}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {reporting ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                {language === 'es' ? 'Enviando...' : 'Sending...'}
                                            </>
                                        ) : (
                                            language === 'es' ? 'Enviar Reporte' : 'Submit Report'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Leave Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {language === 'es' ? 'Gestión de Permisos' : 'Leave Management'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {/* Request Form */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                                <h4 className="font-semibold text-sm text-[#004a90]">
                                    {language === 'es' ? 'Solicitar Nuevo Permiso' : 'Request New Leave'}
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">{language === 'es' ? 'Desde' : 'From'}</label>
                                        <input
                                            type="date"
                                            value={leaveStart}
                                            onChange={(e) => setLeaveStart(e.target.value)}
                                            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#004a90] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">{language === 'es' ? 'Hasta' : 'To'}</label>
                                        <input
                                            type="date"
                                            value={leaveEnd}
                                            onChange={(e) => setLeaveEnd(e.target.value)}
                                            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#004a90] outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Leave Type Dropdown */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">{language === 'es' ? 'Tipo de Permiso' : 'Leave Type'}</label>
                                    <select
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value as any)}
                                        className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#004a90] outline-none bg-white"
                                    >
                                        <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
                                        <option value="vacation">{language === 'es' ? 'Vacaciones' : 'Vacation'}</option>
                                        <option value="sickness">{language === 'es' ? 'Enfermedad' : 'Sickness'}</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={leaveReason}
                                    onChange={(e) => setLeaveReason(e.target.value)}
                                    placeholder={language === 'es' ? 'Motivo...' : 'Reason...'}
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-[#004a90]"
                                />
                                <button
                                    onClick={submitLeaveRequest}
                                    disabled={!leaveStart || !leaveEnd || !leaveReason || submittingLeave}
                                    className="w-full bg-[#004a90] text-white py-2 rounded font-medium text-sm hover:bg-[#194271] disabled:opacity-50"
                                >
                                    {submittingLeave ? 'Saving...' : (language === 'es' ? 'Solicitar' : 'Request')}
                                </button>
                            </div>

                            {/* List */}
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                    {language === 'es' ? 'Historial' : 'History'}
                                </h4>
                                {leaves.length > 0 ? (
                                    <div className="space-y-2">
                                        {leaves.map((l) => (
                                            <div key={l.id} className="border border-gray-100 rounded p-3 flex justify-between items-center text-sm">
                                                <div>
                                                    <p className="font-medium text-gray-800">{l.reason}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatJsDate(l.start_date, language === 'es' ? 'es-PA' : 'en-US')} - {formatJsDate(l.end_date, language === 'es' ? 'es-PA' : 'en-US')}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${l.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    l.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {l.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-4">
                                        {language === 'es' ? 'No hay registros.' : 'No records found.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
