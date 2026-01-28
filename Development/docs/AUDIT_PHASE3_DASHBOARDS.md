# Phase 3: Dashboard Atomic Discovery

> **Generated**: 2026-01-20
> **Scope**: Customer, Technician, and Admin Portals.

## 1. Customer Portal (`app/portal/customer`)

### Layout (`layout.tsx`)
- **Access Control**: Checks `useAuth`. Redirects to `/portal/login` if public.
- **Top Navigation**:
    - **Branding**: Logo links to `/`.
    - **Actions**: Notification Bell, User Dropdown, Language Switcher.
    - **Dropdown**: "Dashboard", "Settings", "Logout".
- **Styling**: Sticky header, light gray background (`#f8fafc`).

### Dashboard (`page.tsx`)
- **Data Fetching**:
    - `ActiveProjectService.getByUserId(user.id)`
    - `quotes` table (pending/reviewed)
    - `inquiries` table (pending/contacted)
- **State**:
    - `projects`: List of active projects.
    - `pendingRequests`: Merged list of Quotes + Inquiries.
- **UI Sections**:
    - **Header**: "Request Service" (CTA), "Settings" (Icon).
    - **Pending Requests Grid**: Cards for quotes/inquiries with status badges.
    - **Action Required**: Conditional banner for `pending_scheduling` or `pending_documents`.
    - **Projects Grid**: Cards showing progress, status, and specific actions (`Schedule Visit`, `Upload Bills`).
    - **Empty State**: Prompts to request new service.

### Project Detail (`projects/[id]/page.tsx`)
> **Audit Level**: Atomic
- **Security Guard**:
    - Strict checks: `project.clientId === user.id` OR `project.userId === user.id` OR `project.clientEmail === user.email`.
    - unauthorized access redirects to dashboard.
- **Embedded Features**:
    - **Scheduling Wizard**: Interactive date/time picker using `TechnicianService.getAvailableTimeSlots`.
    - **Document Hub**:
        - **Upload**: Specific flow for "Electricity Bills" (Efficiency).
        - **List**: Uses `DocumentList` component (shared).
    - **Billing/Phases**:
        - **Efficiency**: "Pending Payment" block (Simulation).
        - **Consulting**: Table view of `ProjectPhase` (Amount, Status).
    - **Reviews**: Modal to rate technician upon completion.
- **Dynamic UI**:
    - **Progress Bar**: Visual gradient (`#c3d021`).
    - **Service Fields**: Conditionally renders `propertyType`, `deviceOption`, etc. based on service.

---

## 2. Technician Portal (`app/portal/technician`)

### Layout (`layout.tsx`)
- **Guard**: Wrapped in `RoleGuard` (role="technician").
- **Design**: Mobile-first optimized headers.
- **Features**: Waze integration ready infrastructure (found in dashboard components).

### Dashboard (`page.tsx`)
- **Core Entity**: `Appointment`.
- **Primary Actions**:
    1.  **Status Flow**: Scheduled -> On Route -> In Progress -> Completed.
    2.  **Evidence**: Photo upload to `appointments` bucket.
    3.  **Incidents**: Modal to report issues (Reassigns or Notifies Admin).
    4.  **Leaves**: Leave request management system.
- **Review Trigger**: Automatically requests a review via `ReviewService` upon job completion.
- **Dependencies**: `AppointmentService`, `TechnicianService`.

### Job Execution (Embedded)
> **Audit Level**: Atomic
- **Inline Flow**: No separate details page.
- **State Management**:
    - **Scheduled**: Shows "On Route" button + Waze Link.
    - **In Progress**: Renders `<InspectionDashboard />` component significantly expanding the card.
    - **Modals**: Incident Reporting & Leave Request are local state overlays.


---

## 3. Admin Portal (`app/portal/admin`)

### Layout (`layout.tsx`)
- **Guard**: Wrapped in `RoleGuard` (role="admin").
- **Navigation**:
    - **Sidebar**: Responsive (Mobile/Desktop).
    - **Sections**:
        - **Operations**: Dashboard, Inquiries, Quotes, Projects, Technicians.
        - **Management**: Portfolio, Users, Requests (Super Admin Only).
    - **Realtime**: Subscribes to `admin_inquiries` for notification badges.

### Dashboard (`page.tsx`)
- **Metrics**:
    - Pending Inquiries/Quotes (High priority).
    - Active Technicians (derived from `on_route`/`in_progress` appointments).
    - Jobs In Progress.
    - **Urgent Incidents**: Red alert banner for projects needing rescheduling.
- **Visualization**: `Recharts` LineChart showing 6-month inquiry volume.
- **Recent Activity**: Merged feed of latest Inquiries, Quotes, and Projects.
- **Data Logic**:
    - Explicitly filters out "Efficiency" quotes in some views (Business logic?).
    - Aggregates "Active Technicians" by distinct `technician_id`.

