# External Integrations

**Analysis Date:** 2026-01-29

## APIs & External Services

**Email Delivery:**
- Resend - Transactional email service for onboarding, invoices, and notifications
  - SDK/Client: `resend` (v6.6.0)
  - Auth: `RESEND_API_KEY` (server-side environment variable)
  - Usage: `app/api/send-email/route.ts`, `app/api/send-invoice/route.ts`, `app/api/send-onboarding-email/route.ts`
  - Implementation: `new Resend(process.env.RESEND_API_KEY)` creates client instance
  - Verified domain: `billing@teravolta.com` (production), `info@teravolta.com` (fallback)

**Maps & Geolocation:**
- Google Maps API - Location visualization and address mapping
  - SDK/Client: `@react-google-maps/api` (v2.19.3)
  - Usage: `components/` for map display in location-based features
  - Client-side integration with React components

## Data Storage

**Primary Database:**
- **Supabase PostgreSQL** - Primary relational database
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` (public) + `SUPABASE_SERVICE_ROLE_KEY` (server-side)
  - Anonymous Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side auth)
  - Clients: `@supabase/supabase-js` (v2.90.0), `@supabase/ssr` (v0.8.0)
  - Row Level Security (RLS): Enabled on all tables
  - Primary Auth: Supabase Auth (auth.users table)

**Authentication Providers:**
- Supabase Auth - Built-in authentication system
  - Session Management: Supabase SSR middleware (`createBrowserClient`, `createServerClient`)
  - Session Storage: HttpOnly cookies (server-side synced)
  - Admin Operations: Service role key (`supabaseAdmin` client in `lib/supabase-admin.ts`)
  - User Table Sync: Users table (`users` table) references `auth.users(id)`

## Supabase Database Schema

**Core Tables & Relationships:**

### Users & Authentication
- **auth.users** (Supabase managed)
  - id: UUID (primary auth identity)
  - email: text
  - Synced with `users` table via foreign keys

- **users** (Custom user profile table)
  - id: UUID (PK, FK → auth.users.id with CASCADE ON DELETE)
  - uid: text (legacy Firebase UID, gradually migrating to UUID)
  - email: text
  - full_name: text
  - role: text (CHECK: 'customer', 'admin', 'super_admin', 'technician')
  - phone: text (optional)
  - company: text (optional)
  - created_at: TIMESTAMPTZ
  - deleted_at: TIMESTAMPTZ (soft delete, NULL = active)
  - deletion_scheduled_for: TIMESTAMPTZ (15-day grace period before hard delete)
  - deleted_by: UUID (FK → users.id, who initiated deletion)
  - Indexes: idx_users_deleted_at, idx_users_deletion_scheduled
  - RLS: Role-based access control for different user types

### Projects & Service Records
- **active_projects** (Main project/service record)
  - id: UUID (PK)
  - user_id: UUID (FK → users.id, CASCADE ON DELETE)
  - client_email: text
  - client_name: text
  - client_phone: text
  - client_company: text (optional)
  - project_name: text
  - service: text (CHECK: 'efficiency', 'consulting', 'advocacy')
  - package: text (optional)
  - status: text (CHECK: pending_onboarding, pending_payment, scheduled, in_progress, completed, cancelled, etc.)
  - payment_status: text (CHECK: 'pending', 'paid', 'partial', 'refunded')
  - progress: integer (0-100)
  - amount: numeric (optional)
  - start_date: TIMESTAMPTZ (optional)
  - estimated_end_date: TIMESTAMPTZ (optional)
  - description: text (optional)
  - challenge: text (optional)
  - solution: text (optional)
  - result: text (optional)
  - timeline: JSONB (event log array)
  - address: text (optional)
  - property_type: text (optional)
  - property_size: text (optional)
  - monthly_bill: text (optional)
  - connectivity_type: text (CHECK: 'wifi', '3g')
  - device_option: text (CHECK: 'purchase', 'rent')
  - city: text, state: text, zip_code: text (optional)
  - budget: text (optional)
  - scheduled_date: DATE (optional)
  - scheduled_time: TIME (optional)
  - appointment_id: UUID (FK, optional)
  - source_quote_id: UUID (optional)
  - source_inquiry_id: UUID (optional)
  - phases: JSONB (array of phase objects with id, name, amount, status)
  - company_id: UUID (optional)
  - active_phases: text[] (array of active phase IDs)
  - created_at: TIMESTAMPTZ
  - last_updated: TIMESTAMPTZ
  - RLS: User can view own projects, admins can view all

### Quotes & Inquiries
- **quotes** (Service quote/proposal)
  - id: UUID (PK)
  - user_id: UUID (FK → users.id, CASCADE ON DELETE, optional)
  - client_email: text
  - client_name: text
  - client_phone: text
  - client_company: text (optional)
  - client_type: text (CHECK: 'residential', 'business')
  - service: text (CHECK: 'efficiency', 'consulting', 'advocacy')
  - status: text (CHECK: 'pending_review', 'in_review', 'approved', 'paid', 'rejected', 'cancelled')
  - property_type: text (optional)
  - property_size: text (optional)
  - current_bill: text (optional)
  - device_mode: text (CHECK: 'purchase', 'rental')
  - connectivity: text (CHECK: 'wifi', 'cellular')
  - timeline: text (optional)
  - budget: text (optional)
  - project_description: text (optional)
  - city: text, state: text, zip_code: text (optional)
  - message: text (optional)
  - amount: numeric (optional)
  - documents: JSONB (array of {name, storagePath, contentType, size, uploadedAt})
  - submitted_at: TIMESTAMPTZ (optional)
  - reviewed_by: UUID (optional)
  - reviewed_at: TIMESTAMPTZ (optional)
  - service_specific_fields: JSONB (dynamic schema)
  - review_status: text (optional)
  - review_feedback: text (optional)
  - phases: JSONB (for consulting/advocacy)
  - created_at: TIMESTAMPTZ
  - RLS: Users can view own quotes, admins can view all

- **inquiries** (Contact form submission)
  - id: UUID (PK)
  - user_id: UUID (FK → auth.users.id, CASCADE ON DELETE, optional)
  - client_type: text (CHECK: 'residential', 'business')
  - full_name: text
  - email: text
  - phone_number: text (optional)
  - company_name: text (optional)
  - subject: text
  - message: text
  - status: text (CHECK: 'new', 'in_progress', 'responded', 'closed')
  - language: text (CHECK: 'en', 'es')
  - source: text
  - attachments: JSONB (array of {fileName, storagePath, downloadURL, contentType, size, uploadedAt})
  - created_at: TIMESTAMPTZ
  - RLS: Users can view own inquiries, admins can view all

### Field Service (Technicians & Appointments)
- **technicians** (Technician staff profile)
  - id: UUID (PK)
  - uid: text (FK → auth.users.id when they have login access, optional)
  - full_name: text
  - email: text
  - phone: text
  - specialties: text[] (array: 'solar', 'electrical', 'audit')
  - active: boolean
  - vacation_quota: integer (annual days)
  - working_schedule: JSONB ({start: "HH:mm", end: "HH:mm", days: [0-6]})
  - created_at: TIMESTAMPTZ
  - RLS: Technicians can view own profile, admins can view all

- **appointments** (Service appointment scheduling)
  - id: UUID (PK)
  - project_id: UUID (FK → active_projects.id, CASCADE ON DELETE)
  - technician_id: UUID (FK → technicians.id)
  - technician_uid: text (denormalized for RLS efficiency)
  - technician_name: text (denormalized)
  - date: DATE
  - status: text (CHECK: 'scheduled', 'on_route', 'in_progress', 'completed', 'cancelled', 'incomplete')
  - client_address: text
  - client_name: text
  - client_phone: text
  - client_email: text (optional)
  - client_user_id: UUID (optional)
  - check_in_time: TIMESTAMPTZ (optional)
  - check_out_time: TIMESTAMPTZ (optional)
  - location_start: JSONB ({lat: number, lng: number}, optional)
  - location_end: JSONB ({lat: number, lng: number}, optional)
  - notes: text (optional)
  - photos: text[] (array of URLs)
  - created_at: TIMESTAMPTZ
  - created_by: UUID
  - RLS: Technicians can view own appointments, admins can view all

- **technician_leaves** (Time off management)
  - id: UUID (PK)
  - technician_id: UUID (FK → technicians.id)
  - start_date: DATE
  - end_date: DATE
  - reason: text
  - status: text (CHECK: 'pending', 'approved', 'rejected', 'cancelled')
  - leave_type: text (CHECK: 'vacation', 'sickness', 'other', 'unplanned', 'suspension')
  - created_at: TIMESTAMPTZ

### Technical Inspection (Efficiency 2.0)
- **electrical_boards** (Electrical panel assessment)
  - id: UUID (PK)
  - appointment_id: UUID (FK → appointments.id, CASCADE ON DELETE)
  - name: text
  - system_type: text (CHECK: 'monophase_120_240', 'triphase_208_120', 'triphase_480_277')
  - has_neutral: boolean
  - emporia_classification: text (CHECK: 'standard', 'adjustments', 'incompatible')
  - incompatibility_reason: text (CHECK: 'no_neutral', 'mv', 'space', 'other', optional)
  - ct_status: text (CHECK: 'fits', 'no_fit')
  - ct_issue: text (optional, free text description)
  - recommended_solution: text (CHECK: 'standard', 'special_cts', 'industrial')
  - observations: text (optional)
  - photos: JSONB (array of URL strings)
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
  - RLS: Admins full access, technicians access own assignment's boards

### Notifications & Audit
- **notifications** (User notifications/alerts)
  - id: UUID (PK)
  - user_id: UUID (FK → auth.users.id, CASCADE ON DELETE)
  - type: text (CHECK: 'info', 'success', 'warning', 'error')
  - title: text
  - message: text
  - link: text (optional action link)
  - read: boolean (default: false)
  - created_at: TIMESTAMPTZ
  - Indexes: idx_notifications_user_id, idx_notifications_read
  - RLS: Users can view/update own notifications, admins can insert

- **deletion_audit_log** (Comprehensive deletion tracking)
  - id: UUID (PK)
  - table_name: text
  - record_id: UUID
  - record_data: JSONB (snapshot of deleted record)
  - deleted_at: TIMESTAMPTZ
  - deleted_by: UUID (FK → users.id, optional)
  - delete_reason: text (CHECK: 'user_request', 'admin_action', 'inactivity', 'violation', 'cascade', optional)
  - deletion_type: text (CHECK: 'soft', 'hard', 'cascade', 'scheduled')
  - parent_deletion_id: UUID (FK → deletion_audit_log.id, for cascade tracking)
  - related_deletions: JSONB (array: [{table: string, id: string}])
  - Indexes: idx_audit_log_table_record, idx_audit_log_deleted_by, idx_audit_log_deleted_at, idx_audit_log_parent
  - RLS: Admins only

- **documents** (Centralized document management - Created 2026-01-29)
  - id: UUID (PK)
  - name: text
  - storage_path: text
  - download_url: text
  - content_type: text
  - size_bytes: BIGINT
  - linked_entity_type: text (CHECK: 'active_projects', 'quotes', 'users', 'technicians')
  - linked_entity_id: UUID (polymorphic foreign key)
  - category: text (CHECK: 'bill', 'contract', 'invoice', 'report', 'deliverable', 'payment_proof', 'site_plan', 'meter_reading', 'claim_evidence', 'regulatory_filing', 'other')
  - uploaded_by: UUID (FK → users.id, optional)
  - uploaded_at: TIMESTAMPTZ
  - description: text (optional)
  - deleted_at: TIMESTAMPTZ (soft delete support)
  - Indexes: idx_documents_entity, idx_documents_category, idx_documents_uploaded_by, idx_documents_deleted_at
  - RLS: Users can view own documents and documents linked to their entities, admins can view all

- **admin_requests** (Admin task queue)
  - id: UUID (PK)
  - type: text (CHECK: 'incident_report', 'reassignment_request', 'reschedule_request')
  - priority: text (CHECK: 'high', 'normal', 'low')
  - status: text (CHECK: 'pending', 'approved', 'rejected', 'in_review')
  - requester_id: text (cast from auth.uid())
  - related_entity_id: UUID (optional)
  - related_entity_type: text (CHECK: 'appointment', 'active_project')
  - details: JSONB
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
  - RLS: Users can view own requests, admins can view/update all

**Key Foreign Key Relationships & CASCADE Behavior:**
1. `active_projects.user_id` → `users.id` (CASCADE ON DELETE)
2. `appointments.project_id` → `active_projects.id` (CASCADE ON DELETE)
3. `invoices.project_id` → `active_projects.id` (CASCADE ON DELETE)
4. `electrical_boards.appointment_id` → `appointments.id` (CASCADE ON DELETE)
5. `notifications.user_id` → `auth.users.id` (CASCADE ON DELETE)
6. `quotes.user_id` → `users.id` (CASCADE ON DELETE)
7. `inquiries.user_id` → `auth.users.id` (CASCADE ON DELETE)
8. `deletion_audit_log.deleted_by` → `users.id`
9. `deletion_audit_log.parent_deletion_id` → `deletion_audit_log.id`

**Views:**
- **active_users** (Created 2026-01-29) - Materialized view for active (non-deleted) users filtering

**Special Features:**
- Soft Delete Support: `users`, `documents` tables have `deleted_at` timestamp
- Audit Trail: `deletion_audit_log` tracks all deletions with JSONB snapshots
- Polymorphic Links: `documents` table supports multiple entity types via `linked_entity_type` + `linked_entity_id`

## Caching

**Strategy:** Not explicitly configured in current system
- Application-level caching via React Context
- Supabase client handles connection pooling

## CI/CD & Deployment

**Hosting:**
- Vercel (Next.js deployment platform)
- Environment: Production and preview deployments

**Deployment Requirements:**
- Node.js environment with Next.js build support
- Environment variables: All `NEXT_PUBLIC_*` and server-side keys

## Environment Configuration

**Required Environment Variables:**

| Variable | Scope | Purpose | Example |
|----------|-------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key for client | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Admin service role (dangerous!) | (hidden) |
| `RESEND_API_KEY` | Server | Email API key | (hidden) |
| `NEXT_PUBLIC_APP_URL` | Public | Application base URL | `https://teravolta.com` |

**Configuration Files:**
- `.env.local` - Local development overrides
- `functions/.env` - Edge function environment (if used)

**Secrets Location:**
- Environment variables stored in Vercel project settings
- Service role key protected as server-only (never exposed to client)

## Webhooks & Callbacks

**Incoming Webhooks:**
- None currently implemented
- Supabase Auth integration handles user lifecycle (created, updated)

**Outgoing Webhooks:**
- Email notifications via Resend (not true webhooks, API calls)
- Transactional emails: onboarding, invoice delivery, status updates

---

*Integration audit: 2026-01-29*
