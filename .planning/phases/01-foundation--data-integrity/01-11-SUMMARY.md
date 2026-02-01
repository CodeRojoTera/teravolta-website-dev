---
phase: 01-foundation--data-integrity
plan: 11
subsystem: ui
tags: [nextjs, admin, active-users, supabase]

# Dependency graph
requires:
  - phase: 01-foundation--data-integrity
    provides: active_users view for soft-delete filtering
provides:
  - Admin portal reads from active_users in layout, lists, and profiles
affects: [admin-portal, user-management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Admin portal user reads source from active_users"

key-files:
  created: []
  modified:
    - app/portal/admin/layout.tsx
    - app/portal/admin/users/[id]/page.tsx
    - app/portal/admin/users/technicians/page.tsx
    - app/portal/admin/users/staff/page.tsx
    - app/portal/admin/active-projects/[id]/page.tsx

key-decisions:
  - "None - followed plan as specified"

patterns-established:
  - "Admin user lists and profiles read from active_users"

# Metrics
completed: 2026-02-01
---

# Phase 01 Plan 11: Admin Active Users Reads Summary

**Admin portal user lookups now read from active_users to hide soft-deleted accounts across lists and profiles.**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-01T17:20:53Z
- **Completed:** 2026-02-01T17:21:51Z
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments
- Switched admin layout, staff, technician, and profile reads to active_users
- Updated assigned technician lookup on project detail to active_users
- Kept all user writes on base users table

## Task Commits

Each task was committed atomically:

1. **Task 1: Update portal pages to read from active_users** - `5718ad42` (fix)

## Files Created/Modified
- `app/portal/admin/layout.tsx` - Admin header user lookup reads from active_users
- `app/portal/admin/users/[id]/page.tsx` - Admin user profile reads from active_users
- `app/portal/admin/users/technicians/page.tsx` - Role lookup reads from active_users
- `app/portal/admin/users/staff/page.tsx` - Staff list reads from active_users
- `app/portal/admin/active-projects/[id]/page.tsx` - Assigned technician lookup reads from active_users

## Decisions Made
None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `rg` was unavailable for verification, so a Node file scan confirmed users-table reads were removed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Admin portal reads now filter soft-deleted users; continue with remaining gap-closure plans.

---
*Phase: 01-foundation--data-integrity*
*Completed: 2026-02-01*
