'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase'; // Supabase client
import { useToast } from '@/components/ui/Toast';

interface MagicLinkData {
    id: string;
    token: string;
    email: string;
    fullName: string;
    phone: string;
    company?: string;
    role?: string;
    inquiryId?: string;
    quoteId?: string;
    service: string;
    expiresAt: string;
    used: boolean;
}

export default function OnboardPage() {
    const { token } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [linkData, setLinkData] = useState<MagicLinkData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showToast } = useToast();

    const content = {
        en: {
            title: 'Welcome to TeraVolta',
            subtitle: 'Activate your account to access your customer portal',
            yourInfo: 'Your Information',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            service: 'Service',
            setPassword: 'Set Your Password',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            passwordHint: 'At least 8 characters',
            activate: 'Activate My Account',
            processing: 'Creating your account...',
            success: '🎉 Account Activated!',
            successMessage: 'Your account has been created successfully. You can now access your customer portal.',
            goToPortal: 'Go to My Portal',
            expired: 'This link has expired',
            expiredMessage: 'Please contact us to request a new activation link.',
            invalid: 'Invalid link',
            invalidMessage: 'This activation link is not valid.',
            used: 'Link already used',
            usedMessage: 'This link has already been used. If you already have an account, please login.',
            passwordMismatch: 'Passwords do not match',
            passwordTooShort: 'Password must be at least 8 characters'
        },
        es: {
            title: 'Bienvenido a TeraVolta',
            subtitle: 'Active su cuenta para acceder a su portal de cliente',
            yourInfo: 'Su Información',
            name: 'Nombre',
            email: 'Correo',
            phone: 'Teléfono',
            service: 'Servicio',
            setPassword: 'Establezca Su Contraseña',
            password: 'Contraseña',
            confirmPassword: 'Confirmar Contraseña',
            passwordHint: 'Al menos 8 caracteres',
            activate: 'Activar Mi Cuenta',
            processing: 'Creando su cuenta...',
            success: '🎉 ¡Cuenta Activada!',
            successMessage: 'Su cuenta ha sido creada exitosamente. Ahora puede acceder a su portal de cliente.',
            goToPortal: 'Ir a Mi Portal',
            expired: 'Este enlace ha expirado',
            expiredMessage: 'Por favor contáctenos para solicitar un nuevo enlace de activación.',
            invalid: 'Enlace inválido',
            invalidMessage: 'Este enlace de activación no es válido.',
            used: 'Enlace ya utilizado',
            usedMessage: 'Este enlace ya ha sido utilizado. Si ya tiene una cuenta, por favor inicie sesión.',
            passwordMismatch: 'Las contraseñas no coinciden',
            passwordTooShort: 'La contraseña debe tener al menos 8 caracteres'
        }
    };

    const t = content[language];

    useEffect(() => {
        const validateToken = async () => {
            try {
                if (!token) return;

                // Verify via API
                const response = await fetch('/api/verify-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const result = await response.json();

                if (!result.valid) {
                    if (result.error === 'used') setError('used');
                    else if (result.error === 'expired') setError('expired');
                    else setError('invalid');
                    setLoading(false);
                    return;
                }

                setLinkData(result.data);
            } catch (err) {
                console.error('Error validating token:', err);
                setError('invalid');
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            showToast(t.passwordTooShort, 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast(t.passwordMismatch, 'error');
            return;
        }

        if (!linkData) return;

        setSubmitting(true);

        try {
            // 1. Call Activate API (Creates Supabase User)
            const activateResponse = await fetch('/api/activate-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: linkData.token,
                    email: linkData.email,
                    password: password,
                    fullName: linkData.fullName,
                    phone: linkData.phone,
                    company: linkData.company,
                    role: linkData.role,
                    service: linkData.service,
                    inquiryId: linkData.inquiryId,
                    quoteId: linkData.quoteId
                })
            });

            const activateResult = await activateResponse.json();

            if (!activateResponse.ok) {
                throw new Error(activateResult.error || 'Activation failed');
            }

            const userId = activateResult.userId; // This is a UUID

            // 2. Sign In to Supabase Client
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: linkData.email,
                password: password
            });

            if (signInError) throw signInError;

            // 3. Link existing active projects in Supabase (if any)
            const userRole = linkData.role || 'customer';

            if (userRole === 'customer') {
                try {
                    // Link orphan projects in Supabase
                    // We look for projects with matching email but no user_id
                    const { data: orphanProjects, error: fetchError } = await supabase
                        .from('active_projects')
                        .select('id')
                        .eq('client_email', linkData.email)
                        .is('user_id', null);

                    if (fetchError) throw fetchError;

                    let hasExistingProjects = false;

                    if (orphanProjects && orphanProjects.length > 0) {
                        const { error: updateError } = await supabase
                            .from('active_projects')
                            .update({ user_id: userId })
                            .in('id', orphanProjects.map(p => p.id));

                        if (updateError) throw updateError;
                        hasExistingProjects = true;
                    }

                    // Create new active project in Supabase if needed
                    // (Matches original logic but using Supabase)
                    if (!hasExistingProjects && (linkData.inquiryId || linkData.quoteId)) {
                        // Use the internal API to create the project to ensure consistency
                        const createResponse = await fetch('/api/create-project', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: userId,
                                clientName: linkData.fullName,
                                clientEmail: linkData.email,
                                clientPhone: linkData.phone || '',
                                clientCompany: linkData.company || '',
                                service: linkData.service || 'consulting',
                                description: `Project started from onboarding. Source: ${linkData.quoteId ? 'Quote' : 'Inquiry'}`,
                                amount: 0, // Default or fetch from quote?? logic in original was simple addDoc
                                status: 'in_progress',
                                quoteId: linkData.quoteId,
                                inquiryId: linkData.inquiryId
                            })
                        });

                        if (!createResponse.ok) {
                            console.error("Failed to create initial project");
                        }
                    }
                } catch (dbError) {
                    console.error("Error linking/creating projects:", dbError);
                    // Non-fatal, account is active
                }
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Error creating account:', err);
            showToast(err.message || 'Error creating account', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#004a90] to-[#194271] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        const errorMessages = {
            expired: { title: t.expired, message: t.expiredMessage },
            invalid: { title: t.invalid, message: t.invalidMessage },
            used: { title: t.used, message: t.usedMessage }
        };
        const errorInfo = errorMessages[error as keyof typeof errorMessages] || errorMessages.invalid;

        return (
            <div className="min-h-screen bg-gradient-to-br from-[#004a90] to-[#194271] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ri-error-warning-line text-4xl text-red-500"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
                    <p className="text-gray-600 mb-6">{errorInfo.message}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-[#004a90] text-white rounded-lg font-medium hover:bg-[#194271]"
                    >
                        {language === 'es' ? 'Volver al Inicio' : 'Go to Homepage'}
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#004a90] to-[#194271] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ri-check-line text-4xl text-green-500"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h1>
                    <p className="text-gray-600 mb-6">{t.successMessage}</p>
                    <button
                        onClick={() => {
                            const role = linkData?.role || 'customer';
                            if (role === 'admin' || role === 'super_admin') {
                                router.push('/portal/admin');
                            } else if (role === 'technician') {
                                router.push('/portal/technician');
                            } else {
                                router.push('/portal/customer');
                            }
                        }}
                        className="px-6 py-3 bg-[#c3d021] text-[#194271] rounded-lg font-bold hover:bg-[#b0bc1e]"
                    >
                        {t.goToPortal} →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#004a90] to-[#194271] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#c3d021] rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-user-add-line text-3xl text-[#194271]"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-[#004a90]">{t.title}</h1>
                    <p className="text-gray-600 mt-2">{t.subtitle}</p>
                </div>

                {/* User Info Card */}
                {linkData && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-medium text-gray-700 mb-3">{t.yourInfo}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.name}:</span>
                                <span className="font-medium text-gray-900">{linkData.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.email}:</span>
                                <span className="font-medium text-gray-900">{linkData.email}</span>
                            </div>
                            {linkData.phone && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{t.phone}:</span>
                                    <span className="font-medium text-gray-900">{linkData.phone}</span>
                                </div>
                            )}
                            {linkData.service && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{t.service}:</span>
                                    <span className="font-medium text-[#004a90]">{linkData.service}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-medium text-gray-700">{t.setPassword}</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">{t.passwordHint}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t.confirmPassword}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-[#c3d021] text-[#194271] rounded-lg font-bold hover:bg-[#b0bc1e] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-[#194271] border-t-transparent rounded-full animate-spin"></div>
                                {t.processing}
                            </>
                        ) : (
                            <>
                                <i className="ri-shield-check-line"></i>
                                {t.activate}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
