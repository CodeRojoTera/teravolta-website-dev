---
phase: 02-quote-submission-wizard-unification
plan: 08
subsystem: admin-portal
tags: [service-filtering, document-manager, inspection-guard, service-specific-ui]

requires:
  - 02-06: DocumentManager service filtering
    provides: serviceType prop and SERVICE_DOCUMENT_CATEGORIES
  - 02-07: Admin quote edit flow
    provides: RHF + Zod structure in admin pages

provides:
  - Service-aware document manager usage in admin pages
  - Efficiency-only inspection workflow enforcement
  - Inspection unavailable messages for non-efficiency services

affects:
  - Phase 03: Project management enhancements (service-aware workflows)

tech-stack:
  added: []
  patterns:
    - Service-based conditional rendering
    - Guarded component access pattern

key-files:
  modified:
    - Development/app/portal/admin/active-projects/[id]/page.tsx
    - Development/app/portal/admin/quotes/[id]/page.tsx
    - Development/components/admin/InspectionViewer.tsx

key-decisions:
  - "Service type prop leverages DocumentManager internal category filtering"
  - "Inspection UI guarded at both component and page level"

metrics:
  duration: 4min
  completed: 2026-02-02
---

# Phase 2 Plan 8: Admin Wiring + Inspection Guard Summary

**Admin pages pass serviceType to DocumentManager for service-aware filtering, and inspection workflow is restricted to efficiency projects only**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-02-02T10:51:51Z
- **Completed:** 2026-02-02T10:55:59Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

1. **Service-aware document filtering in admin pages**
   - Active project detail page passes `serviceType={project.service}` to DocumentManager
   - Admin quote detail page passes `serviceType={quote.service}` to DocumentManager
   - Removed hardcoded `allowedCategories` arrays (efficiency vs non-efficiency)
   - DocumentManager now uses SERVICE_DOCUMENT_CATEGORIES to filter by service type
   - Efficiency projects: bill, meter_reading, contract, site_plan, report, other
   - Consulting/advocacy projects: deliverable, payment_proof, contract, report, other

2. **Efficiency-only inspection workflow enforcement**
   - Added `serviceType` prop to InspectionViewer component
   - InspectionViewer renders yellow message when `serviceType !== 'efficiency'`
   - Skips data loading for non-efficiency services (no Supabase queries)
   - Admin active project page passes `serviceType={project.service}` to InspectionViewer
   - Added guard showing "Inspection Not Available" message when inspection tab active for non-efficiency projects
   - Inspection tab button only shows for efficiency projects (already existed, verified)

## Task Commits

Each task was committed atomically:

1. **Task 1: Pass serviceType into DocumentManager on admin pages** - `3f1e87a6` (feat)
   - Replace hardcoded allowedCategories with serviceType prop in active-projects page
   - Replace hardcoded allowedCategories with serviceType prop in quotes page
   - DocumentManager now handles category filtering via SERVICE_DOCUMENT_CATEGORIES
   - Service types: efficiency, consulting, advocacy all filter correctly

2. **Task 2: Restrict inspection workflow to efficiency projects** - `c308e060` (feat)
   - Add serviceType prop to InspectionViewer component
   - InspectionViewer renders unavailable message for non-efficiency services
   - Pass serviceType from project to InspectionViewer in admin page
   - Add guard showing inspection unavailable message for non-efficiency projects
   - Only efficiency projects show inspection tab and access inspection data

## Files Created/Modified

- `Development/app/portal/admin/active-projects/[id]/page.tsx` - Pass serviceType to DocumentManager and InspectionViewer, added inspection unavailable guard for non-efficiency projects
- `Development/app/portal/admin/quotes/[id]/page.tsx` - Pass serviceType to DocumentManager instead of hardcoded allowedCategories
- `Development/components/admin/InspectionViewer.tsx` - Added serviceType prop, renders inspection unavailable message for non-efficiency services, skips data loading

## Decisions Made

### 1. Service Type Prop Leverages DocumentManager Internal Filtering
**Context:** DocumentManager already had serviceType prop with internal category filtering logic from plan 02-06

**Decision:** Pass serviceType prop instead of customizing allowedCategories in each admin page

**Rationale:**
- Single source of truth: SERVICE_DOCUMENT_CATEGORIES constants
- Consistent behavior across all DocumentManager instances
- Reduces code duplication
- Changes to service categories update automatically everywhere

### 2. Inspection UI Guarded at Both Component and Page Level
**Context:** Need to prevent inspection workflow for non-efficiency services

**Decision:** Add guard in InspectionViewer component AND admin page

**Rationale:**
- **Component-level guard:** Prevents data loading even if component is accidentally rendered
- **Page-level guard:** Provides clear user-facing message in admin context
- Defense in depth: Multiple checks prevent inspection access
- Clear messaging: Users understand why inspection is not available

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Status:** ✅ READY for Phase 3

**Blockers:** None

**Dependencies satisfied:**
- DocumentManager service filtering ✅ (02-06)
- Admin quote edit flow ✅ (02-07)
- Admin wiring complete ✅ (this plan)
- Inspection guard in place ✅ (this plan)

**Phase 02 Status:**
All 8 plans complete:
- 02-01: Zod schema foundation ✅
- 02-02: Shared wizard field components ✅
- 02-03: Public quote form RHF refactor ✅
- 02-04: Customer request wizard RHF refactor ✅
- 02-05: Admin ManualProjectWizard unification ✅
- 02-06: DocumentManager service filtering ✅
- 02-07: Admin quote edits ✅
- 02-08: Admin wiring + inspection guard ✅

**Next steps:**
- Phase 03: Project management enhancements (per ROADMAP.md)
- Quote submission and wizard unification complete

---

*Phase: 02-quote-submission-wizard-unification*
*Completed: 2026-02-02*
