# Phase 2: Quote Submission & Wizard Unification - Research

**Researched:** 2026-02-01
**Domain:** Multi-step wizard forms with service-specific conditional validation
**Confidence:** HIGH

## Summary

This phase requires implementing conditional multi-step forms with service-specific field filtering and validation. The core challenge is unifying 4 different quote/project creation wizards to use consistent data structures while showing/hiding fields based on service type (efficiency, consulting, advocacy).

The standard approach is **React Hook Form + Zod with discriminated unions** for type-safe conditional validation. This pattern provides compile-time type safety, runtime validation, and automatic TypeScript inference from schemas. The architecture uses:
- Discriminated union schemas (Zod) keyed on `service` field
- Conditional rendering based on form state (not just TypeScript types)
- Shared form components with service-specific props
- Single source of truth for property type options and field configurations

**Primary recommendation:** Use Zod discriminated unions with React Hook Form's zodResolver for service-specific validation and conditional field rendering.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.66.0 | Form state management | Industry standard for performant React forms, minimal re-renders, built-in validation |
| zod | 3.24.2 or 4.0.1 | Schema validation | TypeScript-first validation with type inference, discriminated unions, refinements |
| @hookform/resolvers | Latest | RHF + Zod integration | Official adapter for external validators, zodResolver for seamless integration |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react (existing) | 19.0.0 | UI framework | Client components for form interactivity |
| next.js (existing) | 15.3.2 | Framework | App Router patterns, server/client boundaries |
| typescript (existing) | 5.x | Type safety | Compile-time validation of discriminated unions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod | Yup, Joi | Zod has superior TypeScript integration and discriminated union support |
| React Hook Form | Formik | RHF is more performant (uncontrolled inputs), smaller bundle |
| Discriminated unions | Runtime conditionals only | Type safety lost, more brittle refactoring |

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

## Architecture Patterns

### Recommended Project Structure
```
Development/
├── components/
│   ├── wizards/              # Wizard-specific components
│   │   ├── shared/           # Shared across all wizards
│   │   │   ├── PropertyTypeSelector.tsx
│   │   │   ├── EfficiencyFields.tsx
│   │   │   ├── ConsultingFields.tsx
│   │   │   └── AdvocacyFields.tsx
│   │   ├── PublicQuoteWizard.tsx
│   │   ├── CustomerRequestWizard.tsx
│   │   └── ManualProjectWizard.tsx (existing - refactor)
│   └── DocumentManager.tsx    # Extend for service filtering
├── lib/
│   ├── schemas/              # Zod validation schemas
│   │   ├── quote-schema.ts   # Discriminated union by service
│   │   └── constants.ts      # Shared field options
│   └── types.ts              # Existing, enhance with inferred types
```

### Pattern 1: Discriminated Union Schema
**What:** A Zod schema that validates different field sets based on a discriminator key (`service`)
**When to use:** When form structure varies by a known type/category field
**Example:**
```typescript
// Source: Context7 /colinhacks/zod + project requirements
import { z } from 'zod';

// Shared base fields (all services)
const baseQuoteSchema = z.object({
  clientName: z.string().min(1, 'Name required'),
  clientEmail: z.string().email('Invalid email'),
  clientPhone: z.string().min(1, 'Phone required'),
  propertyType: z.enum([
    'residential', 
    'apartment', 
    'small-business', 
    'hotel', 
    'building', 
    'industrial'
  ]),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  message: z.string().optional(),
});

// Service-specific schemas
const efficiencyQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('efficiency'),
  propertySize: z.string().optional(),
  // NOTE: device_option and connectivity REMOVED per WIZ-02
  // These are collected AFTER inspection, not during quote submission
});

const consultingQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('consulting'),
  timeline: z.string().min(1, 'Timeline required for consulting'),
  budget: z.string().min(1, 'Budget required for consulting'),
  projectDescription: z.string().min(1, 'Description required'),
  // propertySize NOT collected for consulting per requirements
});

const advocacyQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('advocacy'),
  timeline: z.string().min(1, 'Timeline required for advocacy'),
  budget: z.string().min(1, 'Budget required for advocacy'),
  projectDescription: z.string().min(1, 'Description required'),
  // Advocacy-specific fields (if any in future)
});

// Discriminated union
export const quoteSchema = z.discriminatedUnion('service', [
  efficiencyQuoteSchema,
  consultingQuoteSchema,
  advocacyQuoteSchema,
]);

// Type inference
export type QuoteFormData = z.infer<typeof quoteSchema>;
// Results in:
// { service: 'efficiency'; propertySize?: string; ... } |
// { service: 'consulting'; timeline: string; budget: string; ... } |
// { service: 'advocacy'; timeline: string; budget: string; ... }
```

