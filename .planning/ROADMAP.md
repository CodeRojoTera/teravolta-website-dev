# Roadmap: Teravolta Platform Stabilization

## Overview

Fix existing issues and establish a solid foundation before automation. The roadmap starts with critical data integrity fixes and state machine implementation for all three services (Energy Efficiency, Consulting, Advocacy), implements shared service features, then completes each service workflow independently, unifies wizards, standardizes UI, and produces comprehensive documentation throughout.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Data Integrity** - Fix critical data issues, implement state machine for all services, schema fixes
- [ ] **Phase 2: Quote Submission & Wizard Unification** - Unify 4 wizards, service filtering, all service quote stages
- [ ] **Phase 3: Shared Service Features** - Quote conversion framework, service-specific portal views, document filtering
- [ ] **Phase 4: EE Inspection Workflow** - Payment tracking, technician inspection, panel hierarchy
- [ ] **Phase 5: EE Customer Equipment Choices** - Inspection results view, equipment selection, preliminary pricing
- [ ] **Phase 6: EE Pricing & Payment** - Inspection review, final pricing, payment tracking, conversion trigger
- [ ] **Phase 7: EE Installation & Discovered Issues** - Installation scheduling, discovered issue workflow
- [ ] **Phase 8: Consulting Workflow** - Phase management, timeline tracking, deliverables, budget tracking
- [ ] **Phase 9: Advocacy Workflow** - Claim data, evidence management, regulatory filing, recovery tracking
- [ ] **Phase 10: Customer Portal Completion** - Quotes/inquiries views, appointment reschedule
- [ ] **Phase 11: UI Standardization** - StatusBadge component, legacy cleanup, status translations
- [ ] **Phase 12: Documentation - System & Technical** - System overview, API, database, code comments
- [ ] **Phase 13: Documentation - User Guides** - Admin, customer, technician guides

## Phase Details

### Phase 1: Foundation & Data Integrity
**Goal**: Critical data issues fixed, state machine prevents invalid transitions for all three service types, database constraints enforce integrity
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, UI-01, UI-02, UI-03, CONS-01, ADVO-01
**Success Criteria** (what must be TRUE):
  1. User deletion (hard or soft) correctly removes/cascades all related entities (no ghost data)
  2. Project status transitions are validated by state machine (invalid jumps blocked)
  3. Admin can only select valid next statuses when manually changing project status
  4. Database foreign keys automatically cascade deletes for user, project, and appointment relationships
  5. Documents table has soft delete support for recovery
  6. State machine validates efficiency-specific statuses (pending_installation, etc.)
  7. State machine validates consulting-specific statuses (requirements_defined -> rfp_preparation -> offers_evaluation -> supplier_selection)
  8. State machine validates advocacy-specific statuses (pending_audit -> claim_formulation -> claim_filed -> asep_filed -> resolved)
**Plans**: 5 plans (re-planned 2026-01-30 based on database audit)

Plans:
- [ ] 01-01-PLAN.md — Soft delete infrastructure (users table columns, active_users view, deletion_audit_log)
- [x] 01-02-PLAN.md — CASCADE constraints on all foreign keys (15+ constraints)
- [x] 01-03-PLAN.md — Soft delete for documents table + cleanup legacy deletion_requests
- [x] 01-04-PLAN.md — User deletion logic (schedule/soft/hard delete with audit)
- [ ] 01-05-PLAN.md — State machine integration into project service and API

**Note:** State machine already implemented (01-03-SUMMARY.md from previous execution). Plans 01-01, 01-02, 01-03 are Wave 1 (parallel). Plans 01-04, 01-05 are Wave 2 (depend on Wave 1).

