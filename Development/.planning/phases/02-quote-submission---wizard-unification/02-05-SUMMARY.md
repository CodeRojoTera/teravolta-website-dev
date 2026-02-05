---
phase: 02-quote-submission-wizard-unification
plan: 05
subsystem: admin-wizard
tags: [admin-wizard, property-types, efficiency-inspection, advocacy-claims, field-visibility]

requires:
  - phase: 02-01
    provides: shared constants, Zod schemas, inspection detection logic
  - phase: 02-02
    provides: shared wizard field components

provides:
  - Admin wizard using 6 standard property types
  - Efficiency inspection scheduling (optional date/time)
  - Advocacy claim field collection
  - Service-specific field visibility rules applied

affects:
  - 02-06: DocumentManager filtering
  - 02-07: Admin quote edits
  - 02-08: Admin wiring + inspection guard

tech-stack:
  added: []
  patterns:
    - Single source of truth for property types (constants.ts)
    - Service-specific field visibility
    - Post-inspection data collection pattern (efficiency)

key-files:
  created: []
  modified:
    - Development/components/ManualProjectWizard.tsx

key-decisions:
  - "Property type shows for ALL services (not hidden for consulting)"
  - "Device/connectivity removed per WIZ-02 (collected after inspection)"
  - "Advocacy uses claim fields only (no timeline/budget/description)"
  - "Inspection requirement notice based on property type"

patterns-established:
  - "Import constants from shared lib/schemas/constants.ts"
  - "Service-specific field visibility via conditional rendering"

metrics:
  duration: 30m
  completed: 2026-02-02
---

# Phase 02 Plan 05: Admin Manual Project Wizard Unification Summary

**One-liner:** Admin wizard updated to use 6 property types, removed device/connectivity collection, added advocacy claim fields, and enforced service-specific field visibility

## Performance

- **Duration:** 30 min
- **Started:** 2026-02-02T05:32:56Z
- **Completed:** 2026-02-02T06:02:00Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Admin wizard now uses 6 standard property types from PROPERTY_TYPES constant
- Device and connectivity fields removed from efficiency project creation (per WIZ-02)
- Inspection requirement notice shows based on property type (hotel/building/industrial = required)
- Optional booking date/time fields added for inspection scheduling (WIZ-03)
- Property type now shows for ALL services (removed consulting exclusion per WIZ-05)
- Timeline/budget/projectDescription restricted to consulting-only
- Advocacy claim fields added: claimType, distributorCompany, claimAmount, incidentDate, damageDescription
- Phase management correctly skips for efficiency, shows for consulting/advocacy (WIZ-06)

## Task Commits

Each task was committed atomically:

1. **Task 1: Import constants and update property type selector** - `de61dd0b` (feat)
2. **Task 2: Remove device/connectivity from efficiency project creation** - `6fd80408` (feat)
3. **Task 3: Verify consulting/advocacy field visibility** - `53f663e2` (feat)

**Plan metadata:** Will be committed separately

## Files Created/Modified

- `Development/components/ManualProjectWizard.tsx` - Admin manual project wizard with unified fields
  - Imports PROPERTY_TYPES, PROPERTY_TYPE_LABELS, PropertyType from constants
  - Imports isInspectionRequired from quote-schema
  - Property type select now uses 6 standard options
  - Device/connectivity buttons replaced with informational note
  - Inspection requirement notice shows for commercial properties
  - Optional booking date/time added for efficiency
  - Timeline/budget restricted to consulting-only
  - Advocacy claim fields added with conditional rendering
  - Description field restricted to consulting-only
  - Form state interface updated with PropertyType and advocacy fields
  - handleSubmit updated to persist correct fields per service

## Decisions Made

### 1. Property Type Shows for ALL Services
**Context:** Original code had `{formData.project.service !== 'consulting'` condition hiding property type for consulting.

**Decision:** Removed the `service !== 'consulting'` condition. Property type now shows for ALL services.

**Rationale:** Property type provides important context for consulting and advocacy projects too, not just efficiency.

### 2. Device/Connectivity Collection Removed
**Context:** Original code collected device type (purchase/rent) and connectivity (WiFi/3G) during project creation.

**Decision:** Removed these fields entirely. Added informational note explaining they're set after inspection.

**Rationale:** Per WIZ-02: Customers don't know technical equipment needs until technician assesses site. These are collected in Phase 5 (EE Customer Equipment Choices).

### 3. Advocacy Uses Claim Fields Only
**Context:** Advocacy service showed timeline/budget/projectDescription fields (same as consulting).

**Decision:** Added advocacy-specific claim fields. Restricted timeline/budget/projectDescription to consulting-only. Description field also restricted to consulting-only.

**Rationale:** Advocacy claims are incident-driven, not project-driven. Focus is on damage assessment and regulatory compliance, not project planning.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Status:** ✅ READY for Plan 02-06

**Blockers:** None

**Dependencies satisfied:**
- Admin wizard field unification complete ✅
- Property type standardization complete ✅
- Device/connectivity removal complete ✅
- Advocacy claim fields added ✅
- Service-specific visibility enforced ✅

**Next steps:**
1. Plan 02-06: Update DocumentManager to filter categories by service type
2. Plan 02-07: Admin quote edit functionality
3. Plan 02-08: Admin wiring + inspection guard

## Implementation Notes

### For Future Developers

**Property type options:**
All 4 wizards (public quote, customer request, admin manual project, admin quote) should use PROPERTY_TYPES constant for consistency.

```typescript
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, PropertyType } from '@/lib/schemas/constants';

<select value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)}>
  <option value="">Select...</option>
  {PROPERTY_TYPES.map(type => (
    <option key={type} value={type}>
      {PROPERTY_TYPE_LABELS[type].en}
    </option>
  ))}
</select>
```

**Inspection requirement detection:**
Use `isInspectionRequired(propertyType)` to show conditional notices for efficiency service.

```typescript
import { isInspectionRequired } from '@/lib/schemas/quote-schema';

{isInspectionRequired(propertyType) && (
  <div className="bg-blue-50 p-4">
    This property type requires a technical inspection before installation.
  </div>
)}
```

**Service-specific field visibility:**
```typescript
// Property type: ALL services
// Property size: efficiency only
// Timeline/budget/description: consulting only
// Claim fields: advocacy only
// Phases: consulting/advocacy only (efficiency skips)
// Booking date/time: efficiency only
```

**Why device_option and connectivity are missing from admin wizard:**
Per WIZ-02 decision: These are collected AFTER inspection, not during project creation. The technical assessment determines appropriate equipment (which meter model, WiFi vs 3G based on site conditions). Collecting this data early causes:
- Customer confusion (answering technical questions they don't understand)
- Data re-collection (wasting time)
- Project-data mismatch (specs change after technician assessment)

### Database Impact

**Admin wizard now creates projects with:**
- All services: `property_type` populated
- Efficiency: `device_option` = NULL, `connectivity_type` = NULL, `scheduled_date` = optional, `scheduled_time` = optional
- Consulting: `client_timeline`, `budget`, `project_description` populated
- Advocacy: `claim_type`, `distributor_company`, `claim_amount`, `incident_date`, `damage_description` populated

---

*Phase: 02-quote-submission-wizard-unification*
*Completed: 2026-02-02*
