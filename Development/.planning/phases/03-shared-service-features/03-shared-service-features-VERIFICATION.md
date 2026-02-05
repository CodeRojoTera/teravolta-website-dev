---
phase: 03-shared-service-features
verified: 2026-02-02T12:00:00Z
status: gaps_found
score: 13/15 must-haves verified
gaps:
  - truth: "Converted consulting/advocacy projects retain their service-specific fields"
    status: failed
    reason: "Advocacy claim fields are written into service_specific_fields but never mapped onto ActiveProject models used by portals."
    artifacts:
      - path: "Development/app/api/create-project/route.ts"
        issue: "Persists advocacy claim data only inside service_specific_fields."
      - path: "Development/app/services/activeProjectService.ts"
        issue: "mapToType omits claimType/distributorCompany/claimAmount/incidentDate/damageDescription."
    missing:
      - "Map advocacy claim fields from active_projects rows (or service_specific_fields) into ActiveProject model."
      - "Ensure create-project stores claim fields in columns or mapping reads service_specific_fields for portals."
  - truth: "Customer portal shows advocacy-specific sections for advocacy projects"
    status: failed
    reason: "Claim details sections render, but project data lacks claim fields due to missing ActiveProject mapping."
    artifacts:
      - path: "Development/app/portal/customer/projects/[id]/page.tsx"
        issue: "Reads project.claimType/distributorCompany/claimAmount/incidentDate/damageDescription that are never populated."
      - path: "Development/app/services/activeProjectService.ts"
        issue: "ActiveProject mapping omits advocacy claim fields."
    missing:
      - "Populate project claim fields in ActiveProjectService.mapToType."
      - "Optionally hydrate claim fields from service_specific_fields in active projects."
---

# Phase 3: Shared Service Features Verification Report

**Phase Goal:** Reusable patterns for quote-to-project conversion, service-specific portal views, and document filtering work for all three services.
**Verified:** 2026-02-02T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Document upload UI only offers categories relevant to the service type | ✓ VERIFIED | `Development/components/DocumentManager.tsx:209` uses `SERVICE_DOCUMENT_CATEGORIES` with `serviceType`. |
| 2 | Uploading a document with a disallowed category is rejected before write | ✓ VERIFIED | `Development/lib/documentUtils.ts:74` rejects category outside `SERVICE_DOCUMENT_CATEGORIES`. |
| 3 | Admin sees a Ready to Convert indicator only when service-specific requirements are satisfied | ✓ VERIFIED | `Development/app/portal/admin/quotes/page.tsx:215` uses `getQuoteConversionReadiness`. |
| 4 | Admin quote review shows service-specific sections for efficiency, consulting, and advocacy | ✓ VERIFIED | `Development/app/portal/admin/quotes/[id]/page.tsx:1016` conditionally renders per service. |
| 5 | Quote-to-project conversion is blocked until required consulting/advocacy data is present | ✓ VERIFIED | `Development/app/portal/admin/quotes/[id]/page.tsx:235` and `:1453` block actions when not ready. |
| 6 | Create-project API rejects conversions with missing service-specific fields | ✓ VERIFIED | `Development/app/api/create-project/route.ts:102` returns 400 with missing fields. |
| 7 | Converted consulting/advocacy projects retain their service-specific fields | ✗ FAILED | Advocacy claim fields are not mapped into ActiveProject models used by portals. |
| 8 | Admin conversion actions use the guarded create-project path and surface missing-field errors | ✓ VERIFIED | `Development/app/services/activeProjectService.ts:98` calls `/api/create-project` and propagates `missing`. |
| 9 | Admin project detail shows consulting sections only for consulting projects | ✓ VERIFIED | `Development/app/portal/admin/active-projects/[id]/page.tsx:675` conditional. |
| 10 | Admin project detail shows advocacy claim/evidence sections only for advocacy projects | ✓ VERIFIED | `Development/app/portal/admin/active-projects/[id]/page.tsx:709` conditional. |
| 11 | Documents on admin project detail use service-specific categories | ✓ VERIFIED | `Development/app/portal/admin/active-projects/[id]/page.tsx:607` uses `serviceType={project.service}`. |
| 12 | Customer portal shows consulting-specific sections for consulting projects | ✓ VERIFIED | `Development/app/portal/customer/projects/[id]/page.tsx:725` consulting overview + deliverables. |
| 13 | Consulting customers can review project deliverables in the customer portal | ✓ VERIFIED | `Development/app/portal/customer/projects/[id]/page.tsx:758` uses `DocumentList` with deliverable/rfp. |
| 14 | Customer portal shows advocacy-specific sections for advocacy projects | ✗ FAILED | Claim details read from project fields that are never populated in ActiveProject mapping. |
| 15 | Document lists can be filtered to service-specific categories | ✓ VERIFIED | `Development/components/DocumentList.tsx:169` filters by `allowedCategories`. |

