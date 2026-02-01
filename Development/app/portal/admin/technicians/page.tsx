'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/components/AuthProvider';
import { Technician } from '@/lib/types';
import { TechnicianService } from '@/app/services/technicianService';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';


// Days of the week for display
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function TechniciansPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const t = {
        title: language === 'es' ? 'Gestión de Técnicos' : 'Technician Management',
        subtitle: language === 'es' ? 'Administrar personal de campo y horarios' : 'Manage field staff and schedules',
        addBtn: language === 'es' ? 'Agregar Técnico' : 'Add Technician',
        noTechs: language === 'es' ? 'No hay técnicos registrados' : 'No technicians found',
        searchPlaceholder: language === 'es' ? 'Buscar por nombre o correo...' : 'Search by name or email...',
        status: {
            active: language === 'es' ? 'Activo' : 'Active',
            inactive: language === 'es' ? 'Inactivo' : 'Inactive',
            pending: language === 'es' ? 'Invitación Pendiente' : 'Invite Pending'
        },
        resend: language === 'es' ? 'Reenviar Invitación' : 'Resend Invite',
        resendSuccess: language === 'es' ? 'Invitación reenviada' : 'Invite resent',
        view: language === 'es' ? 'Ver Detalles' : 'View Details'
    };

    const fetchTechnicians = async () => {
        try {
            setLoading(true);
            const data = await TechnicianService.getAll();
            setTechnicians(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const filteredTechnicians = technicians.filter(tech =>
        tech.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleResendInvite = async (tech: Technician) => {
        if (!tech.email) return;
        setResendingId(tech.id || '');
        try {
            const response = await fetch('/api/resend-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: tech.email,
                    fullName: tech.fullName,
                    role: 'technician',
                    language
                })
            });

            if (!response.ok) throw new Error('Failed to resend');

            showToast(t.resendSuccess, 'success');
        } catch (error) {
            console.error(error);
            showToast('Error resending invite', 'error');
        } finally {
            setResendingId(null);
        }
    };

    if (loading) return <PageLoadingSkeleton title={t.title} />;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>
                <button
                    onClick={() => router.push('/portal/admin/users/technicians')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#c3d021] hover:bg-[#a5b01c] text-[#194271] rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                >
                    <i className="ri-user-add-line"></i>
                    {t.addBtn}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004a90]/20 focus:border-[#004a90] transition-all"
                />
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'es' ? 'Técnico' : 'Technician'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'es' ? 'Email' : 'Email'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'es' ? 'Estado' : 'Status'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'es' ? 'Horario' : 'Schedule'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'es' ? 'Especialidades' : 'Specialties'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{language === 'es' ? 'Acciones' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTechnicians.length > 0 ? (
                                filteredTechnicians.map((tech) => {
                                    const isPending = !tech.uid;
                                    return (
                                        <tr
                                            key={tech.id}
                                            onClick={() => router.push(`/portal/admin/technicians/${tech.id}`)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#004a90] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {tech.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#194271] text-sm">{tech.fullName}</h3>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                            <i className="ri-phone-line"></i>
                                                            {tech.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{tech.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {tech.availabilityStatus === 'unavailable' ? (
                                                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                        <i className="ri-prohibited-line mr-1"></i>
                                                        {language === 'es' ? 'No disponible' : 'Unavailable'}
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${isPending
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : (tech.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')
                                                        }`}>
                                                        {isPending ? t.status.pending : (tech.active ? t.status.active : t.status.inactive)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {tech.workingHours && (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                                                            {tech.workingHours.start} - {tech.workingHours.end}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {tech.workingHours.days.map(d => language === 'es' ? DAYS_ES[d] : DAYS[d]).join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {tech.specialties?.slice(0, 2).map((spec, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs border border-gray-100">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                    {(tech.specialties?.length || 0) > 2 && (
                                                        <span className="px-2 py-0.5 text-xs text-gray-400">+{tech.specialties!.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    {isPending && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleResendInvite(tech);
                                                            }}
                                                            disabled={resendingId === tech.id}
                                                            className="p-2 text-[#004a90] hover:bg-[#004a90]/10 rounded-lg transition-colors"
                                                            title={t.resend}
                                                        >
                                                            {resendingId === tech.id ? (
                                                                <i className="ri-loader-4-line animate-spin"></i>
                                                            ) : (
                                                                <i className="ri-mail-send-line"></i>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/portal/admin/technicians/${tech.id}`);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-[#004a90] hover:bg-gray-100 rounded-lg transition-colors"
                                                        title={t.view}
                                                    >
                                                        <i className="ri-arrow-right-s-line text-xl"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                <i className="ri-user-search-line text-2xl text-gray-300"></i>
                                            </div>
                                            <p>{t.noTechs}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