### Pattern 2: Conditional Field Rendering with Type Guards
**What:** Render fields conditionally based on watched form state, with TypeScript narrowing
**When to use:** Multi-step or service-specific forms
**Example:**
```typescript
// Source: Context7 /react-hook-form/react-hook-form + TypeScript patterns
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function QuoteWizard() {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      service: 'efficiency',
    },
  });

  const service = watch('service');

  const onSubmit = (data: QuoteFormData) => {
    // TypeScript knows data structure based on discriminated union
    if (data.service === 'efficiency') {
      // data.propertySize is accessible
      console.log(data.propertySize);
    } else {
      // data.timeline, data.budget are accessible
      console.log(data.timeline, data.budget);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Service selector */}
      <select {...register('service')}>
        <option value="efficiency">Energy Efficiency</option>
        <option value="consulting">Consulting</option>
        <option value="advocacy">Advocacy</option>
      </select>

      {/* Common fields */}
      <input {...register('clientName')} placeholder="Name" />
      {errors.clientName && <span>{errors.clientName.message}</span>}

      {/* Service-specific fields */}
      {service === 'efficiency' && (
        <>
          <input {...register('propertySize')} placeholder="Property Size" />
          {/* Bill upload via DocumentManager - filter category to 'bill' */}
        </>
      )}

      {(service === 'consulting' || service === 'advocacy') && (
        <>
          <input {...register('timeline')} placeholder="Timeline" />
          {errors.timeline && <span>{errors.timeline.message}</span>}
          
          <input {...register('budget')} placeholder="Budget" />
          {errors.budget && <span>{errors.budget.message}</span>}
          
          <textarea {...register('projectDescription')} placeholder="Description" />
          {errors.projectDescription && <span>{errors.projectDescription.message}</span>}
        </>
      )}

      <button type="submit">Submit Quote</button>
    </form>
  );
}
```

### Pattern 3: Service-Filtered Document Categories
**What:** Pass service type to DocumentManager to filter allowed document categories
**When to use:** Document upload components that vary by context
**Example:**
```typescript
// Source: Project codebase + requirements SVC-01
const SERVICE_DOCUMENT_CATEGORIES = {
  efficiency: ['bill', 'invoice', 'meter_reading', 'site_plan', 'other'],
  consulting: ['contract', 'invoice', 'report', 'deliverable', 'payment_proof', 'other'],
  advocacy: ['contract', 'invoice', 'report', 'deliverable', 'payment_proof', 'other'],
} as const;

interface DocumentManagerProps {
  entityType: DocumentEntityType;
  entityId: string;
  serviceType: ServiceType; // NEW: Add service context
  allowedCategories?: string[]; // Keep for override flexibility
}

function DocumentManager({ entityType, entityId, serviceType, allowedCategories }: DocumentManagerProps) {
  const categories = allowedCategories || SERVICE_DOCUMENT_CATEGORIES[serviceType];
  
  return (
    <div>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{t.categories[cat]}</option>
        ))}
      </select>
      {/* ... rest of component */}
    </div>
  );
}
```

