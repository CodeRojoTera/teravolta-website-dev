'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useLanguage } from '@/components/LanguageProvider';
import { QuoteFormData } from '@/lib/schemas/quote-schema';

interface AdvocacyFieldsProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
}

/**
 * Advocacy-specific form fields.
 * Per ADVO-11: Requires claim_type, distributor_company, claim_amount, incident_date, damage_description.
 * 
 * Hides: property_size, device_option, connectivity, booking, bills, phases, timeline, budget, projectDescription
 */
export function AdvocacyFields({
  register,
  errors,
}: AdvocacyFieldsProps) {
  const { language } = useLanguage();
  
  const t = {
    // Claim-specific fields (per ADVO-11)
    claimType: language === 'es' ? 'Tipo de Reclamo' : 'Claim Type',
    claimTypePlaceholder: language === 'es' ? 'ej. Sobrecargo, Daño por apagón' : 'e.g., Overcharge, Outage damage',
    distributorCompany: language === 'es' ? 'Compañía Distribuidora' : 'Distributor Company',
    distributorPlaceholder: language === 'es' ? 'ej. Naturgy, ENSA' : 'e.g., Naturgy, ENSA',
    claimAmount: language === 'es' ? 'Monto del Reclamo (Estimado)' : 'Claim Amount (Estimated)',
    claimAmountPlaceholder: language === 'es' ? 'ej. $500' : 'e.g., $500',
    incidentDate: language === 'es' ? 'Fecha del Incidente' : 'Incident Date',
    damageDescription: language === 'es' ? 'Descripción del Daño' : 'Damage Description',
    damagePlaceholder: language === 'es' 
      ? 'Describe los equipos dañados o pérdidas...'
      : 'Describe damaged equipment or losses...',
  };

  return (
    <div className="space-y-4">
      {/* Claim-Specific Section - ADVO-11 */}
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium text-[#004a90] mb-4">
          {language === 'es' ? 'Información del Reclamo' : 'Claim Information'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Claim Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.claimType} *
            </label>
            <input
              type="text"
              {...register('claimType' as any)}
              placeholder={t.claimTypePlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {(errors as any).claimType && (
              <span className="text-red-500 text-sm mt-1 block">
                {(errors as any).claimType.message}
              </span>
            )}
          </div>

          {/* Distributor Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.distributorCompany} *
            </label>
            <input
              type="text"
              {...register('distributorCompany' as any)}
              placeholder={t.distributorPlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {(errors as any).distributorCompany && (
              <span className="text-red-500 text-sm mt-1 block">
                {(errors as any).distributorCompany.message}
              </span>
            )}
          </div>

          {/* Claim Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.claimAmount} *
            </label>
            <input
              type="text"
              {...register('claimAmount' as any)}
              placeholder={t.claimAmountPlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {(errors as any).claimAmount && (
              <span className="text-red-500 text-sm mt-1 block">
                {(errors as any).claimAmount.message}
              </span>
            )}
          </div>

          {/* Incident Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.incidentDate} *
            </label>
            <input
              type="date"
              {...register('incidentDate' as any)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {(errors as any).incidentDate && (
              <span className="text-red-500 text-sm mt-1 block">
                {(errors as any).incidentDate.message}
              </span>
            )}
          </div>
        </div>

        {/* Damage Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.damageDescription} *
          </label>
          <textarea
            {...register('damageDescription' as any)}
            placeholder={t.damagePlaceholder}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          />
          {(errors as any).damageDescription && (
            <span className="text-red-500 text-sm mt-1 block">
              {(errors as any).damageDescription.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
