# Requirements: Teravolta Platform Stabilization

**Defined:** 2026-01-28
**Core Value:** A working manual workflow where the core business flow (Quote → Project → Technician Assignment → Completion) works end-to-end with no data loss.

**Based On:** `.planning/CURRENT_STATE_ISSUES.md` analysis

---

## Milestone v1.0 Requirements

Requirements to fix identified issues and achieve stable, complete workflows.

### Data Integrity (DATA) - CRITICAL

Fix ghost data, cascade delete, and field name errors.

- [ ] **DATA-01**: Fix user hard delete to use correct field name (`user_id` not `client_id`)
  - **Issue**: `app/portal/admin/users/clients/page.tsx:186-236` uses `client_id` field that doesn't exist
  - **Impact**: Projects not deleted when user deleted, orphaned data remains

- [ ] **DATA-02**: Implement database-level cascade delete for user relationships
  - **Issue**: No CASCADE ON DELETE in foreign keys for `quotes`, `active_projects`, `appointments`, `notifications`
  - **Impact**: Application-level delete incomplete, orphaned records remain
  - **Solution**: Add migration to set `ON DELETE CASCADE` for all user FK relationships

- [ ] **DATA-03**: Update user deletion to handle all related entities
  - **Issue**: Hard delete misses `appointments`, `documents`, `notifications`, `electrical_boards`
  - **Impact**: Orphaned records cause UI errors (null user references)
  - **Solution**: Delete/cascade all entities: appointments → electrical_boards, documents by `uploadedBy`, notifications by `user_id`

- [ ] **DATA-04**: Add soft delete cascade logic for related projects
  - **Issue**: Soft delete deactivates user but doesn't update related project statuses
  - **Impact**: Deactivated users still show as active project owners
  - **Solution**: When user deactivated, mark their projects as `cancelled` or `archived`

- [ ] **DATA-05**: Fix quote deletion to use `user_id` instead of `client_email`
  - **Issue**: Deletes by email miss records with different emails (email can change)
  - **Impact**: Inconsistent quote deletion
  - **Solution**: Always delete by `user_id` FK, not email

### Energy Efficiency Workflow (EE) - HIGH

Complete multi-stage energy efficiency workflow with payment-triggered conversion.

**Business Context**: Energy efficiency uses Emporia Vue meters. Residential clients (90%) use standard Emporia without inspection. Commercial clients require inspection. Conversion from quote → project happens AFTER first payment received + receipt uploaded.

**Flow Types**:
- **Flow A**: Residential Simple (no inspection needed) - 90% of cases
- **Flow B**: Commercial/Complex (inspection required)
- **Flow C**: Residential Discovered Issue (standard install fails, need extras)

**Critical Rule**: Quote → Project conversion triggered by FIRST PAYMENT RECEIPT UPLOAD, not inspection completion

#### Common: Quote Submission (All Flows Start Here)
- [ ] **EE-01**: Add service-type filter to bill upload UI
  - **Issue**: `app/quote/page.tsx:745-761` shows bill upload for all services
  - **Impact**: Consulting/advocacy users see irrelevant bill upload
  - **Solution**: Only show DocumentManager with 'bill' category if `service === 'efficiency'`

- [ ] **EE-02**: Remove device_option and connectivity fields from quote form
  - **Issue**: Customer doesn't know what device/connectivity they need before inspection
  - **Impact**: Collecting these fields upfront is premature - collected after inspection
  - **Solution**: REMOVE `deviceMode` and `connectivity` from public quote form

- [ ] **EE-03**: Add inspection requirement detection logic
  - **Issue**: No automatic detection of whether inspection needed
  - **Impact**: Manual decision by admin every time
  - **Solution**: Auto-detect based on property type: commercial/hotel/building/industrial = inspection required, residential/apartment/small-business = optional

- [ ] **EE-04**: Add optional inspection request for residential customers
  - **Issue**: Residential customers can't request pre-installation inspection
  - **Impact**: Can't offer inspection to residential who want certainty before paying
  - **Solution**: Add checkbox in quote form: "Request inspection first (additional cost)" for residential property types

#### Inspection Payment (Commercial Required, Residential Optional)
- [ ] **EE-05**: Create inspection payment tracking
  - **Issue**: No way to track inspection fee separately from equipment payment
  - **Impact**: Can't distinguish inspection payment from equipment payment
  - **Solution**: Add `inspection_payment` table or extend `quotes` table with:
    - `inspection_fee` (numeric)
    - `inspection_paid` (boolean)
    - `inspection_receipt_url` (text)
    - `inspection_paid_at` (timestamp)