### Pattern 4: Shared Constants for Field Options
**What:** Single source of truth for dropdown/select options used across wizards
**When to use:** Prevent option drift between components
**Example:**
```typescript
// lib/schemas/constants.ts
export const PROPERTY_TYPES = [
  'residential',
  'apartment', 
  'small-business',
  'hotel',
  'building',
  'industrial',
] as const;

export const PROPERTY_TYPE_LABELS = {
  residential: { en: 'Residential', es: 'Residencial' },
  apartment: { en: 'Apartment', es: 'Apartamento' },
  'small-business': { en: 'Small Business', es: 'Pequeña Empresa' },
  hotel: { en: 'Hotel', es: 'Hotel' },
  building: { en: 'Commercial Building', es: 'Edificio Comercial' },
  industrial: { en: 'Industrial', es: 'Industrial' },
} as const;

// Use in schema
export const propertyTypeSchema = z.enum(PROPERTY_TYPES);

// Use in component
function PropertyTypeSelector({ register, language }: Props) {
  return (
    <select {...register('propertyType')}>
      {PROPERTY_TYPES.map(type => (
        <option key={type} value={type}>
          {PROPERTY_TYPE_LABELS[type][language]}
        </option>
      ))}
    </select>
  );
}
```

### Anti-Patterns to Avoid
- **String-based validation instead of schemas:** Leads to runtime errors, no TypeScript help
- **Duplicating field definitions across wizards:** Creates maintenance burden and drift (WIZ-08 issue)
- **Manual type guards without discriminated unions:** Brittle, doesn't leverage TypeScript narrowing
- **Collecting device/connectivity in quote forms:** Per WIZ-02, these are post-inspection fields
- **Not filtering document categories by service:** Per SVC-01, showing irrelevant categories confuses users

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation functions | Zod schemas with zodResolver | Edge cases (nested objects, arrays, async validation, error formatting) already solved |
| Multi-step wizard state | useReducer with manual step logic | React Hook Form with watch() | RHF handles validation per step, form persistence, error state automatically |
| Conditional field validation | Runtime if/else validation | Zod discriminated unions + refine() | Type safety, compile-time checking, automatic TypeScript inference |
| Property type options sync | Hardcoded arrays in each wizard | Shared constants file + Zod enum | Single source of truth prevents drift across 4 wizards |
| Service-specific document filtering | Component-level hardcoded arrays | SERVICE_DOCUMENT_CATEGORIES map | Centralized logic, easier to extend services |

**Key insight:** Form validation in multi-variant forms (service-specific fields) has massive hidden complexity. Zod's discriminated unions encode business rules in the type system, catching errors at compile time. Hand-rolling this loses type safety and creates runtime validation gaps.

## Common Pitfalls

### Pitfall 1: Runtime-Only Conditional Rendering Without Schema Validation
**What goes wrong:** Fields are hidden/shown with `{service === 'X' && ...}` but Zod schema doesn't reflect service-specific requirements. Form submits invalid data.
**Why it happens:** Developers forget that UI conditionals and validation are separate concerns
**How to avoid:** Use discriminated union schemas that match UI conditionals. Zod validates what TypeScript narrows.
**Warning signs:** 
- TypeScript errors when accessing service-specific fields after form submit
- Backend receives incomplete data (missing required fields)
- Error messages show for hidden fields

### Pitfall 2: Premature Field Collection (Device/Connectivity Before Inspection)
**What goes wrong:** Collecting `device_option` and `connectivity` during quote submission, before customer knows what they need
**Why it happens:** Database has the columns, forms auto-include all fields
**How to avoid:** Explicitly reference WIZ-02 requirement - remove these fields from ALL quote wizards. Add comments explaining they're post-inspection.
**Warning signs:**
- Customers confused by technical questions (WiFi vs 3G before site assessment)
- Admin has to re-collect data after inspection
- Data mismatch between quote and final project

### Pitfall 3: Inconsistent Property Type Options Across Wizards
**What goes wrong:** Public form has 6 options, admin has 2, customer request has 5 (per WIZ-01)
**Why it happens:** Each wizard independently defines options, copy-paste divergence over time
**How to avoid:** Use shared `PROPERTY_TYPES` constant and Zod enum. All wizards import same source.
**Warning signs:**
- Database has property types not in dropdown options
- Reports/filters show values that shouldn't exist
- Customers see different options depending on entry point

### Pitfall 4: Document Category Leakage Across Services
**What goes wrong:** Efficiency users see "deliverable" category, consulting users see "bill" (per SVC-01)
**Why it happens:** DocumentManager defaults to all categories without service context
**How to avoid:** Pass `serviceType` prop to DocumentManager, filter categories via `SERVICE_DOCUMENT_CATEGORIES` map
**Warning signs:**
- Users upload wrong document types
- Document searches return irrelevant categories
- Confusion in admin review ("why is there a utility bill for a consulting project?")

