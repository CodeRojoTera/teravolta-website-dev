# Phase 2: Flow Repair

> **Objective:** Fix the critical logic gaps and runtime errors identified in Phase 1 to ensure a stable data lifecycle and user experience.

## 1. Validated Defects (Input)
*   **Critical:** Quote "Accept & Onboard" does not create Project (Admin Portal).
*   **Critical:** Customer Dashboard fails with 400 Bad Request on internal APIs.
*   **Critical:** Public Quote form crashes with `AbortError` (Browser/Network).
*   **Major:** Service Request form data is outdated/mismatched vs Public Quote.
*   **Major:** Regular Admins can view Super Admin lists.

## 2. Implementation Plan

### Task 2.1: Fix Quote-to-Project Logic (Admin Portal)
**Goal:** Ensure every "Approved" quote has a corresponding `ActiveProject`.
*   [ ] **Modify `app/portal/admin/quotes/[id]/page.tsx`**:
    *   Change "Accept & Onboard" handler.
    *   Check if `linked_project_id` exists.
    *   If NO: Trigger `ActiveProjectService.create` using quote data *before* sending onboarding email.
    *   If YES: Proceed to onboarding email.
*   [ ] **Verify:** User clicking magic link lands on a Dashboard *with* a project card.

### Task 2.2: Fix Customer Dashboard 400 Error
**Goal:** Restore dashboard visibility for clients.
*   [ ] **Debug `app/portal/customer/page.tsx`**:
    *   Identify the failing `fetch` call (likely `inquiries` or `quotes`).
    *   Check `InquiryService` parameters.
    *   Verify RLS policies for `inquiries` table allow `select` for authenticated users.
*   [ ] **Verify:** Dashboard loads "My Projects" and "My Inquiries" without error console logs.

### Task 2.3: Fix Public Quote `AbortError`
**Goal:** Ensure public leads are captured reliably.
*   [ ] **Debug `app/quote/page.tsx`**:
    *   Review `handleSubmit` and validation logic.
    *   Ensure no race conditions with `updateClientType` or `uploadDocument`.
    *   Check `create-magic-link` API timeout settings.
*   [ ] **Verify:** Successful form submission in Browser (no abort).

### Task 2.4: Align Service Request Data (Customer Portal)
**Goal:** Ensure existing clients provide same quality data as new leads.
*   [ ] **Update `app/portal/customer/request-service/page.tsx`**:
    *   Add "Inspection Scheduling" (Date/Time) fields to schema.
    *   Align "Property Type" options (Add Hotel, Building, Industry).
    *   Align "Operating Hours" field for commercial.
*   [ ] **Verify:** Form submission saves all new fields to `quotes` table.

### Task 2.5: Fix Admin Permissions
**Goal:** Secure Super Admin views.
*   [ ] **Update `middleware.ts` or Layout**:
    *   Restrict access to `/portal/admin/users/admins` to `role: super_admin` only.

## 3. Verification Strategy
*   **Manual verification** is required for the "Quote-to-Project" flow as it involves email magic links (simulated).
*   **Browser verification** will be re-attempted for Public Quote once `AbortError` is fixed.
