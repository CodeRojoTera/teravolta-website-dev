'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useLanguage } from '@/components/LanguageProvider';
import { QuoteFormData } from '@/lib/schemas/quote-schema';

interface ConsultingFieldsProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
}

/**
 * Consulting-specific form fields.
 * Per CONS-13: Shows timeline, budget, project_description.
 * Per CONS-14: timeline and budget are required.
 * 
 * Hides: property_size, device_option, connectivity, booking, bills
 * Per CONTEXT.md Decision 2: Phases are admin-only during pricing step.
 */
export function ConsultingFields({
  register,
  errors,
}: ConsultingFieldsProps) {
  const { language } = useLanguage();
  
  const t = {
    timeline: language === 'es' ? 'Cronograma Estimado' : 'Estimated Timeline',
    timelinePlaceholder: language === 'es' ? 'ej. 3-6 meses' : 'e.g., 3-6 months',
    timelineRequired: language === 'es' ? 'El cronograma es requerido' : 'Timeline is required',
    budget: language === 'es' ? 'Presupuesto' : 'Budget',
    budgetPlaceholder: language === 'es' ? 'ej. $5,000 - $15,000' : 'e.g., $5,000 - $15,000',
    budgetRequired: language === 'es' ? 'El presupuesto es requerido' : 'Budget is required',
    description: language === 'es' ? 'Descripción del Proyecto' : 'Project Description',
    descriptionPlaceholder: language === 'es' 
      ? 'Describe tus objetivos y necesidades de consultoría...'
      : 'Describe your consulting goals and needs...',
    descriptionRequired: language === 'es' ? 'La descripción es requerida' : 'Description is required',
  };

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div>
        <label className="block text-sm font-medium text-[#004a90] mb-2">
          {t.timeline} *
        </label>
        <input
          type="text"
          {...register('timeline' as any)}
          placeholder={t.timelinePlaceholder}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {(errors as any).timeline && (
          <span className="text-red-500 text-sm mt-1 block">
            {(errors as any).timeline.message || t.timelineRequired}
          </span>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-[#004a90] mb-2">
          {t.budget} *
        </label>
        <input
          type="text"
          {...register('budget' as any)}
          placeholder={t.budgetPlaceholder}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {(errors as any).budget && (
          <span className="text-red-500 text-sm mt-1 block">
            {(errors as any).budget.message || t.budgetRequired}
          </span>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-[#004a90] mb-2">
          {t.description} *
        </label>
        <textarea
          {...register('projectDescription' as any)}
          placeholder={t.descriptionPlaceholder}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
        />
        {(errors as any).projectDescription && (
          <span className="text-red-500 text-sm mt-1 block">
            {(errors as any).projectDescription.message || t.descriptionRequired}
          </span>
        )}
      </div>

      {/* 
        NOTE: Phases are NOT collected here.
        Per CONTEXT.md Decision 2: Phase collection is admin-only during pricing step.
      */}
    </div>
  );
}
