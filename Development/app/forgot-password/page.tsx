'use client';

import { useState } from 'react';
import { useLanguage } from '../../components/LanguageProvider';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(language === 'es' ? 'Por favor ingresa tu correo electrónico' : 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const content = {
    en: {
      title: 'Reset Your Password',
      subtitle: 'Enter your email address and we will send you a link to reset your password.',
      emailLabel: 'Email Address',
      sendButton: 'Send Reset Link',
      backToLogin: 'Back to Sign In',
      successTitle: 'Check Your Email',
      successMessage: 'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.',
      notReceived: 'Didn\'t receive the email?',
      resend: 'Resend'
    },
    es: {
      title: 'Restablecer Tu Contraseña',
      subtitle: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.',
      emailLabel: 'Correo Electrónico',
      sendButton: 'Enviar Enlace de Restablecimiento',
      backToLogin: 'Volver a Iniciar Sesión',
      successTitle: 'Revisa Tu Correo',
      successMessage: 'Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.',
      notReceived: '¿No recibiste el correo?',
      resend: 'Reenviar'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Forgot Password Section */}
      <section className="py-20 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-6 w-full">
          {/* Forgot Password Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {!isSuccess ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#194271] rounded-full flex items-center justify-center">
                    <i className="ri-lock-unlock-line text-white text-2xl"></i>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{t.title}</h1>
                  <p className="text-gray-600">{t.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.emailLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        required
                        className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-[#194271] focus:border-[#194271] text-sm ${error ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="ejemplo@email.com"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-mail-line text-[#194271]"></i>
                      </div>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
                        {language === 'es' ? 'Enviando...' : 'Sending...'}
                      </div>
                    ) : (
                      t.sendButton
                    )}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                  <Link href="/portal/login" className="text-[#194271] hover:text-[#003270] font-medium cursor-pointer">
                    <i className="ri-arrow-left-line mr-2"></i>
                    {t.backToLogin}
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#c3d021] rounded-full flex items-center justify-center">
                    <i className="ri-mail-send-line text-[#194271] text-2xl"></i>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{t.successTitle}</h1>
                  <p className="text-gray-600 mb-8">{t.successMessage}</p>

                  {/* Show email */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <i className="ri-mail-line mr-2"></i>
                      {email}
                    </div>
                  </div>

                  {/* Resend Option */}
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {t.notReceived}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsSuccess(false);
                        setIsLoading(false);
                      }}
                    >
                      {t.resend}
                    </Button>
                  </div>

                  {/* Back to Login */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link href="/portal/login" className="text-[#194271] hover:text-[#003270] font-medium cursor-pointer">
                      <i className="ri-arrow-left-line mr-2"></i>
                      {t.backToLogin}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Link href="/contact" className="text-[#194271] hover:text-[#003270] cursor-pointer">
                <i className="ri-customer-service-line mr-1"></i>
                {language === 'es' ? 'Contactar Soporte' : 'Contact Support'}
              </Link>
              <Link href="/help" className="text-[#194271] hover:text-[#003270] cursor-pointer">
                <i className="ri-question-line mr-1"></i>
                {language === 'es' ? 'Centro de Ayuda' : 'Help Center'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}