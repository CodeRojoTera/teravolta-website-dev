# Teravolta Platform Stabilization

## What This Is

A stabilization milestone for Teravolta's energy services management platform. The system handles three service lines (Energy Efficiency, Consulting, Advocacy) with a public website and three role-based portals (Admin, Customer, Technician). The goal is to fix existing issues and establish a solid foundation before adding automation features.

## Core Value

**A working manual workflow.** The core business flow (Quote → Project → Technician Assignment → Completion) must work end-to-end so the team can operate efficiently while future automation is built on top.

## Requirements

### Validated

Existing capabilities inferred from codebase:

- ✓ Public website with service pages (efficiency, consulting, advocacy) — existing
- ✓ Quote/inquiry submission form with service selection — existing
- ✓ Supabase authentication with magic links — existing
- ✓ Role-based portal access (admin, customer, technician) — existing
- ✓ Basic project CRUD operations — existing
- ✓ Technician management and assignment — existing
- ✓ Email notifications via Resend — existing
- ✓ Bilingual support (EN/ES) — existing
- ✓ Quote-to-project conversion flow — existing

### Active

Stabilization scope — fix what's broken, complete what's partial:

**Core Flow**
- [ ] Quote submission works end-to-end (form → database → admin view)
- [ ] Admin can review, approve, and convert quotes to projects
- [ ] Project creation populates all required fields correctly
- [ ] Technician assignment flow works completely
- [ ] Customer can view accurate project status and data
- [ ] Status transitions follow logical flow (no invalid state jumps)

**Admin Portal**
- [ ] Dashboard displays correct data (no wrong/stale information)
- [ ] All management views functional (quotes, projects, technicians, users)
- [ ] Project detail pages show complete information
- [ ] Assignment and scheduling workflows complete

**Customer Portal**
- [ ] Dashboard shows customer's actual projects and quotes
- [ ] Project detail page displays accurate status and timeline
- [ ] Customer can add data/documents to their projects
- [ ] Status updates reflect real-time changes

**Technician Portal**
- [ ] Dashboard shows assigned projects correctly
- [ ] Inspection forms work for all service types
- [ ] Calendar/scheduling view functional
- [ ] Can update project status from field

**Code Quality**
- [ ] Build succeeds without ignoring TypeScript errors
- [ ] Replace `any` types with proper interfaces
- [ ] Fix module import errors
- [ ] Remove orphaned Firebase code
- [ ] Service mapping functions type-safe

**Documentation**
- [ ] System overview document (architecture, data flow, key concepts)
- [ ] API documentation (all endpoints, request/response formats)
- [ ] Code comments on complex functions and business logic

### Out of Scope

- Production deployment and hosting setup — stabilize locally first
- Security hardening (rate limiting, input validation) — future milestone
- Test coverage (unit, integration, E2E) — future milestone
- Energy bill analysis automation — future feature
- Smart meter integration — future feature
- Advanced reporting/analytics — future feature
- Real-time notifications (push, SMS) — future feature
- Performance optimization (caching, indexing) — after functional stability

## Context

**Business Domain:**
Teravolta is a Panama-based energy services company offering:
1. **Energy Efficiency** — Analyze energy bills, identify savings, install smart meters (most complex, future automation target)
2. **Consulting** — Strategic energy consulting, PPA structuring, contract evaluation
3. **Advocacy** — Service quality claims against distributors and regulators

**Technical History:**
- Started with Firebase (Firestore + Cloud Functions)
- Migrated to Supabase (PostgreSQL) — migration mostly complete
- Firebase code orphaned but not removed (`functions/` directory)
- Email migrated from Zoho SMTP to Resend

**Architecture:**
- Next.js 15 with App Router
- Supabase for database and authentication
- Three portals sharing common components
- Service layer pattern for business logic
- 16 project statuses (complex state machine, undocumented transitions)

**Known Issues (from codebase analysis):**
- Build config ignores TypeScript errors (`ignoreBuildErrors: true`)
- Excessive `any` types throughout services and components
- Module import errors in portal/account page
- Incomplete service methods (e.g., ReviewService.hasUserReviewedProject)
- No state machine validation for project status transitions
- Placeholder Supabase clients if env vars missing (silent failures)

## Constraints

- **Tech Stack**: Next.js 15, React 19, Supabase, TypeScript — no framework changes
- **Database**: Supabase PostgreSQL — all data must live here (complete Firebase removal)
- **Email**: Resend — consolidate all email sending through this provider
- **Patterns**: Maintain existing service layer pattern and portal structure
- **Compatibility**: Must work with existing data in Supabase (no breaking schema changes without migration)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Complete Firebase removal | Single database simplifies operations, SQL enables future self-hosting | — Pending |
| Fix build before features | Can't trust deployments with errors ignored | — Pending |
| Document before expanding | Understanding current system prevents compounding complexity | — Pending |
| Manual workflow first | Team needs to work efficiently now; automation comes later | — Pending |

---
*Last updated: 2026-01-28 after initialization*
