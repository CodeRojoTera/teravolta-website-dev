# Atomic Architecture Documentation

> **Generated**: 2026-01-20
> **Scope**: Application Logic Layer (Code -> Database)

## Overview

This document maps the invisible "wiring" of the application: Types, Services, API Routes, and State Management.

---

## 1. Core Data Models (`lib/types.ts`)

These TypeScript interfaces are the single source of truth for frontend logic, mapping directly (or with adaptation) to Database tables.

| Interface | Mapped Table | Key Enums / Consts | Description |
|-----------|--------------|--------------------|-------------|
| `User` | `users` | `UserRole` ('customer', 'admin', 'technician') | Base user profile extending Auth. |
| `Quote` | `quotes` | `QuoteStatus`, `ServiceType` | Service inquiry before project creation. |
| `ActiveProject` | `active_projects` | `ProjectStatus`, `PaymentStatus` | Live engagement with tracking. |
| `Technician` | `technicians` | `WorkingHours` | Technician profile & availability. |
| `Appointment` | `appointments` | `AppointmentStatus` | Scheduled site visit. |
| `Document` | `documents` | `DocumentEntityType` | Unified file attachment. |
| `Inquiry` | `inquiries` | `InquiryStatus` | Generic contact form. |
| `ElectricalBoard` | `electrical_boards` | `SYSTEM_TYPES` | Efficiency technical inspection data. |
| `Invoice` | `invoices` | `InvoiceStatus` | *Schema Drift*: Hybrid use with JSONB phases? |
| - | `deletion_requests` | - | Account deletion queue. |

---

## 2. Service Layer (`app/services/*.ts`)

The Service Layer abstracts Supabase calls. It handles data fetching, business logic (e.g., availability checks), and type mapping.

### `activeProjectService.ts`
- **`getAll()`**: Returns `ActiveProject[]`.
- **`getById(id)`**: Returns `ActiveProject`.
- **`getByUserId(userId)`**: For Customer Dashboard.
- **`getByTechnicianId(techId)`**: For Technician Dashboard.
- **`create(data)`**: Calls `/api/create-project` (Bypasses RLS).
- **`assignTechnicians(projectId, ids)`**: Updates `active_projects` and sends Notification via API.
- **`uploadDocument(file, ...)`**: Uploads to Storage bucket `documents` + Inserts DB record.

### `quoteService.ts`
- **`create(data)`**: Inserts into `quotes`. RLS allows public `INSERT`.
- **`getAll()`**: Admin access.
- **`updateStatus(id, status)`**: Transitions state (pending -> approved).

### `technicianService.ts`
- **`getAll()`**: Fetches all + specific "today's availability" logic.
- **`findAvailableTechnicians(date, time)`**: Complex active logic:
    1.  Get all active techs.
    2.  Filter out those with `active_projects` conflict at `time`.
    3.  Filter out those on `technician_leave_requests`.
- **`requestLeave(...)`**: Inserts leave request.

### `appointmentService.ts`
- **`create(...)`**: Inserts appointment.
- **`getUpcoming(...)`**: Field app logic.

### Other Services
- **`emailService.ts`**: Wrapper for `/api/send-email`.
- **`notificationService.ts`**: Fetches `notifications`, marks read.
- **`rescheduleService.ts`**: Handles Appointment update + Notification logic.
- **`reviewService.ts`**: CRUD for `technician_reviews`.

---

## 3. Server-Side API (`app/api/*`)

API Routes are used for privileged operations (Admin SDK interactions) or complex atomic transactions that cannot be handled by client-side RLS alone.

### Transactional Routes
- **`/api/create-quote`**: Validates input -> Creates Quote -> (Optional) Triggers Email.
- **`/api/create-project`**: Admin-level project creation.
- **`/api/create-technician`**: Creates Auth User + Technician Profile (Requires Admin).
- **`/api/assign-technician`**: Assigns + Notifies.

### Auth & Onboarding
- **`/api/create-magic-link`**: Generates passwordless login for new users.
- **`/api/send-onboarding-email`**: Sends welcome packet.
- **`/api/verify-token`**: Validates onboarding tokens.

### Communication
- **`/api/send-email`**: Generic mailer (Postmark/SendGrid wrapper).
- **`/api/create-notification`**: Inter-user system notifications.

---

## 4. State Management & Providers

Global state is managed via React Context providers in `components/`.

- **`AuthProvider`**: Wraps Supabase Auth (`onAuthStateChange`). Exposes `user`, `role`, `loading`.
- **`LanguageProvider`**: Manages `en` / `es` context.
- **`ViewModeProvider`**: Controls UI density/mode (if used).

---

## 5. File Usage & Storage

- **Bucket**: `documents`
- **Access**: Controlled by `documents` table RLS.
- **Pathing**: `[EntityId]/[Timestamp]-[Details].[Ext]`
- **Logic**: `uploadDocument` in services handles the 2-step process (Upload File + DB Record).
