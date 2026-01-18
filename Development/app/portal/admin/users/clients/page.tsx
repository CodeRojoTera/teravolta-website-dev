'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserRole } from '@/lib/types';

interface User {
    id: string;
    name?: string;
    fullName?: string;
    email: string;
    phone?: string;
    company?: string;
    role?: UserRole;
    status?: 'active' | 'deactivated';
    createdAt: any;
}

export default function ClientsPage() {
    const { language } = useLanguage();
    const { user: authUser } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    // Modal states
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null; keepData: boolean }>({
        open: false, user: null, keepData: true
    });
    const [inquiryModal, setInquiryModal] = useState<{ open: boolean; user: User | null; message: string }>({
        open: false, user: null, message: ''
    });

    // Fetch current user role
    useEffect(() => {
        const fetchRole = async () => {
            if (!authUser) return;
            try {
                const { data, error } = await supabase
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

    // Fetch clients only (role = customer or no role)
    useEffect(() => {
        const fetchClients = async () => {
            try {
                // 1. Fetch Registered Users
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .or('role.eq.customer,role.is.null')
                    .order('created_at', { ascending: false });

                if (userError) throw userError;

                const registeredEmails = new Set(userData?.map((u: any) => u.email) || []);

                const mappedUsers: User[] = (userData || []).map((u: any) => ({
                    id: u.id,
                    fullName: u.full_name,
                    name: u.full_name,
                    email: u.email,
                    phone: u.phone,
                    company: u.company,
                    role: u.role || 'customer',
                    status: u.status || 'active',
                    createdAt: u.created_at ? new Date(u.created_at) : null
                }));

                // 2. Fetch Pending Clients from Quotes and Inquiries
                // Quotes
                const { data: quotesData } = await supabase.from('quotes').select('client_name, client_email, created_at');
                // Inquiries
                const { data: inquiriesData } = await supabase.from('inquiries').select('full_name, email, created_at');

                const pendingMap = new Map<string, User>();

                // Process Quotes
                quotesData?.forEach((q: any) => {
                    const email = q.client_email;
                    if (email && !registeredEmails.has(email)) {
                        // Only add if not already in list (deduplicate by email)
                        if (!pendingMap.has(email)) {
                            pendingMap.set(email, {
                                id: `pending-quote-${email}`, // Temp ID
                                fullName: q.client_name,
                                name: q.client_name,
                                email: email,
                                role: 'pending' as any,
                                status: 'active', // Display as "Invite Pending" later
                                createdAt: new Date(q.created_at)
                            });
                        }
                    }
                });

                // Process Inquiries
                inquiriesData?.forEach((i: any) => {
                    const email = i.email;
                    if (email && !registeredEmails.has(email)) {
                        if (!pendingMap.has(email)) {
                            pendingMap.set(email, {
                                id: `pending-inquiry-${email}`,
                                fullName: i.full_name,
                                name: i.full_name,
                                email: email,
                                role: 'pending' as any,
                                status: 'active',
                                createdAt: new Date(i.created_at)
                            });
                        }
                    }
                });

                const pendingUsers = Array.from(pendingMap.values());

                // Combine and set users
                setUsers([...mappedUsers, ...pendingUsers]);

            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const t = {
        title: language === 'es' ? 'Clientes' : 'Clients',
        subtitle: language === 'es' ? 'Gestionar cuentas de clientes' : 'Manage client accounts',
        name: language === 'es' ? 'Nombre' : 'Name',
        email: language === 'es' ? 'Correo' : 'Email',
        phone: language === 'es' ? 'Teléfono' : 'Phone',
        status: language === 'es' ? 'Estado' : 'Status',
        created: language === 'es' ? 'Creado' : 'Created',
        actions: language === 'es' ? 'Acciones' : 'Actions',
        noClients: language === 'es' ? 'No hay clientes' : 'No clients found',
        searchPlaceholder: language === 'es' ? 'Buscar por nombre o correo...' : 'Search by name or email...',
        active: language === 'es' ? 'Activo' : 'Active',
        deactivated: language === 'es' ? 'Desactivado' : 'Deactivated',
        pending: language === 'es' ? 'Invitación Pendiente' : 'Invite Pending',
        resetPassword: language === 'es' ? 'Restablecer Contraseña' : 'Reset Password',
        edit: language === 'es' ? 'Editar' : 'Edit',
        delete: language === 'es' ? 'Eliminar' : 'Delete',
        resend: language === 'es' ? 'Reenviar Invitación' : 'Resend Invite',
        requestDelete: language === 'es' ? 'Solicitar Eliminación' : 'Request Deletion',
        deleteTitle: language === 'es' ? 'Eliminar Cliente' : 'Delete Client',
        deleteKeepData: language === 'es' ? 'Desactivar cuenta (conservar datos)' : 'Deactivate account (keep data)',
        deleteRemoveData: language === 'es' ? 'Eliminar permanentemente (borrar datos)' : 'Delete permanently (remove data)',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel',
        confirm: language === 'es' ? 'Confirmar' : 'Confirm',
        passwordResetSent: language === 'es' ? 'Correo de restablecimiento enviado' : 'Password reset email sent',
        requestReason: language === 'es' ? 'Razón de la solicitud' : 'Request reason',
        sendRequest: language === 'es' ? 'Enviar Solicitud' : 'Send Request',
    };

    const filteredUsers = users.filter(user => {
        const displayName = user.name || user.fullName || '';
        return searchTerm === '' ||
            displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDeleteClient = async () => {
        if (!deleteModal.user) return;
        const userId = deleteModal.user.id;

        try {
            if (deleteModal.keepData) {
                // Soft delete - deactivate
                const { error } = await supabase
                    .from('users')
                    .update({
                        status: 'deactivated',
                        // deactivatedAt: new Date(), // If column exists? Schema doesn't show it, using metadata or valid columns only.
                        // validated columns: id, email, full_name, phone, company, role, created_at, status, etc.
                        // Assuming deactivated_at doesn't exist yet, we can skip or add it. Let's start with status.
                    })
                    .eq('id', userId);

                if (error) throw error;

                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'deactivated' } : u));
            } else {
                // Hard delete - remove user document
                // Note: Auth user deletion usually requires Supabase Admin API (backend). 
                // Client-side delete on 'users' table is RLS permitted for admin? Yes per RLS plan.
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', userId);

                if (error) throw error;

                // Note: Related data (activeProjects, etc.) would need cascade or trigger.
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
            showToast(language === 'es' ? 'Cliente eliminado' : 'Client deleted', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast(language === 'es' ? 'Error al eliminar' : 'Error deleting', 'error');
        } finally {
            setDeleteModal({ open: false, user: null, keepData: true });
        }
    };

    const handleRequestDeletion = async () => {
        if (!inquiryModal.user || !authUser) return;

        try {
            // Using admin_inquiries table via Supabase
            const { error } = await supabase
                .from('admin_inquiries')
                .insert({
                    type: 'client_deletion',
                    // Using details jsonb for extended info
                    details: {
                        userId: inquiryModal.user.id,
                        userName: inquiryModal.user.fullName || inquiryModal.user.name || 'N/A',
                        userEmail: inquiryModal.user.email,
                        keepData: false // Implicit in request type mostly
                    },
                    requested_by: authUser.id,
                    subject: 'Client Deletion Request',
                    message: inquiryModal.message,
                    status: 'new'
                });

            if (error) throw error;

            showToast(language === 'es' ? 'Solicitud enviada' : 'Request sent', 'success');
        } catch (error) {
            console.error('Error sending inquiry:', error);
            showToast(language === 'es' ? 'Error al enviar' : 'Error sending', 'error');
        } finally {
            setInquiryModal({ open: false, user: null, message: '' });
        }
    };

    const [resendingEmail, setResendingEmail] = useState<string | null>(null);

    const handleResendInvite = async (user: User) => {
        if (!user.email) return;
        setResendingEmail(user.email);
        try {
            const response = await fetch('/api/create-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: user.name || user.fullName,
                    role: 'customer',
                    service: 'efficiency' // Default service, since we don't track it perfectly here yet
                })
            });

            if (!response.ok) throw new Error('Failed to generate link');
            const data = await response.json();

            // Send actual email via API
            // Note: create-magic-link returns the token but doesn't send email? 
            // Checking quote page: logic is create-magic-link -> redirect. 
            // We need an endpoint that sends the email.
            // Let's use `resend-onboarding` endpoint if available, or construct and send.

            // Actually, let's use the standardized `api/resend-onboarding` if it supports customers.
            // Technicians page used: /api/resend-onboarding. Let's try that.

            const resendResponse = await fetch('/api/resend-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: user.name,
                    role: 'customer',
                    language
                })
            });

            if (!resendResponse.ok) throw new Error('Failed to send email');

            showToast(t.passwordResetSent.replace('Password reset', 'Invitation'), 'success'); // Reuse success msg style or add new key
        } catch (error) {
            console.error('Error resending invite:', error);
            showToast('Error sending invite', 'error');
        } finally {
            setResendingEmail(null);
        }
    };

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

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

            {/* Clients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.name}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.email}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.phone}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.status}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t.created}</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => {
                                    const displayName = user.name || user.fullName || 'N/A';
                                    const isDeactivated = user.status === 'deactivated';
                                    const isPending = user.role === 'pending' as any;

                                    return (
                                        <tr key={user.id} className={`hover:bg-gray-50 animate-fade-in ${isDeactivated ? 'opacity-50' : ''}`} style={{ animationDelay: `${index * 30}ms` }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPending ? 'bg-orange-100 text-orange-600' : 'bg-[#c3d021] text-[#194271]'}`}>
                                                        <span className="font-bold text-sm">
                                                            {displayName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="font-medium text-gray-900">{displayName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.phone || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${isPending
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : (isDeactivated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800')
                                                    }`}>
                                                    {isPending ? t.pending : (isDeactivated ? t.deactivated : t.active)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {user.createdAt instanceof Date ? user.createdAt.toLocaleDateString(language === 'es' ? 'es-PA' : 'en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                }) : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isPending ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleResendInvite(user); }}
                                                            disabled={resendingEmail === user.email}
                                                            className="p-2 text-[#004a90] hover:bg-blue-50 rounded-lg"
                                                            title={t.resend}
                                                        >
                                                            {resendingEmail === user.email ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-mail-send-line"></i>}
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); router.push(`/portal/admin/users/${user.id}`); }}
                                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                                title={t.edit}
                                                            >
                                                                <i className="ri-pencil-line"></i>
                                                            </button>

                                                            {userRole === 'super_admin' ? (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, user, keepData: true }); }}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                                    title={t.delete}
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setInquiryModal({ open: true, user, message: '' }); }}
                                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                                                                    title={t.requestDelete}
                                                                >
                                                                    <i className="ri-mail-send-line"></i>
                                                                </button>
                                                            )}
                                                        </>
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
                        icon="ri-user-line"
                        title={t.noClients}
                    />
                )}
            </div>

            {/* Delete Modal (Super Admin) */}
            {deleteModal.open && deleteModal.user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.deleteTitle}</h3>
                        <p className="text-gray-600 mb-4">
                            {deleteModal.user.fullName || deleteModal.user.name} ({deleteModal.user.email})
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
                                onClick={handleDeleteClient}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {t.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiry Modal (Admin) */}
            {inquiryModal.open && inquiryModal.user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.requestDelete}</h3>
                        <p className="text-gray-600 mb-4">
                            {inquiryModal.user.fullName || inquiryModal.user.name} ({inquiryModal.user.email})
                        </p>
                        <textarea
                            value={inquiryModal.message}
                            onChange={(e) => setInquiryModal(prev => ({ ...prev, message: e.target.value }))}
                            placeholder={t.requestReason}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-24"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setInquiryModal({ open: false, user: null, message: '' })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleRequestDeletion}
                                className="flex-1 px-4 py-2 bg-[#004a90] text-white rounded-lg hover:bg-[#194271]"
                            >
                                {t.sendRequest}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
