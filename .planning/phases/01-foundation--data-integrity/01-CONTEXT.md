# Phase 1: Foundation & Data Integrity - Context

**Gathered:** 2026-01-28
**Updated:** 2026-01-29 (after database audit and codebase mapping)
**Status:** Ready for re-planning

<domain>
## Phase Boundary

Fix critical data integrity issues and implement a state machine to prevent invalid status transitions across all three service types (Energy Efficiency, Consulting, Advocacy). Establish proper database constraints and ensure data consistency.

**Critical Discovery (2026-01-29):**
All original planning was done without live Supabase access. Database audit revealed significant gaps between assumptions and reality requiring Phase 1 re-planning.

</domain>

<decisions>
## Implementation Decisions

### User Deletion Behavior
- Support both hard delete and soft delete approaches
- Soft delete must include option to reactivate user account
- Block deletion OR soft delete automatically for users with active projects (either approach acceptable)
- 15-day grace period before hard deletion executes (not 30 days)
- During grace period, all active projects put on hold
- Admin must have capability to instantly and permanently hard delete a user (bypassing grace period)
- Admin notification: Both email notification immediately AND dashboard notification
- Detailed audit log of everything deleted (every entity: projects, appointments, documents with timestamps and admin who initiated)
- Self-service deletion depends on account state: Users with no projects can self-delete, users with projects must request admin deletion
- For technician deletion with assigned appointments: Leverage/fix/adapt existing appointment reassignment system in codebase
- Grace period UX: Allow login with banner warning showing "Account scheduled for deletion on [date]. Click to cancel deletion."
- Admin instant hard delete requires reason selection/entry + confirmation before executing

