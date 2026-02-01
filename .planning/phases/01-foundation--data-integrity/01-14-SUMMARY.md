---
phase: 01-foundation--data-integrity
plan: 14
subsystem: ui
tags: [nextjs, portal, active-users, supabase]

# Dependency graph
requires:
  - phase: 01-foundation--data-integrity
    provides: active_users view applied
provides:
  - Portal login/account/customer/technician reads filtered via active_users
affects: [customer-portal, technician-portal, auth]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Portal profile reads use active_users while writes stay on users"

key-files:
  created: []
  modified:
    - app/portal/login/page.tsx
    - app/portal/account/page.tsx
    - app/portal/technician/layout.tsx
    - app/portal/customer/request-service/page.tsx

key-decisions:
  - "None - followed plan as specified"

patterns-established:
  - "Portal role/profile reads source from active_users"

# Metrics
completed: 2026-02-01
---

# Phase 01 Plan 14: Portal Active Users Reads Summary

**Login, account, technician, and customer request-service pages now read profiles from active_users to hide soft-deleted users.**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-01T17:29:19Z
- **Completed:** 2026-02-01T17:29:25Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments
- Switched login role lookup to active_users
- Updated account profile reads to active_users
- Updated technician layout and request-service profile lookups to active_users

## Task Commits

Each task was committed atomically:

1. **Task 1: Update customer/technician/login pages to read from active_users** - `6928166c` (fix)

## Files Created/Modified
- `app/portal/login/page.tsx` - Role lookup reads from active_users
- `app/portal/account/page.tsx` - Profile fetch reads from active_users
- `app/portal/technician/layout.tsx` - Technician profile reads from active_users
- `app/portal/customer/request-service/page.tsx` - Request-service profile reads from active_users

## Decisions Made
None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Portal reads now filter soft-deleted users; continue with remaining gap-closure plans.

---
*Phase: 01-foundation--data-integrity*
*Completed: 2026-02-01*
