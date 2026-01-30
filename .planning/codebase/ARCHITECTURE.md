# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** Client-Server Web Application with Role-Based Portal Architecture

**Key Characteristics:**
- Multi-tenant SPA (Single Page App) using Next.js 15 with App Router
- Server-side session management via Supabase Auth with SSR cookie support
- PostgreSQL-backed relational database with Row Level Security (RLS)
- Role-based access control (customer, admin, super_admin, technician) enforced at middleware, API, and database layers
- Three distinct user portals: Public website, Customer portal, Admin portal, Technician portal
- Soft-delete infrastructure with cascading deletes and comprehensive audit logging
- Document management with polymorphic entity linking (JSWONB/JSON storage)

## Layers

**Presentation Layer (Client):**
- Purpose: React/TypeScript UI components served by Next.js
- Location: `app/`, `components/`
- Contains: Page components, layouts, forms, modals, admin dashboards
- Depends on: Auth context, Supabase client, API routes
- Used by: End users via browser

**API Layer:**
- Purpose: Server-side logic for business operations, data validation, auth operations
- Location: `app/api/`
- Contains: Route handlers for creating projects, inquiries, quotes, magic links, notifications, technician operations
- Key routes:
  - `POST /api/create-inquiry` - Submit contact form inquiry
  - `POST /api/create-quote` - Create energy efficiency quote
  - `POST /api/create-project` - Convert quote/inquiry to active project
  - `POST /api/create-magic-link` - Generate one-time login tokens
  - `POST /api/activate-account` - Onboard users with magic links
  - `POST /api/assign-technician` - Schedule appointments and assign technicians
  - `POST /api/availability` - Check technician availability for dates
- Depends on: Supabase Admin Client (service role), Auth system
- Used by: Frontend forms, middleware redirects

**Service Layer:**
- Purpose: Business logic encapsulation for domain operations
- Location: `app/services/`
- Contains: ProjectService, AppointmentService, TechnicianService, NotificationService, EmailService, ReviewService, QuoteService
- Patterns: Fetch-transform-persist, with query result validation
- Depends on: Supabase Client, external APIs (email, webhooks)

**Data Access Layer:**
- Purpose: Database and Supabase operations
- Location: `lib/supabase.ts`, `lib/supabase-admin.ts`
- Contains: Two client configurations:
  - `supabase`: Browser client with SSR cookie support for client-side operations
  - `supabaseAdmin`: Server-side admin client with service role key (bypasses RLS, for API routes only)
- Depends on: Supabase SDK, environment configuration
- Used by: All API routes and services

