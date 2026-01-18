'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';

type UserRole = 'admin' | 'super_admin' | 'technician';



// ...



// ...





interface StaffUser {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
    position?: string;
    personalEmail?: string;
    role: UserRole;
    status?: 'active' | 'deactivated';
    createdAt: any;
}

export default function StaffPage() {
    const { language } = useLanguage();
    const { user: authUser } = useAuth();
    const router = useRouter();
    const [staff, setStaff] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'super_admin'>('all');
    const { showToast } = useToast();

    // Modal states
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: StaffUser | null; keepData: boolean }>({
        open: false, user: null, keepData: true
    });
    const [newStaff, setNewStaff] = useState({
        fullName: '',
        position: '',
        role: 'admin' as UserRole,
        personalEmail: '',
        companyEmail: '',
        phone: ''
    });

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

    // Fetch staff only (role = admin or super_admin)
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .in('role', ['admin', 'super_admin'])
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const mappedStaff: StaffUser[] = (data || []).map((u: any) => ({
                    id: u.id,
                    fullName: u.full_name,
                    email: u.email,
                    phone: u.phone,
                    position: u.position,
                    personalEmail: u.personal_email,
                    role: u.role,
                    status: u.status,
                    createdAt: u.created_at
                }));

                setStaff(mappedStaff);
            } catch (error) {
                console.error('Error fetching staff:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const t = {
        title: language === 'es' ? 'Administrativos' : 'Admins',
        subtitle: language === 'es' ? 'Gestionar equipo de administración' : 'Manage administrative team',
        addStaff: language === 'es' ? 'Agregar Admin' : 'Add Admin',
        name: language === 'es' ? 'Nombre' : 'Name',
        email: language === 'es' ? 'Correo' : 'Email',
        position: language === 'es' ? 'Posición' : 'Position',
        role: language === 'es' ? 'Rol' : 'Role',
        status: language === 'es' ? 'Estado' : 'Status',
        actions: language === 'es' ? 'Acciones' : 'Actions',
        noStaff: language === 'es' ? 'No hay staff' : 'No staff found',
        searchPlaceholder: language === 'es' ? 'Buscar por nombre o correo...' : 'Search by name or email...',
        active: language === 'es' ? 'Activo' : 'Active',
        deactivated: language === 'es' ? 'Desactivado' : 'Deactivated',
        admin: language === 'es' ? 'Administrador' : 'Admin',
        technician: language === 'es' ? 'Técnico' : 'Technician',
        superAdmin: language === 'es' ? 'Super Administrador' : 'Super Admin',
        resetPassword: language === 'es' ? 'Restablecer Contraseña' : 'Reset Password',
        edit: language === 'es' ? 'Editar' : 'Edit',
        delete: language === 'es' ? 'Eliminar' : 'Delete',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel',
        save: language === 'es' ? 'Guardar' : 'Save',
        confirm: language === 'es' ? 'Confirmar' : 'Confirm',
        createTitle: language === 'es' ? 'Crear Nuevo Staff' : 'Create New Staff',
        deleteTitle: language === 'es' ? 'Eliminar Staff' : 'Delete Staff',
        deleteKeepData: language === 'es' ? 'Desactivar cuenta (conservar datos)' : 'Deactivate account (keep data)',
        deleteRemoveData: language === 'es' ? 'Eliminar permanentemente (borrar datos)' : 'Delete permanently (remove data)',
        personalEmail: language === 'es' ? 'Correo Personal' : 'Personal Email',
        companyEmail: language === 'es' ? 'Correo de Empresa' : 'Company Email',
        phone: language === 'es' ? 'Teléfono' : 'Phone',
        onlySuper: language === 'es' ? 'Solo Super Admin puede gestionar staff' : 'Only Super Admin can manage staff',
        passwordResetSent: language === 'es' ? 'Correo de restablecimiento enviado' : 'Password reset email sent',
        staffCreated: language === 'es' ? 'Staff creado. Recuerda crear la cuenta en Zoho y notificar al trabajador.' : 'Staff created. Remember to create the Zoho account and notify the worker.',
    };

    const filteredStaff = staff.filter(user => {
        const displayName = user.fullName || '';
        const matchesSearch = searchTerm === '' ||
            displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });



    const handleCreateStaff = async () => {
        if (!newStaff.fullName || !newStaff.companyEmail) return;

        try {
            // 1. Generate Magic Link
            const linkResponse = await fetch('/api/create-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newStaff.companyEmail,
                    fullName: newStaff.fullName,
                    phone: newStaff.phone,
                    company: 'TeraVolta',
                    role: newStaff.role, // Pass the role!
                    service: 'Staff Onboarding'
                })
            });

            const linkData = await linkResponse.json();
            if (!linkData.success) throw new Error(linkData.error);

            // 2. Send Onboarding Email
            const emailResponse = await fetch('/api/send-onboarding-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: newStaff.companyEmail,
                    fullName: newStaff.fullName,
                    magicLink: linkData.magicLink,
                    service: 'Staff Account Activation',
                    language: language
                })
            });

            const emailData = await emailResponse.json();
            if (emailData.error) throw new Error(emailData.error);

            showToast(t.passwordResetSent, 'success'); // Changed message to "email sent"
            setCreateModal(false);
            setNewStaff({ fullName: '', position: '', role: 'admin', personalEmail: '', companyEmail: '', phone: '' });

            // Refresh list (new user will appear after activation)
            window.location.reload();
        } catch (e: any) {
            console.error('Error creating staff:', e);
            showToast(e.message || 'Error', 'error');
        }
    };

    const handleDeleteStaff = async () => {
        if (!deleteModal.user) return;
        const userId = deleteModal.user.id;
        const isTechnician = deleteModal.user.role === 'technician';

        try {
            if (deleteModal.keepData) {
                // Soft delete / deactivate
                await supabase.from('users').update({
                    status: 'deactivated',
                    deactivated_at: new Date(),
                    deactivated_by: authUser?.id
                }).eq('id', userId);

                // Also deactivate technician profile if it exists
                if (isTechnician) {
                    await supabase.from('technicians').update({ active: false }).eq('uid', userId);
                }

                setStaff(prev => prev.map(u => u.id === userId ? { ...u, status: 'deactivated' } : u));
            } else {
                // Hard delete
                await supabase.from('users').delete().eq('id', userId);

                // Also delete technician profile
                if (isTechnician) {
                    await supabase.from('technicians').delete().eq('uid', userId);
                }

                setStaff(prev => prev.filter(u => u.id !== userId));
            }
            showToast(language === 'es' ? 'Staff eliminado' : 'Staff deleted', 'success');
        } catch (e) {
            console.error('Error deleting staff:', e);
            showToast('Error', 'error');
        } finally {
            setDeleteModal({ open: false, user: null, keepData: true });
        }
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    const isSuperAdmin = userRole === 'super_admin';

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>
                {isSuperAdmin && (
                    <button
                        onClick={() => setCreateModal(true)}
                        className="px-4 py-2 bg-[#c3d021] text-[#194271] rounded-lg hover:bg-opacity-80 font-medium flex items-center gap-2"
                    >
                        <i className="ri-user-add-line"></i> {t.addStaff}
                    </button>
                )}
            </div>

            {!isSuperAdmin && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    <i className="ri-information-line mr-2"></i>{t.onlySuper}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilterRole('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'all' ? 'bg-white text-[#004a90] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {language === 'es' ? 'Todos' : 'All'}
                    </button>
                    <button
                        onClick={() => setFilterRole('super_admin')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'super_admin' ? 'bg-white text-[#004a90] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {t.superAdmin}s
                    </button>
                    <button
                        onClick={() => setFilterRole('admin')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterRole === 'admin' ? 'bg-white text-[#004a90] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {t.admin}s
                    </button>
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.position}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.role}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.status}</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStaff.map((user, index) => {
                                    const displayName = user.fullName || 'N/A';
                                    const isDeactivated = user.status === 'deactivated';
                                    const isUserSuperAdmin = user.role === 'super_admin';
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
                                            <td className="px-6 py-4 text-gray-600">{user.position || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'technician' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {user.role === 'super_admin' ? t.superAdmin :
                                                        user.role === 'technician' ? t.technician :
                                                            t.admin}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${isDeactivated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {isDeactivated ? t.deactivated : t.active}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/portal/admin/users/${user.id}`)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                        title={isSuperAdmin ? t.edit : (language === 'es' ? 'Ver detalles' : 'View details')}
                                                    >
                                                        <i className={isSuperAdmin ? "ri-pencil-line" : "ri-eye-line"}></i>
                                                    </button>
                                                    {isSuperAdmin && authUser?.id !== user.id && (
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
                        icon="ri-team-line"
                        title={t.noStaff}
                    />
                )}
            </div>

            {/* Create Staff Modal */}
            {createModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.createTitle}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.name} *</label>
                                <input
                                    type="text"
                                    value={newStaff.fullName}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.position}</label>
                                <input
                                    type="text"
                                    value={newStaff.position}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, position: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.role}</label>
                                <select
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value as UserRole }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="admin">{t.admin}</option>
                                    <option value="super_admin">{t.superAdmin}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.companyEmail} * (@teravolta.com)</label>
                                <input
                                    type="email"
                                    value={newStaff.companyEmail}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, companyEmail: e.target.value }))}
                                    placeholder="nombre@teravolta.com"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.personalEmail}</label>
                                <input
                                    type="email"
                                    value={newStaff.personalEmail}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, personalEmail: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                                <input
                                    type="tel"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setCreateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleCreateStaff}
                                disabled={!newStaff.fullName || !newStaff.companyEmail}
                                className="flex-1 px-4 py-2 bg-[#004a90] text-white rounded-lg hover:bg-[#194271] disabled:opacity-50"
                            >
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