### Quotes Module (`app/portal/admin/quotes/page.tsx`)
> **Audit Level**: Atomic
- **State**:
    - `quotes`: Full dataset from `QuoteService.getAll()`.
    - `filteredQuotes`: Display set based on `activeService`.
    - `activeService`: Filter ('all' | 'consulting' | 'efficiency' | 'advocacy').
- **Filters**:
    - **Buttons**: Tab-style filtering by Service Type.
    - **Logic**: Client-side filtering on `quote.service`.
- **Data Display (Table)**:
    - **Columns**: Client (Name+Email), Service (Badge), Details (Desc+Stats), Status, Date, Actions.
    - **Actions**: "View Details" -> router.push(`/portal/admin/quotes/${id}`).
    - **Badges**:
        - `consulting` (Blue), `advocacy` (Purple), `efficiency` (Lime).
        - Status Badges map 1:1 with `QuoteStatus` type (including `pending_review`, `paid`, `rejected`).
- **Dependencies**:
    - `QuoteService`: Fetches data.
    - `PageLoadingSkeleton`: Loading state.
    - `useLanguage`: Localization.

### Projects Module (`app/portal/admin/active-projects/page.tsx`)
> **Audit Level**: Atomic
- **State**:
    - `projects`: Fetched via `ActiveProjectService.getAll()`.
    - `activeService`: Filter tabs ('all', 'efficiency', 'consulting', 'advocacy').
    - `showWizard`: Boolean to toggle `ManualProjectWizard` modal.
- **Data Display (Grid)**:
    - **Card Layout**: Not a table. Uses standard card grid.
    - **Badges**: 
        - Service (Color-coded).
        - Status (Maps to `ProjectStatus` enum).
        - **Tags**: `PropertyType`, `DeviceOption`, `ClientTimeline`, `Budget`.
    - **Progress**: Visual progress bar (`green` | `c3d021`).
- **Logic**:
    - `isPendingSetup`: Checks for `pending_onboarding` or `pending_scheduling` to show specific alert badge.
    - **Sorting**: Pending statuses first, then by `createdAt`.

### Users Module (`app/portal/admin/users/*`)
> **Audit Level**: Atomic
#### 1. Clients (`/clients/page.tsx`)
- **Data Aggregation**:
    - **Source A**: Registered Users (Supabase `users` table where role='customer').
    - **Source B**: Pending Leads (Unregistered emails from `quotes` and `inquiries` tables).
    - **Deduplication**: Maps by email to avoid showing registered users as pending.
- **Actions**:
    - `handleResendInvite`: Generates magic link -> Sends via `/api/resend-onboarding`.
    - `handleDeleteClient`: Super Admin only (Hard delete) vs Admin (Request deletion).

#### 2. Technicians (`/technicians/page.tsx`)
- **Hybrid View**: Lists active technicians with "Working Hours" display.
- **Management**:
    - `TechnicianModal`: Create/Edit flow.
    - **Invite**: Uses `/api/resend-onboarding`.
    - **Role Logic**: Checks `userRole` ('admin' | 'super_admin').

#### 3. Staff (`/staff/page.tsx`)
- **Scope**: Manages `admin` and `super_admin` users.
- **Onboarding**:
    - Generates Magic Link via `/api/create-magic-link`.
    - Sends email via `/api/send-onboarding-email`.
    - **Note**: Distinct from Client/Tech onboarding flow?

### Inquiries Module (`app/portal/admin/inquiries/*`)
> **Audit Level**: Atomic
- **Grouping Logic**:
    - **Client Grouping**: Client-side grouping of inquiries by `clientId` (generated from email + phone).
    - **Aggregates**: Shows "New Count" and "Latest Date" per group.
- **Details Page (`[id]/page.tsx`)**:
    - **Smart Match**: Queries `inquiries` table for other records with same email/phone.
    - **Attachments**: Renders icons based on MIME type (PDF, Image, Excel, Word).
    - **Actions**: Delete (with confirmation modal).

### Remaining Admin Modules
> **Audit Level**: Atomic
#### 1. Portfolio (`app/portal/admin/portfolio/page.tsx`)
- **State**: `projects` (fetched from `portfolio_projects`).
- **Filters**: Client-side (All | Published | Drafts).
- **Actions**: Toggle `featured` / `published` (Optimistic UI update).

#### 2. Settings (`app/portal/admin/settings/page.tsx`)
- **Persistence**: `user_settings` table (Upsert logic).
- **Complexity**:
    - **Do Not Disturb**: Custom objects for logic (days array, start/end time).
    - **Email Prefs**: Frequency + Digest Time.

#### 3. Requests (`app/portal/admin/requests/page.tsx`)
- **Role**: Super Admin ONLY (`RoleGuard`).
- **Aggregation**: Merges 3 tables:
    1. `deletion_requests` (Legacy).
    2. `admin_requests` (Reschedule, Incidents).
    3. `technician_leave_requests`.
- **Logic**:
    - **Reschedule**: Generates token via `RescheduleService` -> Sends Email OR copies link.

