# Phase 02: Quote Submission & Wizard Unification - Context

**Created:** 2026-02-01
**Phase Goal:** All 4 quote/project creation wizards collect consistent data with proper service-specific filtering for efficiency, consulting, and advocacy

## Blockers Resolved

✅ **Dependencies installed:**
- react-hook-form@7.71.1
- zod@3.25.76
- @hookform/resolvers@5.2.2

✅ **4 Wizards identified and located:**
1. **Public quote form:** `Development/app/quote/page.tsx` (public-facing)
2. **Customer request wizard:** `Development/app/portal/customer/request-service/page.tsx` (authenticated customer)
3. **Admin manual project wizard:** `Development/components/ManualProjectWizard.tsx` (admin-only, 689 lines)
4. **Admin quote form:** Likely part of admin quotes pages at `Development/app/portal/admin/quotes/`

## Decisions Made

### Decision 1: Inspection Requirement Logic for Edge Cases

**Context:** EE-03 requires inspection auto-detection based on property type. Clear for residential (optional) and commercial (required), but unclear for small-business and hotel.

**Decision:** 
- **small-business:** Inspection OPTIONAL (treat like residential - small scale)
- **hotel:** Inspection REQUIRED (treat like commercial - complex electrical infrastructure)

**Rationale:** Hotels have commercial-scale electrical systems requiring professional assessment. Small businesses typically have simple setups comparable to residential.

### Decision 2: Phase Management Timing for Consulting/Advocacy

**Context:** WIZ-06 mentions phases exist in admin wizard but unclear if customers should define phases during initial quote.

**Decision:** 
- **Phase collection:** ADMIN-ONLY during pricing/conversion step
- **Customer quote:** Collects timeline, budget, description only (simple fields)
- **Admin pricing:** Defines detailed phases, deliverables, payment schedule

**Rationale:** 
- Matches efficiency pattern (customer provides high-level needs, admin structures technical details)
- Simplifies customer experience (fewer complex decisions upfront)
- Allows admin to structure phases based on project assessment

### Decision 3: Quote → Project Conversion for Non-Efficiency Services

**Context:** EE-28 specifies efficiency converts on first equipment payment. Unclear for consulting/advocacy.

**Decision:**
- **Efficiency:** Quote → Project on first equipment payment (existing flow)
- **Consulting:** Quote → Project when admin defines phases and customer accepts proposal
- **Advocacy:** Quote → Project when admin validates claim and customer accepts engagement terms

**Rationale:** Each service has different "commitment point" where work transitions from inquiry to active project.

## Claude's Discretion

The planner has freedom to decide:

### Implementation Approach
- How to structure shared form components (granularity, props, composition)
- Whether to refactor existing wizards in-place or create new unified components
- Validation error message wording and presentation
- Step sequencing within multi-step wizards

### Technical Details
- Zod schema organization (single file vs split by service)
- Component file structure within `components/wizards/`
- Whether to use React Hook Form's `useFormContext` or prop drilling
- Loading states, transitions, and animations

### Testing Strategy
- Which fields to validate first during planning
- Whether to create test fixtures for service-specific schemas
- Verification checkpoints (per-wizard vs end-to-end)

## Deferred Ideas

These are explicitly OUT OF SCOPE for Phase 02:

- ❌ Advanced validation (async API checks, real-time pricing)
- ❌ Autosave/draft functionality for wizards
- ❌ Quote PDF generation or email notifications
- ❌ Multi-language form validation messages
- ❌ Integration with external property databases
- ❌ Equipment selection UI (that's Phase 5)
- ❌ Payment collection (that's Phase 6)

## Open Questions (No Blockers)

These do NOT block planning but should be considered during implementation:

1. **Property size units:** Should we enforce "sq ft" or allow metric? → Default to sq ft, allow freeform text
2. **Budget format:** Range (min-max) or single number? → Freeform text (customer flexibility)
3. **Timeline format:** Relative (3-6 months) or absolute dates? → Freeform text (customer flexibility)
4. **Document upload limits:** Max files per quote? → Use existing DocumentManager limits (no change)

## Key Constraints

From prior decisions and Phase 1 work:

1. **Type-state programming:** Use Zod discriminated unions for compile-time + runtime validation
2. **Service-specific color palettes:** Maintain blue (efficiency), purple (consulting), teal (advocacy)
3. **Polymorphic entity linking:** Documents link to quotes via existing entity pattern
4. **Manual workflow first:** Focus on making manual data entry efficient (no automation yet)
5. **State machine integration:** Quote status transitions must respect Phase 1 state machine

## Success Criteria (Reference)

From ROADMAP.md Phase 2:

1. All 4 wizards use same property type options (6 options: residential, apartment, small-business, hotel, building, industrial)
2. Device and connectivity fields REMOVED from all quote creation wizards (collected after inspection for EE)
3. Bill upload only shows for efficiency service, not consulting/advocacy
4. Inspection requirement auto-detected based on property type (per Decision 1 above)
5. DocumentManager component filters categories by service type
6. Customer service request wizard creates quotes successfully end-to-end
7. Consulting wizard hides efficiency fields (property_size, device_option, bills) and shows timeline, budget, project_description
8. Advocacy wizard hides efficiency and consulting fields, shows claim_type, distributor_company, claim_amount, incident_date, damage_description
9. Service-specific required field validation enforces timeline/budget for consulting, claim data for advocacy

## Files Modified (Predicted)

Based on wizard locations and requirements:

**Core wizards:**
- `Development/app/quote/page.tsx` (public quote form)
- `Development/app/portal/customer/request-service/page.tsx` (customer request wizard)
- `Development/components/ManualProjectWizard.tsx` (admin manual project)
- `Development/app/portal/admin/quotes/[id]/page.tsx` or similar (admin quote form - TBD)

**Shared components (new):**
- `Development/lib/schemas/quote-schema.ts` (Zod discriminated union)
- `Development/lib/schemas/constants.ts` (PROPERTY_TYPES, SERVICE_DOCUMENT_CATEGORIES)
- `Development/components/wizards/shared/PropertyTypeSelector.tsx`
- `Development/components/wizards/shared/EfficiencyFields.tsx`
- `Development/components/wizards/shared/ConsultingFields.tsx`
- `Development/components/wizards/shared/AdvocacyFields.tsx`

**Document filtering:**
- `Development/components/DocumentManager.tsx` (add serviceType prop + category filtering)

**Types:**
- `Development/lib/types.ts` (enhance QuoteFormData with inferred Zod types)