**Score:** 13/15 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `Development/lib/schemas/constants.ts` | Service document categories include consulting rfp | ✓ VERIFIED | `SERVICE_DOCUMENT_CATEGORIES` includes `rfp`. |
| `Development/components/DocumentManager.tsx` | Service-aware category selection for uploads | ✓ VERIFIED | Uses `serviceType` and `SERVICE_DOCUMENT_CATEGORIES`. |
| `Development/lib/documentUtils.ts` | Upload validation for service-specific categories | ✓ VERIFIED | Validates against `SERVICE_DOCUMENT_CATEGORIES`. |
| `Development/lib/types.ts` | Document category union includes advocacy categories | ✓ VERIFIED | Document category union includes `claim_evidence`/`regulatory_filing`. |
| `Development/lib/validation/quote-conversion.ts` | Service-specific conversion readiness helper | ✓ VERIFIED | `getQuoteConversionReadiness` implemented. |
| `Development/app/portal/admin/quotes/page.tsx` | Ready-to-convert badge in quote list | ✓ VERIFIED | `Ready to Convert` badge. |
| `Development/app/portal/admin/quotes/[id]/page.tsx` | Service-specific admin quote review sections | ✓ VERIFIED | Conditional sections by service. |
| `Development/app/api/create-project/route.ts` | Server-side conversion guard and persistence | ✓ VERIFIED | Guard present; service-specific fields stored in `service_specific_fields`. |
| `Development/app/portal/admin/active-projects/[id]/page.tsx` | Service-specific admin project detail sections | ✓ VERIFIED | Consulting/advocacy sections conditional. |
| `Development/components/DocumentList.tsx` | Allowed category filtering for document lists | ✓ VERIFIED | Filters by `allowedCategories`. |
| `Development/app/portal/customer/projects/[id]/page.tsx` | Service-specific customer project detail sections | ⚠️ ORPHANED | Sections render but advocacy claim data is not wired from ActiveProject mapping. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `Development/components/DocumentManager.tsx` | `Development/lib/schemas/constants.ts` | `SERVICE_DOCUMENT_CATEGORIES` | WIRED | Category list filtered by service type. |
| `Development/lib/documentUtils.ts` | `Development/lib/schemas/constants.ts` | category validation | WIRED | Guard rejects invalid categories. |
| `Development/app/portal/admin/quotes/[id]/page.tsx` | `Development/lib/validation/quote-conversion.ts` | readiness helper | WIRED | `getQuoteConversionReadiness` used. |
| `Development/app/portal/admin/quotes/[id]/page.tsx` | `Development/app/services/activeProjectService.ts` | conversion action | WIRED | `ActiveProjectService.create` used. |
| `Development/app/services/activeProjectService.ts` | `Development/app/api/create-project/route.ts` | guarded project creation | WIRED | Fetches `/api/create-project`. |
| `Development/app/api/create-project/route.ts` | `Development/lib/validation/quote-conversion.ts` | server-side validation | WIRED | Readiness enforced in API. |
| `Development/app/portal/admin/active-projects/[id]/page.tsx` | `Development/components/DocumentManager.tsx` | serviceType prop | WIRED | `serviceType={project.service}`. |
| `Development/app/portal/customer/projects/[id]/page.tsx` | `Development/components/DocumentList.tsx` | allowedCategories prop | WIRED | Filters deliverables/evidence/regulatory docs. |
| `Development/app/api/create-project/route.ts` | `Development/app/services/activeProjectService.ts` | claim fields mapping | NOT_WIRED | ActiveProject mapping omits claim fields and service_specific_fields. |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
| --- | --- | --- |
| SHAR-01 | ✓ SATISFIED | - |
| SHAR-02 | ✗ BLOCKED | Advocacy claim fields not mapped into ActiveProject models. |
| SHAR-03 | ✓ SATISFIED | - |
| SHAR-04 | ✓ SATISFIED | - |
| SHAR-05 | ✗ BLOCKED | Advocacy claim details not wired into customer portal model. |
| SHAR-06 | ✗ BLOCKED | Admin advocacy claim details rely on unmapped fields. |
| SHAR-07 | ✓ SATISFIED | - |
| SHAR-08 | ✓ SATISFIED | - |
| SHAR-09 | ✓ SATISFIED | - |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `Development/app/portal/customer/projects/[id]/page.tsx` | 81 | TODO | ⚠️ Warning | Review status check not implemented. |

### Gaps Summary

Advocacy claim fields are written into `service_specific_fields` but are never mapped into the ActiveProject models used by the admin and customer portals. As a result, advocacy claim details render as empty values even though the sections exist, and service-specific portal views do not fully work for advocacy projects.

---

_Verified: 2026-02-02T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
