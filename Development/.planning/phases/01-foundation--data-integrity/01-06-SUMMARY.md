---
phase: 01-foundation--data-integrity
plan: 06
subsystem: api
tags: [nextjs, supabase, deletion, state-machine, typescript]

# Dependency graph
requires:
  - phase: 01-foundation--data-integrity
    provides: User deletion service with audit logging
  - phase: 01-foundation--data-integrity
    provides: Project status state machine and updateProjectStatus service
provides:
  - Deletion workflows route project status updates through state machine
  - Admin and customer deletion actions wired to user-deletion API
  - Admin request center no longer uses deletion_requests
affects: [admin-portal, customer-portal, deletion-workflows]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Authenticated API route wraps supabaseAdmin deletion workflow"
    - "Deletion scheduling uses active_users.deletion_scheduled_for for UI state"

key-files:
  created:
    - app/api/users/[id]/deletion/route.ts
  modified:
    - lib/services/user-deletion.ts
    - app/portal/admin/users/clients/page.tsx
    - app/portal/customer/settings/page.tsx
    - app/portal/admin/requests/page.tsx

key-decisions:
  - "Added server-side deletion API to keep supabaseAdmin usage off the client"

patterns-established:
  - "Client deletion actions call API route with action payloads (schedule/cancel/hard)"

# Metrics
duration: 1 min
completed: 2026-02-01
---

# Phase 01 Plan 06: Deletion Workflow Wiring Summary

**Admin and customer deletion flows now route through the user-deletion service with state-machine status updates and legacy deletion_requests removed from UI.**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-01T16:59:31Z
- **Completed:** 2026-02-01T17:00:29Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Routed deletion-driven project status changes through updateProjectStatus with audit notes
- Wired admin client deletion actions to schedule/cancel/hard delete via user-deletion API
- Replaced deletion_requests usage in customer settings and admin request center

## Task Commits

Each task was committed atomically:

1. **Task 1: Route deletion-driven project status changes through state machine** - `13cc6a40` (fix)
2. **Task 2: Wire admin client deletion actions to user-deletion service** - `9ff3180c` (feat)
3. **Task 3: Replace legacy deletion_requests in customer settings and admin request center** - `10fb96a3` (feat)

## Files Created/Modified
- `app/api/users/[id]/deletion/route.ts` - Authenticated API route for scheduling, cancelling, and hard deletion
- `lib/services/user-deletion.ts` - Deletion workflows route status changes through updateProjectStatus
- `app/portal/admin/users/clients/page.tsx` - Admin deletion actions call the user-deletion API and show scheduled state
- `app/portal/customer/settings/page.tsx` - Customer deletion scheduling/cancellation uses API and active_users state
- `app/portal/admin/requests/page.tsx` - Request center displays admin_requests without deletion_requests merge

## Decisions Made
- Added a server-side deletion API to keep supabaseAdmin usage off the client.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added server-side deletion API to avoid client-side supabaseAdmin usage**
- **Found during:** Task 2 (Wire admin client deletion actions to user-deletion service)
- **Issue:** The user-deletion service relies on supabaseAdmin and cannot be safely imported into client components
- **Fix:** Added `/api/users/[id]/deletion` API route and routed client actions through it
- **Files modified:** `app/api/users/[id]/deletion/route.ts`, `app/portal/admin/users/clients/page.tsx`, `app/portal/customer/settings/page.tsx`
- **Verification:** Type check for user-deletion service passed; client files contain no deletion_requests references
- **Committed in:** `9ff3180c`, `10fb96a3`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Required for security and correct client/server separation. No scope creep.

## Issues Encountered
- `rg` was unavailable in the environment, so deletion_requests checks used a Node file scan instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Deletion workflows are wired; ready for manual UI verification of schedule/cancel/hard delete actions.

---
*Phase: 01-foundation--data-integrity*
*Completed: 2026-02-01*