- [ ] **EE-06**: Add admin UI to set and collect inspection fee
  - **Issue**: No workflow to charge inspection before scheduling
  - **Impact**: Can't collect inspection payment upfront
  - **Solution**: In admin quote detail, add "Set Inspection Fee" form, customer receives payment prompt BEFORE inspection appointment scheduling

#### Technician Inspection (If Inspection Path)
- [ ] **EE-07**: Add panel hierarchy support (main panel vs sub-panels)
  - **Issue**: Current `electrical_boards` table doesn't distinguish main vs sub-panels
  - **Impact**: Can't show customer which panels are main vs sub for monitoring scope decisions
  - **Solution**: Add `panel_type` field ('main' | 'sub') and `parent_panel_id` (nullable FK) to `electrical_boards` table

- [ ] **EE-08**: Add connectivity recommendation field to inspection
  - **Issue**: No field for technician to recommend WiFi vs 3G based on site conditions
  - **Impact**: Customer makes connectivity choice without guidance
  - **Solution**: Add `recommended_connectivity` field ('wifi' | '3g') with `connectivity_notes` (text) to inspection summary

- [ ] **EE-09**: Create extra costs tracking system (per panel + overall)
  - **Issue**: No way for technician to log discovered costs
  - **Impact**: Admin doesn't know about special CTs, panel upgrades, installation complexity
  - **Solution**: Create `inspection_extra_costs` table with fields:
    - `id`, `appointment_id` (FK)
    - `electrical_board_id` (nullable FK - null if overall cost)
    - `description` (text)
    - `category` ('panel_specific' | 'installation' | 'materials' | 'labor' | 'other')
    - `required` (boolean) - mandatory vs optional extra
    - `notes` (text)

- [ ] **EE-10**: Add per-panel extra costs input to BoardForm
  - **Issue**: BoardForm doesn't allow logging panel-specific extras
  - **Impact**: Can't capture "Panel 2 needs special CTs" cost
  - **Solution**: Add "Extra Costs" section to BoardForm allowing multiple cost entries per panel

- [ ] **EE-11**: Add overall inspection summary form with extras
  - **Issue**: No form for overall costs (installation complexity, access difficulty, etc.)
  - **Impact**: Can't capture site-wide extra costs
  - **Solution**: Create InspectionSummaryForm shown after all panels completed, collects connectivity recommendation + overall extra costs

- [ ] **EE-12**: Ensure all inspection data persists correctly
  - **Issue**: Components exist but data persistence not validated
  - **Impact**: Inspection data may be lost
  - **Solution**: Add validation that all board data + extras + recommendations save on appointment completion

