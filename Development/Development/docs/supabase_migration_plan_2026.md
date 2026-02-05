# Master Plan: Full Migration to Supabase
**Date:** 2026-01-08
**Status:** DRAFT (Ready for Execution)

## Executive Summary
The application currently operates on a **Hybrid Architecture** (Firebase Auth/Firestore + Supabase DB). This causes data duplication ("split-brain" user data), complex API logic, and inconsistent authorization.
**Objective:** Consolidate the entire stack (Auth, Database, Storage) onto **Supabase**.

---

## Phase 1: Preparation & Backup (Est. 1 Day)
1.  **Audit Data Sources:**
    *   **Firestore Collections:** `users`, `activeProjects`, `inquiries`, `quotes`.
    *   **Supabase Tables:** `users`, `active_projects`, `appointments`, `technicians`, `admin_requests`.
    *   **Gap Analysis:** Identify fields present in Firestore but missing in Supabase schemas.
2.  **Backup:**
    *   Export all Firestore JSON data.
    *   Download all files from Firebase Storage bucket `teravolta-41afd.firebasestorage.app`.
3.  **Environment Setup:**
    *   Verify `SUPABASE_SERVICE_ROLE_KEY` is active in `.env`.
    *   Ensure **Email Auth** is enabled in Supabase Dashboard.

## Phase 2: User & Auth Migration (Est. 2 Days)
*Critical Path: This replaces Firebase Auth.*

1.  **Export Users:** Use `firebase-admin` to export all users (`uid`, `email`, `displayName`, `phone`).
2.  **Import to Supabase:**
    *   Script: Insert users into `auth.users` (requires Service Role).
    *   Script: Sync profiles to `public.users` table.
3.  **Switch Frontend Auth:**
    *   **Action:** Update `components/AuthProvider.tsx` to remove Firebase logic entirely.
    *   **Action:** Update `app/portal/login/page.tsx` to use `supabase.auth.signInWithPassword`.
4.  **Update Protected Routes:**
    *   Refactor `RoleGuard.tsx` to check Supabase Session only.
    *   Update `TechnicianLayout.tsx` and `Header.tsx` to fetch profile from `public.users` only.

## Phase 3: Database Unification (Est. 3 Days)
*Goal: Decommission Firestore.*

1.  **Migrate Collections:**
    *   **Users:** (Already covered in Phase 2).
    *   **Active Projects:**
        *   Compare Firestore `activeProjects` vs Supabase `active_projects`.
        *   Script: Upsert missing projects/fields from Firestore -> Supabase.
        *   Update `app/api/send-invoice/route.ts` to write to Supabase instead of `adminDb`.
    *   **Inquiries & Quotes:** Migrate remaining legacy data if any.
2.  **Refactor Services:**
    *   Update `TechnicianService`, `AppointmentService`, etc., to stop using any `firebase-admin` or `db` imports.
    *   Remove `lib/firebase.ts` and `lib/firebase-admin.ts`.
3.  **Fix Foreign Keys:**
    *   *After* Auth migration, run the SQL script to revert `requester_id`, `uid`, etc. from `TEXT` back to `UUID`.
    *   Re-establish FK constraints to `auth.users`.

## Phase 4: Storage Migration (Est. 1 Day)
1.  **Transfer Files:**
    *   Script: Download files from Firebase Storage -> Upload to Supabase Storage buckets (`invoices`, `project-files`, etc.).
2.  **Update References:**
    *   Update DB columns containing `firebasestorage.googleapis.com` URLs to point to Supabase Storage URLs.
3.  **Code Update:**
    *   Update file upload components to use `supabase.storage`.

## Pre-Migration Checklist
- [ ] List of all 50+ users exported.
- [ ] Schema mapping for `activeProjects` completed.
- [ ] "Maintenance Mode" page ready (to prevent writes during migration).

## Post-Migration Verification
- [ ] User can login with existing credentials (password reset might be needed if hashes incompatible, or use a migration tool that preserves hashes).
- [ ] "My Appointments" loads in Technician Dashboard.
- [ ] "Admin Dashboard" loads all projects.
- [ ] File uploads and downloads work.