**Authentication & Authorization:**
- Purpose: User identity and permission management
- Location: `components/AuthProvider.tsx`, `middleware.ts`, `components/RoleGuard.tsx`
- Patterns:
  - Supabase Auth (JWT tokens) for identity
  - Custom `users` table for role and profile data
  - Middleware redirects unauthenticated /portal/* requests to login
  - RoleGuard component enforces role requirements on client
  - Database RLS policies enforce role-based access server-side
- Key flows:
  1. Magic link sent to email → User clicks → `activate-account` API creates auth user → `users` table record created
  2. Login via email → JWT stored in httpOnly cookie → Middleware refreshes session → Client retrieves user data

**Middleware (Auth & Routing):**
- Location: `middleware.ts`
- Responsibility: Session management and protected route redirection
- Flow:
  1. Intercepts all requests (except static assets)
  2. Creates Supabase server client with cookies
  3. Refreshes auth session via `getUser()`
  4. Redirects unauthenticated users to `/portal/login` when accessing protected `/portal/*` routes
  5. Preserves original path in `redirect_to` param for post-login navigation

## Data Flow

**User Inquiry → Project Creation Flow:**

1. Customer submits inquiry form on public site (`/inquiry` or `/contact`)
   - Form data sent to `POST /api/create-inquiry`
   - Supabase Admin inserts inquiry record
   - Customer receives confirmation response

2. Admin reviews inquiry in dashboard (`/portal/admin/inquiries`)
   - Queries `inquiries` table
   - Can convert inquiry to quote via `POST /api/conversions/inquiry-to-quote`
   - Quote created in `quotes` table with inquiry data copied

3. Customer reviews quote in portal (`/portal/customer/...`)
   - Quote displayed with service details, property info, timeline, budget, phases

4. Customer approves quote (or admin creates project directly)
   - `POST /api/create-project` called with quote ID
   - API fetches full quote data to enrich project
   - Creates `active_projects` record with user_id linked
   - Transfers documents from quote to project (updates `documents.linked_entity_id`)
   - Updates quote status to 'approved' and links to project
   - Creates notification for customer
   - Returns project UUID to frontend

5. Admin schedules appointment (`/portal/admin/active-projects/[id]`)
   - Selects technician and date via `POST /api/assign-technician`
   - Creates `appointments` record with technician_id and project_id
   - Checks technician availability (queries `technician_leaves` for conflicts)
   - Syncs appointment data to active_projects
   - Creates notification

6. Technician performs work
   - Logs in to technician portal (`/portal/technician`)
   - Views assigned appointments
   - For Efficiency service: performs electrical board assessment, creates `electrical_boards` records
   - For all services: uploads photos/documents, marks appointment complete
   - Documents linked to project via `documents` table

7. Admin manages project lifecycle
   - Tracks through project status states
   - Generates invoices and sends to customer
   - Marks phases as paid
   - Moves to completed when work done

**Document Flow (Polymorphic Linking):**

1. Customer uploads document with quote/inquiry form
   - File stored in Supabase Storage (bucket: `documents/`)
   - Metadata inserted to `documents` table with:
     - `linked_entity_type`: 'quotes' | 'inquiries' | 'active_projects' | 'technicians'
     - `linked_entity_id`: UUID of the entity
     - `category`: bill | contract | invoice | report | deliverable | payment_proof | site_plan | meter_reading | claim_evidence | regulatory_filing | other

2. Document transfer on project creation
   - When quote → project conversion, documents bulk updated:
   - `UPDATE documents SET linked_entity_id = project.id WHERE linked_entity_id = quote.id`

3. Document querying by admin
   - Query all project documents: `SELECT * FROM documents WHERE linked_entity_type = 'active_projects' AND linked_entity_id = ?`
   - RLS ensures admins see all, customers only see their own

**Cascade Delete & Audit Flow:**

1. When user deleted (soft delete):
   - User marked with `deleted_at` timestamp, `deletion_scheduled_for` (15 days), `deleted_by` (admin/self)
   - CASCADE constraints trigger automatic deletion of related records:
     - All `active_projects` with `user_id = deleted_user`
     - All `quotes` with `user_id = deleted_user`
     - All `inquiries` with `user_id = deleted_user`
     - All `notifications` for that user
   - Cascade deletions trigger related cascades:
     - Project deletion cascades to `appointments`, `invoices`
     - Appointment deletion cascades to `electrical_boards`
   - Each deletion logged to `deletion_audit_log` with:
     - JSONB snapshot of deleted record
     - Deletion reason and type (soft/hard/cascade/scheduled)
     - Parent deletion reference for cascade tracking

2. Audit log inspection
   - Only super_admin can view `deletion_audit_log` via RLS
   - Can trace cascade chains via `parent_deletion_id`
   - Full record snapshots stored for compliance/recovery

**State Management:**

- **Authentication State:** Stored in Supabase Auth (JWT in httpOnly cookie), synced to client via `useAuth()` hook
- **User Session:** Persisted across tabs via cookie middleware
- **UI State:** React component state (sidebar open/closed, dropdowns, modals) - ephemeral, not persisted
- **Role Data:** Fetched from `users` table on component mount, used by RoleGuard and admin layout
- **Real-time Updates:** Supabase Realtime subscriptions used in admin layout to watch `admin_inquiries` for unresolved counts

## Key Abstractions

**Auth Session Management:**
- Purpose: Keep user session alive across SSR boundaries with cookie sync
- Implementation: Supabase SSR client in middleware + browser client in layout
- File: `middleware.ts`, `lib/supabase.ts`
- Pattern: Dual-client approach (one per environment) with cookie bridge

**Role-Based Access Control (RBAC):**
- Purpose: Enforce authorization at multiple layers
- Implementations:
  - Middleware: Redirects unauthenticated to login
  - RoleGuard: Wraps pages requiring specific role (`requiredRole="admin"`)
  - Database RLS: Policies on each table check `users.role` via auth.uid()
- Files: `middleware.ts`, `components/RoleGuard.tsx`, migration files

**Document Polymorphism:**
- Purpose: Single table stores documents for multiple entity types without strong typing
- Implementation: `documents` table with columns:
  - `linked_entity_type`: TEXT CHECK IN ('active_projects', 'quotes', 'users', 'technicians')
  - `linked_entity_id`: UUID
  - Queries filter by type + ID to get entity-specific documents
- Benefit: Simplifies schema (one table vs. multiple), enables document transfer on entity conversion
- Trade-off: Requires runtime validation of entity existence (no FK constraint due to polymorphism)

**Service Locator Pattern (API Routes):**
- Purpose: Centralized entry points for business operations
- Routes act as "controllers" that:
  1. Parse request body
  2. Validate inputs
  3. Fetch related data (user lookup, quote enrichment, etc.)
  4. Perform mutations (insert/update DB)
  5. Trigger side effects (create notifications, send emails)
  6. Return result
- Example: `app/api/create-project/route.ts` orchestrates user resolution, quote data enrichment, document transfer, project creation

**Soft Delete + Audit:**
- Purpose: Support 15-day recovery grace period and compliance auditing
- Implementation:
  - Soft delete columns: `deleted_at`, `deletion_scheduled_for`, `deleted_by` on users table
  - CASCADE constraints on FKs for automatic propagation
  - `deletion_audit_log` table records all deletions with snapshots and chain tracking
- Pattern: Application logic checks `deleted_at IS NULL` in RLS policies; hard delete deferred to cron job

## Entry Points

**Public Website:**
- Location: `app/page.tsx` (home), `app/services/`, `app/inquiry/`, `app/contact/`, `app/quote/`
- Triggers: Direct navigation via browser
- Responsibilities:
  - Display marketing content
  - Host inquiry/quote forms
  - Link to customer/admin portals

**Customer Portal:**
- Location: `app/portal/customer/`
- Entry point: `/portal/customer` (redirects here after login if role is 'customer')
- Pages:
  - `page.tsx`: Dashboard showing active projects
  - `projects/[id]/page.tsx`: Project detail view
  - `request-service/page.tsx`: Start new request
  - `settings/page.tsx`: Account settings
- Responsibilities: View projects, upload documents, track appointments

**Admin Portal:**
- Location: `app/portal/admin/`
- Entry point: `/portal/admin` (redirects here after login if role is 'admin' or 'super_admin')
- Key pages:
  - `page.tsx`: Dashboard
  - `inquiries/page.tsx`: List and manage inquiries
  - `quotes/page.tsx`: Review and manage quotes
  - `active-projects/page.tsx`: List projects, schedule appointments
  - `users/`: Manage customers, admins, technicians
  - `technicians/`: Schedule, view availability
  - `requests/page.tsx`: Admin requests (super_admin only)
- Responsibilities: Manage full operation lifecycle

**Technician Portal:**
- Location: `app/portal/technician/`
- Entry point: `/portal/technician`
- Pages:
  - `page.tsx`: Dashboard showing assigned appointments
  - Electrical board inspection forms (Efficiency service)
- Responsibilities: View assignments, perform work, submit assessments

**API Endpoints (Server-Side Entry Points):**
- All in `app/api/`
- Authentication: Supabase Admin Client (service role, bypasses RLS) or user-initiated requests with auth check
- Error Handling: All return NextResponse.json with status codes

## Error Handling

**Strategy:** Try-catch at route handlers, validation errors return 400, system errors return 500, errors logged to console

**Patterns:**

**Database Errors:**
```typescript
// In API routes
try {
  const { data, error } = await supabaseAdmin.from('table').select('*');
  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
  return NextResponse.json(data);
} catch (error) {
  console.error('Unexpected error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

**Validation Errors:**
```typescript
// Early validation with meaningful feedback
const requiredFields = ['field1', 'field2'];
for (const field of requiredFields) {
  if (!body[field]) {
    return NextResponse.json(
      { error: `Missing required field: ${field}` },
      { status: 400 }
    );
  }
}
```

**Auth Errors:**
- Middleware: Redirects to `/portal/login`
- API routes: Check auth.uid() and return 401 if missing
- Component level: `useAuth()` hook provides user object, components render conditionally

**Service Layer:**
- Services throw errors which bubble to route handlers
- Route handlers catch and format for HTTP response

## Cross-Cutting Concerns

**Logging:**
- Approach: console.log/error in API routes and services
- Location: `app/api/*` and `app/services/*`
- Patterns: Log before/after major operations, log errors with context
- No centralized logging service; direct to console (suitable for development, can add external service)

**Validation:**
- Approach: Per-route validation in API handlers
- Pattern: Check required fields early, validate types/formats as needed
- No schema validation library (could add Zod/Joi)
- Database constraints (CHECK, NOT NULL) provide secondary validation

**Authentication:**
- Provider: Supabase Auth (JWT-based)
- Storage: httpOnly cookies (managed by SSR client)
- Refresh: Middleware calls `getUser()` on every request to refresh JWT
- Enforcement: Middleware + RoleGuard + RLS policies

**Authorization:**
- Roles: 'customer', 'admin', 'super_admin', 'technician' stored in `users.role`
- Enforcement Layers:
  1. Middleware redirects unauthenticated
  2. RoleGuard component wraps pages (e.g., `<RoleGuard requiredRole="admin">`)
  3. API routes check role in admin client operations
  4. Database RLS policies check `users.role` for table access
- Example RLS policy (admin-only operations):
```sql
CREATE POLICY "Admins can view all records" ON table_name
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE uid = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
```

**Data Consistency:**
- Foreign keys with CASCADE or explicit constraint checks
- Atomic operations: Quote → Project conversion fetches full quote data before creating project
- Document transfer as part of project creation ensures no orphaned docs
- Soft delete + audit trail enables recovery

**Pagination/Filtering:**
- Implemented in components via `.limit()` and `.range()` on Supabase queries
- Example from admin pages: `.select().range(offset, offset + limit)`
- No global pagination service; per-page implementation

## Database Schema - Complete Reference

**Note:** Database is Supabase PostgreSQL. All tables have RLS enabled unless noted.

### Core User & Auth Tables

**auth.users (Supabase Built-in):**
- id: uuid (PK)
- email: text (unique)
- encrypted_password: text
- created_at: timestamptz
- *Managed by Supabase Auth system*

**public.users:**
- id: uuid (PK) - references auth.users.id
- uid: uuid - alternative key, references auth.users(id) [DEPRECATED - use id]
- email: text (NOT NULL)
- full_name: text
- phone: text
- company: text
- role: text CHECK IN ('customer', 'admin', 'super_admin', 'technician') - defaults to 'customer'
- created_at: timestamptz (DEFAULT now())
- deleted_at: timestamptz (NULL) - soft delete timestamp
- deletion_scheduled_for: timestamptz (NULL) - scheduled hard deletion time (15 days out)
- deleted_by: uuid FK users(id) (NULL) - who initiated deletion
- **Indexes:**
  - idx_users_deletion_scheduled (on deletion_scheduled_for WHERE IS NOT NULL)
  - idx_users_deleted_at (on deleted_at WHERE IS NULL) - for filtering active users
- **Soft delete infrastructure:** Supports 15-day grace period before hard deletion
- **Constraints:** CASCADE delete on active_projects, quotes, inquiries, notifications

### Service/Project Tables

**public.active_projects:**
- id: uuid (PK)
- user_id: uuid FK users(id) ON DELETE CASCADE (NOT NULL) - project owner
- project_name: text
- service: text CHECK IN ('efficiency', 'consulting', 'advocacy') (NOT NULL)
- package: text - service package selected
- status: text CHECK IN [16 valid statuses] (see `lib/types.ts` PROJECT_STATUSES)
- payment_status: text CHECK IN ('pending', 'paid', 'partial', 'refunded')
- progress: integer (0-100)
- amount: numeric (project value)
- description: text
- challenge: text
- solution: text
- result: text
- timeline: jsonb DEFAULT '[]'::jsonb - history array
- client_timeline: text - customer's desired timeline ("ASAP", "3 months", etc.)
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz
- start_date: date
- estimated_end_date: date
- address: text
- city: text
- state: text
- zip_code: text
- property_type: text - 'residential', 'apartment', 'small-business', 'office', 'industrial'
- property_size: text
- monthly_bill: text
- budget: text - estimated budget range
- project_description: text - detailed description
- connectivity_type: text - 'wifi' or '3g' (Efficiency only)
- device_option: text - 'purchase' or 'rent' (Efficiency only)
- client_name: text
- client_email: text
- client_phone: text
- client_company: text - added 2026-01-10
- appointed_technician_id: uuid FK technicians(id) (NULL)
- scheduled_date: date
- scheduled_time: time
- appointment_id: uuid FK appointments(id) (NULL)
- source_quote_id: uuid FK quotes(id) (NULL) - if created from quote
- source_inquiry_id: uuid FK inquiries(id) (NULL) - if created from inquiry
- phases: jsonb DEFAULT '[]'::jsonb - payment phases for Consulting/Advocacy
- invoice_sent_at: timestamptz (NULL)
- **Indexes:** idx_active_projects_user_id, idx_active_projects_status
- **Soft delete:** Cascades via FK on user_id; no explicit deleted_at column
- **Constraints:** CASCADE delete to appointments, invoices

**public.quotes:**
- id: uuid (PK)
- user_id: uuid FK users(id) ON DELETE CASCADE (NULL) - quote owner (can be NULL for pre-onboarding)
- service: text CHECK IN ('efficiency', 'consulting', 'advocacy') (NOT NULL)
- status: text CHECK IN ('pending_review', 'in_review', 'approved', 'paid', 'rejected', 'cancelled')
- client_type: text CHECK IN ('residential', 'business')
- client_name: text (NOT NULL)
- client_email: text (NOT NULL)
- client_phone: text (NOT NULL)
- client_company: text (NULL) - business name if business type
- property_type: text
- property_size: text
- current_bill: text
- device_mode: text - 'purchase' or 'rental' (Efficiency only)
- connectivity: text - 'wifi' or 'cellular' (Efficiency only)
- timeline: text - desired timeline (Consulting/Advocacy)
- budget: text - estimated budget (Consulting/Advocacy)
- project_description: text
- city: text
- state: text
- zip_code: text
- preferred_contact: text
- message: text - additional comments
- amount: numeric (quote value)
- linked_user_id: uuid FK users(id) (NULL) - user who onboarded from this quote
- linked_project_id: uuid FK active_projects(id) (NULL) - project created from this quote
- phases: jsonb DEFAULT '[]'::jsonb - payment phases for multi-phase quotes
- submitted_at: timestamptz
- created_at: timestamptz (DEFAULT now())
- reviewed_by: uuid FK users(id) (NULL) - admin who reviewed
- reviewed_at: timestamptz (NULL)
- **Indexes:** idx_quotes_user_id, idx_quotes_status
- **Soft delete:** Cascades via FK on user_id
- **Constraints:** CASCADE delete on user_id
- **Purpose:** Estimates, pricing, service configuration before project creation

**public.inquiries:**
- id: uuid (PK)
- user_id: uuid FK auth.users(id) ON DELETE CASCADE (NULL) - added 2026-01-16
- client_type: text CHECK IN ('residential', 'business')
- full_name: text (NOT NULL)
- email: text (NOT NULL)
- phone: text (NULL)
- company: text - business company name
- service: text - service type inquired about
- subject: text
- message: text
- project_description: text
- status: text CHECK IN ('new', 'in_progress', 'responded', 'closed')
- language: text CHECK IN ('en', 'es') - form language
- source: text - form source
- address: text - property address
- city: text
- state: text
- zip_code: text
- timeline: text - desired timeline
- budget: text - estimated budget
- property_type: text
- preferred_contact: text - 'email' or 'phone'
- created_at: timestamptz (DEFAULT now())
- **Indexes:** idx_inquiries_status
- **Soft delete:** Cascades via FK on user_id
- **Constraints:** CASCADE delete on user_id
- **Purpose:** First contact channel, can convert to Quote

### Appointment & Field Service Tables

**public.technicians:**
- id: uuid (PK)
- uid: uuid FK auth.users(id) (NULL) - optional auth access
- full_name: text (NOT NULL)
- email: text (NOT NULL)
- phone: text (NOT NULL)
- specialties: text[] - array of specialization strings ('solar', 'electrical', etc.)
- active: boolean (DEFAULT true)
- working_schedule: jsonb - working hours configuration
- vacation_quota: integer - annual vacation days
- created_at: timestamptz (DEFAULT now())
- **Indexes:** idx_technicians_uid, idx_technicians_active
- **Purpose:** Staff who perform installations and assessments

**public.appointments:**
- id: uuid (PK)
- project_id: uuid FK active_projects(id) ON DELETE CASCADE (NOT NULL)
- technician_id: uuid FK technicians(id) (NOT NULL)
- technician_uid: uuid (NULL) - denormalized for RLS efficiency
- technician_name: text - denormalized for display
- date: date (NOT NULL) - scheduled date
- status: text CHECK IN ('scheduled', 'on_route', 'in_progress', 'completed', 'cancelled', 'incomplete')
- client_address: text (NOT NULL) - installation address
- client_name: text (NOT NULL)
- client_phone: text (NOT NULL)
- client_email: text (NULL)
- client_user_id: uuid (NULL) - FK to customer user
- check_in_time: timestamptz (NULL)
- check_out_time: timestamptz (NULL)
- location_start: jsonb (NULL) - {lat: number, lng: number}
- location_end: jsonb (NULL) - {lat: number, lng: number}
- notes: text (NULL)
- photos: text[] DEFAULT '[]'::text[] - photo URLs
- created_at: timestamptz (DEFAULT now())
- created_by: uuid - who created appointment
- **Indexes:** idx_appointments_project_id, idx_appointments_technician_id, idx_appointments_date
- **Soft delete:** Cascades via FK on project_id
- **Constraints:** CASCADE delete to electrical_boards
- **Purpose:** Schedule field service, track work completion

**public.technician_leaves:**
- id: uuid (PK)
- technician_id: uuid FK technicians(id) (NOT NULL)
- start_date: date (NOT NULL)
- end_date: date (NOT NULL)
- reason: text (NOT NULL)
- status: text CHECK IN ('pending', 'approved', 'rejected', 'cancelled')
- leave_type: text CHECK IN ('vacation', 'sickness', 'other', 'unplanned', 'suspension')
- created_at: timestamptz (DEFAULT now())
- **Purpose:** Track technician unavailability for scheduling

**public.electrical_boards:**
- id: uuid (PK)
- appointment_id: uuid FK appointments(id) ON DELETE CASCADE (NOT NULL)
- name: text (NOT NULL) - board name/identifier
- system_type: text (NOT NULL) - 'monophase_120_240', 'triphase_208_120', 'triphase_480_277'
- has_neutral: boolean (NOT NULL)
- emporia_classification: text (NOT NULL) - 'standard', 'adjustments', 'incompatible'
- incompatibility_reason: text (NULL) - 'no_neutral', 'mv', 'space', 'other'
- ct_status: text (NOT NULL) - 'fits', 'no_fit'
- ct_issue: text (NULL) - description of structural issues
- recommended_solution: text (NOT NULL) - 'standard', 'special_cts', 'industrial'
- observations: text (NULL) - technician notes
- photos: jsonb DEFAULT '[]'::jsonb - array of photo URLs
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- **Indexes:** idx_electrical_boards_appointment_id
- **Soft delete:** Cascades via FK on appointment_id
- **Constraints:** CASCADE delete on appointment_id
- **Purpose:** Efficiency 2.0 service - technical inspection of electrical panels

### Document Management Tables

**public.documents:**
- id: uuid (PK)
- name: text (NOT NULL) - original filename
- storage_path: text (NOT NULL) - Supabase Storage path
- download_url: text (NOT NULL) - public download URL
- content_type: text (NOT NULL) - MIME type
- size_bytes: bigint (NOT NULL) - file size
- linked_entity_type: text CHECK IN ('active_projects', 'quotes', 'users', 'technicians') (NOT NULL) - polymorphic
- linked_entity_id: uuid (NOT NULL) - entity this document belongs to
- category: text CHECK IN ('bill', 'contract', 'invoice', 'report', 'deliverable', 'payment_proof', 'site_plan', 'meter_reading', 'claim_evidence', 'regulatory_filing', 'other') (DEFAULT 'other')
- uploaded_by: uuid FK users(id) (NULL) - who uploaded
- uploaded_at: timestamptz (DEFAULT now())
- description: text (NULL)
- deleted_at: timestamptz (NULL) - soft delete
- **Indexes:**
  - idx_documents_entity (linked_entity_type, linked_entity_id)
  - idx_documents_category
  - idx_documents_uploaded_by
  - idx_documents_deleted_at (WHERE deleted_at IS NULL)
- **RLS Policies:**
  - Users see documents they uploaded or documents linked to their projects/quotes
  - Admins see all documents
- **Purpose:** Centralized document storage with polymorphic entity linking

### Audit & Logging Tables

**public.deletion_audit_log:**
- id: uuid (PK)
- table_name: text (NOT NULL) - which table was affected
- record_id: uuid (NOT NULL) - which record was deleted
- record_data: jsonb (NOT NULL) - full snapshot of deleted record
- deleted_at: timestamptz (DEFAULT now())
- deleted_by: uuid FK users(id) (NULL) - who initiated deletion
- delete_reason: text CHECK IN ('user_request', 'admin_action', 'inactivity', 'violation', 'cascade', NULL)
- deletion_type: text CHECK IN ('soft', 'hard', 'cascade', 'scheduled') (NOT NULL)
- parent_deletion_id: uuid FK deletion_audit_log(id) (NULL) - for cascade tracking
- related_deletions: jsonb DEFAULT '[]'::jsonb - array of {table: text, id: uuid}
- **Indexes:**
  - idx_audit_log_table_record (table_name, record_id)
  - idx_audit_log_deleted_by
  - idx_audit_log_deleted_at (DESC)
  - idx_audit_log_parent (WHERE parent_deletion_id IS NOT NULL)
- **RLS:** Only admins can view
- **Purpose:** Comprehensive deletion audit trail for compliance and recovery

### Communication Tables

**public.notifications:**
- id: uuid (PK)
- user_id: uuid FK auth.users(id) ON DELETE CASCADE (NOT NULL)
- type: text CHECK IN ('info', 'success', 'warning', 'error') (DEFAULT 'info')
- title: text (NOT NULL)
- message: text (NOT NULL)
- link: text (NULL) - action URL (e.g., /portal/active-projects/123)
- read: boolean (DEFAULT false)
- created_at: timestamptz (DEFAULT now())
- **Indexes:**
  - idx_notifications_user_id
  - idx_notifications_read (user_id, read)
- **RLS:**
  - Users see own notifications only
  - Admins can create notifications
- **Soft delete:** Cascades via FK on user_id
- **Constraints:** CASCADE delete on user_id
- **Purpose:** In-app notifications for project updates, approvals, etc.

**public.admin_requests:**
- id: uuid (PK)
- type: text CHECK IN ('incident_report', 'reassignment_request', 'reschedule_request') (NOT NULL)
- priority: text CHECK IN ('high', 'normal', 'low') (DEFAULT 'normal')
- status: text CHECK IN ('pending', 'approved', 'rejected', 'in_review') (DEFAULT 'pending')
- requester_id: uuid FK auth.users(id) (NULL) - who requested
- related_entity_id: uuid (NULL) - appointment or project ID
- related_entity_type: text CHECK IN ('appointment', 'active_project', NULL)
- details: jsonb DEFAULT '{}'::jsonb - flexible request data
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- **RLS:**
  - Users see own requests
  - Admins see all requests
- **Purpose:** Support requests from users (rescheduling, reassignment) pending admin approval

### Support/Utility Tables

**public.magic_links:**
- id: uuid (PK)
- email: text (NOT NULL)
- token: text (NOT NULL) - one-time token
- created_at: timestamptz (DEFAULT now())
- expires_at: timestamptz
- used_at: timestamptz (NULL)
- **Purpose:** One-time login links for account activation/password reset

**public.invoices:**
- id: uuid (PK)
- project_id: uuid FK active_projects(id) ON DELETE CASCADE (NOT NULL)
- amount: numeric (NOT NULL)
- status: text CHECK IN ('pending', 'paid', 'partial', 'refunded')
- created_at: timestamptz (DEFAULT now())
- paid_at: timestamptz (NULL)
- **Purpose:** Track payments for projects

### Views

**public.active_users (view):**
- Selects all users WHERE deleted_at IS NULL
- Purpose: Convenient filtering of non-deleted users

---

## Database Constraints & Cascades

**Cascade Delete Chain:**

When a user is deleted:
1. `users.id` → `active_projects.user_id` (CASCADE)
   - Deletes all projects for that user
   - Cascades to: appointments, invoices, electrical_boards
2. `users.id` → `quotes.user_id` (CASCADE)
   - Deletes all quotes
3. `users.id` → `inquiries.user_id` (CASCADE)
   - Deletes all inquiries
4. `auth.users.id` → `notifications.user_id` (CASCADE)
   - Deletes all notifications

When a project is deleted:
1. `active_projects.id` → `appointments.project_id` (CASCADE)
   - Cascades to electrical_boards
2. `active_projects.id` → `invoices.project_id` (CASCADE)

When an appointment is deleted:
1. `appointments.id` → `electrical_boards.appointment_id` (CASCADE)

All deletion events are logged to `deletion_audit_log` with parent/child tracking.

---

*Architecture analysis: 2026-01-29*
