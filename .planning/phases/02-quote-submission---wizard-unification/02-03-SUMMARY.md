---
phase: 02-quote-submission-wizard-unification
plan: 03
subsystem: public-quote-form
tags: [react-hook-form, zod, public-form, refactor, validation]

requires:
  - 02-01-zod-schema-foundation
  - 02-02-shared-wizard-components

provides:
  - rhf-quote-form-pattern
  - unified-public-form
  - zod-validation-integration

affects:
  - 02-04-customer-request-wizard
  - 02-05-admin-wizard-refactors

tech-stack:
  added: []
  patterns:
    - react-hook-form-integration (useForm + zodResolver)
    - zod-validation (replace manual validation)
    - shared-component-integration (PropertyTypeSelector)

key-files:
  created: []
  modified:
    - Development/app/quote/page.tsx (820 → 931 lines, full RHF refactor)

decisions:
  - id: maintain-file-upload-separate-state
    choice: Keep bills as separate useState, not in Zod schema
    rationale: File uploads handled differently (stored in Supabase storage), not part of form data validation
  - id: preserve-step-flow
    choice: Keep existing 4-step flow unchanged
    rationale: Working UX pattern, no need to modify navigation structure
  - id: incremental-validation
    choice: Use trigger() for step validation before navigation
    rationale: Prevents advancing to next step with invalid data

metrics:
  duration: 27m
  completed: 2026-02-02
---

# Phase 02 Plan 03: Public Quote Form RHF Refactor Summary

**One-liner:** Refactored public quote form to use React Hook Form + Zod validation with shared PropertyTypeSelector component

## What Was Built

### Core Deliverables

**Public Quote Form Refactor (`app/quote/page.tsx`):**

1. **React Hook Form Integration**
   - Replaced `useState` form management with `useForm<QuoteFormData>`
   - Added `zodResolver(quoteSchema)` for validation
   - Implemented `watch()` for conditional rendering
   - Used `trigger()` for step-by-step validation
   - Added `setValue()` for programmatic field updates

2. **Shared Component Integration**
   - Replaced inline property type grid with `PropertyTypeSelector` component
   - Uses 6 property type options from PROPERTY_TYPES constant
   - Bilingual labels with icons
   - Click-to-select card UI

3. **Zod Validation**
   - All form fields validated by `quoteSchema`
   - Real-time error display from Zod
   - Service-specific field requirements enforced
   - Email and phone validation through schema

4. **Helper Function Integration**
   - `shouldShowBillUpload(service)` guards Step 3 rendering
   - `isInspectionRequired(propertyType)` determines commercial properties
   - Commercial properties show company + operating hours fields
   - Residential properties get optional inspection checkbox

5. **Maintained Functionality**
   - 4-step wizard flow preserved
   - File upload (bills) unchanged
   - Phone number validation with react-phone-number-input
   - Consulting/advocacy redirect to /inquiry (Step 1)
   - Quote submission and onboarding link generation

### Technical Implementation

**Form Setup:**
```typescript
const {
  register,
  handleSubmit,
  watch,
  setValue,
  trigger,
  formState: { errors, isValid },
} = useForm<QuoteFormData>({
  resolver: zodResolver(quoteSchema),
  mode: 'onBlur',
  defaultValues: {
    service: 'efficiency',
    clientName: '',
    clientEmail: '',
    // ... other fields
  },
});
```

**Conditional Rendering:**
```typescript
const service = watch('service');
const propertyType = watch('propertyType');

// Step 3 only for efficiency
{currentStep === 3 && shouldShowBillUpload(service as any) && (
  // Bill upload UI
)}

// Company fields only for commercial
{isCommercial() && (
  // Company + operating hours
)}
```

**Step Validation:**
```typescript
const canProceedToBills = async () => {
  const fieldsToValidate = [
    'propertyType',
    'clientName',
    'clientEmail',
    'clientPhone',
    'address',
  ] as const;
  return await trigger(fieldsToValidate as any);
};
```

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Convert public quote form to React Hook Form | 7b67c37 | Development/app/quote/page.tsx |
| 2 | Verify bill upload conditional and cleanup | (part of task 1) | Development/app/quote/page.tsx |

## Success Criteria Verification

✅ **All 10 criteria met:**

1. ✅ Public quote form uses React Hook Form with zodResolver
2. ✅ PropertyTypeSelector used for property type selection
3. ✅ Exactly 6 property type options displayed (residential, apartment, small-business, hotel, building, industrial)
4. ✅ NO device_option or connectivity fields in form
5. ✅ Bill upload only appears for efficiency service (guarded by shouldShowBillUpload)
6. ✅ Inspection-required notice appears for commercial property types (hotel, building, industrial)
7. ✅ Optional inspection request checkbox appears for residential/apartment/small-business
8. ✅ Form validation prevents invalid submissions (Zod schema enforcement)
9. ✅ Consulting/advocacy redirect to /inquiry (existing behavior preserved)
10. ✅ TypeScript compiles without errors

