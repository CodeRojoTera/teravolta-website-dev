'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

export default function CustomerSettings() {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [prefStatus, setPrefStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [existingRequest, setExistingRequest] = useState<any>(null);
    const [emailNotifications, setEmailNotifications] = useState(false);

    const [profile, setProfile] = useState<{
        fullName: string;
        phone: string;
        company: string;
    }>({ fullName: '', phone: '', company: '' });
    const [profileStatus, setProfileStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Fetch User Settings, Profile, and Deletion Requests
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const { data: userData } = await supabase
                    .from('users')
                    .select('full_name, phone, company')
                    .eq('id', user.id)
                    .single();

                if (userData) {
                    setProfile({
                        fullName: userData.full_name || '',
                        phone: userData.phone || '',
                        company: userData.company || ''
                    });
                }

                const { data: settings } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                const { data: requests } = await supabase
                    .from('deletion_requests')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'pending');

                if (settings) {
                    setEmailNotifications(settings.email_notifications ?? true);
                } else {
                    setEmailNotifications(true);
                }

                if (requests && requests.length > 0) {
                    setExistingRequest(requests[0]);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setProfileStatus('saving');
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: profile.fullName,
                    phone: profile.phone,
                    company: profile.company
                })
                .eq('id', user.id);

            if (error) throw error;

            setProfileStatus('success');
            setTimeout(() => setProfileStatus('idle'), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setProfileStatus('error');
        }
    };

    const handleDeletionRequest = async () => {
        if (!user) return;
        setLoading(true);
        setStatus('idle');
        try {
            const { error } = await supabase.from('deletion_requests').insert({
                user_id: user.id,
                resource_type: 'account',
                resource_id: user.id,
                reason: 'Customer requested account deletion',
                status: 'pending',
                requested_at: new Date().toISOString()
            });

            if (error) throw error;

            setStatus('success');
            setExistingRequest(true);
        } catch (error) {
            console.error('Error creating deletion request:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        if (!user) return;
        setPrefStatus('saving');
        try {
            const { error } = await supabase.from('user_settings').upsert({
                user_id: user.id,
                email_notifications: emailNotifications,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

            if (error) throw error;

            setPrefStatus('success');
            setTimeout(() => setPrefStatus('idle'), 3000);
        } catch (error) {
            console.error('Error saving preferences:', error);
            setPrefStatus('error');
        }
    };

    const content = {
        en: {
            title: 'Account Settings',
            subtitle: 'Manage your account preferences',
            profile: 'Profile Information',
            fullName: 'Full Name',
            phone: 'Phone Number',
            company: 'Company',
            dangerZone: 'Danger Zone',
            deleteAccount: 'Delete Account',
            deleteDescription: 'Once you delete your account, there is no going back. Please be certain.',
            requestDeletion: 'Request Account Deletion',
            requestPending: 'Deletion Request Pending',
            requestSent: 'Request sent successfully',
            error: 'An error occurred. Please try again.',
            preferences: 'Notification Preferences',
            emailNotifications: 'Email Notifications',
            emailNotificationsDesc: 'Receive updates about your project progress and important announcements.',
            savePreferences: 'Save Preferences',
            preferencesSaved: 'Preferences saved successfully',
            saveProfile: 'Save Profile',
            profileSaved: 'Profile saved successfully'
        },
        es: {
            title: 'Configuración de la Cuenta',
            subtitle: 'Administra tus preferencias de cuenta',
            profile: 'Información del Perfil',
            fullName: 'Nombre Completo',
            phone: 'Número de Teléfono',
            company: 'Empresa',
            dangerZone: 'Zona de Peligro',
            deleteAccount: 'Eliminar Cuenta',
            deleteDescription: 'Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.',
            requestDeletion: 'Solicitar Eliminación de Cuenta',
            requestPending: 'Solicitud de Eliminación Pendiente',
            requestSent: 'Solicitud enviada exitosamente',
            error: 'Ocurrió un error. Por favor intenta de nuevo.',
            preferences: 'Preferencias de Notificación',
            emailNotifications: 'Notificaciones por Correo',
            emailNotificationsDesc: 'Recibe actualizaciones sobre el progreso de tu proyecto y anuncios importantes.',
            savePreferences: 'Guardar Preferencias',
            preferencesSaved: 'Preferencias guardadas exitosamente',
            saveProfile: 'Guardar Perfil',
            profileSaved: 'Perfil guardado exitosamente'
        }
    };

    const t = content[language];

    if (pageLoading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/portal/customer"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-[#004a90] transition-colors mb-4"
                >
                    <i className="ri-arrow-left-line mr-1"></i>
                    {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
                </Link>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-[#004a90]">{t.profile}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90]/20 focus:border-[#004a90]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90]/20 focus:border-[#004a90]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.company}</label>
                            <input
                                type="text"
                                value={profile.company}
                                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a90]/20 focus:border-[#004a90]"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSaveProfile}
                            disabled={profileStatus === 'saving'}
                            className="px-4 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {profileStatus === 'saving' ? 'Saving...' : t.saveProfile}
                        </button>
                        {profileStatus === 'success' && (
                            <span className="ml-4 text-green-600 text-sm font-medium animate-fade-in">
                                <i className="ri-check-line mr-1"></i>
                                {t.profileSaved}
                            </span>
                        )}
                        {profileStatus === 'error' && (
                            <span className="ml-4 text-red-600 text-sm font-medium animate-fade-in">
                                {t.error}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-[#004a90]">{t.preferences}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">{t.emailNotifications}</h4>
                            <p className="text-sm text-gray-500 mt-1">{t.emailNotificationsDesc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#004a90]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004a90]"></div>
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSavePreferences}
                            disabled={prefStatus === 'saving'}
                            className="px-4 py-2 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {prefStatus === 'saving' ? 'Saving...' : t.savePreferences}
                        </button>
                        {prefStatus === 'success' && (
                            <span className="ml-4 text-green-600 text-sm font-medium animate-fade-in">
                                <i className="ri-check-line mr-1"></i>
                                {t.preferencesSaved}
                            </span>
                        )}
                        {prefStatus === 'error' && (
                            <span className="ml-4 text-red-600 text-sm font-medium animate-fade-in">
                                {t.error}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <h3 className="text-lg font-bold text-red-700">{t.dangerZone}</h3>
                </div>
                <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-2">{t.deleteAccount}</h4>
                    <p className="text-gray-600 text-sm mb-4">{t.deleteDescription}</p>

                    {existingRequest ? (
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                            <i className="ri-time-line mr-2"></i>
                            {t.requestPending}
                        </div>
                    ) : (
                        <button
                            onClick={handleDeletionRequest}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : (
                                t.requestDeletion
                            )}
                        </button>
                    )}

                    {status === 'success' && (
                        <p className="text-green-600 text-sm mt-2">{t.requestSent}</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-600 text-sm mt-2">{t.error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
