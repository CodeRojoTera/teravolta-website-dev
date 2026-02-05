'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

interface NotificationSettings {
    newInquiry: boolean;
    quoteRequest: boolean;
    quoteApproved: boolean;
    paymentReceived: boolean;
    projectMilestone: boolean;
    projectCompleted: boolean;
}

interface DoNotDisturb {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
}

interface EmailPreferences {
    frequency: 'realtime' | 'daily' | 'weekly' | 'disabled';
    digestTime: string;
}

interface UserSettings {
    userId: string;
    email: string;
    notifications: NotificationSettings;
    doNotDisturb: DoNotDisturb;
    emailPreferences: EmailPreferences;
}

const defaultSettings: Omit<UserSettings, 'userId' | 'email'> = {
    notifications: {
        newInquiry: true,
        quoteRequest: true,
        quoteApproved: true,
        paymentReceived: true,
        projectMilestone: false,
        projectCompleted: true
    },
    doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        days: []
    },
    emailPreferences: {
        frequency: 'realtime',
        digestTime: '09:00'
    }
};

export default function SettingsPage() {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const loadSettings = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('preferences')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setSettings({
                        userId: user.id,
                        email: user.email || '',
                        ...defaultSettings, // Fallback for missing keys
                        ...(data.preferences as any)
                    });
                } else if (error && error.code === 'PGRST116') {
                    // No settings found, create default
                    const newSettings: UserSettings = {
                        userId: user.id,
                        email: user.email || '',
                        ...defaultSettings
                    };
                    setSettings(newSettings);

                    // Save defaults to DB
                    await supabase
                        .from('user_settings')
                        .insert({
                            user_id: user.id,
                            preferences: defaultSettings,
                            updated_at: new Date().toISOString()
                        });
                } else {
                    console.error('Error loading settings:', error);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [user]);

    const saveSettings = async (newSettings?: UserSettings) => {
        const settingsToSave = newSettings || settings;
        if (!user || !settingsToSave) return;

        if (!newSettings) setSaving(true); // Only show saving state for manual save

        try {
            const { notifications, doNotDisturb, emailPreferences } = settingsToSave;
            const preferences = { notifications, doNotDisturb, emailPreferences };

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    preferences,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            if (!newSettings) {
                showToast(language === 'es' ? 'Configuración guardada' : 'Settings saved', 'success');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast(language === 'es' ? 'Error al guardar' : 'Error saving settings', 'error');
        } finally {
            if (!newSettings) setSaving(false);
        }
    };

    const toggleNotification = async (key: keyof NotificationSettings) => {
        if (!settings) return;
        const updated = {
            ...settings,
            notifications: {
                ...settings.notifications,
                [key]: !settings.notifications[key]
            }
        };
        setSettings(updated);
        await saveSettings(updated);
        showToast(language === 'es' ? 'Preferencia actualizada' : 'Preference updated', 'success');
    };

    const toggleDNDDay = (day: string) => {
        if (!settings) return;
        const days = settings.doNotDisturb.days.includes(day)
            ? settings.doNotDisturb.days.filter(d => d !== day)
            : [...settings.doNotDisturb.days, day];

        setSettings({
            ...settings,
            doNotDisturb: {
                ...settings.doNotDisturb,
                days
            }
        });
    };

    const content = {
        en: {
            title: 'Notification Settings',
            subtitle: 'Manage your notification preferences',
            notificationTypes: 'Notification Types',
            notificationDesc: 'Choose which events you want to be notified about',
            newInquiry: 'New Inquiry Submitted',
            newInquiryDesc: 'When a customer submits a new inquiry',
            quoteRequest: 'Quote Request Received',
            quoteRequestDesc: 'When a customer requests a quote',
            quoteApproved: 'Quote Status Changed',
            quoteApprovedDesc: 'When you approve or reject a quote',
            paymentReceived: 'Payment Received',
            paymentReceivedDesc: 'When a customer completes payment',
            projectMilestone: 'Project Milestones',
            projectMilestoneDesc: 'Progress updates on active projects',
            projectCompleted: 'Project Completed',
            projectCompletedDesc: 'When a project is marked as complete',
            doNotDisturb: 'Do Not Disturb',
            dndDesc: 'Set quiet hours when you won\'t receive notifications',
            enableDND: 'Enable Do Not Disturb',
            startTime: 'Start Time',
            endTime: 'End Time',
            daysOfWeek: 'Days of Week',
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat',
            sunday: 'Sun',
            emailPreferences: 'Email Preferences',
            emailDesc: 'Configure how you receive email notifications',
            frequency: 'Email Frequency',
            realtime: 'Real-time (Immediate)',
            daily: 'Daily Digest',
            weekly: 'Weekly Digest',
            disabled: 'Disabled',
            digestTime: 'Digest Time',
            saveChanges: 'Save Changes',
            saving: 'Saving...',
            saved: 'Saved!'
        },
        es: {
            title: 'Configuración de Notificaciones',
            subtitle: 'Gestiona tus preferencias de notificaciones',
            notificationTypes: 'Tipos de Notificaciones',
            notificationDesc: 'Elige sobre qué eventos quieres ser notificado',
            newInquiry: 'Nueva Consulta Enviada',
            newInquiryDesc: 'Cuando un cliente envía una nueva consulta',
            quoteRequest: 'Solicitud de Cotización Recibida',
            quoteRequestDesc: 'Cuando un cliente solicita una cotización',
            quoteApproved: 'Estado de Cotización Cambiado',
            quoteApprovedDesc: 'Cuando apruebas o rechazas una cotización',
            paymentReceived: 'Pago Recibido',
            paymentReceivedDesc: 'Cuando un cliente completa un pago',
            projectMilestone: 'Hitos del Proyecto',
            projectMilestoneDesc: 'Actualizaciones de progreso en proyectos activos',
            projectCompleted: 'Proyecto Completado',
            projectCompletedDesc: 'Cuando un proyecto se marca como completo',
            doNotDisturb: 'No Molestar',
            dndDesc: 'Establece horas de silencio cuando no recibirás notificaciones',
            enableDND: 'Activar No Molestar',
            startTime: 'Hora de Inicio',
            endTime: 'Hora de Fin',
            daysOfWeek: 'Días de la Semana',
            monday: 'Lun',
            tuesday: 'Mar',
            wednesday: 'Mié',
            thursday: 'Jue',
            friday: 'Vie',
            saturday: 'Sáb',
            sunday: 'Dom',
            emailPreferences: 'Preferencias de Email',
            emailDesc: 'Configura cómo recibes notificaciones por email',
            frequency: 'Frecuencia de Email',
            realtime: 'Tiempo Real (Inmediato)',
            daily: 'Resumen Diario',
            weekly: 'Resumen Semanal',
            disabled: 'Desactivado',
            digestTime: 'Hora del Resumen',
            saveChanges: 'Guardar Cambios',
            saving: 'Guardando...',
            saved: '¡Guardado!'
        }
    };

    const t = content[language];

    const weekDays = [
        { key: 'monday', label: t.monday },
        { key: 'tuesday', label: t.tuesday },
        { key: 'wednesday', label: t.wednesday },
        { key: 'thursday', label: t.thursday },
        { key: 'friday', label: t.friday },
        { key: 'saturday', label: t.saturday },
        { key: 'sunday', label: t.sunday }
    ];

    if (loading) {
        return <PageLoadingSkeleton title={t.title} />;
    }

    if (!settings) return null;

    return (
        <div className="space-y-6 max-w-4xl animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#004a90]">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            {/* Notification Types */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#004a90] mb-2">{t.notificationTypes}</h2>
                <p className="text-sm text-gray-600 mb-4">{t.notificationDesc}</p>

                <div className="space-y-3">
                    {[
                        { key: 'newInquiry' as keyof NotificationSettings, title: t.newInquiry, desc: t.newInquiryDesc },
                        { key: 'quoteRequest' as keyof NotificationSettings, title: t.quoteRequest, desc: t.quoteRequestDesc },
                        { key: 'quoteApproved' as keyof NotificationSettings, title: t.quoteApproved, desc: t.quoteApprovedDesc },
                        { key: 'paymentReceived' as keyof NotificationSettings, title: t.paymentReceived, desc: t.paymentReceivedDesc },
                        { key: 'projectMilestone' as keyof NotificationSettings, title: t.projectMilestone, desc: t.projectMilestoneDesc },
                        { key: 'projectCompleted' as keyof NotificationSettings, title: t.projectCompleted, desc: t.projectCompletedDesc }
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className="ml-4"
                            >
                                <div className={`w-12 h-6 rounded-full transition-colors ${settings.notifications[item.key] ? 'bg-[#c3d021]' : 'bg-gray-300'
                                    }`}>
                                    <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-transform ${settings.notifications[item.key] ? 'ml-6' : 'ml-1'
                                        }`}></div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Do Not Disturb */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#004a90] mb-2">{t.doNotDisturb}</h2>
                <p className="text-sm text-gray-600 mb-4">{t.dndDesc}</p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="font-medium text-gray-900">{t.enableDND}</span>
                        <button
                            onClick={() => setSettings({
                                ...settings,
                                doNotDisturb: {
                                    ...settings.doNotDisturb,
                                    enabled: !settings.doNotDisturb.enabled
                                }
                            })}
                        >
                            <div className={`w-12 h-6 rounded-full transition-colors ${settings.doNotDisturb.enabled ? 'bg-[#c3d021]' : 'bg-gray-300'
                                }`}>
                                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-transform ${settings.doNotDisturb.enabled ? 'ml-6' : 'ml-1'
                                    }`}></div>
                            </div>
                        </button>
                    </div>

                    {settings.doNotDisturb.enabled && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.startTime}
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.doNotDisturb.startTime || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            doNotDisturb: {
                                                ...settings.doNotDisturb,
                                                startTime: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.endTime}
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.doNotDisturb.endTime || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            doNotDisturb: {
                                                ...settings.doNotDisturb,
                                                endTime: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.daysOfWeek}
                                </label>
                                <div className="flex gap-2">
                                    {weekDays.map((day) => (
                                        <button
                                            key={day.key}
                                            onClick={() => toggleDNDDay(day.key)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settings.doNotDisturb.days.includes(day.key)
                                                ? 'bg-[#004a90] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Email Preferences */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#004a90] mb-2">{t.emailPreferences}</h2>
                <p className="text-sm text-gray-600 mb-4">{t.emailDesc}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            {t.frequency}
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'realtime' as const, label: t.realtime },
                                { value: 'daily' as const, label: t.daily },
                                { value: 'weekly' as const, label: t.weekly },
                                { value: 'disabled' as const, label: t.disabled }
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${settings.emailPreferences.frequency === option.value
                                        ? 'border-[#004a90] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={option.value}
                                        checked={settings.emailPreferences.frequency === option.value}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            emailPreferences: {
                                                ...settings.emailPreferences,
                                                frequency: e.target.value as typeof option.value
                                            }
                                        })}
                                        className="text-[#004a90] focus:ring-[#004a90]"
                                    />
                                    <span className="ml-3 font-medium text-gray-900">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {(settings.emailPreferences.frequency === 'daily' || settings.emailPreferences.frequency === 'weekly') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.digestTime}
                            </label>
                            <input
                                type="time"
                                value={settings.emailPreferences.digestTime}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    emailPreferences: {
                                        ...settings.emailPreferences,
                                        digestTime: e.target.value
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3 -mx-6 -mb-6 rounded-b-xl">
                <button
                    onClick={() => saveSettings()}
                    disabled={saving}
                    className="px-6 py-3 bg-[#004a90] hover:bg-[#194271] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? t.saving : t.saveChanges}
                </button>
            </div>
        </div>
    );
}
