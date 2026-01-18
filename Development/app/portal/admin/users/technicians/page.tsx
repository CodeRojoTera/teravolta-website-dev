'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TechnicianService } from '@/app/services/technicianService';
import { Technician } from '@/lib/types';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';

import { TechnicianModal } from '@/components/admin/TechnicianModal';

export default function TechniciansPage() {
    const { language } = useLanguage();
    const { user: authUser } = useAuth();
    const router = useRouter();
    const [staff, setStaff] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    // Modal and Action States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState<Technician | null>(null);

    // Delete State
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: Technician | null; keepData: boolean }>({
        open: false, user: null, keepData: true
    });

    const [resendingId, setResendingId] = useState<string | null>(null);

    // Fetch current user role
    useEffect(() => {
        const fetchRole = async () => {
            if (!authUser) return;
            try {
                const { data } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', authUser.id)
                    .single();

                if (data) {
                    setUserRole(data.role || 'admin');
                }
            } catch (e) {
                console.error('Error fetching role:', e);
            }
        };
        fetchRole();
    }, [authUser]);

    const fetchStaff = async (background = false) => {
        try {
            if (!background) setLoading(true);
            const technicians = await TechnicianService.getAll();
            setStaff(technicians);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        } finally {
            if (!background) setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const t = {
        title: language === 'es' ? 'Técnicos' : 'Technicians',
        subtitle: language === 'es' ? 'Gestionar equipo técnico' : 'Manage technical team',
        addStaff: language === 'es' ? 'Agregar Técnico' : 'Add Technician',
        name: language === 'es' ? 'Nombre' : 'Name',
        email: language === 'es' ? 'Correo' : 'Email',
        position: language === 'es' ? 'Posición' : 'Position',
        role: language === 'es' ? 'Rol' : 'Role',
        status: language === 'es' ? 'Estado' : 'Status',
        actions: language === 'es' ? 'Acciones' : 'Actions',
        noStaff: language === 'es' ? 'No hay técnicos' : 'No technicians found',
        searchPlaceholder: language === 'es' ? 'Buscar por nombre o correo...' : 'Search by name or email...',
        active: language === 'es' ? 'Activo' : 'Active',
        deactivated: language === 'es' ? 'Desactivado' : 'Deactivated',
        pending: language === 'es' ? 'Invitación Pendiente' : 'Invite Pending',
        admin: language === 'es' ? 'Administrador' : 'Admin',
        technician: language === 'es' ? 'Técnico' : 'Technician',
        edit: language === 'es' ? 'Editar' : 'Edit',
        delete: language === 'es' ? 'Eliminar' : 'Delete',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel',
        confirm: language === 'es' ? 'Confirmar' : 'Confirm',
        deleteTitle: language === 'es' ? 'Eliminar Técnico' : 'Delete Technician',
        deleteKeepData: language === 'es' ? 'Desactivar cuenta (conservar datos)' : 'Deactivate account (keep data)',
        deleteRemoveData: language === 'es' ? 'Eliminar permanentemente (borrar datos)' : 'Delete permanently (remove data)',
        onlySuper: language === 'es' ? 'Solo Super Admin puede gestionar cuentas' : 'Only Super Admin can manage accounts',
        resend: language === 'es' ? 'Reenviar Invitación' : 'Resend Invite',
    };

    const filteredStaff = staff.filter(user => {
        const displayName = user.fullName || '';
        return searchTerm === '' ||
            displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSave = async (data: Partial<Technician>) => {
        try {
            if (editingTech?.id) {
                await TechnicianService.update(editingTech.id, data);
                showToast(language === 'es' ? 'Técnico actualizado' : 'Technician updated', 'success');
            } else {
                // New Technician - Service handles creation + email
                await TechnicianService.create(data);
                showToast(language === 'es' ? 'Invitación enviada exitosamente' : 'Invitation sent successfully', 'success');
            }
            fetchStaff(true); // Background refresh
            setIsModalOpen(false);
        } catch (error: any) {
            showToast(error.message || 'Error', 'error');
        }
    };

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

            showToast(t.resend, 'success');
        } catch (error) {
            console.error(error);
            showToast('Error resending invite', 'error');
        } finally {
            setResendingId(null);
        }
    };

    const handleDeleteStaff = async () => {
        if (!deleteModal.user) return;
        const techId = deleteModal.user.id;
        const userId = deleteModal.user.uid;

        try {
            if (deleteModal.keepData) {
                await TechnicianService.update(techId!, { active: false });
                if (userId) {
                    await supabase.from('users').update({
                        status: 'deactivated',
                        deactivated_at: new Date(),
                        deactivated_by: authUser?.id
                    }).eq('id', userId);
                }
            } else {
                await TechnicianService.delete(techId!);
                if (userId) {
                    await supabase.from('users').delete().eq('id', userId);
                }
            }
            showToast(t.delete, 'success');
            fetchStaff(true); // Background refresh
        } catch (e) {
            console.error('Error deleting staff:', e);
            showToast('Error', 'error');
        } finally {
            setDeleteModal({ open: false, user: null, keepData: true });
        }
    };

    if (loading) return <PageLoadingSkeleton title={t.title} />;

    // Allow both 'admin' and 'super_admin' to manage technicians
    const canManage = userRole === 'admin' || userRole === 'super_admin';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>
                {canManage && (
                    <button
                        onClick={() => {
                            setEditingTech(null);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#c3d021] text-[#194271] rounded-lg hover:bg-opacity-80 font-medium flex items-center gap-2"
                    >
                        <i className="ri-user-add-line"></i> {t.addStaff}
                    </button>
                )}
            </div>

            {!canManage && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    <i className="ri-information-line mr-2"></i>{t.onlySuper}
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredStaff.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.name}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.email}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Horario</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.status}</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStaff.map((user, index) => {
                                    const displayName = user.fullName || 'N/A';
                                    const isDeactivated = !user.active;
                                    const isPending = !user.uid;

                                    return (
                                        <tr key={user.id} className={`hover:bg-gray-50 animate-fade-in ${isDeactivated ? 'opacity-50' : ''}`} style={{ animationDelay: `${index * 30}ms` }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#004a90] flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">
                                                            {displayName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="font-medium text-gray-900">{displayName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.workingHours ? (
                                                    <div className="flex flex-col text-xs">
                                                        <span className="font-medium">{user.workingHours.start} - {user.workingHours.end}</span>
                                                        <span className="text-gray-400">
                                                            {/* Need to import DAYS helpers or duplicate them */}
                                                            {user.workingHours.days.join(', ')}
                                                        </span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${isPending
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : (isDeactivated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800')
                                                    }`}>
                                                    {isPending ? t.pending : (isDeactivated ? t.deactivated : t.active)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isPending && canManage && (
                                                        <button
                                                            onClick={() => handleResendInvite(user)}
                                                            disabled={resendingId === user.id}
                                                            className="p-2 text-[#004a90] hover:bg-blue-50 rounded-lg"
                                                            title={t.resend}
                                                        >
                                                            {resendingId === user.id ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-mail-send-line"></i>}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => router.push(`/portal/admin/users/technicians/${user.id}`)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                        title={canManage ? t.edit : (language === 'es' ? 'Ver detalles' : 'View details')}
                                                    >
                                                        <i className={canManage ? "ri-pencil-line" : "ri-eye-line"}></i>
                                                    </button>
                                                    {canManage && (
                                                        <button
                                                            onClick={() => setDeleteModal({ open: true, user, keepData: true })}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title={t.delete}
                                                        >
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon="ri-hard-hat-line"
                        title={t.noStaff}
                    />
                )}
            </div>

            {/* Create/Edit Technician Modal */}
            <TechnicianModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                technician={editingTech}
            />

            {/* Delete Modal */}
            {deleteModal.open && deleteModal.user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.deleteTitle}</h3>
                        <p className="text-gray-600 mb-4">
                            {deleteModal.user.fullName} ({deleteModal.user.email})
                        </p>
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    checked={deleteModal.keepData}
                                    onChange={() => setDeleteModal(prev => ({ ...prev, keepData: true }))}
                                />
                                <span>{t.deleteKeepData}</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    checked={!deleteModal.keepData}
                                    onChange={() => setDeleteModal(prev => ({ ...prev, keepData: false }))}
                                />
                                <span className="text-red-600">{t.deleteRemoveData}</span>
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ open: false, user: null, keepData: true })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleDeleteStaff}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