## Decisions Made

### 1. File Upload Separate State
**Context:** Bills array needs to be managed for file upload functionality

**Decision:** Keep `bills` as separate `useState<FileUpload[]>`, not in QuoteFormData

**Rationale:**
- File uploads go to Supabase storage, not form data
- Zod schema validates form fields, not File objects
- Upload progress tracking requires separate state management
- Cleaner separation of concerns (form data vs file management)

### 2. Preserve Existing Step Flow
**Context:** Could redesign wizard steps during refactor

**Decision:** Keep existing 4-step flow unchanged (Service → Property → Bills → Booking)

**Rationale:**
- Working UX pattern users already understand
- No requirement to change navigation
- Reduces refactor scope and risk
- Easier to test and verify behavior matches original

### 3. Incremental Step Validation
**Context:** How to validate before allowing step advancement

**Decision:** Use `trigger(fieldsToValidate)` before navigation, not `isValid`

**Rationale:**
- Validates only fields relevant to current step
- Provides immediate feedback on specific issues
- Prevents advancing with incomplete data
- Better UX than validating entire form at once

## Deviations from Plan

**Minor adjustment:** Combined Tasks 1 and 2 into single refactor commit instead of separate commits. This made more sense because:
- Both tasks modify the same file extensively
- Bill upload conditional (Task 2) was naturally part of the RHF refactor (Task 1)
- Single cohesive change easier to review and revert if needed

## Known Issues / Technical Debt

None identified. Form works as expected with proper validation and error handling.

## Next Phase Readiness

**Status:** ✅ READY for Plan 02-04

**Blockers:** None

**Dependencies satisfied:**
- Public quote form refactored ✅
- RHF + Zod pattern established ✅
- PropertyTypeSelector integrated ✅
- Shared helper functions working ✅
- Pattern proven for other wizards ✅

**Next steps:**
1. Plan 02-04: Refactor customer request wizard using same RHF pattern
2. Plan 02-05: Refactor admin wizards using same RHF pattern
3. Plan 02-06: Update DocumentManager for service-specific category filtering

## Implementation Notes

### For Future Developers

**Using the refactored pattern for other wizards:**
```typescript
// 1. Import RHF and Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, QuoteFormData } from '@/lib/schemas/quote-schema';

// 2. Setup form
const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<QuoteFormData>({
  resolver: zodResolver(quoteSchema),
  mode: 'onBlur',
});

// 3. Watch for conditional rendering
const service = watch('service');
const propertyType = watch('propertyType');

// 4. Use shared components
<PropertyTypeSelector register={register} errors={errors} setValue={setValue} value={propertyType} />

// 5. Register inputs
<input {...register('clientName')} />
{errors.clientName && <span>{errors.clientName.message}</span>}

// 6. Submit with validation
<form onSubmit={handleSubmit(onSubmit)}>
```

### Why Files Are Separate State

The `bills` array is managed with `useState<FileUpload[]>` instead of being part of the Zod-validated form because:
1. **File upload mechanics:** Files go to Supabase storage via `uploadDocument()`, not form POST
2. **Progress tracking:** Need separate state for `uploadProgress` per file
3. **Preview generation:** Need to store File objects for preview (not serializable in form data)
4. **Validation timing:** Files validated at upload time (file type, size), not form submit time

### Step Validation Pattern

Each step validates only relevant fields before navigation:
- **Step 1 → 2:** Service selection (handled by routing)
- **Step 2 → 3:** Property, contact, address fields
- **Step 3 → 4:** Bills array length > 0
- **Step 4 → Submit:** Booking date and time

This provides better UX than validating the entire form at once (fields user hasn't seen yet).

### Phone Validation

Phone validation uses both:
1. **react-phone-number-input:** Real-time international phone validation
2. **Zod schema:** clientPhone required validation
3. **Custom error state:** `fieldErrors.phone` for visual feedback

The phone component integrates with RHF via `setValue('clientPhone', value, { shouldValidate: true })`.

## Performance Impact

- **Bundle size:** +0KB (RHF and Zod already in package.json)
- **Render performance:** Similar to original (useState → useForm, both trigger re-renders)
- **Validation performance:** Faster (Zod validates on demand vs manual checks)
- **Code maintainability:** Improved (validation logic centralized in schema)

## Lessons Learned

1. **RHF patterns work well:** useForm + zodResolver + trigger provides clean validation flow
2. **Shared components reduce code:** PropertyTypeSelector eliminates 20+ lines of duplicated UI
3. **File uploads are special:** Keep file state separate from form data for cleaner architecture
4. **Cast needed for discriminated unions:** `register('propertySize' as any)` required for efficiency-specific fields
5. **Preserve working patterns:** Existing step flow and navigation worked well, no need to change

---

**Status:** ✅ COMPLETE
**Duration:** 27 minutes
**Commits:** 1 (7b67c37)
