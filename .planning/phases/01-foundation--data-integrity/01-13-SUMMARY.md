---
phase: 01-foundation--data-integrity
plan: 13
subsystem: api
tags: [nextjs, supabase, active-users, services]

# Dependency graph
requires:
  - phase: 01-foundation--data-integrity
    provides: active_users view applied
provides:
  - API and service user reads filtered via active_users
affects: [admin-portal, api, technician-services]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "API/service user lookups use active_users; writes stay on users"

key-files:
  created: []
  modified:
    - app/services/technicianService.ts
    - app/api/admin/projects/[id]/status/route.ts
    - app/api/create-project/route.ts
    - app/api/update-user-password/route.ts
    - app/api/activate-account/route.ts

key-decisions:
  - "None - followed plan as specified"

patterns-established:
  - "Password reset and activation checks exclude soft-deleted users"

# Metrics
completed: 2026-02-01
---

# Phase 01 Plan 13: API Active Users Reads Summary

**API and service lookups now read from active_users to avoid returning soft-deleted accounts.**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-01T17:27:23Z
- **Completed:** 2026-02-01T17:27:30Z
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments
- Switched admin status API and create-project user lookups to active_users
- Filtered password update and activation lookups to active_users
- Updated technician capacity count to use active_users

## Task Commits

Each task was committed atomically:

1. **Task 1: Update API and services to read from active_users** - `916957ba` (fix)

## Files Created/Modified
- `app/services/technicianService.ts` - Technician capacity counts from active_users
- `app/api/admin/projects/[id]/status/route.ts` - Admin role check uses active_users
- `app/api/create-project/route.ts` - User lookup reads from active_users
- `app/api/update-user-password/route.ts` - Password updates validate active_users
- `app/api/activate-account/route.ts` - Activation checks use active_users

## Decisions Made
None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- API/service reads now filter soft-deleted users; continue with remaining gap-closure plans.

---
*Phase: 01-foundation--data-integrity*
*Completed: 2026-02-01*
