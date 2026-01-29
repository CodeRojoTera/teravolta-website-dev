# Phase 1: Foundation & Data Integrity - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix critical data integrity issues and implement a state machine to prevent invalid status transitions across all three service types (Energy Efficiency, Consulting, Advocacy). Establish proper database constraints and ensure data consistency.

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

### Claude's Discretion
- Reactivation access security approach (immediate access vs password reset after reactivation)
- Exact transition validation logic between common and service-specific statuses
- Reactivation UI implementation (combination of soft-deleted user tab/filter + support request queue processing)

</decisions>

<specifics>
## Specific Ideas

- Existing system: "There was a system developed to reassign appointments of technicians depending on different situations" - leverage/fix/adapt this for technician deletion handling
- User explicitly wants both email and dashboard notifications for deletions (not either/or)
- 15-day grace period specifically (user adjusted from default 30-day suggestion)

</specifics>

<deferred>
## Deferred Ideas

- **General registry/audit log for all customer projects** - Comprehensive reporting showing all projects (completed, not completed, etc.) with reasons for their current status. This is a broader reporting/audit feature that would be its own phase (perhaps "Project History & Audit Log" or similar reporting phase).

</deferred>

---

*Phase: 01-foundation--data-integrity*
*Context gathered: 2026-01-28*
