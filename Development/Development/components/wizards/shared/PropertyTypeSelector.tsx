'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useLanguage } from '@/components/LanguageProvider';
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, PropertyType } from '@/lib/schemas/constants';
import { QuoteFormData } from '@/lib/schemas/quote-schema';

interface PropertyTypeSelectorProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
  setValue: UseFormSetValue<QuoteFormData>;
  value?: PropertyType;
  required?: boolean;
}

/**
 * Shared property type selector used by all 4 quote/project wizards.
 * Per WIZ-01: All wizards use same 6 property type options.
 * 
 * Uses click-to-select card UI matching existing app patterns.
 */
export function PropertyTypeSelector({
  register,
  errors,
  setValue,
  value,
  required = true,
}: PropertyTypeSelectorProps) {
  const { language } = useLanguage();
  
  const t = {
    label: language === 'es' ? 'Tipo de Propiedad' : 'Property Type',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#004a90] mb-2">
        {t.label} {required && '*'}
      </label>
      
      {/* Hidden input for form registration */}
      <input type="hidden" {...register('propertyType')} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {PROPERTY_TYPES.map((type) => {
          const labels = PROPERTY_TYPE_LABELS[type];
          const isSelected = value === type;
          
          return (
            <div
              key={type}
              onClick={() => setValue('propertyType', type, { shouldValidate: true })}
              className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all group ${
                isSelected
                  ? 'border-[#004a90] bg-[#004a90]/5'
                  : 'border-gray-200 hover:border-[#004a90]'
              }`}
            >
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#004a90]/5 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <i className={`${labels.icon} text-xl md:text-2xl text-[#004a90]`}></i>
                </div>
                <div className="text-xs md:text-sm font-medium text-[#004a90]">
                  {language === 'es' ? labels.es : labels.en}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {errors.propertyType && (
        <span className="text-red-500 text-sm mt-1 block">
          {errors.propertyType.message as string}
        </span>
      )}
    </div>
  );
}
