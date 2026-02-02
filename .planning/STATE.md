# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** A working manual workflow where the core business flow (Quote → Project → Technician Assignment → Completion) works end-to-end with no data loss.
**Current focus:** Phase 2 - Quote Submission & Wizard Unification

## Current Position

Phase: 2 of 13 (Quote Submission & Wizard Unification)
Plan: 3 of 8 complete (public quote form RHF refactor)
Status: In progress
Last activity: 2026-02-02 - Completed 02-03-PLAN.md

Progress: [████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 38%

**Re-plan Summary (2026-01-30):**
- All previous plans archived to .archive/
- Fresh plans created based on DATABASE REALITY (live Supabase access)
- State machine already complete (lib/state-machines/) - no longer needs separate plan
- Wave 1: Plans 01-01, 01-02, 01-03 (parallel - database migrations)
- Wave 2: Plans 01-04, 01-05 (depend on Wave 1 - TypeScript services)

## Performance Metrics

**Velocity:**
- Total plans completed: 18
- Average duration: 8 min
- Total execution time: 2.35 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 - Foundation & Data Integrity | 15/15 | 109 min | 8 min |
| 02 - Quote Submission & Wizard Unification | 3/8 | 33 min | 11 min |

**Recent Trend:**
- Last 5 plans: 02-03 (27min), 02-02 (2min), 02-01 (4min), 01-15 (1min), 01-14 (1min)
- Trend: Phase 02 progressing - public form refactored to RHF

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [2026-01-29]: Views over RLS filters for soft delete - prevents RLS UPDATE conflicts
- [2026-01-29]: Polymorphic entity linking - flexible document attachment pattern
- [2026-01-29]: 15-day grace period - GDPR compliance and accidental deletion recovery
- [2026-01-29]: JSONB for audit snapshots - enables recovery without complex joins
- [2026-01-30]: No external state machine library - XState overkill for linear workflows
- [2026-01-30]: Type-state programming - compile-time + runtime validation
- [2026-01-30]: Service-specific color palettes - blue/purple/teal for visual distinction
- [2026-01-28]: Complete Firebase removal - single database simplifies operations
- [2026-01-28]: Fix build before features - can't trust deployments with errors ignored
- [2026-01-28]: Document before expanding - understanding prevents compounding complexity
- [2026-01-28]: Manual workflow first - team needs to work efficiently now
- [2026-02-01]: Log project cancellations during scheduled deletions for audit traceability
- [2026-02-01]: Link cascade deletion logs to primary user deletion audit row when available
- [2026-02-01]: Add server-side deletion API to keep supabaseAdmin usage off the client
- [2026-02-01]: Align deletion audit schema to deletion_reason and allow service role inserts
- [2026-02-01]: Enforce documents.deleted_by SET NULL for deletion audit integrity
- [2026-02-02]: Advocacy quotes collect only claim fields (no timeline/budget/projectDescription)
- [2026-02-02]: Inspection required for commercial-scale properties (hotel/building/industrial)
- [2026-02-02]: Shared constants in lib/schemas/ (co-located with Zod schemas)
- [2026-02-02]: Card-based property type selector (matches existing app patterns)
- [2026-02-02]: Separate service field components instead of mega-component (better maintainability)
- [2026-02-02]: File uploads as separate state (not in Zod schema - different lifecycle)
- [2026-02-02]: Preserve existing step flow in refactors (working UX patterns)

### Pending Todos

- [2026-02-01]: Fix global TypeScript errors blocking `npx tsc --noEmit`

### Blockers/Concerns

- [2026-01-29]: Database migrations created but not applied - local Supabase not running (Docker unavailable). Migrations need production deployment and verification.
- [2026-02-01]: Global TypeScript errors prevent full `npx tsc --noEmit` verification.

## Session Continuity

Last session: 2026-02-02 00:39 UTC
Stopped at: Completed 02-03-PLAN.md
Resume file: None

**Re-planning Outcome:**
- Database audit verified via live Supabase MCP
- 5 fresh plans created addressing DATABASE REALITY
- Previous plans archived to .archive/
- State machine confirmed complete (no plan needed)

**Current Database State (verified 2026-01-30):**
- users table: NO soft delete columns (deleted_at missing)
- active_users view: DOES NOT EXIST
- deletion_audit_log: DOES NOT EXIST
- deletion_requests: EXISTS (legacy - to be removed)
- documents table: EXISTS (needs soft delete columns added)
- CASCADE constraints: Only 3 exist (need 12+ more)

**Execution Status:**
- Plan 01-01: Complete (soft delete infrastructure)
- Plan 01-02: Complete (CASCADE constraints)
- Plan 01-03: Complete (documents soft delete + cleanup)
- Plan 01-04: Complete (user deletion service)
- Plan 01-05: Complete (state machine integration)
- Plan 01-06: Complete (deletion workflow wiring)
- Plan 01-07: Complete (active_users adoption in shared UI)
- Plan 01-08: Complete (deletion audit triggers + cleanup)
- Plan 01-09: Complete (documents soft delete)
- Plan 01-10: Complete (active_users view applied)
- Plan 01-11: Complete (admin active_users reads)
- Plan 01-12: Complete (state machine coverage + admin status API verification)
- Plan 01-13: Complete (api active_users reads)
- Plan 01-14: Complete (portal active_users reads)
- Plan 01-15: Complete (cascade constraints audit)

**Execution Status (Phase 02):**
- Plan 02-01: Complete (Zod schema foundation with discriminated unions)
- Plan 02-02: Complete (shared wizard field components)
- Plan 02-03: Complete (public quote form RHF + Zod refactor)
- Plan 02-03: Pending (ManualProjectWizard RHF refactor)
- Plan 02-04: Pending (public quote form RHF refactor)
- Plan 02-05: Pending (customer request wizard locate/fix/unify)
- Plan 02-06: Pending (DocumentManager service filtering)
- Plan 02-07: Pending (TBD)
- Plan 02-08: Pending (TBD)

**Next action:** Continue Phase 02 with Plan 02-02
