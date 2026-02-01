'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { Technician } from '@/lib/types';
import { TechnicianService } from '@/app/services/technicianService';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { TechnicianModal } from '@/components/admin/TechnicianModal';

// Days of the week for display
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TechnicianManagementPage({ params }: PageProps) {
    const { id } = use(params);
    const { language } = useLanguage();
    const router = useRouter();
    const { showToast } = useToast();
    const [technician, setTechnician] = useState<Technician | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Absence State
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [absenceData, setAbsenceData] = useState({
        type: 'suspension' as const,
        startDate: '',
        endDate: '',
        reason: ''
    });

    const initData = async () => {
        try {
            setLoading(true);
            // 1. Get Technician Details
            const techData = await TechnicianService.getById(id);
            if (!techData) throw new Error('Technician not found');
            setTechnician(techData);
        } catch (error) {
            console.error(error);
            showToast('Error loading technician', 'error');
            router.push('/portal/admin/users/technicians');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initData();
    }, [id]);

    const handleSaveProfile = async (data: Partial<Technician>) => {
        try {
            await TechnicianService.update(technician!.id!, data);
            showToast('Profile updated successfully', 'success');
            setTechnician({ ...technician, ...data } as Technician);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error(error);
            showToast('Failed to update profile', 'error');
        }
    };

    const handleRegisterAbsence = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!technician) return;

            await TechnicianService.requestLeave(
                technician.id!,
                absenceData.startDate,
                absenceData.endDate,
                absenceData.reason,
                absenceData.type,
                'approved' // Admin force leave is always approved immediately
            );

            showToast('Absence registered successfully', 'success');
            setIsAbsenceModalOpen(false);
            // Optional: Redirect or refresh logic if needed, but for now just toast is fine
        } catch (error) {
            console.error(error);
            showToast('Failed to register absence', 'error');
        }
    };

    const t = {
        title: language === 'es' ? 'Gestión de Técnico' : 'Technician Management',
        back: language === 'es' ? 'Volver' : 'Back',
        edit: language === 'es' ? 'Editar Perfil' : 'Edit Profile',
        forceLeave: language === 'es' ? 'Forzar Ausencia / Suspensión' : 'Force Leave / Suspension',
        sections: {
            profile: language === 'es' ? 'Perfil Profesional' : 'Professional Profile',
            contact: language === 'es' ? 'Contacto' : 'Contact Info',
            schedule: language === 'es' ? 'Horario' : 'Schedule'
        }
    };

    if (loading) return <PageLoadingSkeleton title={t.title} />;
    if (!technician) return null;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-500">{technician.fullName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#004a90] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                {technician.fullName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{technician.fullName}</h2>
                                <p className="text-gray-500">{technician.email}</p>
                                <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-bold ${technician.availabilityStatus === 'unavailable'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : (technician.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                                    }`}>
                                    {technician.availabilityStatus === 'unavailable'
                                        ? (language === 'es' ? 'No disponible' : 'Unavailable')
                                        : (technician.active ? (language === 'es' ? 'Activo' : 'Active') : (language === 'es' ? 'Inactivo' : 'Inactive'))
                                    }
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all"
                        >
                            <i className="ri-pencil-line"></i>
                            {t.edit}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="ri-contacts-book-2-line text-[#004a90]"></i>
                                {t.sections.contact}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Phone</label>
                                    <p className="text-gray-700">{technician.phone}</p>
                                </div>

                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="ri-time-line text-[#004a90]"></i>
                                {t.sections.schedule}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Working Hours</label>
                                    <p className="text-gray-700">{technician.workingHours?.start} - {technician.workingHours?.end}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Working Days</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {technician.workingHours?.days.map(d => (
                                            <span key={d} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs border border-gray-100">
                                                {language === 'es' ? DAYS_ES[d] : DAYS[d]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="ri-tools-line text-[#004a90]"></i>
                            Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {technician.specialties?.map((spec, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-6">
                    {/* Force Leave / Suspension Card */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                        <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                            <i className="ri-alarm-warning-line"></i>
                            HR Actions
                        </h3>
                        <p className="text-sm text-red-700 mb-4">
                            Force a leave or suspension for this technician. This action bypasses the approval process.
                        </p>
                        <button
                            onClick={() => setIsAbsenceModalOpen(true)}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-sm"
                        >
                            {t.forceLeave}
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <TechnicianModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
                technician={technician}
            />

            {/* Force Leave Modal */}
            {isAbsenceModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                            <h3 className="font-bold text-red-800 flex items-center gap-2">
                                <i className="ri-alarm-warning-line"></i>
                                {t.forceLeave}
                            </h3>
                            <button onClick={() => setIsAbsenceModalOpen(false)} className="text-red-400 hover:text-red-700">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleRegisterAbsence} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={absenceData.type}
                                        onChange={(e) => setAbsenceData({ ...absenceData, type: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="suspension">Suspension</option>
                                        <option value="sickness">Sickness</option>
                                        <option value="unplanned">Unplanned Leave</option>
                                        <option value="vacation">Forced Vacation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={absenceData.startDate}
                                        onChange={(e) => setAbsenceData({ ...absenceData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={absenceData.endDate}
                                        onChange={(e) => setAbsenceData({ ...absenceData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={absenceData.reason}
                                    onChange={(e) => setAbsenceData({ ...absenceData, reason: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Enter administrative reason..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAbsenceModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-sm"
                                >
                                    Apply Force Leave
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
