---
phase: 02-quote-submission-wizard-unification
plan: 06
subsystem: document-management
tags: [service-filtering, document-manager, validation, upload-security]

requires:
  - phase: 02-quote-submission-wizard-unification-01
    provides: SERVICE_DOCUMENT_CATEGORIES constant
    provides: ServiceType type

provides:
  - Service-aware document manager with category filtering
  - Server-side category validation per service type
  - Bilingual translations for advocacy document categories
  - isCategoryAllowedForService helper for reuse

affects:
  - Future wizard integrations that use DocumentManager
  - Document upload endpoints across the application

tech-stack:
  added: []
  patterns:
    - Service-based category filtering
    - Server-side validation to prevent disallowed uploads
    - Optional prop pattern for backwards compatibility

key-files:
  created: []
  modified:
    - Development/components/DocumentManager.tsx
    - Development/lib/documentUtils.ts
    - Development/app/services/activeProjectService.ts

key-decisions:
  - "Service category filtering is optional via serviceType prop to maintain backwards compatibility"
  - "Server-side validation enforces category rules even if client is bypassed"
  - "Service type resolved from database when not explicitly provided"

metrics:
  duration: 5min
  completed: 2026-02-02
---

# Phase 02 Plan 06: DocumentManager Service Filtering Summary

**Service-aware document manager with category filtering and server-side validation to prevent disallowed uploads per service type**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-02T01:20:04Z
- **Completed:** 2026-02-02T01:25:21Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

1. **DocumentManager accepts optional serviceType prop** - Enables service-specific category filtering while maintaining backwards compatibility
2. **Service-based category derivation** - Uses SERVICE_DOCUMENT_CATEGORIES from constants to show only relevant categories per service
3. **Complete bilingual translations** - Added claim_evidence and regulatory_filing translations for advocacy service
4. **Server-side validation layer** - Added isCategoryAllowedForService helper to validate categories before upload
5. **Automatic service resolution** - Fetches service type from quotes/active_projects tables when not provided
6. **Upload rejection for invalid categories** - Returns clear error messages when attempting to upload disallowed categories

## Task Commits

Each task was committed atomically:

1. **Task 1: Add serviceType prop and import constants** - `805f769b` (feat)
   - Import SERVICE_DOCUMENT_CATEGORIES and ServiceType from constants
   - Add serviceType optional prop to DocumentManagerProps
   - Update component signature to accept serviceType
   - Derive categories from serviceType when provided
   - Fallback to all categories when no serviceType (backwards compatible)

2. **Task 2: Add missing category translations** - `9903f781` (feat)
   - Add claim_evidence translation (en/es)
   - Add regulatory_filing translation (en/es)
   - All SERVICE_DOCUMENT_CATEGORIES now have translations in both languages

3. **Task 3: Enforce service-based category validation on uploads** - `4efc4208` (feat)
   - Import SERVICE_DOCUMENT_CATEGORIES and ServiceType from constants
   - Add serviceType to UploadDocumentOptions
   - Add resolveServiceType helper to fetch service from quotes/active_projects tables
   - Add isCategoryAllowedForService helper to validate categories
   - Update uploadDocument to validate category before storage upload
   - Update uploadMultipleDocuments to accept optional serviceType
   - Update getDocumentsByCategory to include new category types
   - Update activeProjectService.uploadDocument to fetch project service and validate
   - Reject disallowed categories with clear error message

**Plan metadata:** (will be committed with SUMMARY and STATE)

## Files Created/Modified

- `Development/components/DocumentManager.tsx` - Added serviceType prop, imports SERVICE_DOCUMENT_CATEGORIES, filters categories by service type, added claim_evidence and regulatory_filing translations
- `Development/lib/documentUtils.ts` - Added serviceType option to upload interfaces, implemented resolveServiceType helper, implemented isCategoryAllowedForService helper, added validation logic in uploadDocument
- `Development/app/services/activeProjectService.ts` - Import isCategoryAllowedForService, fetches project service for validation, rejects invalid categories before upload

## Decisions Made

### 1. Service Category Filtering is Optional
**Context:** DocumentManager is used across the application in various contexts

**Decision:** serviceType prop is optional. When provided, categories are filtered by service. When omitted, all categories are shown (backwards compatible).

**Rationale:**
- Existing usage of DocumentManager should not break
- Explicit serviceType enables service-specific filtering when needed
- Fallback to all categories maintains current behavior

### 2. Server-Side Validation is Mandatory
**Context:** Client-side filtering can be bypassed by API calls or modified client code

**Decision:** Implement server-side validation in uploadDocument and activeProjectService.uploadDocument. Categories are validated against SERVICE_DOCUMENT_CATEGORIES before file is stored.

**Rationale:**
- Security: Prevents malicious category assignments regardless of UI
- Data integrity: Ensures documents are always categorized correctly
- Consistency: All upload paths validate categories equally

### 3. Automatic Service Resolution from Database
**Context:** serviceType may not always be provided by the caller (e.g., legacy code, generic upload functions)

**Decision:** Implement resolveServiceType helper that fetches service from quotes or active_projects tables based on entityType and entityId.

**Rationale:**
- Enables validation without requiring explicit serviceType prop
- Works with existing upload code that doesn't know about service types
- Single source of truth: database service column

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Status:** ✅ READY for Plan 02-07

**Blockers:** None

**Dependencies satisfied:**
- DocumentManager accepts serviceType prop ✅
- Category filtering by service type implemented ✅
- All categories have bilingual translations ✅
- Server-side validation prevents disallowed uploads ✅

**Next steps:**
1. Plan 02-07: Admin quote edits (next plan in phase)
2. Plan 02-08: Admin wiring + inspection guard (final plan in phase)

---

*Phase: 02-quote-submission-wizard-unification*
*Completed: 2026-02-02*
