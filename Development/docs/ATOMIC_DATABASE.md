# Atomic Database Documentation

> **Generated**: 2026-01-20
> **Source**: Live Supabase Schema (`oqnyfnyvxuxgovwwyxci`)

## Overview

This document details every table, column, relationship, and Row Level Security (RLS) policy in the Production database.

---

## Table Index

- [active_projects](#active_projects)
- [admin_inquiries](#admin_inquiries)
- [admin_requests](#admin_requests)
- [appointments](#appointments)
- [deletion_requests](#deletion_requests)
- [documents](#documents)
- [electrical_boards](#electrical_boards)
- [inquiries](#inquiries)
- [invoices](#invoices)
- [magic_links](#magic_links)
- [notifications](#notifications)
- [portfolio_projects](#portfolio_projects)
- [quotes](#quotes)
- [reschedule_tokens](#reschedule_tokens)
- [technician_leave_requests](#technician_leave_requests)
- [technician_reviews](#technician_reviews)
- [technicians](#technicians)
- [user_settings](#user_settings)
- [users](#users)

---

## Tables Detail

### `active_projects`
> Represents live projects being executed for a client.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | No | Primary Key |
| `user_id` | `uuid` | - | Yes | Link to `users.id` (Client) |
| `service_type` | `text` | - | No | e.g. 'consulting', 'efficiency' |
| `status` | `text` | `'active'` | No | Project status |
| `created_at` | `timestamptz` | `now()` | No | |
| `updated_at` | `timestamptz` | `now()` | No | |
| `client_name` | `text` | - | Yes | Snapshot of name |
| `client_email` | `text` | - | Yes | Snapshot of email |
| `start_date` | `date` | - | Yes | |
| `description` | `text` | - | Yes | |
| `address` | `text` | - | Yes | |
| `timeline` | `jsonb` | `'[]'` | Yes | Array of timeline events |
| `assigned_technicians` | `_text` | - | Yes | Array of Technician IDs |
| `quote_id` | `uuid` | - | Yes | Originating Quote ID |

**Relations**:
- `user_id` -> `users.id`
- `quote_id` -> `quotes.id`

**RLS Policies**:
- **Super Admins manage all**: `ALL` using `is_super_admin()`
- **Users manage own projects**: `ALL` using `(auth.uid() = user_id)`
- **Admins limited management**: `ALL` using `is_admin_or_super()`
- **Admins can manage active projects**: `ALL` using `is_admin()`

---

### `admin_inquiries`
> Internal inquiries/notes created by admins.

**RLS Policies**:
- **Super Admins manage all**: `ALL` using `is_super_admin()`
- **Admins can create/read/update**: `INSERT/SELECT/UPDATE` using `is_admin()`

---

### `admin_requests`
> Requests for admin actions (e.g. access requests).

**RLS Policies**:
- **Admins can update requests**: `UPDATE` using `auth.role() = 'service_role'` or Admin check.
- **Super Admins manage all**: `ALL` using `is_super_admin()`

---

### `appointments`
> Field service visits scheduled for technicians.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `extensions.uuid_generate_v4()` | No | PK |
| `project_id` | `uuid` | - | No | FK to `active_projects` |
| `technician_id` | `uuid` | - | Yes | FK to `users.id` (Technician) |
| `client_id` | `uuid` | - | Yes | FK to `users.id` |
| `scheduled_time` | `timestamptz` | - | No | |
| `status` | `text` | `'scheduled'` | No | scheduled, on_route, in_progress, completed |
| `notes` | `text` | - | Yes | |
| `evidence_photos` | `_text` | - | Yes | Array of storage URLs |
| `check_in_time` | `timestamptz` | - | Yes | |
| `check_out_time` | `timestamptz` | - | Yes | |

**Relations**:
- `project_id` -> `active_projects.id`
- `technician_id` -> `users.id`
- `client_id` -> `users.id`

**RLS Policies**:
- **Technicians can update assigned**: `UPDATE` using `(auth.uid() = technician_id)`
- **Admins can manage**: `ALL` using `is_admin()`
- **Clients can read own**: `SELECT` using `(auth.uid() = client_id)`

---

### `documents`
> Central file registry linking Storage files to Entities.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `uuid_generate_v4()` | No | PK |
| `entity_type` | `text` | - | Yes | e.g. 'projects', 'quotes' |
| `entity_id` | `uuid` | - | Yes | ID of the linked entity |
| `storage_path` | `text` | - | Yes | Path in Supabase Storage |
| `download_url` | `text` | - | Yes | Public or Signed URL |
| `uploaded_by` | `uuid` | - | Yes | FK to `users.id` |
| `category` | `text` | - | Yes | e.g. 'bill', 'contract' |

**Relations**:
- `uploaded_by` -> `auth.users.id`
- `project_id` -> `active_projects.id` (Legacy/Specific column)

RLS:
- **Users can read own docs**: `SELECT` where `uploaded_by = auth.uid()`
- **Admins view all**: `SELECT` where `is_admin()`

---

### `inquiries`
> Raw form submissions from the public website (non-quote).

**RLS Policies**:
- **Anyone can insert**: `INSERT` using `true` (Public)
- **Admins view all**: `SELECT` using `is_admin_or_super()`

---

### `notifications`
> In-app notifications for users.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | No | PK |
| `user_id` | `uuid` | - | No | Recipient |
| `title` | `text` | - | No | |
| `message` | `text` | - | Yes | |
| `read` | `boolean` | `false` | No | |
| `type` | `text` | `'info'` | No | info, success, warning, error |

**RLS Policies**:
- **Users manage own**: `ALL` using `(auth.uid() = user_id)`
- **Admins can insert**: `INSERT` using `is_admin()`

---

### `quotes`
> Detailed service requests awaiting approval.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | No | PK |
| `service` | `text` | - | No | consulting, advocacy, efficiency |
| `status` | `text` | `'pending_review'` | No | |
| `client_name` | `text` | - | No | |
| `client_email` | `text` | - | No | |
| `user_id` | `uuid` | - | Yes | Linked user if logged in |
| `bill_files` | `jsonb` | `'[]'` | Yes | Array of file metadata |
| `generated_quote_url` | `text` | - | Yes | PDF URL |

**RLS Policies**:
- **Public Insert**: `INSERT` using `true`
- **Admins manage all**: `ALL` using `is_admin()`
- **Owners view own**: `SELECT` using `(auth.uid() = user_id)` OR email match (if implemented via function)

---

### `technician_leave_requests`
> Calendar management for technician availability.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | No | PK |
| `technician_id` | `uuid` | - | No | FK to `technicians` |
| `start_date` | `date` | - | No | |
| `end_date` | `date` | - | No | |
| `reason` | `text` | - | Yes | |
| `status` | `text` | `'pending'` | No | pending, approved, rejected |
| `leave_type` | `text` | `'other'` | No | vacation, sickness, etc. |

**Relations**:
- `technician_id` -> `technicians.id`

**RLS Policies**:
- **Technicians manage own**: `ALL` using `(auth.uid() = technician_id)`
- **Admins manage all**: `ALL` using `is_admin_or_super()`

---

### `technician_reviews`
> Ratings and feedback for technician performance.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | No | PK |
| `technician_id` | `uuid` | - | No | FK to `technicians` |
| `rating` | `integer` | - | No | 1-5 |
| `comment` | `text` | - | Yes | |

**Relations**:
- `technician_id` -> `technicians.id`
- `project_id` -> `active_projects.id`
- `reviewer_id` -> `users.id`

---

### `technicians`
> Profile extension for Technician users.

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | - | No | PK |
| `uid` | `uuid` | - | Yes | Link to `users.id` / `auth.users` |
| `specialties` | `_text` | - | Yes | Array of skills |
| `working_hours` | `jsonb` | - | Yes | Schedule config |
| `active` | `boolean` | `true` | Yes | Availability status |

**RLS Policies**:
- **Admins manage**: `ALL` using `is_admin_or_super()`
- **Technicians read**: `SELECT` using `true` (Public read for assignment?)

---

### `users`
> Main user profile table (extending `auth.users`).

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `id` | `uuid` | - | No | PK, matches `auth.users.id` |
| `email` | `text` | - | No | |
| `role` | `text` | `'customer'` | No | super_admin, admin, technician, customer |
| `full_name` | `text` | - | Yes | |
| `avatar_url` | `text` | - | Yes | |

**RLS Policies**:
- **Users read all**: `SELECT` using `(auth.uid() IS NOT NULL)` (Directory visibility)
- **Users update own**: `UPDATE` using `(auth.uid() = id)`
- **Admins insert/manage**: `ALL` using `is_admin()` or `is_super_admin()`


---

### `deletion_requests`
> **[NEW]** Requests for account deletion.

**RLS Policies**:
- **Users can verify**: `ALL` using `true` (Likely public with token check?)

---

### `electrical_boards`
> **[NEW]** Technical details for electrical panels (Efficiency services).

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `appointment_id` | `uuid` | FK to `appointments` |
| `system_type` | `text` | monophase/triphase |
| `photos` | `jsonb` | Photo URLs |

**RLS Policies**:
- **Technicians insert/update**: Check `technician_id` on appt?
- **Admins manage**: `is_admin_or_super()`

---

### `invoices`
> **[NEW]** Standalone invoices table (possibly replacing JSONB phases?).

**RLS Policies**:
- **Admins manage**: `is_admin()`

---

### `magic_links`
> **[NEW]** Temporary login tokens.

---

### `portfolio_projects`
> **[NEW]** Publiccase studies or past work.

---

### `reschedule_tokens`
> **[NEW]** Secure tokens for client rescheduling.

---

## 4. Deep Dive Findings (Phase 1 Audit)

### Critical Gaps
1.  **Missing Indices**:
    -   `active_projects`: No index on `user_id` or `status`. High impact on dashboard queries.
    -   `appointments`: No index on `project_id`, `technician_id`. Field app performance risk.
    -   `quotes`: No index on `user_id`.
2.  **Privacy Risk**:
    -   `users` table policy `Users can read all users` (`(auth.uid() IS NOT NULL)`) allows any logged-in customer to scrape the entire user base. **Recommendation: Restrict to `id = auth.uid()` or Admin only.**
3.  **Redundant Policies**:
    -   `active_projects`: Multiple policies for Admins (`Admins can manage active projects` vs `Admins limited management`).
4.  **Schema Drift**:
    -   `types.ts` has `ActiveProject.phases` (JSONB) but DB has `invoices` table. need to clarify source of truth for billing.

### Function Analysis
-   `is_admin()`: Correctly includes `super_admin`.
-   `is_super_admin()`: Strict check for `super_admin`.
