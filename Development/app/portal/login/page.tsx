'use client';

import { useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();

      // Check role to redirect correctly
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .maybeSingle();

      if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        router.push('/portal/admin');
      } else if (profile?.role === 'technician') {
        router.push('/portal/technician');
      } else {
        router.push('/portal/customer');
      }
    } catch (err: any) {
      // Ignore AbortError
      if (err.message?.includes('AbortError') || err.name === 'AbortError') {
        return;
      }

      console.error('Login error:', err);
      // Supabase generic error message mapping
      if (err.message === 'Invalid login credentials') {
        setError(language === 'es' ? 'Correo o contraseña incorrectos. Por favor verifique.' : 'Invalid email or password. Please check your credentials.');
      } else if (err.message.includes('rate limit')) {
        setError(language === 'es' ? 'Demasiados intentos. Por favor espere.' : 'Too many attempts. Please wait.');
      } else {
        setError(language === 'es' ? `Error al iniciar sesión: ${err.message}` : `Error signing in: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    en: {
      title: 'Sign In to Your Account',
      subtitle: 'Access your dashboard to view your projects and billing information.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      signInButton: 'Sign In',
      forgotPassword: 'Forgot your password?',
      noAccount: 'Don\'t have an account?',
      signUp: 'Sign Up',
      showPassword: 'Show password',
      hidePassword: 'Hide password'
    },
    es: {
      title: 'Inicia Sesión en Tu Cuenta',
      subtitle: 'Accede a tu panel de control para ver tus proyectos e información de facturación.',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      signInButton: 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      signUp: 'Registrarse',
      showPassword: 'Mostrar contraseña',
      hidePassword: 'Ocultar contraseña'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Header />

      {/* Login Section */}
      <section className="py-20 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-6 w-full">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#004a90] mb-3">{t.title}</h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#004a90] mb-2">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-[#004a90] text-sm"
                    placeholder="ejemplo@email.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-mail-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#004a90] mb-2">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004a90] focus:border-[#004a90] text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-lock-line text-gray-400"></i>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 hover:text-gray-600`}></i>
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-[#004a90] hover:text-[#003270] cursor-pointer">
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'es' ? 'Iniciando Sesión...' : 'Signing In...'}
                  </div>
                ) : (
                  t.signInButton
                )}
              </Button>
            </form>

            {/* Sign Up Link Removed for Admin-Only Access */}
            {/* <div className="mt-8 text-center border-t border-gray-200 pt-6">
              <p className="text-gray-600">
                {t.noAccount}{' '}
                <Link href="/signup" className="text-[#004a90] hover:text-[#003270] font-medium cursor-pointer">
                  {t.signUp}
                </Link>
              </p>
            </div> */}
          </div>

          {/* Additional Features */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <i className="ri-shield-check-line mr-2 text-[#c3d021]"></i>
                {language === 'es' ? 'Seguro y Protegido' : 'Secure & Protected'}
              </div>
              <div className="flex items-center">
                <i className="ri-customer-service-line mr-2 text-[#004a90]"></i>
                {language === 'es' ? 'Soporte 24/7' : '24/7 Support'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}