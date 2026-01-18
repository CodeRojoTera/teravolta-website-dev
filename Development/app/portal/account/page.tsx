'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';

import { supabase } from '@/lib/supabase';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

export default function AccountPage() {
  const { language } = useLanguage();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: '',
    company: '',
    email: '',
  });

  // Notification preferences
  const [preferences, setPreferences] = useState({
    monthlyReports: true,
    alertNotifications: true,
    projectUpdates: false,
    marketingCommunications: false,
  });

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/portal/login');
    }
  }, [user, loading, router]);

  // Fetch user data
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoadingData(true);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setProfileData({
              fullName: data.full_name || '',
              company: data.company || '',
              email: user.email || '',
            });
            if (data.preferences?.notifications) {
              setPreferences(data.preferences.notifications);
            }
          } else {
            // Initialize with defaults if new
            setProfileData(prev => ({ ...prev, email: user.email || '' }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchUserData();
    }
  }, [user]);


  if (loading || (!user && isLoadingData)) {
    return <PageLoadingSkeleton title={language === 'es' ? 'Cargando Cuenta...' : 'Loading Account...'} />;
  }

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          full_name: profileData.fullName,
          company: profileData.company,
          email: user.email,
          preferences: {
            notifications: preferences
          },
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSaveMessage({ type: 'success', text: language === 'es' ? 'Perfil actualizado correctamente.' : 'Profile updated successfully.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      let errorMessage = language === 'es' ? 'Error al guardar.' : 'Failed to save.';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const content = {
    en: {
      title: 'Account Dashboard',
      subtitle: 'Manage your energy optimization projects and track your savings progress.',
      welcome: `Welcome back, ${profileData.fullName.split(' ')[0] || user.email?.split('@')[0] || 'User'}!`, // Dynamic welcome
      welcomeSubtitle: 'Here\'s your energy optimization summary for this month.',
      energySavings: 'Energy Savings',
      dashboard: 'Dashboard',
      projects: 'Projects',
      reports: 'Reports',
      settings: 'Settings',
      profile: 'My Profile',
      billing: 'Billing & Invoices',
      logout: 'Logout',
      monthlySavings: 'Monthly Savings',
      usageReduction: 'Usage Reduction',
      co2Saved: 'Tons CO2 Saved',
      efficiencyScore: 'Efficiency Score',
      recentActivity: 'Recent Activity',
      monthlyReportGenerated: 'Monthly Energy Report Generated',
      ledRetrofitCompleted: 'LED Retrofit Project Completed',
      powerQualityResolved: 'Power Quality Alert Resolved',
      quickActions: 'Quick Actions',
      newProjectQuote: 'New Project Quote',
      downloadReport: 'Download Report',
      contactSupport: 'Contact Support',
      yourProjects: 'Your Projects',
      newProject: 'New Project',
      energyReports: 'Energy Reports'
    },
    es: {
      title: 'Panel de Control de Cuenta',
      subtitle: 'Administra tus proyectos de optimización energética y rastrea tu progreso de ahorro.',
      welcome: `¡Bienvenido de vuelta, ${profileData.fullName.split(' ')[0] || user.email?.split('@')[0] || 'Usuario'}!`, // Dynamic
      welcomeSubtitle: 'Aquí está tu resumen de optimización energética para este mes.',
      energySavings: 'Ahorro Energético',
      dashboard: 'Panel Principal',
      projects: 'Proyectos',
      reports: 'Reportes',
      settings: 'Configuración',
      profile: 'Mi Perfil',
      billing: 'Facturación y Facturas',
      logout: 'Cerrar Sesión',
      monthlySavings: 'Ahorro Mensual',
      usageReduction: 'Reducción de Consumo',
      co2Saved: 'Toneladas CO2 Ahorradas',
      efficiencyScore: 'Puntuación de Eficiencia',
      recentActivity: 'Actividad Reciente',
      monthlyReportGenerated: 'Reporte Energético Mensual Generado',
      ledRetrofitCompleted: 'Proyecto de Retrofit LED Completado',
      powerQualityResolved: 'Alerta de Calidad Energética Resuelta',
      quickActions: 'Acciones Rápidas',
      newProjectQuote: 'Nueva Cotización de Proyecto',
      downloadReport: 'Descargar Reporte',
      contactSupport: 'Contactar Soporte',
      yourProjects: 'Tus Proyectos',
      newProject: 'Nuevo Proyecto',
      energyReports: 'Reportes Energéticos'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-[#004A90] text-white relative overflow-hidden">
        {/* Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.20] pointer-events-none"
          style={{
            backgroundImage: 'url(/images/brand/textura-alargada.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            mixBlendMode: 'overlay'
          }}
        />

        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-fluid-h2 font-bold mb-4">{t.title}</h1>
              <p className="text-xl md:text-fluid-body">{t.subtitle}</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl md:text-fluid-h3 font-bold text-gray-200">18%</div>
                <div className="text-sm opacity-80">{t.energySavings}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${activeTab === 'dashboard'
                ? 'border-[#004A90] text-[#004A90]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.dashboard}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${activeTab === 'projects'
                ? 'border-[#004A90] text-[#004A90]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.projects}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${activeTab === 'reports'
                ? 'border-[#004A90] text-[#004A90]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.reports}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${activeTab === 'settings'
                ? 'border-[#004A90] text-[#004A90]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.settings}
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleLogout}
              className="py-4 px-4 text-sm text-red-600 hover:text-red-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-logout-box-line mr-2"></i>
              {t.logout}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div
              className="flex overflow-x-auto gap-6 pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <button onClick={() => setActiveTab('dashboard')} className={`py-3 px-4 border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'dashboard' ? 'border-[#004A90] text-[#004A90]' : 'border-transparent text-gray-500'}`}>{t.dashboard}</button>
              <button onClick={() => setActiveTab('projects')} className={`py-3 px-4 border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'projects' ? 'border-[#004A90] text-[#004A90]' : 'border-transparent text-gray-500'}`}>{t.projects}</button>
              <button onClick={() => setActiveTab('reports')} className={`py-3 px-4 border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'reports' ? 'border-[#004A90] text-[#004A90]' : 'border-transparent text-gray-500'}`}>{t.reports}</button>
              <button onClick={() => setActiveTab('settings')} className={`py-3 px-4 border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'settings' ? 'border-[#004A90] text-[#004A90]' : 'border-transparent text-gray-500'}`}>{t.settings}</button>
              <button onClick={handleLogout} className="py-3 px-4 text-sm text-red-600 hover:text-red-700 flex-shrink-0"><i className="ri-logout-box-line mr-2"></i>{t.logout}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-fluid-section bg-white min-h-screen">
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Card - Dynamic */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#004a90] mb-2">{t.welcome}</h2>
                    <p className="text-gray-600">{t.welcomeSubtitle}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-3xl font-bold text-[#004A90]">18%</div>
                    <div className="text-sm text-gray-500">{t.energySavings}</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#194271] rounded-full mr-4">
                      <i className="ri-coins-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#004a90]">$12,450</div>
                      <div className="text-sm text-gray-500">{t.monthlySavings}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                      <i className="ri-arrow-down-line text-xl" style={{ color: '#194271' }}></i>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#004a90]">24%</div>
                      <div className="text-sm text-gray-500">{t.usageReduction}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#194271] rounded-full mr-4">
                      <i className="ri-leaf-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#004a90]">15.2</div>
                      <div className="text-sm text-gray-500">{t.co2Saved}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                      <i className="ri-trophy-line text-xl" style={{ color: '#194271' }}></i>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#004a90]">98.5%</div>
                      <div className="text-sm text-gray-500">{t.efficiencyScore}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity (Hardcoded for now as placeholders) */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#004a90] mb-6">{t.recentActivity}</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-[#004A90]/5 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#194271] rounded-full mr-4">
                      <i className="ri-file-text-line text-white"></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#004a90]">{t.monthlyReportGenerated}</div>
                      <div className="text-sm text-gray-500">{language === 'es' ? 'hace 2 horas' : '2 hours ago'}</div>
                    </div>
                  </div>
                  {/* ... other activities ... */}
                  <div className="flex items-center p-4 bg-[#C3D021]/10 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#c3d021] rounded-full mr-4">
                      <i className="ri-check-line" style={{ color: '#194271' }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#004a90]">{t.ledRetrofitCompleted}</div>
                      <div className="text-sm text-gray-500">{language === 'es' ? 'hace 3 días' : '3 days ago'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#004a90] mb-6">{t.quickActions}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 3xl:gap-6">
                  <Button href="/quote" className="w-full whitespace-nowrap bg-[#C3D021] hover:bg-green-400 text-[#004A90]">
                    <i className="ri-add-line mr-2"></i>
                    {t.newProjectQuote}
                  </Button>
                  <Button variant="outline" className="w-full whitespace-nowrap">
                    <i className="ri-download-line mr-2"></i>
                    {t.downloadReport}
                  </Button>
                  <Button variant="outline" className="w-full whitespace-nowrap">
                    <i className="ri-customer-service-line mr-2"></i>
                    {t.contactSupport}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab - Placeholder for now */}
          {activeTab === 'projects' && (
            <div className="text-center py-20 text-gray-500">
              <i className="ri-briefcase-line text-6xl mb-4 text-gray-300 block"></i>
              {t.projects} - {language === 'es' ? 'Próximamente' : 'Coming Soon'}
            </div>
          )}

          {/* Reports Tab - Placeholder for now */}
          {activeTab === 'reports' && (
            <div className="text-center py-20 text-gray-500">
              <i className="ri-file-chart-line text-6xl mb-4 text-gray-300 block"></i>
              {t.reports} - {language === 'es' ? 'Próximamente' : 'Coming Soon'}
            </div>
          )}

          {/* Settings Tab - FULLY IMPLEMENTED */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#004a90]">
                {language === 'es' ? 'Configuración de Cuenta' : 'Account Settings'}
              </h2>

              {saveMessage && (
                <div className={`p-4 rounded-lg mb-4 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {saveMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-[#004a90] mb-6">
                    {language === 'es' ? 'Información del Perfil' : 'Profile Information'}
                  </h3>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {language === 'es' ? 'Nombre Completo' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder={language === 'es' ? 'Ej. Juan Pérez' : 'Ex. John Doe'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {language === 'es' ? 'Correo Electrónico (Solo lectura)' : 'Email (Read-only)'}
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">
                        {language === 'es' ? 'Empresa' : 'Company'}
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={language === 'es' ? 'Ej. TeraVolta Inc.' : 'Ex. TeraVolta Inc.'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSaving}
                      className={`w-full whitespace-nowrap bg-[#C3D021] text-[#004A90] ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-green-400'}`}
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#004A90] mr-2"></div>
                          {language === 'es' ? 'Guardando...' : 'Saving...'}
                        </span>
                      ) : (
                        language === 'es' ? 'Actualizar Perfil' : 'Update Profile'
                      )}
                    </Button>
                  </form>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-[#004a90] mb-6">
                    {language === 'es' ? 'Preferencias de Notificación' : 'Notification Preferences'}
                  </h3>
                  <div className="space-y-4">
                    {/* Monthly Reports */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#004a90]">
                          {language === 'es' ? 'Reportes Mensuales' : 'Monthly Reports'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'es' ? 'Recibir reportes energéticos mensuales' : 'Receive monthly energy reports'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePreference('monthlyReports')}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${preferences.monthlyReports ? 'bg-[#004A90]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${preferences.monthlyReports ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>

                    {/* Alert Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#004a90]">
                          {language === 'es' ? 'Notificaciones de Alerta' : 'Alert Notifications'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'es' ? 'Alertas de calidad energética' : 'Power quality alerts'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePreference('alertNotifications')}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${preferences.alertNotifications ? 'bg-[#004A90]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${preferences.alertNotifications ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>

                    {/* Project Updates */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#004a90]">
                          {language === 'es' ? 'Actualizaciones de Proyectos' : 'Project Updates'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'es' ? 'Progreso de proyectos activos' : 'Active project progress'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePreference('projectUpdates')}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${preferences.projectUpdates ? 'bg-[#004A90]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${preferences.projectUpdates ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#004a90]">
                          {language === 'es' ? 'Comunicaciones de Marketing' : 'Marketing Communications'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'es' ? 'Noticias y novedades' : 'News and updates'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePreference('marketingCommunications')}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${preferences.marketingCommunications ? 'bg-[#004A90]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${preferences.marketingCommunications ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
