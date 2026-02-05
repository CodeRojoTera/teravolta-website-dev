'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useState, useRef } from 'react';
import { useLanguage } from '../../components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { uploadDocument } from '@/lib/documentUtils';
import { v4 as uuidv4 } from 'uuid';
import 'react-phone-number-input/style.css';
import dynamic from 'next/dynamic';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import type { Country } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en.json';
import esLabels from 'react-phone-number-input/locale/es.json';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
});

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-[#004a90] group-hover:text-[#003870] transition-colors">{question}</span>
        <span className="ml-4 flex h-8 w-8 items-center justify-center text-2xl font-light text-[#004a90] group-hover:text-[#003870] transition-colors">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-gray-600 leading-relaxed text-base">{answer}</p>
      </div>
    </div>
  );
}

// Helper to format bytes
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ContactPage() {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clientType, setClientType] = useState<'residential' | 'business'>('residential');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [phone, setPhone] = useState<string | undefined>();
  const [phoneKey, setPhoneKey] = useState(0);
  const [country, setCountry] = useState<Country>('PA');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddFiles(selectedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    setUploadError('');
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 5;
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    const validFiles: File[] = [];

    if (files.length + newFiles.length > MAX_FILES) {
      setUploadError(language === 'es' ? `Máximo ${MAX_FILES} archivos permitidos.` : `Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    for (const file of newFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError(language === 'es'
          ? `Tipo de archivo no permitido: ${file.name}`
          : `File type not allowed: ${file.name}`);
        return;
      }
      if (file.size > MAX_SIZE) {
        setUploadError(language === 'es'
          ? `El archivo es demasiado grande (Máx 10MB): ${file.name}`
          : `File is too large (Max 10MB): ${file.name}`);
        return;
      }
      validFiles.push(file);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (!value) {
      setPhone(undefined);
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

    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // 1. Generate ID first
      const inquiryId = uuidv4();

      // 2. Upload Files if any
      const attachmentsMeta = [];
      if (files.length > 0) {
        for (const file of files) {
          // Fake progress start
          setUploadProgress((prev) => ({ ...prev, [file.name]: 10 }));

          const result = await uploadDocument({
            file,
            entityType: 'inquiries',
            entityId: inquiryId,
            uploadedBy: 'public_contact_form', // or system
          });

          // Fake progress end
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

          if (result.success && result.document) {
            attachmentsMeta.push({
              name: result.document.name,
              storagePath: result.document.storagePath,
              downloadURL: result.document.downloadURL,
              contentType: result.document.contentType,
              size: result.document.size,
              uploadedAt: new Date().toISOString()
            });
          } else {
            console.error("Failed to upload file:", file.name, result.error);
            // Handle error? Continue for now.
          }
        }
      }

      // 3. Save to Supabase
      console.log("Saving to Supabase...");
      const { error } = await supabase.from('inquiries').insert({
        id: inquiryId,
        client_type: clientType,
        full_name: formData.name,
        email: formData.email,
        company_name: clientType === 'business' ? formData.company : null,
        phone_number: phone || null,
        subject: formData.subject,
        message: formData.message,
        attachments: attachmentsMeta,
        status: 'new',
        language: language,
        source: 'contact-page'
        // created_at is default now()
      });

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
      setPhone(undefined);
      setFiles([]);
      setClientType('residential');

      // 4. Send Emails (New Logic to Restore Zoho/Email Workflow)
      // Send notification to Admin
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'info@teravolta.com',
            subject: `New Contact Inquiry: ${formData.subject}`,
            html: `
              <h1>New Contact Inquiry</h1>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Type:</strong> ${clientType}</p>
              <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${formData.message}</p>
              <p><strong>Attachments:</strong> ${files.length}</p>
            `,
          }),
        });

        // Send confirmation to Client
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: language === 'en' ? 'We received your message - TeraVolta' : 'Recibimos tu mensaje - TeraVolta',
            html: language === 'en' ? `
              <h1>Thank you for contacting us, ${formData.name}!</h1>
              <p>We have received your message regarding "<strong>${formData.subject}</strong>".</p>
              <p>Our team will review your inquiry and get back to you shortly.</p>
              <br/>
              <p><strong>Your Message:</strong></p>
              <p><em>${formData.message}</em></p>
              <br/>
              <p>Best regards,</p>
              <p>The TeraVolta Team</p>
            ` : `
              <h1>¡Gracias por contactarnos, ${formData.name}!</h1>
              <p>Hemos recibido tu mensaje sobre "<strong>${formData.subject}</strong>".</p>
              <p>Nuestro equipo revisará tu consulta y te responderá a la brevedad.</p>
              <br/>
              <p><strong>Tu Mensaje:</strong></p>
              <p><em>${formData.message}</em></p>
              <br/>
              <p>Saludos,</p>
              <p>El Equipo TeraVolta</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // We don't block success state here, as DB save was successful
      }

    } catch (error) {
      console.error("Error submitting form: ", error);
      console.log("Detailed error:", JSON.stringify(error));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    en: {
      heroTitle: "Get in Touch",
      heroSubtitle: "Ready to start your energy optimization journey? Contact our team of experts for a consultation.",
      formTitle: "Send us a Message",
      formSubtitle: "Fill out the form below and we'll get back to you within 24 hours.",
      clientTypeLabel: "I am a...",
      typeResidential: "Residential Client",
      typeBusiness: "Business / Company",
      fullName: "Full Name",
      emailAddress: "Email Address",
      companyName: "Company Name",
      phoneNumber: "Phone Number",
      subject: "Subject",
      message: "Message",
      attachmentsLabel: "Attachments / Upload files",
      dropText: "Drag & drop files here, or click to select",
      uploadHint: "Max 5 files (PDF, JPG, PNG, DOCX, XLSX). Max 10MB each.",
      submitButton: "Send Message",
      sending: "Sending...",
      successMessage: "Thank you! Your message has been sent successfully. We'll be in touch properly.",
      errorMessage: "Something went wrong. Please try again or email us directly.",
      contactInfo: "Contact Information",
      contactSubtitle: "Reach out to us directly via email or phone.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      hoursLabel: "Business Hours",
      hoursValue: "Monday - Friday: 9:00 AM - 6:00 PM EST",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Quick answers to common questions about our services and process.",
      requiredField: "Please fill out this field.",
      subjectPlaceholder: "Select a subject",
      subjectGeneral: "General Inquiry",
      subjectSupport: "Support",
      subjectSales: "Sales",
      subjectOther: "Other"
    },
    es: {
      heroTitle: "Contáctanos",
      heroSubtitle: "¿Listo para comenzar tu viaje de optimización energética? Contacta a nuestro equipo de expertos.",
      formTitle: "Envíanos un Mensaje",
      formSubtitle: "Completa el formulario y te responderemos en 24 horas.",
      clientTypeLabel: "Soy un...",
      typeResidential: "Cliente Residencial",
      typeBusiness: "Empresa / Negocio",
      fullName: "Nombre Completo",
      emailAddress: "Correo Electrónico",
      companyName: "Nombre de la Empresa",
      phoneNumber: "Número de Teléfono",
      subject: "Asunto",
      message: "Mensaje",
      attachmentsLabel: "Adjuntos / Subir archivos",
      dropText: "Arrastra y suelta archivos aquí, o haz clic para seleccionar",
      uploadHint: "Máx 5 archivos (PDF, JPG, PNG, DOCX, XLSX). Máx 10MB c/u.",
      submitButton: "Enviar Mensaje",
      sending: "Enviando...",
      successMessage: "¡Gracias! Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto pronto.",
      errorMessage: "Algo salió mal. Por favor intenta de nuevo o escríbenos directamente.",
      contactInfo: "Información de Contacto",
      contactSubtitle: "Contáctanos directamente por correo o teléfono.",
      emailLabel: "Correo",
      phoneLabel: "Teléfono",
      hoursLabel: "Horario de Atención",
      hoursValue: "Lunes - Viernes: 9:00 AM - 6:00 PM EST",
      faqTitle: "Preguntas Frecuentes",
      faqSubtitle: "Respuestas rápidas a preguntas comunes sobre nuestros servicios.",
      requiredField: "Por favor, complete este campo.",
      subjectPlaceholder: "Seleccione un asunto",
      subjectGeneral: "Consulta General",
      subjectSupport: "Soporte",
      subjectSales: "Ventas",
      subjectOther: "Otro"
    }
  };

  const t = language === 'en' ? content.en : content.es;



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
        display: flex;
        align-items: center;
        margin-right: 0.5rem;
    }
    .PhoneInputCountrySelect {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        opacity: 0;
        cursor: pointer;
    }
    .PhoneInputCountryIcon {
        width: 1.5em;
        height: 1.5em;
        box-shadow: none !important;
        background-color: transparent !important;
        border: none !important;
    }
    .PhoneInputCountrySelectArrow {
        width: 0.5em;
        height: 0.5em;
        margin-left: 0.5em;
        border-style: solid;
        border-color: #6b7280; /* gray-500 */
        border-width: 0 1px 1px 0;
        transform: rotate(45deg);
    }
  `;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />
      <Header />

      {/* Hero Section */}
      <section className="bg-[#004a90] text-white py-20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        {/* Texture Overlay - Large Continuous Background */}
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

        <div className="max-w-7xl 3xl:max-w-8xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-fluid-h1 font-bold mb-6">{t.heroTitle}</h1>
          <p className="text-xl md:text-2xl 3xl:text-3xl max-w-3xl 3xl:max-w-4xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-fluid-section bg-white">
        <div className="max-w-7xl 3xl:max-w-9xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 3xl:gap-20">

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-fluid-card shadow-sm border border-gray-100">
              <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t.formTitle}</h2>
              <p className="text-gray-600 text-fluid-body mb-8">
                {t.formSubtitle}
              </p>

              {submitStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl animate-fade-in text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2">{language === 'en' ? 'Sent!' : '¡Enviado!'}</h3>
                  <p>{t.successMessage}</p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitStatus('')}
                  >
                    {language === 'en' ? 'Send another message' : 'Enviar otro mensaje'}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Client Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.clientTypeLabel}</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${clientType === 'residential' ? 'border-[#004a90] bg-blue-50 text-[#004a90]' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="clientType"
                          value="residential"
                          checked={clientType === 'residential'}
                          onChange={() => setClientType('residential')}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <i className="ri-home-4-line text-xl"></i>
                          <span className="font-medium">{t.typeResidential}</span>
                        </div>
                      </label>
                      <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${clientType === 'business' ? 'border-[#004a90] bg-blue-50 text-[#004a90]' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="clientType"
                          value="business"
                          checked={clientType === 'business'}
                          onChange={() => setClientType('business')}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <i className="ri-building-4-line text-xl"></i>
                          <span className="font-medium">{t.typeBusiness}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{t.fullName}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.requiredField)}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        className="w-full px-4 py-3 rounded-lg !bg-white border border-gray-200 focus:border-[#004a90] focus:ring-0 transition-colors outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{t.emailAddress}</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.requiredField)}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        className={`w-full px-4 py-3 rounded-lg !bg-white border focus:border-[#004a90] focus:ring-0 transition-colors outline-none ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1 animate-fade-in">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Company & Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Conditional Company Field */}
                    {clientType === 'business' && (
                      <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-[#004a90] mb-2">{t.companyName} *</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required={clientType === 'business'}
                          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.requiredField)}
                          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                          className="w-full px-4 py-3 rounded-lg !bg-white border border-gray-200 focus:border-[#004a90] focus:ring-0 transition-colors outline-none"
                        />
                      </div>
                    )}

                    {/* International Phone Input */}
                    <div className={clientType === 'residential' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{t.phoneNumber}</label>
                      <div className={`transition-all rounded-lg overflow-hidden border ${fieldErrors.phone ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-200 focus-within:ring-[#004a90]'
                        }`}>
                        <PhoneInput
                          key={phoneKey}
                          international
                          country={country}
                          placeholder={t.phoneNumber}
                          value={phone}
                          onChange={handlePhoneChange}
                          onCountryChange={(c) => setCountry(c as Country)}
                          labels={customLabels}
                          className="w-full !bg-white"
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

                  <div className="relative">
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.subject}</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      onInvalid={(e) => (e.target as HTMLSelectElement).setCustomValidity(t.requiredField)}
                      onInput={(e) => (e.target as HTMLSelectElement).setCustomValidity('')}
                      className="w-full px-4 py-3 rounded-lg !bg-white border border-gray-200 focus:border-[#004a90] focus:ring-0 transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled>{t.subjectPlaceholder}</option>
                      <option value="General Inquiry">{t.subjectGeneral}</option>
                      <option value="Support">{t.subjectSupport}</option>
                      <option value="Sales">{t.subjectSales}</option>
                      <option value="Other">{t.subjectOther}</option>
                    </select>
                    {/* select chevron arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-[10%] pointer-events-none text-gray-500">
                      <i className="ri-arrow-down-s-line text-xl"></i>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.message}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity(t.requiredField)}
                      onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg !bg-white border border-gray-200 focus:border-[#004a90] focus:ring-0 transition-colors outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-[#004a90] mb-2">{t.attachmentsLabel}</label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#004a90] hover:bg-blue-50 transition-all cursor-pointer"
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#004a90]', 'bg-blue-50'); }}
                      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#004a90]', 'bg-blue-50'); }}
                      onDrop={(e) => {
                        e.currentTarget.classList.remove('border-[#004a90]', 'bg-blue-50');
                        handleDrop(e);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="ri-upload-cloud-2-line text-3xl text-gray-400 mb-2"></i>
                      <p className="text-[#004a90] font-medium">{t.dropText}</p>
                      <p className="text-sm text-gray-500 mt-1">{t.uploadHint}</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf, .jpg, .jpeg, .png, .docx, .xlsx"
                      />
                    </div>
                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}

                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <i className="ri-file-line text-gray-500"></i>
                                <div className="truncate">
                                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                disabled={isSubmitting}
                              >
                                <i className="ri-close-circle-line text-xl"></i>
                              </button>
                            </div>

                            {/* Upload Progress Bar if submitting */}
                            {isSubmitting && uploadProgress[file.name] !== undefined && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-medium text-gray-600">
                                  <span>{uploadProgress[file.name] === 100 ? (language === 'es' ? 'Completado' : 'Subiendo...') : (language === 'es' ? 'Subiendo...' : 'Uploading...')}</span>
                                  <span>{Math.round(uploadProgress[file.name])}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-[#004A90] h-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress[file.name]}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {submitStatus === 'error' && (
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg text-sm">
                      {t.errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#c3d021] text-[#194271] hover:bg-[#b0bc1d] font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.sending}
                      </span>
                    ) : (
                      t.submitButton
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information (Updated: No Map/Address) */}
            {/* Contact Information & FAQ Column */}
            <div className="space-y-12">

              {/* Contact INFO */}
              <div>
                <h2 className="text-fluid-h2 font-bold text-[#004a90] mb-6">{t.contactInfo}</h2>
                <p className="text-gray-600 text-fluid-body mb-8">
                  {t.contactSubtitle}
                </p>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#194271] rounded-full flex items-center justify-center text-white text-2xl shadow-sm">
                      <i className="ri-mail-line"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-[#194271] text-lg">{t.emailLabel}</h3>
                      <p className="text-gray-600">info@teravolta.com</p>
                      <p className="text-gray-600">support@teravolta.com</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#c3d021] rounded-full flex items-center justify-center text-[#194271] text-2xl shadow-sm">
                      <i className="ri-phone-line"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-[#194271] text-lg">{t.phoneLabel}</h3>
                      <p className="text-gray-600">+507 836-5555</p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#194271] rounded-full flex items-center justify-center text-white text-2xl shadow-sm">
                      <i className="ri-time-line"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-[#194271] text-lg">{t.hoursLabel}</h3>
                      <p className="text-gray-600">{t.hoursValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section (Stacked) */}
              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-[#004a90] mb-6">{t.faqTitle}</h2>
                <div className="space-y-0">
                  {language === 'en' ? (
                    <>
                      <FAQItem
                        question="How long does an installation usually take?"
                        answer="Residential installations typically take 1-3 days depending on the system size. Commercial projects may vary from a week to several weeks."
                      />
                      <FAQItem
                        question="Do you offer financing options?"
                        answer="Yes, we partner with major local banks to offer attractive financing rates for green energy projects."
                      />
                      <FAQItem
                        question="What maintenance is required?"
                        answer="Solar panels generally require very little maintenance. We recommend a cleaning and inspection once a year to ensure optimal performance."
                      />
                      <FAQItem
                        question="Is the initial consultation free?"
                        answer="Absolutely! Our initial assessment and quote are completely free and come with no obligation."
                      />
                    </>
                  ) : (
                    <>
                      <FAQItem
                        question="¿Cuánto tiempo toma una instalación?"
                        answer="Las instalaciones residenciales típicamente toman 1-3 días. Proyectos comerciales pueden variar desde una semana hasta varias semanas."
                      />
                      <FAQItem
                        question="¿Ofrecen opciones de financiamiento?"
                        answer="Sí, tenemos alianzas con los principales bancos locales para ofrecer tasas atractivas para proyectos de energía verde."
                      />
                      <FAQItem
                        question="¿Qué mantenimiento se requiere?"
                        answer="Los paneles solares requieren muy poco mantenimiento. Recomendamos una limpieza e inspección anual para asegurar un rendimiento óptimo."
                      />
                      <FAQItem
                        question="¿La consulta inicial es gratuita?"
                        answer="¡Por supuesto! Nuestra evaluación inicial y cotización son completamente gratuitas y sin compromiso."
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