- [ ] **EE-13**: Add service-type enforcement for inspection workflow
  - **Issue**: Inspection shows for all services, relies on manual check
  - **Impact**: Inspection form shows for consulting/advocacy (shouldn't)
  - **Solution**: Enforce `service === 'efficiency'` at route/component level

#### Customer Equipment Choices (If Inspection Path)
- [ ] **EE-14**: Create customer inspection results view
  - **Issue**: Customer portal doesn't show inspection findings
  - **Impact**: Customer can't review what technician found before making decisions
  - **Solution**: Add `/portal/customer/quotes/[id]/inspection-results` (still quote state) showing:
    - All discovered panels (main + subs) with meter type recommendations
    - Technician's connectivity recommendation + reasoning
    - Extra costs discovered (required + optional separately)

- [ ] **EE-15**: Create measurement scope selector
  - **Issue**: No UI for customer to choose which panels to meter
  - **Impact**: Can't implement "main only" vs "main + subs" vs "subs only" options
  - **Solution**: Add panel selection UI: checkboxes for each discovered panel, group by main/sub, show meter type per panel

- [ ] **EE-16**: Create device option selector (buy all / rent all / custom)
  - **Issue**: No UI for customer to choose purchase vs rent
  - **Impact**: Can't collect customer's device ownership preference
  - **Solution**: Add radio buttons: "Buy All Meters" | "Rent All Meters" | "Custom (choose per panel)"

- [ ] **EE-17**: Create per-panel device option selector (if custom)
  - **Issue**: No UI for per-panel buy/rent choice
  - **Impact**: Can't implement custom option
  - **Solution**: If "Custom" selected, show buy/rent toggle per selected panel

- [ ] **EE-18**: Create connectivity selector with recommendation highlight
  - **Issue**: No UI for customer to choose WiFi vs 3G
  - **Impact**: Can't collect connectivity preference
  - **Solution**: Add radio buttons: "WiFi" | "3G", highlight technician's recommendation with note

- [ ] **EE-19**: Implement preliminary pricing calculator
  - **Issue**: No pricing estimate for customer
  - **Impact**: Customer makes choices blind without cost guidance
  - **Solution**: Calculate estimate based on:
    - Number of selected panels
    - Meter type per panel (Emporia < industrial)
    - Device option per panel (purchase = higher upfront, rent = monthly)
    - Connectivity upcharge (3G > WiFi)
    - Required extra costs
    - Display as: "Estimated Total: $X (upfront) + $Y/month" OR "Estimated Total: $X (upfront only)"

- [ ] **EE-20**: Create customer choices submission workflow
  - **Issue**: No backend to save customer's selections
  - **Impact**: Choices made but not persisted
  - **Solution**: Create `customer_equipment_choices` table:
    - `id`, `quote_id` (FK) - still quote state
    - `selected_panels` (jsonb array of electrical_board_ids)
    - `device_option` ('buy_all' | 'rent_all' | 'custom')
    - `panel_device_choices` (jsonb map: {board_id: 'buy'|'rent'})
    - `connectivity_choice` ('wifi' | '3g')
    - `preliminary_estimate` (numeric) - calculated estimate
    - `submitted_at` (timestamp)

- [ ] **EE-21**: Notify admin when customer submits choices
  - **Issue**: Admin doesn't know customer is ready for final pricing
  - **Impact**: Customer waits without knowing next step
  - **Solution**: Send email to admin + add notification in admin dashboard when customer choices submitted

#### Admin Pricing (Both Paths)
- [ ] **EE-22**: Create admin inspection review UI (if inspection path)
  - **Issue**: `app/portal/admin/quotes/[id]/page.tsx` has no reference to inspection or customer choices
  - **Impact**: Admin prices without seeing technical findings or customer selections
  - **Solution**: Add "Inspection & Customer Choices" section showing:
    - All panels with meter type recommendations
    - Customer's selected panels + device choices + connectivity
    - Extra costs (required + optional)
    - Preliminary estimate shown to customer

- [ ] **EE-23**: Add final pricing form with optional breakdown
  - **Issue**: No structured pricing form
  - **Impact**: Admin enters single number without breakdown
  - **Solution**: Create pricing form with:
    - Simple mode (residential): Single total amount field
    - Detailed mode (commercial): Line items (base per panel, device cost, connectivity, extras, labor)
    - Payment phases section (optional): Split total into phases with amounts and descriptions

- [ ] **EE-24**: Add phased payment configuration
  - **Issue**: No way to define payment phases for large projects
  - **Impact**: Can't split payments for customer financial flexibility
  - **Solution**: In pricing form, add "Payment Phases" section:
    - Number of phases (1-5)
    - Per phase: amount, description, due date/milestone
    - Validation: phase amounts sum to total

- [ ] **EE-25**: Add validation before allowing pricing
  - **Issue**: Admin can price without required information
  - **Impact**: Incomplete pricing decisions
  - **Solution**: Validate before enabling pricing form:
    - If inspection required: inspection appointment completed + `electrical_boards` exist + customer choices submitted
    - If residential simple: customer contacted (manual admin confirmation checkbox)

#### Payment & Receipt Upload (Still Quote State)
- [ ] **EE-26**: Create payment tracking system
  - **Issue**: No structured payment tracking
  - **Impact**: Can't track inspection vs equipment payments, or phased payments
  - **Solution**: Create `quote_payments` table:
    - `id`, `quote_id` (FK)
    - `payment_type` ('inspection' | 'equipment' | 'phase')
    - `phase_number` (int, nullable - which phase if phased)
    - `amount` (numeric)
    - `receipt_url` (text)
    - `paid_at` (timestamp)
    - `uploaded_by` (user FK)
    - `is_first_equipment_payment` (boolean) - THIS triggers conversion

- [ ] **EE-27**: Create admin receipt upload UI
  - **Issue**: No UI to upload payment receipt
  - **Impact**: Can't verify payments received
  - **Solution**: In admin quote detail, add "Payments" section:
    - List all payments (inspection, phases)
    - Upload receipt button per payment
    - Mark payment as received

- [ ] **EE-28**: Implement conversion trigger on first equipment payment
  - **Issue**: No automatic quote → project conversion on payment
  - **Impact**: Admin must manually convert
  - **Solution**: When admin uploads receipt for first equipment payment (not inspection), auto-trigger quote → project conversion
    - Create project record from quote data
    - Copy all related data (inspection, equipment choices, pricing)
    - Update quote status to 'converted'
    - Redirect customer to installation scheduling

#### Installation Scheduling (Now Project State)
- [ ] **EE-29**: Create immediate installation scheduling prompt
  - **Issue**: After conversion, customer doesn't know next step
  - **Impact**: Project stalls waiting for customer action
  - **Solution**: After conversion, IMMEDIATELY show customer modal/page: "Your project is ready! Schedule installation"

- [ ] **EE-30**: Create installation appointment scheduling UI
  - **Issue**: Current scheduling may assume single appointment model
  - **Impact**: Can't distinguish inspection vs installation appointments
  - **Solution**: Create installation appointment with `appointment_type` = 'installation', link to project (not quote)

- [ ] **EE-31**: Notify technician when installation scheduled
  - **Issue**: Tech doesn't know about new installation
  - **Impact**: Installation not on tech schedule
  - **Solution**: Send email + dashboard notification when installation scheduled

#### Installation & Discovered Issues (Project State)
- [ ] **EE-32**: Add "Pause Installation" workflow for technicians
  - **Issue**: No workflow when tech discovers incompatibility during residential install
  - **Impact**: Tech stuck, can't report issue
  - **Solution**: Add "Report Issue" button in technician job modal:
    - Pauses installation (appointment status = 'paused')
    - Tech logs issue description + photos
    - Project status = 'on_hold'
    - Notification sent to admin

- [ ] **EE-33**: Create admin discovered issue resolution workflow
  - **Issue**: No workflow to charge extra after issue discovered
  - **Impact**: Can't handle Flow C (residential discovered issue)
  - **Solution**: In admin project detail, when project = 'on_hold':
    - Show issue report from tech
    - Add "Set Additional Charge" form
    - Customer receives payment prompt (second invoice)
    - After payment, customer reschedules installation

- [ ] **EE-34**: Link all data to project detail (admin and customer)
  - **Issue**: Inspection/equipment data not shown in project after conversion
  - **Impact**: No historical visibility
  - **Solution**: Add "Technical Assessment" section to project detail showing:
    - Inspection results (if inspection path)
    - Customer equipment choices
    - Payment history
    - All appointments (inspection + installation)

### Wizard Unification (WIZ) - HIGH

Make all 4 quote/project creation wizards collect consistent data.

#### Field Standardization
- [ ] **WIZ-01**: Standardize property type options across all wizards
  - **Issue**: Public form has 6 options, admin wizard has 2, customer request has 5
  - **Impact**: Different data granularity depending on entry point
  - **Solution**: Use same 6 options everywhere: residential, apartment, small-business, hotel, building, industrial

- [ ] **WIZ-02**: Remove device_option and connectivity from all quote creation wizards
  - **Issue**: Some wizards collect device/connectivity upfront, but this is premature
  - **Impact**: Customer makes choices before inspection (they don't know what they need)
  - **Solution**: REMOVE `deviceMode` and `connectivity` from all quote/project wizards - these are collected AFTER inspection in Stage 2.5 (customer choice flow)

- [ ] **WIZ-03**: Add booking date/time to admin quote creation wizard
  - **Issue**: Public form and customer request collect booking, admin wizard doesn't
  - **Impact**: Admin-created quotes miss booking preference
  - **Solution**: Add optional booking fields to admin wizard for efficiency service

#### Service-Specific Field Visibility
- [ ] **WIZ-04**: Implement service-type conditional rendering in admin wizard
  - **Issue**: `ManualProjectWizard.tsx` has inconsistent service logic (line 319, 450, 518)
  - **Impact**: Wrong fields shown for wrong services
  - **Solution**: Refactor to clear service-specific sections: efficiency (booking/property details only), consulting/advocacy (timeline/budget/description/phases)
  - **Note**: Device/connectivity NOT collected in wizards - collected after inspection

- [ ] **WIZ-05**: Add property type selector to consulting service in admin wizard
  - **Issue**: Line 450 skips property type for consulting
  - **Impact**: Consulting projects missing property context
  - **Solution**: Show property type for all services (needed for context)

- [ ] **WIZ-06**: Unify phase management logic for consulting/advocacy
  - **Issue**: Admin wizard skips phases for efficiency (good) but phase UI exists in quote review
  - **Impact**: Confusing which path uses phases
  - **Solution**: Only show phase UI for consulting/advocacy, hide completely for efficiency

#### Customer Service Request Wizard
- [ ] **WIZ-07**: Fix customer service request wizard to generate quote correctly
  - **Issue**: User reported wizard broken, but code analysis shows it's actually best implementation
  - **Impact**: May have deployment/build issue vs code issue
  - **Solution**: Test customer request wizard end-to-end, verify quote creation succeeds

- [ ] **WIZ-08**: Extract shared form logic into reusable components
  - **Issue**: Customer request wizard duplicates public quote form logic
  - **Impact**: Maintenance burden, divergence over time
  - **Solution**: Create shared service-specific form components used by all wizards

### Service-Specific Logic (SVC) - HIGH

Properly filter UI, documents, and fields by service type.

#### Document Management
- [ ] **SVC-01**: Implement service-type filtering in DocumentManager component
  - **Issue**: `components/DocumentManager.tsx:198-201` shows all categories for all services
  - **Impact**: Users see irrelevant document types
  - **Solution**: Pass service type to DocumentManager, filter categories: efficiency (bill, invoice, meter_reading, site_plan), consulting/advocacy (contract, invoice, report, deliverable, payment_proof)

- [ ] **SVC-02**: Add validation that 'bill' category only used for efficiency projects
  - **Issue**: No backend validation of service-appropriate categories
  - **Impact**: Data integrity issue if wrong category used
  - **Solution**: Add check in document upload API/service layer

#### Form Validation
- [ ] **SVC-03**: Add service-specific required field validation
  - **Issue**: No validation that efficiency collects device/connectivity, consulting collects timeline/budget
  - **Impact**: Incomplete project data
  - **Solution**: Create service-specific validation schemas (Zod) for quote/project creation

- [ ] **SVC-04**: Enforce inspection requirement for efficiency service only
  - **Issue**: Inspection form shows for all services
  - **Impact**: Confusion, unnecessary workflow for consulting/advocacy
  - **Solution**: Hide inspection dashboard for non-efficiency appointments

### Customer Portal Completion (PORT) - MEDIUM

Add missing views and improve customer experience.

#### Quote Management
- [ ] **PORT-01**: Create dedicated quotes list view (`/portal/customer/quotes`)
  - **Issue**: Customer portal doesn't have `/portal/customer/quotes` route
  - **Impact**: Customers can't see all their quotes
  - **Solution**: Add quotes list page showing all quotes (pending/reviewed/approved) with filters

- [ ] **PORT-02**: Create quote detail view (`/portal/customer/quotes/[id]`)
  - **Issue**: No way to view individual quote details
  - **Impact**: Can't see quote amount, admin responses, pricing breakdown
  - **Solution**: Add quote detail page showing full quote info, linked project (if converted)

- [ ] **PORT-03**: Add quote status badge and filtering to customer dashboard
  - **Issue**: Pending Requests section mixes quotes and inquiries
  - **Impact**: Hard to distinguish actionable quotes from informational inquiries
  - **Solution**: Separate into "Pending Quotes" and "My Inquiries" sections with status badges

#### Inquiry Management
- [ ] **PORT-04**: Create dedicated inquiries view (`/portal/customer/inquiries`)
  - **Issue**: No separate inquiries page, shown mixed with quotes
  - **Impact**: Can't see inquiry thread/responses
  - **Solution**: Add inquiries list page showing post-onboarding inquiries only

- [ ] **PORT-05**: Add inquiry detail view with response thread
  - **Issue**: No way to see admin responses to inquiries
  - **Impact**: Customer doesn't know if inquiry was addressed
  - **Solution**: Create inquiry detail view showing original inquiry + admin responses (if response system exists)

#### Inspection Visibility & Equipment Choices
- [ ] **PORT-06**: (Covered by EE-10 through EE-17) - Complete Stage 2.5 customer choice workflow
  - **Note**: Customer inspection results view and equipment selection is now part of Energy Efficiency workflow requirements
  - **Cross-reference**: See EE-10 (inspection results view), EE-11 (measurement scope), EE-12-14 (device choices), EE-15 (preliminary pricing), EE-16 (choices submission)

- [ ] **PORT-07**: Add appointment reschedule UI to customer portal
  - **Issue**: Customer must use token link, can't self-service reschedule
  - **Impact**: Poor UX, requires contacting support
  - **Solution**: Add "Request Reschedule" button in appointment section of project detail

### Status & UI Standardization (UI) - MEDIUM

Standardize status displays, remove broken UI, implement state machine.

#### State Machine Implementation
- [ ] **UI-01**: Implement type-safe state machine for project status transitions
  - **Issue**: No validation of status transitions, can jump from `pending_onboarding` → `completed`
  - **Impact**: Invalid states, workflow bypassed
  - **Solution**: Create TypeScript state machine class with valid transitions defined (see ARCHITECTURE.md pattern recommendation)

- [ ] **UI-02**: Refactor all status updates to use state machine validation
  - **Issue**: Manual status updates bypass any validation
  - **Impact**: Data inconsistency
  - **Solution**: Replace direct status updates with `projectStateMachine.transition(event)` calls

- [ ] **UI-03**: Add state machine validation to admin status change UI
  - **Issue**: Admin can manually set any status
  - **Impact**: Can create impossible states
  - **Solution**: Only show status options that are valid transitions from current state

#### Status Display Consistency
- [ ] **UI-04**: Create shared StatusBadge component with standardized colors
  - **Issue**: Status badge logic duplicated across portals, inconsistent colors
  - **Impact**: Same status looks different in different portals
  - **Solution**: Single `<StatusBadge status={value} />` component with color map

- [ ] **UI-05**: Standardize status translations between admin and customer views
  - **Issue**: Customer sees translated subset, admin sees all 17 statuses
  - **Impact**: Confusing when customer and admin discuss project
  - **Solution**: Document status translation map, use consistent terminology

#### Legacy UI Cleanup
- [ ] **UI-06**: Remove or fix phase management UI in admin quote review
  - **Issue**: Phase UI exists but doesn't integrate with quote → project conversion
  - **Impact**: Admin adds phases that don't transfer to project
  - **Solution**: Either wire up phase transfer or hide phase UI from efficiency quotes

- [ ] **UI-07**: Remove non-functional buttons and modals
  - **Issue**: Buttons that don't trigger actions, modals with broken save logic
  - **Impact**: User confusion, broken workflows
  - **Solution**: Audit all buttons/modals, remove or fix each

- [ ] **UI-08**: Remove workflow steps shown in UI but not implemented
  - **Issue**: UI suggests actions that don't exist (e.g., document requirements not specified)
  - **Impact**: User expectations not met
  - **Solution**: Hide UI for unimplemented features or implement the features

### Database Schema Fixes (SCHEMA) - MEDIUM

Add missing tables, fix foreign keys, improve integrity.

- [ ] **SCHEMA-01**: Add `documents` metadata table to database
  - **Issue**: Storage works but no centralized document tracking table
  - **Impact**: Can't query documents by project, no audit trail
  - **Solution**: Create `documents` table with columns: id, entity_type, entity_id, category, filename, url, uploaded_by, uploaded_at

- [ ] **SCHEMA-02**: Add CASCADE ON DELETE to all user foreign keys
  - **Issue**: Foreign keys exist but no cascade behavior
  - **Impact**: Orphaned records when user deleted
  - **Solution**: Migration to `ALTER TABLE quotes ADD CONSTRAINT ... ON DELETE CASCADE`, repeat for active_projects, appointments, notifications

- [ ] **SCHEMA-03**: Add CASCADE ON DELETE to appointment → project relationship
  - **Issue**: Deleting project doesn't delete appointments
  - **Impact**: Orphaned appointments
  - **Solution**: `ALTER TABLE appointments ADD CONSTRAINT fk_project ON DELETE CASCADE`

- [ ] **SCHEMA-04**: Create service_requirements table for document requirements
  - **Issue**: No way to specify which documents required per service
  - **Impact**: Customers don't know what to upload
  - **Solution**: Table with service, document_category, required (boolean), description

### Documentation (DOCS) - COMPREHENSIVE

Create comprehensive documentation as requested.

#### System Documentation
- [ ] **DOCS-01**: Write system overview document
  - **Content**: Architecture, data flow, three portals, three service types, key concepts
  - **Audience**: New developers, stakeholders
  - **Location**: `docs/SYSTEM_OVERVIEW.md`

- [ ] **DOCS-02**: Document state machine logic and status transitions
  - **Content**: All 17 project statuses, valid transitions, guards, role-based restrictions
  - **Audience**: Developers, QA
  - **Location**: `docs/STATE_MACHINE.md`

- [ ] **DOCS-03**: Create API documentation for all endpoints
  - **Content**: All `/api/*` routes with request/response formats, auth requirements
  - **Audience**: Developers
  - **Location**: `docs/API_REFERENCE.md`

- [ ] **DOCS-04**: Document database schema with ERD
  - **Content**: All tables, columns, relationships, RLS policies
  - **Audience**: Developers, database admins
  - **Location**: `docs/DATABASE_SCHEMA.md` + ERD diagram

#### Workflow Documentation
- [ ] **DOCS-05**: Create admin portal user guide
  - **Content**: Quote management, project creation, technician assignment, all workflows
  - **Audience**: Admin users, trainers
  - **Location**: `docs/ADMIN_GUIDE.md`

- [ ] **DOCS-06**: Create customer portal user guide
  - **Content**: Requesting quotes, viewing projects, uploading documents, scheduling
  - **Audience**: Customers
  - **Location**: `docs/CUSTOMER_GUIDE.md`

- [ ] **DOCS-07**: Create technician portal user guide
  - **Content**: Viewing schedule, updating status, uploading evidence, completing inspections
  - **Audience**: Technicians
  - **Location**: `docs/TECHNICIAN_GUIDE.md`

- [ ] **DOCS-08**: Document service type differences and requirements
  - **Content**: Efficiency vs consulting vs advocacy - workflows, data requirements, pricing models
  - **Audience**: Developers, admins
  - **Location**: `docs/SERVICE_TYPES.md`

#### Developer Documentation
- [ ] **DOCS-09**: Add code comments to complex business logic functions
  - **Content**: Inline comments on wizard logic, state machine, service-specific validation
  - **Audience**: Developers
  - **Location**: Inline in codebase

- [ ] **DOCS-10**: Create deployment guide
  - **Content**: Environment setup, Supabase configuration, Resend setup, build process
  - **Audience**: DevOps, developers
  - **Location**: `docs/DEPLOYMENT.md`

- [ ] **DOCS-11**: Create troubleshooting guide
  - **Content**: Common issues (ghost data, orphaned records, status errors), resolutions
  - **Audience**: Support, developers
  - **Location**: `docs/TROUBLESHOOTING.md`

---

## Future Requirements (v2.0+)

Deferred features for post-stabilization.

### Real Payment Integration
- **PAY-01**: Replace simulated payment with Stripe integration
- **PAY-02**: Automated invoice generation from project completion
- **PAY-03**: Phase-based payment collection for consulting/advocacy

### Advanced Features
- **ADV-01**: AI-powered pricing recommendations based on inspection data
- **ADV-02**: Automated quote generation from bill analysis
- **ADV-03**: SMS notifications via Twilio
- **ADV-04**: Calendar view for appointments
- **ADV-05**: Advanced reporting and analytics

### Automation
- **AUTO-01**: Auto-assign technicians based on availability/location
- **AUTO-02**: Automated follow-up sequences
- **AUTO-03**: Customer satisfaction surveys post-completion

---

## Out of Scope

Explicitly excluded features with reasoning.

| Feature | Reason |
|---------|--------|
| Native Mobile Apps | Web portal optimized for mobile sufficient |
| Offline Functionality | Adds complexity, techs have reliable internet |
| Real-Time GPS Tracking | Privacy concerns, complexity outweighs benefits |
| Multi-Language Beyond EN/ES | Current customer base only needs English/Spanish |
| QuickBooks Integration | Manual accounting acceptable for current scale |
| Inventory Management | Not applicable to service-only business model |

---

## Traceability

Requirement-to-phase mapping (populated during roadmap creation).

| Requirement | Phase | Status |
|-------------|-------|--------|
| TBD | TBD | Pending |

**Coverage:**
- v1 requirements: 81 total
- Mapped to phases: 0 (roadmap pending)
- Unmapped: 81 ⚠️

---

*Requirements defined: 2026-01-28 based on CURRENT_STATE_ISSUES.md*
*Last updated: 2026-01-28 after codebase analysis*
