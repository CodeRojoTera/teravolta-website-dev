# Supabase Migration: Gap Analysis
**Date:** 2026-01-08

## 1. Users Collection vs. `public.users` Table
**Goal:** Merge Firestore `users` into Supabase `auth.users` + `public.users`.

| Field (Firestore) | Field (Supabase) | Action Required |
| :--- | :--- | :--- |
| `uid` (Doc ID) | `id` (UUID) | **CRITICAL:** Firestore UIDs are 28-char strings. Supabase User IDs are UUIDs. We must Migrate Auth to Supabase to generate new UUIDs, OR keep `id` as TEXT in public tables (already done for `technician_uid` etc, but `auth.users` requires UUID). |
| `email` | `email` | Sync to `auth.users` and `public.users`. |
| `name` / `displayName` | `full_name` | Map `name` -> `full_name`. |
| `phone` | `phone` | Sync to `auth.users`. |
| `role` | `role` | Sync to `public.users` (`admin`, `technician`, `customer`). |
| `createdAt` | `created_at` | Preserve timestamp. |
| `photoURL` | `avatar_url` | Map if exists. |

> **Decision:** We will migrate Users to Supabase Auth, which will generate **NEW UUIDs**. We must then update all Relational Data (`active_projects.client_id`, `technicians.uid`) to match these new UUIDs. *Alternatively, we can force specific UUIDs if we use the Admin API, but Firebase UIDs are not valid UUIDs, so we MUST generate new ones.*

## 2. ActiveProjects Collection vs. `public.active_projects` Table
**Goal:** Move `activeProjects` to SQL.

| Field (Firestore) | Field (Supabase) | Type | Action Required |
| :--- | :--- | :--- | :--- |
| `projectName` | `project_name` | TEXT | Rename. |
| `clientId` | `client_id` | TEXT -> UUID | **Complex:** Must update to new User UUID after Auth migration. |
| `clientName` | `client_name` | TEXT | Copy. |
| `service` | `service_type` | TEXT | Rename. |
| `status` | `status` | TEXT | Copy. |
| `progress` | `progress` | INT | Copy. |
| `assignedTo` (Array) | `technician_id` (Text) | **Mismatch** | Firestore allows multiple; Supabase currently has single `technician_id`. Need to decide: Only 1 tech? Or create junction table `project_technicians`? *Current app seems to treat it as single.* |
| `timeline` (Array of Objs) | `timeline` (JSONB) | JSONB | No change needed, map direct to JSONB. |
| `scheduledDate` | `installation_date` | DATE | Map. |
| `installationAddress` | `installation_address` | TEXT | Map. |
| `invoiceUrl` | `invoice_url` | TEXT | Copy. |

## 3. Storage Gap
*   **Firestore:** Uses `gs://teravolta-41afd.appspot.com` or `firebasestorage.googleapis.com` links.
*   **Supabase:** Uses `supabase.co/storage/v1/object/public/...`.
*   **Action:** 
    1.  Download all files from Firebase buckets (`project-files`, `invoices`, `quotes`).
    2.  Upload to Supabase Storage.
    3.  Run a DB update script to replace `firebasestorage` domains with new Supabase URLs in `active_projects` and `quotes` tables.

## 4. Key Blockers & Risks
1.  **ID Change:** Changing from Firebase 28-char UID to Supabase UUID is the biggest risk. It breaks all foreign keys.
    *   *Mitigation:* Create a generic mapping table `migration_user_map (firebase_uid, supabase_uuid)` during the import process. Use this to update all other tables (`active_projects`, `admin_requests`, etc.) before dropping it.
2.  **Split Writes:** Several API routes (`send-invoice`, `create-project`) still write to Firestore.
    *   *Mitigation:* These must be rewritten to use `supabase-admin` client immediately after data migration.

## 5. Recommended Order of Operations
1.  **Backup** (Done).
2.  **Auth Import:** Script reads Firebase JSON -> Creates Supabase Users -> populates `migration_user_map`.
3.  **Data Transformation:** Script reads Firestore JSON -> Replaces `clientId`/`technicianId` using `migration_user_map` -> Inserts into Supabase.
4.  **Cutover:** Deploy code changes (disable `firebase-admin`, enable `supabase` logic).
