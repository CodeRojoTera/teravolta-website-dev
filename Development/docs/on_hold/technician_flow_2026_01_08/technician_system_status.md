# Technician Flow & Assignment: Status Report (Paused)
**Date:** 2026-01-08
**Status:** PAUSED to prioritize Supabase Migration.

## 1. What Has Been Done
We have completed **Phase 1 (Admin Manual Reassignment)** and **Phase 2 (Technician Incident Reporting)** of the Reassignment System.

### Features Implemented
*   **Database:**
    *   Created `admin_requests` table in Supabase.
    *   Updated `technicians`, `appointments`, `active_projects`, and `admin_requests` columns to use `TEXT` instead of `UUID` to support Firebase UIDs (Hybrid Architecture).
*   **Technician Dashboard:**
    *   Added "Report Issue" (Reportar Problema) button to appointment cards.
    *   Implemented "Incident Modal" for selecting reason (Traffic, Illness, etc.) and adding details.
    *   Fixed "Zombie Login" issue where Supabase session persisted after Firebase logout, hiding header buttons.
*   **Backend Services:**
    *   `TechnicianService.findAvailableTechnicians`: Algorithm to find replacement techs excluding the current one.
    *   `AppointmentService.reportIncident`:
        *   Accepts incident report.
        *   Automatically searches for a replacement.
        *   Creates an `admin_request` of type `reassignment_request` (if tech found) or `reschedule_request` (if no tech found).

## 2. What is Missing (To Be Done)
The following work was planned but is now ON HOLD:

### Phase 3: Admin Requests & Management
*   **Requests Page:** Create/Update `/portal/admin/requests` to view the new incident requests.
*   **Action Logic:**
    *   **Approve Swap:** Button to execute the reassignment (update `active_projects` and notify both techs).
    *   **Notify Client:** Button to trigger reschedule email if no tech is available.

### Phase 4: Customer Experience
*   **Notifications:** Email/Dashboard alerts when a reschedule is requested.

## 3. Future Architecture (After Migration)
This system currently runs on a **Hybrid Architecture** (Firebase Auth + Supabase DB).
**Once the Full Supabase Migration is complete:**
1.  **Revert Column Types:** The columns changed to `TEXT` (`requester_id`, `uid`, `technician_uid`) should be converted back to `UUID`.
2.  **Restore Foreign Keys:** Re-add Foreign Key constraints to `auth.users` for data integrity.
3.  **Update Services:** Ensure `AppointmentService` and `TechnicianService` use the new Supabase Auth user IDs.

## 4. How to Resume
1.  Complete the **Full Supabase Migration** (see separate plan).
2.  Execute the "Revert Column Types" SQL script (to be created).
3.  Resume work on **Phase 3: Admin Requests**.
