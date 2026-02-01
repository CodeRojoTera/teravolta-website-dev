'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import { User as GlobalUser, UserRole, Technician } from '@/lib/types';
import { TechnicianService } from '@/app/services/technicianService';

type ClientType = 'residential' | 'commercial' | 'both' | null;

interface ExtendedUser extends Omit<GlobalUser, 'createdAt'> {
    name?: string; // Fallback
    position?: string;
    personalEmail?: string;
    clientType?: ClientType;
    status?: string;
    createdAt: string; // ISO String from Supabase
}

// Country codes mapping for common phone prefixes
const getCountryFromPhone = (phone: string | undefined): string | null => {
    if (!phone) return null;
    const prefixMap: { [key: string]: string } = {
        '+507': 'Panamá',
        '+1': 'USA/CA',
        '+52': 'México',
        '+57': 'Colombia',
        '+506': 'Costa Rica',
        '+503': 'El Salvador',
        '+502': 'Guatemala',
        '+504': 'Honduras',
        '+505': 'Nicaragua',
        '+51': 'Perú',
        '+56': 'Chile',
        '+54': 'Argentina',
        '+55': 'Brasil',
        '+34': 'España',
        '+44': 'UK',
    };
    for (const prefix in prefixMap) {
        if (phone.startsWith(prefix)) {
            return prefixMap[prefix];
        }
    }
    return null;
};

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { user: authUser } = useAuth();

    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [technicianData, setTechnicianData] = useState<Technician | null>(null); // Extended tech data
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        company: '',
        position: '',
        personalEmail: '',
        role: 'customer' as UserRole
    });

    // Inquiry Modal
    const [inquiryModal, setInquiryModal] = useState<{
        isOpen: boolean;
        type: 'role_change' | 'user_edit';
        targetRole?: UserRole;
        changes?: any;
    }>({
        isOpen: false,
        type: 'role_change',
    });
    const [inquiryMessage, setInquiryMessage] = useState('');

    const isStaffUser = user?.role === 'admin' || user?.role === 'super_admin';
    const backPath = isStaffUser ? '/portal/admin/users/staff' : '/portal/admin/users/clients';
    const isSuperAdmin = currentUserRole === 'super_admin';

    useEffect(() => {
        const fetchRole = async () => {
            if (!authUser) return;
            try {
                // Use Supabase to get role
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', authUser.id)
                    .single();

                if (data) {
                    setCurrentUserRole(data.role || 'admin');
                }
            } catch (e) {
                console.error('Error fetching role:', e);
            }
        };
        fetchRole();
    }, [authUser]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    console.error('User not found or error:', error);
                    router.push('/portal/admin/users/clients');
                    return;
                }

                // Map Supabase snake_case to CamelCase ExtendedUser
                // Note: GlobalUser uses camelCase for known fields if we use mapToType, but raw Supabase response is snake_case
                // So we assume 'data' keys are snake_case: full_name, personal_email, client_type, etc.
                const userData: ExtendedUser = {
                    uid: data.id, // map id to uid for GlobalUser compat or just use id locally
                    email: data.email,
                    fullName: data.full_name,
                    phone: data.phone,
                    company: data.company,
                    role: data.role as UserRole,
                    createdAt: data.created_at,

                    // Extended fields
                    position: data.position,
                    personalEmail: data.personal_email,
                    clientType: data.client_type,
                    status: data.status || 'active',
                    name: data.full_name // Fallback
                };

                setUser(userData);
                setFormData({
                    fullName: userData.fullName || '',
                    phone: userData.phone || '',
                    company: userData.company || '',
                    position: userData.position || '',
                    personalEmail: userData.personalEmail || '',
                    role: userData.role || 'customer'
                });

                // Fetch Technician Data if applicable
                if (userData.role === 'technician') {
                    const tech = await TechnicianService.getById(id as string);
                    if (tech) setTechnicianData(tech);
                }

            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchUser();
    }, [id, router]);

    const t = {
        backToClients: language === 'es' ? 'Volver a Clientes' : 'Back to Clients',
        backToStaff: language === 'es' ? 'Volver a Staff' : 'Back to Staff',
        personalInfo: language === 'es' ? 'Información Personal' : 'Personal Information',
        name: language === 'es' ? 'Nombre' : 'Name',
        email: language === 'es' ? 'Correo' : 'Email',
        phone: language === 'es' ? 'Teléfono' : 'Phone',
        country: language === 'es' ? 'País' : 'Country',
        company: language === 'es' ? 'Empresa' : 'Company',
        position: language === 'es' ? 'Posición' : 'Position',
        role: language === 'es' ? 'Rol' : 'Role',
        personalEmail: language === 'es' ? 'Correo Personal' : 'Personal Email',
        status: language === 'es' ? 'Estado' : 'Status',
        createdAt: language === 'es' ? 'Creado el' : 'Created At',
        clientType: language === 'es' ? 'Tipo de Cliente' : 'Client Type',
        residential: language === 'es' ? 'Residencial' : 'Residential',
        commercial: language === 'es' ? 'Comercial' : 'Commercial',
        both: language === 'es' ? 'Ambos' : 'Both',
        saveChanges: language === 'es' ? 'Guardar Cambios' : 'Save Changes',
        saving: language === 'es' ? 'Guardando...' : 'Saving...',
        resetPassword: language === 'es' ? 'Restablecer Contraseña' : 'Reset Password',
        resetPasswordDesc: language === 'es' ? 'Enviar email para restablecer' : 'Send reset email',
        passwordResetSent: language === 'es' ? 'Email enviado' : 'Email sent',
        changesSaved: language === 'es' ? 'Cambios guardados' : 'Changes saved',
        active: language === 'es' ? 'Activo' : 'Active',
        deactivated: language === 'es' ? 'Desactivado' : 'Deactivated',
        roleAdmin: language === 'es' ? 'Administrador' : 'Admin',
        roleSuperAdmin: language === 'es' ? 'Super Administrador' : 'Super Admin',
        selectRole: language === 'es' ? 'Cambiar Rol' : 'Change Role',
        onlySuperCanEdit: language === 'es' ? 'Solo Super Admin puede editar' : 'Only Super Admin can edit',
    };

    const handleSave = async () => {
        if (!user || updating) return;

        // Check for role change by regular admin
        if (formData.role !== user.role && !isSuperAdmin) {
            setInquiryModal({
                isOpen: true,
                type: 'role_change',
                targetRole: formData.role
            });
            return;
        }

        // Calculate changes
        const changes: any = {};
        const dbChanges: any = {}; // Changes mapped to DB columns

        if (formData.fullName !== user.fullName) {
            changes.fullName = formData.fullName;
            dbChanges.full_name = formData.fullName;
        }
        if (formData.phone !== user.phone) {
            changes.phone = formData.phone;
            dbChanges.phone = formData.phone;
        }

        if (isStaffUser) {
            if (formData.position !== user.position) {
                changes.position = formData.position;
                dbChanges.position = formData.position;
            }
            if (formData.personalEmail !== user.personalEmail) {
                changes.personalEmail = formData.personalEmail;
                dbChanges.personal_email = formData.personalEmail;
            }
            // Role change handled above or allowed for super admin
            if (isSuperAdmin && formData.role !== user.role) {
                changes.role = formData.role;
                dbChanges.role = formData.role;
            }
        } else {
            if (formData.company !== user.company) {
                changes.company = formData.company;
                dbChanges.company = formData.company;
            }
        }

        // If standard admin (and not just changing role which is handled above), request approval for data edits
        if (!isSuperAdmin && Object.keys(changes).length > 0) {
            setInquiryModal({
                isOpen: true,
                type: 'user_edit',
                changes: changes
            });
            return;
        }

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('users')
                .update(dbChanges)
                .eq('id', user.uid); // Use ID (UUID)

            if (error) throw error;

            setUser({ ...user, ...changes });
            setToast({ message: t.changesSaved, type: 'success' });
        } catch (error) {
            console.error('Error saving:', error);
            setToast({ message: 'Error', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveTechnician = async () => {
        if (!technicianData) return;
        setUpdating(true);
        try {
            // Update technicians table
            await TechnicianService.update(technicianData.id, {
                specialties: technicianData.specialties,
                working_schedule: technicianData.workingHours,
                is_active: technicianData.active
            });
            // Update users table name/phone via normal handleSave if needed, 
            // but usually we might want to trigger both. 
            // For now, let's just do technician data here.

            setToast({ message: 'Technician Profile Updated', type: 'success' });
        } catch (e) {
            console.error(e);
            setToast({ message: 'Error updating technician profile', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };


    const handleResetPassword = async () => {
        if (!user) return;
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });
            if (error) throw error;
            setToast({ message: t.passwordResetSent, type: 'success' });
        } catch (e) {
            console.error('Error sending reset email:', e);
            setToast({ message: 'Error', type: 'error' });
        }
    };

    const hasChanges = (): boolean => {
        if (!user) return false;
        const original = {
            fullName: user.fullName || '',
            phone: user.phone || '',
            company: user.company || '',
            position: user.position || '',
            personalEmail: user.personalEmail || '',
            role: user.role || 'customer'
        };
        return JSON.stringify(formData) !== JSON.stringify(original);
    };

    if (loading) {
        return <PageLoadingSkeleton title={isStaffUser ? t.backToStaff : t.backToClients} />;
    }

    if (!user) return null;

    const displayName = user.fullName || 'N/A';
    const canEdit = isSuperAdmin || (!isStaffUser && currentUserRole === 'admin');
    const detectedCountry = getCountryFromPhone(user.phone);

    // Client type badge
    const getClientTypeBadge = () => {
        if (isStaffUser) return null;
        const type = user.clientType;
        if (type === 'residential') {
            return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{t.residential}</span>;
        }
        if (type === 'commercial') {
            return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">{t.commercial}</span>;
        }
        if (type === 'both') {
            return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{t.both}</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">—</span>;
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-4">×</button>
                </div>
            )}

            {/* Header */}
            <div>
                <button
                    onClick={() => router.push(backPath)}
                    className="text-[#004a90] hover:text-[#c3d021] mb-2 flex items-center text-sm"
                >
                    <i className="ri-arrow-left-line mr-1"></i>
                    {isStaffUser ? t.backToStaff : t.backToClients}
                </button>
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isStaffUser ? 'bg-[#004a90]' : 'bg-[#c3d021]'}`}>
                        <span className={`font-bold text-2xl ${isStaffUser ? 'text-white' : 'text-[#194271]'}`}>
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#004a90]">{displayName}</h1>
                        <p className="text-gray-600 mt-1">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Cannot edit warning for non-super admins viewing staff */}
            {!canEdit && isStaffUser && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    <i className="ri-information-line mr-2"></i>{t.onlySuperCanEdit}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Card: Personal Info + Actions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#004a90]">{t.personalInfo}</h2>
                            {/* Password Reset - inline */}
                            {(isSuperAdmin || !isStaffUser) && (
                                <button
                                    onClick={handleResetPassword}
                                    className="px-3 py-1.5 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors flex items-center gap-1"
                                    title={t.resetPasswordDesc}
                                >
                                    <i className="ri-key-line text-sm"></i>
                                    {t.resetPassword}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.name}</label>
                                {canEdit ? (
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-gray-900">{displayName}</p>
                                )}
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.email}</label>
                                <p className="text-base text-gray-900">{user.email}</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.phone}</label>
                                {canEdit ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900">{user.phone || '—'}</p>
                                )}
                            </div>

                            {/* Country (derived from phone) */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.country}</label>
                                <p className="text-base text-gray-900">{detectedCountry || '—'}</p>
                            </div>

                            {/* Company (clients) or Position/Personal Email (staff) */}
                            {!isStaffUser ? (
                                <>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.company}</label>
                                        {canEdit ? (
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">{user.company || '—'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.clientType}</label>
                                        {getClientTypeBadge()}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.position}</label>
                                        {canEdit ? (
                                            <input
                                                type="text"
                                                value={formData.position}
                                                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">{user.position || '—'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.personalEmail}</label>
                                        {canEdit ? (
                                            <input
                                                type="email"
                                                value={formData.personalEmail}
                                                onChange={(e) => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">{user.personalEmail || '—'}</p>
                                        )}
                                    </div>
                                    {/* Role Display for Staff (Read-Only here) */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.role}</label>
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {user.role === 'super_admin' ? t.roleSuperAdmin : t.roleAdmin}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Created At */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.createdAt}</label>
                                <p className="text-base text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString(language === 'es' ? 'es-PA' : 'en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">{t.status}</label>
                                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'deactivated' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.status === 'deactivated' ? t.deactivated : t.active}
                                </span>
                            </div>
                        </div>

                        {/* Save button - only show when there are changes */}
                        {canEdit && hasChanges() && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    disabled={updating}
                                    className="px-6 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                >
                                    {updating ? t.saving : (isSuperAdmin ? t.saveChanges : (language === 'es' ? 'Solicitar Cambios' : 'Request Changes'))}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Role Selector (Super Admin only for staff) */}
                {isStaffUser && isSuperAdmin && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#004a90] mb-4">{t.selectRole}</h2>
                            <div className="space-y-2">
                                <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${formData.role === 'admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        checked={formData.role === 'admin'}
                                        onChange={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">{t.roleAdmin}</span>
                                </label>
                                <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${formData.role === 'super_admin' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        checked={formData.role === 'super_admin'}
                                        onChange={() => setFormData(prev => ({ ...prev, role: 'super_admin' }))}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">{t.roleSuperAdmin}</span>
                                </label>
                            </div>
                        </div>

                        {/* Technician Profile Editor (Only for Technicians) */}
                        {user.role === 'technician' && technicianData && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-[#004a90]">{t.profile}</h2>
                                    {canEdit && (
                                        <button
                                            onClick={handleSaveTechnician}
                                            disabled={updating}
                                            className="text-sm font-bold text-[#004a90] hover:text-[#c3d021] disabled:opacity-50"
                                        >
                                            {updating ? '...' : 'Save Profile'}
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {/* Active Status */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">Active Status</label>
                                        <button
                                            onClick={() => canEdit && setTechnicianData({ ...technicianData, active: !technicianData.active })}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${technicianData.active ? 'bg-green-500' : 'bg-gray-200'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transform transition-transform ${technicianData.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Specialties */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Specialties</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {technicianData.specialties.map(s => (
                                                <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100 flex items-center gap-1">
                                                    {s}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => setTechnicianData({ ...technicianData, specialties: technicianData.specialties.filter(sp => sp !== s) })}
                                                            className="hover:text-red-500"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                        {canEdit && (
                                            <input
                                                type="text"
                                                placeholder="Add specialty + Enter"
                                                className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = e.currentTarget.value.trim();
                                                        if (val && !technicianData.specialties.includes(val)) {
                                                            setTechnicianData({ ...technicianData, specialties: [...technicianData.specialties, val] });
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Working Hours */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Working Schedule</label>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div>
                                                <label className="text-xs text-gray-400 block">Start</label>
                                                <input
                                                    type="time"
                                                    value={technicianData.workingHours?.start || '08:00'}
                                                    onChange={(e) => canEdit && setTechnicianData({
                                                        ...technicianData,
                                                        workingHours: { ...technicianData.workingHours!, start: e.target.value }
                                                    })}
                                                    className="w-full p-1 border rounded text-sm"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 block">End</label>
                                                <input
                                                    type="time"
                                                    value={technicianData.workingHours?.end || '17:00'}
                                                    onChange={(e) => canEdit && setTechnicianData({
                                                        ...technicianData,
                                                        workingHours: { ...technicianData.workingHours!, end: e.target.value }
                                                    })}
                                                    className="w-full p-1 border rounded text-sm"
                                                    disabled={!canEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-1">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (!canEdit) return;
                                                        const days = technicianData.workingHours?.days || [];
                                                        const newDays = days.includes(i) ? days.filter(d => d !== i) : [...days, i];
                                                        setTechnicianData({
                                                            ...technicianData,
                                                            workingHours: { ...technicianData.workingHours!, days: newDays.sort() }
                                                        });
                                                    }}
                                                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${technicianData.workingHours?.days.includes(i) ? 'bg-[#004a90] text-white' : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Inquiry Modal (Role Change & User Edit) */}
            {inquiryModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setInquiryModal({ ...inquiryModal, isOpen: false }); setInquiryMessage(''); }}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <i className={`ri-${inquiryModal.type === 'role_change' ? 'user-settings' : 'edit'}-line text-2xl text-yellow-600`}></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {inquiryModal.type === 'role_change'
                                        ? (language === 'es' ? 'Solicitar Cambio de Rol' : 'Request Role Change')
                                        : (language === 'es' ? 'Solicitar Edición de Datos' : 'Request Data Edit')}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {inquiryModal.type === 'role_change'
                                        ? (language === 'es'
                                            ? `Solicitar cambio de rol a: ${t[`role${inquiryModal.targetRole === 'super_admin' ? 'SuperAdmin' : 'Admin'}` as keyof typeof t] || inquiryModal.targetRole}`
                                            : `Request role change to: ${inquiryModal.targetRole === 'super_admin' ? 'Super Admin' : 'Admin'}`)
                                        : (language === 'es' ? 'Solicitar aprobación para los cambios realizados.' : 'Request approval for changes made.')}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'es' ? 'Razón de la solicitud' : 'Reason for request'}
                            </label>
                            <textarea
                                value={inquiryMessage}
                                onChange={(e) => setInquiryMessage(e.target.value)}
                                rows={3}
                                placeholder={language === 'es' ? 'Explica por qué se requiere este cambio...' : 'Explain why this change is required...'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setInquiryModal({ ...inquiryModal, isOpen: false }); setInquiryMessage(''); }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={async () => {
                                    if (!user) return;
                                    if (!inquiryMessage.trim()) {
                                        setToast({ message: language === 'es' ? 'Ingresa una razón' : 'Enter a reason', type: 'error' });
                                        return;
                                    }
                                    setUpdating(true);
                                    try {
                                        const { error } = await supabase.from('admin_inquiries').insert({
                                            type: inquiryModal.type,
                                            details: inquiryModal.type === 'role_change' ? {
                                                currentRole: user.role,
                                                requestedRole: inquiryModal.targetRole
                                            } : {
                                                changes: inquiryModal.changes
                                            },
                                            requested_by: authUser?.id, // Supabase ID
                                            // subject/message mapping to new schema
                                            subject: inquiryModal.type === 'role_change' ? 'Role Change Request' : 'User Edit Request',
                                            message: inquiryMessage,
                                            status: 'new'
                                        });

                                        if (error) throw error;

                                        setToast({ message: language === 'es' ? 'Solicitud enviada al Super Admin' : 'Request sent to Super Admin', type: 'success' });
                                        setTimeout(() => setToast(null), 3000);
                                    } catch (e) {
                                        console.error('Inquiry submit error:', e);
                                        setToast({ message: language === 'es' ? 'Error al enviar solicitud' : 'Request failed', type: 'error' });
                                    } finally {
                                        setUpdating(false);
                                        setInquiryModal({ ...inquiryModal, isOpen: false });
                                        setInquiryMessage('');
                                    }
                                }}
                                disabled={updating || !inquiryMessage.trim()}
                                className="px-6 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                {updating ? '...' : (language === 'es' ? 'Enviar Solicitud' : 'Send Request')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