### Pitfall 5: Validation Divergence Between Quote and Project Wizards
**What goes wrong:** Quote form has different validation rules than manual project wizard
**Why it happens:** Schemas defined separately, requirements drift
**How to avoid:** Share base schema, extend for quote vs project differences. Document why differences exist (e.g., project requires assignment fields, quote doesn't).
**Warning signs:**
- Data shape mismatches when converting quote → project
- Different error messages for same field in different flows
- Manual project wizard can create invalid state that quote wizard prevents

## Code Examples

Verified patterns from official sources:

### Multi-Step Wizard with Service-Specific Steps
```typescript
// Source: Context7 /react-hook-form/react-hook-form + project patterns
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, type QuoteFormData } from '@/lib/schemas/quote-schema';

function MultiStepQuoteWizard() {
  const [step, setStep] = useState(1);
  const { register, watch, handleSubmit, trigger, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const service = watch('service');

  const nextStep = async () => {
    // Validate current step fields before advancing
    const fieldsToValidate = step === 1 
      ? ['clientName', 'clientEmail', 'clientPhone', 'service'] 
      : step === 2 
        ? ['propertyType', 'city', 'state']
        : [];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => s + 1);
  };

  const onSubmit = (data: QuoteFormData) => {
    // TypeScript knows exact shape based on service discriminator
    console.log('Valid quote data:', data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Step 1: Client Info + Service Selection */}
      {step === 1 && (
        <div>
          <input {...register('clientName')} placeholder="Full Name" />
          {errors.clientName && <span>{errors.clientName.message}</span>}
          
          <input {...register('clientEmail')} type="email" placeholder="Email" />
          {errors.clientEmail && <span>{errors.clientEmail.message}</span>}
          
          <select {...register('service')}>
            <option value="efficiency">Energy Efficiency</option>
            <option value="consulting">Consulting</option>
            <option value="advocacy">Advocacy</option>
          </select>
          
          <button type="button" onClick={nextStep}>Next</button>
        </div>
      )}

      {/* Step 2: Property Details */}
      {step === 2 && (
        <div>
          <select {...register('propertyType')}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            {/* ... other options */}
          </select>
          
          <button type="button" onClick={() => setStep(1)}>Back</button>
          <button type="button" onClick={nextStep}>Next</button>
        </div>
      )}

      {/* Step 3: Service-Specific Fields */}
      {step === 3 && (
        <div>
          {service === 'efficiency' && (
            <div>
              <input {...register('propertySize')} placeholder="Property Size (sq ft)" />
              {/* NO device_option or connectivity per WIZ-02 */}
            </div>
          )}
          
          {(service === 'consulting' || service === 'advocacy') && (
            <div>
              <input {...register('timeline')} placeholder="Timeline" />
              {errors.timeline && <span>{errors.timeline.message}</span>}
              
              <input {...register('budget')} placeholder="Budget" />
              {errors.budget && <span>{errors.budget.message}</span>}
              
              <textarea {...register('projectDescription')} placeholder="Description" />
              {errors.projectDescription && <span>{errors.projectDescription.message}</span>}
            </div>
          )}
          
          <button type="button" onClick={() => setStep(2)}>Back</button>
          <button type="submit">Submit Quote</button>
        </div>
      )}
    </form>
  );
}
```

### Shared Service-Specific Field Components
```typescript
// Source: Project requirements WIZ-08 + React Hook Form patterns
// components/wizards/shared/ConsultingFields.tsx
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { QuoteFormData } from '@/lib/schemas/quote-schema';

interface ConsultingFieldsProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
}

export function ConsultingFields({ register, errors }: ConsultingFieldsProps) {
  return (
    <>
      <div>
        <label>Timeline</label>
        <input {...register('timeline')} placeholder="e.g., 3-6 months" />
        {errors.timeline && <span className="error">{errors.timeline.message}</span>}
      </div>
      
      <div>
        <label>Budget</label>
        <input {...register('budget')} placeholder="e.g., $10,000 - $50,000" />
        {errors.budget && <span className="error">{errors.budget.message}</span>}
      </div>
      
      <div>
        <label>Project Description</label>
        <textarea 
          {...register('projectDescription')} 
          placeholder="Describe your project goals..."
          rows={4}
        />
        {errors.projectDescription && <span className="error">{errors.projectDescription.message}</span>}
      </div>
    </>
  );
}

// Usage in multiple wizards
function PublicQuoteWizard() {
  const { register, watch, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });
  const service = watch('service');
  
  return (
    <form>
      {/* ... common fields ... */}
      {(service === 'consulting' || service === 'advocacy') && (
        <ConsultingFields register={register} errors={errors} />
      )}
    </form>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Controlled inputs with useState per field | React Hook Form uncontrolled inputs | RHF 7.0+ (2020+) | Massive performance improvement, fewer re-renders |
| Runtime validation with manual if/else | Zod schemas with discriminated unions | Zod 3.0+ (2022+) | Type safety, compile-time validation, better DX |
| Prop drilling form state through wizard steps | useForm context or single form state | RHF 7.0+ | Cleaner code, easier step validation |
| Separate validation for create vs update | Shared schema with .partial() or .extend() | Zod 3.0+ | DRY validation, consistent rules |
| Manual TypeScript types for form data | z.infer<typeof schema> automatic inference | Zod 3.0+ | Single source of truth, types always match validation |

**Deprecated/outdated:**
- **Formik:** Still maintained but RHF is faster and more ergonomic for large forms
- **Manual type predicates for form data:** Zod discriminated unions replace need for hand-written type guards
- **Separate validation and TypeScript types:** Use z.infer to derive types from schemas

## Open Questions

Things that couldn't be fully resolved:

1. **Inspection requirement auto-detection (EE-03)**
   - What we know: Commercial properties require inspection, residential optional
   - What's unclear: Exact business logic for "small-business" and "hotel" property types
   - Recommendation: During implementation, confirm with stakeholder whether small-business/hotel follow commercial rules or have custom logic

2. **Phase management UI for consulting/advocacy (WIZ-06)**
   - What we know: Phases exist in database schema, admin wizard has phase UI
   - What's unclear: Whether phases should be collected during initial quote submission or only during admin pricing
   - Recommendation: Review WIZ-06 requirement - likely move phases to admin pricing step, not customer-facing wizard

3. **Quote → Project conversion trigger timing**
   - What we know: EE-28 specifies conversion happens on first equipment payment
   - What's unclear: How this affects consulting/advocacy wizards that create projects directly
   - Recommendation: Consulting/advocacy may bypass quote stage entirely, or quote converts immediately. Clarify flow during planning.

## Sources

### Primary (HIGH confidence)
- Context7 /react-hook-form/react-hook-form - Multi-step forms, useFieldArray, dependent validation
- Context7 /colinhacks/zod - Discriminated unions, refinements, superRefine patterns
- Context7 /react-hook-form/resolvers - zodResolver integration with React Hook Form
- Context7 /vercel/next.js/v15.1.8 - Next.js 15 + React 19 client component patterns
- Project codebase: Development/components/ManualProjectWizard.tsx - Existing wizard implementation
- Project codebase: Development/lib/types.ts - Current Quote and ServiceType definitions
- Supabase schema: quotes, active_projects tables - Field structure and constraints

### Secondary (MEDIUM confidence)
- Project requirements: .planning/REQUIREMENTS.md - WIZ-01 through WIZ-08, SVC-01 through SVC-04, EE-01 through EE-04
- Project codebase: Development/components/DocumentManager.tsx - Current document category implementation

### Tertiary (LOW confidence)
- None - all research verified with official documentation or project codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Hook Form + Zod is industry standard for this use case, verified with Context7
- Architecture: HIGH - Discriminated unions pattern verified in Zod docs, existing codebase uses similar patterns
- Pitfalls: HIGH - Based on project requirements (WIZ-02 device/connectivity, WIZ-01 property types, SVC-01 document categories) and common Zod/RHF mistakes

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - stable libraries, no rapid changes expected)