### Phase 2: Quote Submission & Wizard Unification
**Goal**: All 4 quote/project creation wizards collect consistent data with proper service-specific filtering for efficiency, consulting, and advocacy
**Depends on**: Phase 1
**Requirements**: EE-01, EE-02, EE-03, EE-04, WIZ-01, WIZ-02, WIZ-03, WIZ-04, WIZ-05, WIZ-06, WIZ-07, WIZ-08, SVC-01, SVC-02, SVC-03, SVC-04, CONS-13, CONS-14, ADVO-11
**Success Criteria** (what must be TRUE):
  1. All 4 wizards (public, admin, customer request, manual project) use same property type options
  2. Device and connectivity fields removed from all quote creation wizards (collected after inspection for EE)
  3. Bill upload only shows for efficiency service, not consulting/advocacy
  4. Inspection requirement automatically detected based on property type (commercial = required, residential = optional) for efficiency service
  5. DocumentManager component filters categories by service type
  6. Customer service request wizard creates quotes successfully end-to-end
  7. Consulting wizard hides efficiency fields (property_size, device_option, bills) and shows timeline, budget, project_description
  8. Advocacy wizard hides efficiency and consulting fields, shows claim_type, distributor_company, claim_amount, incident_date, damage_description
  9. Service-specific required field validation enforces timeline/budget for consulting, claim data for advocacy
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 3: Shared Service Features
**Goal**: Reusable patterns for quote-to-project conversion, service-specific portal views, and document filtering work for all three services
**Depends on**: Phase 1 (state machine), Phase 2 (unified wizards)
**Requirements**: SHAR-01, SHAR-02, SHAR-03, SHAR-04, SHAR-05, SHAR-06, SHAR-07, SHAR-08, SHAR-09
**Success Criteria** (what must be TRUE):
  1. Consulting quotes convert to projects when phases defined and validated (SHAR-01)
  2. Advocacy quotes convert to projects when claim data validated (SHAR-02)
  3. Admin quote list shows "Ready to Convert" badge when service-specific validation passes (SHAR-03)
  4. Customer portal shows consulting-specific view (phases, deliverables, timeline) for consulting projects (SHAR-04)
  5. Customer portal shows advocacy-specific view (claim details, evidence, regulatory filing) for advocacy projects (SHAR-05)
  6. Admin project detail conditionally renders sections based on service type (SHAR-06)
  7. DocumentManager filters categories by service (efficiency: bill/meter_reading, consulting: deliverable/rfp, advocacy: claim_evidence/regulatory_filing) (SHAR-07)
  8. Admin quote review shows service-specific sections (efficiency: inspection, consulting: timeline/budget, advocacy: claim validation) (SHAR-08)
  9. Project creation blocked until service-specific validation passes (SHAR-09)
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 4: EE Inspection Workflow
**Goal**: Technicians can complete inspections with panel hierarchy, connectivity recommendations, and extra cost tracking (efficiency service only)
**Depends on**: Phase 3 (shared conversion framework)
**Requirements**: EE-05, EE-06, EE-07, EE-08, EE-09, EE-10, EE-11, EE-12, EE-13
**Success Criteria** (what must be TRUE):
  1. Admin can set inspection fee and customer receives payment prompt before scheduling
  2. Inspection payment tracked separately from equipment payment
  3. Technician can log multiple electrical panels distinguishing main vs sub-panels
  4. Technician can add per-panel extra costs and overall installation extra costs
  5. Technician can recommend WiFi or 3G connectivity with reasoning notes
  6. All inspection data (panels, extras, recommendations) persists correctly after appointment completion
  7. Inspection workflow only appears for efficiency service appointments
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 5: EE Customer Equipment Choices
**Goal**: Customers can review inspection results and make equipment choices (panels, device options, connectivity) for efficiency service
**Depends on**: Phase 4
**Requirements**: EE-14, EE-15, EE-16, EE-17, EE-18, EE-19, EE-20, EE-21, PORT-06
**Success Criteria** (what must be TRUE):
  1. Customer can view inspection results showing all discovered panels, connectivity recommendation, and extra costs
  2. Customer can select which panels to meter (main only, main + subs, custom selection)
  3. Customer can choose device option (buy all, rent all, or custom per-panel)
  4. Customer can choose WiFi or 3G connectivity with technician recommendation highlighted
  5. Customer sees preliminary pricing estimate that updates based on selections
  6. Customer choices submission saves all selections to database
  7. Admin receives notification when customer submits equipment choices
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 6: EE Pricing & Payment
**Goal**: Admin reviews inspection and customer choices, sets final pricing with phased payments, and first equipment payment receipt triggers quote-to-project conversion (efficiency service)
**Depends on**: Phase 5
**Requirements**: EE-22, EE-23, EE-24, EE-25, EE-26, EE-27, EE-28
**Success Criteria** (what must be TRUE):
  1. Admin can view complete inspection results and customer equipment choices before pricing
  2. Admin can set final pricing with optional line-item breakdown (residential simple, commercial detailed)
  3. Admin can configure phased payments (number of phases, amount per phase, descriptions)
  4. Admin cannot price until inspection completed and customer choices submitted (if inspection path)
  5. Payment tracking system distinguishes inspection vs equipment payments and tracks phased payments
  6. Admin can upload payment receipts for each payment phase
  7. First equipment payment receipt upload automatically triggers quote-to-project conversion
  8. After conversion, customer immediately prompted to schedule installation
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 7: EE Installation & Discovered Issues
**Goal**: Installation appointments scheduled, technicians can pause for discovered issues, admin can charge extras, project shows complete history (efficiency service)
**Depends on**: Phase 6
**Requirements**: EE-29, EE-30, EE-31, EE-32, EE-33, EE-34
**Success Criteria** (what must be TRUE):
  1. After quote-to-project conversion, customer sees installation scheduling prompt immediately
  2. Customer can schedule installation appointment (appointment_type = 'installation')
  3. Technician receives notification when installation scheduled
  4. Technician can pause installation and report discovered issues with photos
  5. When installation paused, project status changes to 'on_hold' and admin notified
  6. Admin can review issue report, set additional charge, and customer receives second invoice
  7. After additional payment, customer reschedules installation
  8. Project detail (admin and customer) shows complete Technical Assessment section (inspection, choices, payments, appointments)
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 8: Consulting Workflow
**Goal**: Consulting projects progress through phase-based workflow with deliverables, timeline tracking, and budget management
**Depends on**: Phase 1 (state machine), Phase 2 (wizards), Phase 3 (shared features)
**Requirements**: CONS-02, CONS-03, CONS-04, CONS-05, CONS-06, CONS-07, CONS-08, CONS-09, CONS-10, CONS-11, CONS-12
**Success Criteria** (what must be TRUE):
  1. Consulting projects calculate progress as (completed_phases / total_phases) * 100
  2. Admin can define project phases with deliverables, duration, and payment amounts before conversion
  3. Customer portal displays all project phases with status, due dates, and deliverables checklist
  4. Admin can update individual phase status (pending | in_progress | completed | blocked) with completion notes
  5. System calculates estimated end date from timeline text and tracks actual vs planned milestone dates
  6. Customer can upload deliverables for current phase, admin receives notification and can approve/reject
  7. Budget stored as numeric min/max range, actual costs tracked with variance alerts when over budget
  8. Phase payments tracked separately in quote_payments table with phase_number reference
  9. Customer sees budget status (within budget | over budget) and payment status per phase
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 9: Advocacy Workflow
**Goal**: Advocacy projects track claim lifecycle with evidence management, regulatory filing, and recovery amounts
**Depends on**: Phase 1 (state machine), Phase 2 (wizards), Phase 3 (shared features)
**Requirements**: ADVO-02, ADVO-03, ADVO-04, ADVO-05, ADVO-06, ADVO-07, ADVO-08, ADVO-09, ADVO-10, ADVO-12
**Success Criteria** (what must be TRUE):
  1. Advocacy projects track claim_type, distributor_company, claim_amount, incident_date, and damage_description
  2. Evidence tracked in advocacy_evidence table with type, submission date, admin review status, and adequacy flag
  3. Customer portal shows evidence checklist with upload buttons per evidence type and submission status
  4. Admin can review submitted evidence, mark as reviewed with notes, and request more evidence
  5. Status cannot change to claim_ready until minimum required evidence exists and admin marks adequate
  6. Admin can record ASEP complaint number, filing date, distributor response, and ASEP decision
  7. Customer and admin portals show claim financials (claimed amount, recovered amount, recovery percentage)
  8. DocumentManager shows advocacy-specific categories (meter_readings, outage_logs, damage_photos, regulatory_filing, settlement_agreement)
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 10: Customer Portal Completion
**Goal**: Customer portal has dedicated quotes and inquiries views with filtering and detail pages
**Depends on**: Phase 1 (state machine for status badges)
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-07
**Success Criteria** (what must be TRUE):
  1. Customer can access /portal/customer/quotes page showing all quotes with filters
  2. Customer can view individual quote detail at /portal/customer/quotes/[id] showing pricing and linked project
  3. Customer dashboard separates "Pending Quotes" from "My Inquiries" with status badges
  4. Customer can access /portal/customer/inquiries page showing post-onboarding inquiries
  5. Customer can view inquiry detail with response thread (if response system exists)
  6. Customer can request appointment reschedule from project detail page
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 11: UI Standardization
**Goal**: Status displays consistent across portals, legacy UI removed, translations standardized
**Depends on**: Phase 1 (state machine implemented)
**Requirements**: UI-04, UI-05, UI-06, UI-07, UI-08
**Success Criteria** (what must be TRUE):
  1. StatusBadge component renders same status with same color across all three portals
  2. Status translations between admin and customer views use consistent terminology
  3. Phase management UI either integrates with quote-to-project conversion or hidden from efficiency quotes
  4. All non-functional buttons and modals removed from UI
  5. UI no longer shows workflow steps for unimplemented features
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 12: Documentation - System & Technical
**Goal**: Comprehensive system, technical, and developer documentation created
**Depends on**: All implementation phases (1-11) - documents the built system
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-09, DOCS-10, DOCS-11
**Success Criteria** (what must be TRUE):
  1. docs/SYSTEM_OVERVIEW.md exists documenting architecture, data flow, portals, and key concepts
  2. docs/STATE_MACHINE.md exists documenting all service-specific statuses, valid transitions, and guards
  3. docs/API_REFERENCE.md exists documenting all endpoints with request/response formats
  4. docs/DATABASE_SCHEMA.md exists with ERD diagram showing all tables and relationships
  5. Complex business logic functions have inline code comments explaining decisions
  6. docs/DEPLOYMENT.md exists with environment setup and build instructions
  7. docs/TROUBLESHOOTING.md exists with common issues and resolutions
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 13: Documentation - User Guides
**Goal**: User-facing documentation for all three portals and service type differences
**Depends on**: Phase 12 (technical foundation documented)
**Requirements**: DOCS-05, DOCS-06, DOCS-07, DOCS-08
**Success Criteria** (what must be TRUE):
  1. docs/ADMIN_GUIDE.md exists documenting all admin portal workflows
  2. docs/CUSTOMER_GUIDE.md exists documenting customer portal usage
  3. docs/TECHNICIAN_GUIDE.md exists documenting technician portal and inspection workflows
  4. docs/SERVICE_TYPES.md exists documenting efficiency vs consulting vs advocacy differences
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> (8 || 9) -> 10 -> 11 -> 12 -> 13

**Note on Parallelism:** Phases 8 (Consulting) and 9 (Advocacy) are PARALLEL - they can be worked on independently after Phase 3 completes. They have no dependency on each other.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Integrity | 4/5 | In progress | - |
| 2. Quote Submission & Wizard Unification | 0/TBD | Not started | - |
| 3. Shared Service Features | 0/TBD | Not started | - |
| 4. EE Inspection Workflow | 0/TBD | Not started | - |
| 5. EE Customer Equipment Choices | 0/TBD | Not started | - |
| 6. EE Pricing & Payment | 0/TBD | Not started | - |
| 7. EE Installation & Discovered Issues | 0/TBD | Not started | - |
| 8. Consulting Workflow | 0/TBD | Not started | - |
| 9. Advocacy Workflow | 0/TBD | Not started | - |
| 10. Customer Portal Completion | 0/TBD | Not started | - |
| 11. UI Standardization | 0/TBD | Not started | - |
| 12. Documentation - System & Technical | 0/TBD | Not started | - |
| 13. Documentation - User Guides | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-28*
*Last updated: 2026-01-29 - Phase 1 planned with 5 plans in 2 waves*