### Service-Specific Status Handling
- Shared common statuses (pending, in_progress, completed, cancelled) + service-specific ones for unique workflows
- In mixed views, separate projects into sections by service type (don't mix in single list)
- Service-specific color schemes: EE statuses use one palette, Consulting another, Advocacy another; common statuses use neutral colors
- Quote-to-project conversion sets service-specific initial status (EE: pending_inspection/pending_payment, Consulting: requirements_defined, Advocacy: pending_audit)
- Customer-facing labels are simplified AND bilingual (EN/ES): Customers see friendly labels ('Waiting for inspection') while admins see technical ones ('pending_inspection')
- Invalid transitions: Log warning but allow for admins only (regular operations blocked, admins can force with warning logged)
- Service-specific groupings for reporting: Each service has its own stage groupings that make sense for that workflow (don't force common stages across services)

### Database Schema Updates (NEW - from audit findings)

#### Documents Table Strategy
- **Decision:** Migrate to pure polymorphic pattern (best practice, scalable)
- **Rationale:** Existing hybrid schema (specific FKs + polymorphic fields) is redundant and confusing
- **Approach:**
  - Remove specific FKs (`user_id`, `project_id`)
  - Keep polymorphic fields (`entity_type`, `entity_id`)
  - Add soft delete columns (`deleted_at`, etc.)
  - Migrate existing data to polymorphic pattern
  - More flexible for future entity types (quotes, invoices, etc.)

#### Soft Delete Implementation
- **Decision:** Replace partial implementation with proper design (best practice)
- **Rationale:** Existing `deletion_requests` table is incomplete and doesn't follow standard soft delete pattern
- **Approach:**
  - Remove `deletion_requests` table
  - Add soft delete columns to core tables: `deleted_at`, `deletion_scheduled_for`, `deleted_by`
  - Create views for active records (e.g., `active_users`, `active_projects`)
  - Use views in application code to filter soft-deleted records automatically
  - Tiered scope: Core tables (users, projects, appointments, documents, inquiries, quotes) in Phase 1
  - Remaining tables (admin_requests, portfolio_projects, magic_links, reschedule_tokens, user_settings, electrical_boards) added in future phases as needed

#### CASCADE Constraint Strategy
- **Decision:** Selective CASCADE vs SET NULL based on data ownership semantics (best practice)
- **Approach:**
  - **CASCADE** for owned data (user owns their projects, projects own appointments/documents)
  - **SET NULL** for references that preserve audit trail (technician on appointment, reviewer on technician_reviews, uploaded_by on documents)
  - All 15+ missing constraints addressed, not just the 5 originally planned
  - Examples:
    - `active_projects.user_id` → CASCADE (user's project)
    - `appointments.project_id` → CASCADE (project's appointment)
    - `appointments.technician_id` → SET NULL (preserve appointment history)
    - `documents.uploaded_by` → SET NULL (preserve who uploaded)
    - `technician_reviews.reviewer_id` → SET NULL (preserve review even if reviewer deleted)

#### State Machine Enhancement
- **Decision:** Review and enhance existing implementation with full database context
- **Rationale:** State machine was completed before database schema was fully known
- **Approach:**
  - Review implemented state machine code quality
  - Validate against actual database schema and discovered tables
  - Enhance transition guards based on real FK relationships
  - Add validation for newly discovered service-specific statuses
  - Ensure integration with soft delete (can't transition deleted records)

### Claude's Discretion
- Reactivation access security approach (immediate access vs password reset after reactivation)
- Exact transition validation logic between common and service-specific statuses
- Reactivation UI implementation (combination of soft-deleted user tab/filter + support request queue processing)
- **Specific migration strategy for documents table** (data transformation approach, rollback safety)
- **Deletion audit log schema design** (JSONB structure, retention policy)
- **Active record view naming conventions** (active_* vs non-deleted_*)
- **Performance optimization for soft delete queries** (indexes on deleted_at)

</decisions>

<specifics>
## Specific Ideas

- Existing system: "There was a system developed to reassign appointments of technicians depending on different situations" - leverage/fix/adapt this for technician deletion handling
- User explicitly wants both email and dashboard notifications for deletions (not either/or)
- 15-day grace period specifically (user adjusted from default 30-day suggestion)
- **Database audit findings:**
  - Documents table has redundant columns: `url` + `download_url`, `size` instead of `size_bytes`
  - Existing `deletion_requests` table structure suggests soft delete was attempted but abandoned
  - Some FKs already have CASCADE (appointments → electrical_boards, user_settings.user_id)
  - State machine files exist: `lib/state-machines/types.ts`, `project-states.ts`, `project-states.test.ts`

</specifics>

<database_reality>
## Database Reality Check (from 2026-01-29 audit)

**What EXISTS (vs what was assumed):**
- ✅ Documents table (hybrid schema - needs migration to polymorphic)
- ✅ State machine implementation (completed in Plan 01-03)
- ✅ Partial soft delete attempt (deletion_requests table - to be removed)
- ✅ Some CASCADE constraints (appointments, user_settings, technician_leave_requests)
- ✅ 7 undocumented tables (admin_requests, portfolio_projects, magic_links, reschedule_tokens, user_settings, electrical_boards, deletion_requests)

**What's MISSING (needs to be added):**
- ❌ Soft delete columns on ANY table (deleted_at, deletion_scheduled_for, deleted_by)
- ❌ Active record views (active_users, active_projects, etc.)
- ❌ Deletion audit log table
- ❌ 15+ CASCADE constraints on critical FKs
- ❌ Proper polymorphic pattern in documents table

**Impact on original plans:**
- Plan 01-01: Needs adaptation (documents table exists, not creating from scratch)
- Plan 01-02: Needs major expansion (15+ FKs vs 5 originally planned)
- Plan 01-03: ✅ Complete but needs review/enhancement
- Plan 01-04: May conflict with existing deletion_requests logic
- Plan 01-05: Needs validation against actual schema

</database_reality>

<deferred>
## Deferred Ideas

- **General registry/audit log for all customer projects** - Comprehensive reporting showing all projects (completed, not completed, etc.) with reasons for their current status. This is a broader reporting/audit feature that would be its own phase (perhaps "Project History & Audit Log" or similar reporting phase).
- **Soft delete for remaining tables** - admin_requests, portfolio_projects, magic_links, reschedule_tokens, user_settings, electrical_boards get soft delete support in future phases as needed (not Phase 1 scope)
- **Documents table column cleanup** - Remove redundant `url` column, rename `size` to `size_bytes` (minor schema improvements deferred to future refactoring)

</deferred>

---

*Phase: 01-foundation--data-integrity*
*Context gathered: 2026-01-28*
*Updated: 2026-01-29 (post database audit)*
