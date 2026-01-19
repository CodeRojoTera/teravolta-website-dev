
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../components/LanguageProvider';
import { useAuth } from '../../components/AuthProvider';
import { supabasePublic as supabase } from '@/lib/supabase';
// Removed Firebase imports

// ... imports remain the same

import { updateClientType } from '@/lib/clientTypeUtils';
import { useToast } from '@/components/ui/Toast';
import { PageLoadingSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import dynamic from 'next/dynamic';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import type { Country } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en.json';
import esLabels from 'react-phone-number-input/locale/es.json';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
});

function InquiryFormContent() {
  const { language } = useLanguage();
  const { isAdmin, user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMountedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    propertyType: '',
    projectDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferredContact: 'email',
    timeline: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [country, setCountry] = useState<Country>('PA');
  const [phoneKey, setPhoneKey] = useState(0);
  const { showToast } = useToast();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const content = {
    en: {
      title: "Request Specialized Consultation",
      subtitle: "Tell us about your project and we'll connect you with the right expert",
      formTitle: "Consultation Form",
      changeService: "← Change Service",
      serviceSelected: "Selected service:",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      company: "Company (optional)",
      propertyType: "Property Type",
      residential: "Residential",
      apartment: "Apartment",
      smallBusiness: "Small Business",
      office: "Office",
      industrial: "Industrial",
      projectDescription: "Project Description",
      address: "Address",
      city: "City",
      stateProvince: "State/Province",
      timeline: "Desired Timeline",
      budget: "Estimated Budget",
      selectTimeline: "Select a timeline",
      immediate: "Immediate (1-2 weeks)",
      oneMonth: "1 month",
      twoThreeMonths: "2-3 months",
      moreThanThreeMonths: "More than 3 months",
      selectRange: "Select a range",
      lessThan5k: "Less than $5,000",
      range5k15k: "$5,000 - $15,000",
      range15k50k: "$15,000 - $50,000",
      moreThan50k: "More than $50,000",
      submitRequest: "Submit Request",
      submitting: "Submitting request...",
      successTitle: "Consultation submitted successfully!",
      successMessage: "Redirecting to confirmation page...",
      errorTitle: "Error submitting consultation",
      errorMessage: "Please check all fields and try again.",
      placeholders: {
        fullName: "Your full name",
        email: "your@email.com",
        phone: "+507 0000-0000",
        company: "Your company name",
        projectDescription: "Describe your project in detail...",
        address: "Project address",
        city: "City",
        state: "State or province"
      },
      charactersLabel: "characters",
      loading: "Loading form...",
      services: {
        consulting: "Strategic Consulting",
        advocacy: "Service Quality",
        efficiency: "Energy Efficiency"
      }
    },
    es: {
      title: "Solicitar Consulta Especializada",
      subtitle: "Cuéntanos sobre tu proyecto y te conectaremos con el experto adecuado",
      formTitle: "Formulario de Consulta",
      changeService: "← Cambiar Servicio",
      serviceSelected: "Servicio seleccionado:",
      fullName: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono",
      company: "Empresa (opcional)",
      propertyType: "Tipo de Propiedad",
      residential: "Residencial",
      apartment: "Apartamento",
      smallBusiness: "Pequeña Empresa",
      office: "Oficina",
      industrial: "Industrial",
      projectDescription: "Descripción del Proyecto",
      address: "Dirección",
      city: "Ciudad",
      stateProvince: "Estado/Provincia",
      timeline: "Cronograma Deseado",
      budget: "Presupuesto Estimado",
      selectTimeline: "Selecciona un cronograma",
      immediate: "Inmediato (1-2 semanas)",
      oneMonth: "1 mes",
      twoThreeMonths: "2-3 meses",
      moreThanThreeMonths: "Más de 3 meses",
      selectRange: "Selecciona un rango",
      lessThan5k: "Menos de $5,000",
      range5k15k: "$5,000 - $15,000",
      range15k50k: "$15,000 - $50,000",
      moreThan50k: "Más de $50,000",
      submitRequest: "Enviar Solicitud",
      submitting: "Enviando solicitud...",
      successTitle: "¡Consulta enviada exitosamente!",
      successMessage: "Redirigiendo a la página de confirmación...",
      errorTitle: "Error al enviar la consulta",
      errorMessage: "Por favor verifica todos los campos e inténtalo nuevamente.",
      placeholders: {
        fullName: "Tu nombre completo",
        email: "tu@correo.com",
        phone: "+507 0000-0000",
        company: "Nombre de tu empresa",
        projectDescription: "Describe tu proyecto en detalle...",
        address: "Dirección del proyecto",
        city: "Ciudad",
        state: "Estado o provincia"
      },
      charactersLabel: "caracteres",
      loading: "Cargando formulario...",
      services: {
        consulting: "Consultoría Estratégica",
        advocacy: "Calidad de Servicio",
        efficiency: "Eficiencia Energética"
      }
    }
  };

  const t = (key: string) => (content[language] as any)?.[key] || (content['es'] as any)[key] || key;

  useEffect(() => {
    isMountedRef.current = true;
    setIsClient(true);

    const service = searchParams.get('service');
    if (service && isMountedRef.current) {
      setSelectedService(service);
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchParams]);

  // Generate custom labels with calling codes and flags
  const countryLabels = language === 'en' ? enLabels : esLabels;
  const customLabels = { ...countryLabels };

  getCountries().forEach((country) => {
    const callingCode = getCountryCallingCode(country);
    if (customLabels[country]) {
      customLabels[country] = `${customLabels[country]} +${callingCode}`;
    }
  });

  // Global styles for phone input
  const phoneInputStyles = `
    .PhoneInput {
        display: flex;
        align-items: center;
        border: 1px solid #e5e7eb; /* gray-200 */
        border-radius: 0.5rem; /* rounded-lg */
        padding: 0.75rem 1rem;
        background-color: #ffffff !important; /* white */
    }
    .PhoneInput input,
    .PhoneInput .PhoneInputInput {
        background-color: #ffffff !important;
        border: none !important;
        outline: none !important;
    }
    .PhoneInput:focus-within {
        border-color: #004a90;
        box-shadow: 0 0 0 1px #004a90; /* Custom ring effect */
    }
    .PhoneInputInput {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 1rem;
        color: #111827; /* gray-900 */
        margin-left: 0.5rem;
    }
    .PhoneInputCountry {
        margin-right: 0.5rem;
    }
    .PhoneInputCountrySelect {
        cursor: pointer;
    }
      /* Custom Flags Styles */
      .PhoneInputCountryIcon {
        width: 24px;
        height: 18px;
        box-shadow: 0 0 1px rgba(0,0,0,0.5); /* Add subtle border to flags */
        border-radius: 2px;
      }
      .PhoneInputCountryIconImg {
        display: block;
        width: 100%;
        height: 100%;
      }
  `;

  const getServiceName = (service: string) => {
    const serviceTranslations: Record<string, string> = {
      consulting: (content[language] as any)?.services?.consulting || 'Consultoría Estratégica',
      advocacy: (content[language] as any)?.services?.advocacy || 'Calidad de Servicio',
      efficiency: (content[language] as any)?.services?.efficiency || 'Eficiencia Energética'
    };
    return serviceTranslations[service] || service;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!isMountedRef.current || !isClient) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setFieldErrors(prev => ({ ...prev, email: language === 'es' ? 'Email inválido' : 'Invalid email' }));
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (!value) {
      setFormData(prev => ({ ...prev, phone: '' }));
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
      return;
    }

    // Validation
    if (value && isValidPhoneNumber(value)) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    } else if (value) {
      setFieldErrors(prev => ({ ...prev, phone: language === 'es' ? 'Número inválido' : 'Invalid number' }));
    }

    let maxLength = 21; // Safe default
    if (country) {
      const example = getExampleNumber(country, examples);
      if (example) {
        maxLength = example.format('E.164').length;
      }
    }

    if (value.length > maxLength) {
      const truncated = value.slice(0, maxLength);
      setFormData(prev => ({ ...prev, phone: truncated }));
      setPhoneKey(prev => prev + 1);
      return;
    }

    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMountedRef.current || !isClient) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // 1. Insert into Inquiries via API (bypasses RLS)
      const inquiryResponse = await fetch('/api/create-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: selectedService,
          project_description: formData.projectDescription,
          timeline: formData.timeline,
          budget: formData.budget,
          property_type: formData.propertyType,
          preferred_contact: formData.preferredContact,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          address: formData.address,
        })
      });

      const inquiryResult = await inquiryResponse.json();
      if (!inquiryResult.success) throw new Error(inquiryResult.error || 'Failed to create inquiry');
      const inquiryData = inquiryResult.inquiry;

      // 2. Update Client Type
      if (formData.email && formData.propertyType) {
        try {
          await updateClientType(formData.email, formData.propertyType);
        } catch (e) {
          console.error("Client type update error:", e);
        }
      }

      // 3. Generate Magic Link for Immediate Onboarding
      const linkResponse = await fetch('/api/create-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          company: formData.company,
          role: 'customer',
          inquiryId: inquiryData.id, // Link to the created inquiry
          service: selectedService
        })
      });

      const linkData = await linkResponse.json();
      if (!linkData.success) throw new Error('Failed to create onboarding link');

      // 4. Send Notification Emails (Background)
      try {
        const serviceName = getServiceName(selectedService);
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'info@teravolta.com',
            subject: `New Specialized Inquiry: ${serviceName}`,
            html: `
                <h1>New Inquiry for ${serviceName}</h1>
                <p><strong>Name:</strong> ${formData.fullName}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Link:</strong> <a href="${linkData.magicLink}">Onboarding Link</a></p>
                <p><strong>Description:</strong> ${formData.projectDescription}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
      }

      if (!isMountedRef.current || !isClient) return;

      showToast(t('successTitle'), 'success');

      // Redirect to Onboarding
      router.push(`/onboard/${linkData.token}`);

    } catch (error) {
      console.error('Submission error:', error);
      if (isMountedRef.current && isClient) {
        showToast(t('errorTitle'), 'error');
      }
    } finally {
      if (isMountedRef.current && isClient) {
        setIsSubmitting(false);
      }
    }
  };

  const canSubmitForm = () => {
    return formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.projectDescription.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      !fieldErrors.email &&
      !fieldErrors.phone;
  }

  if (!isClient) {
    return <PageLoadingSkeleton title={t('loading')} />;
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <Header />

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004a90] mb-4">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-[#004a90] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#004a90]">
                {t('formTitle')}
              </h2>
              <a
                href="/quote"
                className="text-[#004a90] hover:text-[#003270] transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base"
              >
                {t('changeService')}
              </a>
            </div>

            {selectedService && (
              <div className="bg-[#004A90]/5 border border-[#004A90]/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-[#004a90] font-semibold text-sm md:text-base leading-relaxed">
                  {t('serviceSelected')} <span className="font-bold">{getServiceName(selectedService)}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} id="project-inquiry-form">
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base !bg-white"
                    placeholder={content[language]?.placeholders?.fullName || 'Tu nombre completo'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm md:text-base font-medium text-[#004a90]">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base transition-colors !bg-white ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder={content[language]?.placeholders?.email || 'tu@correo.com'}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1 animate-fade-in">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm md:text-base font-medium text-[#004a90]">
                      {t('phone')} *
                    </label>
                    <div className={`transition-colors rounded-lg overflow-hidden border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}>
                      <style jsx global>{phoneInputStyles}</style>
                      <PhoneInput
                        key={phoneKey}
                        international
                        country={country}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onCountryChange={(c) => setCountry(c as Country)}
                        labels={customLabels}
                        placeholder={content[language]?.placeholders?.phone || '+507 0000-0000'}
                        className="w-full text-base !bg-white"
                        maxLength={16}
                        countryCallingCodeEditable={false}
                        limitMaxLength={true}
                        smartCaret={false}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 animate-fade-in">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                    {t('company')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base !bg-white"
                    placeholder={content[language]?.placeholders?.company || 'Nombre de tu empresa'}
                  />
                </div>

                {/* Property Type Selector - Only for advocacy service */}
                {selectedService === 'advocacy' && (
                  <div>
                    <label className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('propertyType')} *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {[
                        { value: 'residential', label: t('residential'), icon: 'ri-home-line' },
                        { value: 'apartment', label: t('apartment'), icon: 'ri-building-line' },
                        { value: 'small-business', label: t('smallBusiness'), icon: 'ri-store-line' },
                        { value: 'office', label: t('office'), icon: 'ri-briefcase-line' },
                        { value: 'industrial', label: t('industrial'), icon: 'ri-building-4-line' },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all group ${formData.propertyType === option.value
                            ? 'border-[#004a90] bg-[#004a90]/5'
                            : 'border-gray-200 hover:border-[#004a90]'
                            }`}
                          onClick={() => setFormData(prev => ({ ...prev, propertyType: option.value }))}
                        >
                          <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#004a90]/5 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform">
                              <i className={`${option.icon} text-xl md:text-2xl text-[#004a90]`}></i>
                            </div>
                            <div className="text-xs md:text-sm font-medium text-[#004a90]">{option.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="projectDescription" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                    {t('projectDescription')} *
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base resize-none !bg-white"
                    placeholder={content[language]?.placeholders?.projectDescription || 'Describe tu proyecto en detalle...'}
                  ></textarea>
                  <div className="text-right text-xs md:text-sm text-gray-500 mt-1">
                    {formData.projectDescription.length}/500 {t('charactersLabel')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label htmlFor="address" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('address')} *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base !bg-white"
                      placeholder={content[language]?.placeholders?.address || 'Dirección del proyecto'}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base !bg-white"
                      placeholder={content[language]?.placeholders?.city || 'Ciudad'}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('stateProvince')} *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base !bg-white"
                      placeholder={content[language]?.placeholders?.state || 'Estado o provincia'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="timeline" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('timeline')}
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base pr-8 !bg-white"
                    >
                      <option value="">{t('selectTimeline')}</option>
                      <option value="inmediato">{t('immediate')}</option>
                      <option value="1-mes">{t('oneMonth')}</option>
                      <option value="2-3-meses">{t('twoThreeMonths')}</option>
                      <option value="mas-3-meses">{t('moreThanThreeMonths')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm md:text-base font-medium text-[#004a90] mb-2">
                      {t('budget')}
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A90] focus:border-[#004A90] text-sm md:text-base pr-8 !bg-white"
                    >
                      <option value="">{t('selectRange')}</option>
                      <option value="menos-5000">{t('lessThan5k')}</option>
                      <option value="5000-15000">{t('range5k15k')}</option>
                      <option value="15000-50000">{t('range15k50k')}</option>
                      <option value="mas-50000">{t('moreThan50k')}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!canSubmitForm() || isSubmitting}
                    className={`w-full py-4 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${canSubmitForm() && !isSubmitting
                      ? 'bg-[#C3D021] hover:bg-[#A8B91E] text-[#333333] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {t('submitting')}
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        {t('submitRequest')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Submit status handled by Toast */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function InquiryForm() {
  return (
    <Suspense fallback={<PageLoadingSkeleton title="Cargando formulario..." />}>
      <InquiryFormContent />
    </Suspense>
  );
}
