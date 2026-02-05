'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useLanguage } from '@/components/LanguageProvider';
import { QuoteFormData, isInspectionRequired } from '@/lib/schemas/quote-schema';
import { PropertyType } from '@/lib/schemas/constants';

interface EfficiencyFieldsProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
  propertyType?: PropertyType;
}

/**
 * Efficiency-specific form fields.
 * 
 * IMPORTANT per WIZ-02: Does NOT include device_option or connectivity.
 * These are collected AFTER inspection, not during quote submission.
 * 
 * Includes:
 * - Property size (optional)
 * - Operating hours (for commercial properties)
 * - Booking date/time (for inspection scheduling)
 * - Inspection requirement notice
 * - Optional inspection request checkbox for residential/apartment/small-business
 */
export function EfficiencyFields({
  register,
  errors,
  propertyType,
}: EfficiencyFieldsProps) {
  const { language } = useLanguage();
  
  const isCommercial = propertyType && isInspectionRequired(propertyType);
  
  const t = {
    propertySize: language === 'es' ? 'Tamaño de la propiedad (pies cuadrados)' : 'Property size (square feet)',
    selectSize: language === 'es' ? 'Selecciona el tamaño' : 'Select size',
    operatingHours: language === 'es' ? 'Horario de Operación' : 'Operating Hours',
    operatingHoursPlaceholder: language === 'es' ? 'ej. 9:00 AM - 5:00 PM' : 'e.g., 9:00 AM - 5:00 PM',
    bookingDate: language === 'es' ? 'Fecha de Inspección Preferida' : 'Preferred Inspection Date',
    bookingTime: language === 'es' ? 'Hora Preferida' : 'Preferred Time',
    inspectionRequired: language === 'es' 
      ? 'Este tipo de propiedad requiere una inspección técnica antes de la instalación.'
      : 'This property type requires a technical inspection before installation.',
    inspectionOptional: language === 'es'
      ? 'La inspección es opcional para propiedades residenciales.'
      : 'Inspection is optional for residential properties.',
    inspectionRequestLabel: language === 'es'
      ? 'Solicitar inspección técnica'
      : 'Request a technical inspection',
    inspectionRequestHelp: language === 'es'
      ? 'Marca esta opción si deseas que el equipo coordine una inspección.'
      : 'Check this if you want the team to schedule an inspection.',
  };

  return (
    <div className="space-y-6">
      {/* Property Size */}
      <div>
        <label className="block text-sm font-medium text-[#004a90] mb-2">
          {t.propertySize}
        </label>
        <select
          {...register('propertySize' as any)} // Cast needed for discriminated union
          className="w-full p-3 border border-gray-300 rounded-lg pr-8 text-sm md:text-base bg-white"
        >
          <option value="">{t.selectSize}</option>
          <option value="1000">&lt; 1,000 sq ft</option>
          <option value="3000">1,000 - 3,000 sq ft</option>
          <option value="5000">3,000 - 5,000 sq ft</option>
          <option value="10000">&gt; 5,000 sq ft</option>
        </select>
      </div>

      {/* Operating Hours - Only for commercial properties */}
      {isCommercial && (
        <div>
          <label className="block text-sm font-medium text-[#004a90] mb-2">
            {t.operatingHours}
          </label>
          <input
            type="text"
            {...register('operatingHours' as any)}
            placeholder={t.operatingHoursPlaceholder}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      )}

      {/* Inspection Scheduling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#004a90] mb-2">
            {t.bookingDate}
          </label>
          <input
            type="date"
            {...register('bookingDate' as any)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004a90] mb-2">
            {t.bookingTime}
          </label>
          <input
            type="time"
            {...register('bookingTime' as any)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Inspection Requirement Notice */}
      {propertyType && (
        <div className={`p-4 rounded-lg text-sm ${
          isCommercial 
            ? 'bg-blue-50 border border-blue-100 text-blue-800' 
            : 'bg-gray-50 border border-gray-100 text-gray-600'
        }`}>
          <i className={`${isCommercial ? 'ri-information-line' : 'ri-lightbulb-line'} mr-2`}></i>
          {isCommercial ? t.inspectionRequired : t.inspectionOptional}
        </div>
      )}

      {/* Optional Inspection Request (residential/apartment/small-business) */}
      {propertyType && !isCommercial && (
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            {...register('inspectionRequested' as any)}
            className="mt-1"
          />
          <span>
            <span className="font-medium text-[#004a90]">{t.inspectionRequestLabel}</span>
            <span className="block text-xs text-gray-500">{t.inspectionRequestHelp}</span>
          </span>
        </label>
      )}

      {/* 
        NOTE: device_option and connectivity fields INTENTIONALLY OMITTED.
        Per WIZ-02: These are collected after inspection, not during quote submission.
        Customers don't know what equipment they need until technician assesses the site.
      */}
    </div>
  );
}
