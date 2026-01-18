'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useState, useRef } from 'react';
import { useLanguage } from '../../components/LanguageProvider';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      return;
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
      setPhone(truncated);
      setPhoneKey(prev => prev + 1); // Force re-render to sync DOM
      return;
    }

    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // 1. Generate ID first
      const newDocRef = doc(collection(db, 'inquiries'));
      const inquiryId = newDocRef.id;

      // 2. Upload Files if any
      const attachmentsMeta = [];
      if (files.length > 0) {
        for (const file of files) {
          const storagePath = `inquiries/${inquiryId}/${file.name}`;
          const fileRef = ref(storage, storagePath);

          // Upload with explicit content type AND content disposition
          // This ensures the browser downloads it with the correct name and extension (e.g. .xlsx)
          const metadata = {
            contentType: file.type,
            contentDisposition: `attachment; filename="${file.name}"`
          };

          const uploadPromise = uploadBytes(fileRef, file, metadata);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timed out')), 30000));

          await Promise.race([uploadPromise, timeoutPromise]);

          attachmentsMeta.push({
            fileName: file.name,
            storagePath: storagePath,
            downloadURL: "", // Still empty as public read is restricted
            contentType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });
        }
      }

      // 3. Save to Firestore
      console.log("Saving to Firestore...");
      await setDoc(newDocRef, {
        clientType: clientType,
        fullName: formData.name,
        email: formData.email,
        companyName: clientType === 'business' ? formData.company : null,
        phoneNumber: phone || null, // Stores E.164 from React Phone Input
        subject: formData.subject,
        message: formData.message,
        attachments: attachmentsMeta,
        status: 'new',
        createdAt: serverTimestamp(),
        language: language,
        source: 'contact-page'
      });

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
                    <div>
                      <label className="block text-sm font-medium text-[#004a90] mb-2">{t.emailAddress}</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.requiredField)}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        className="w-full px-4 py-3 rounded-lg !bg-white border border-gray-200 focus:border-[#004a90] focus:ring-0 transition-colors outline-none"
                      />
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
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                            >
                              <i className="ri-close-circle-line text-xl"></i>
                            </button>
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
