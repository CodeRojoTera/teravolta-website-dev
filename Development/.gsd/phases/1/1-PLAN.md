---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Comprehensive System Audit

## Objective
To systematically verify all core user flows, log specific errors, and explicitly map "disconnected" areas. This is necessary because the user reports "countless errors" but we need specific reproduction steps to fix them.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- User Report: "countless errors and problems user user flow logic"

## Tasks

<task type="auto">
  <name>Active Audit: Technician Flow</name>
  <files>Development/app/portal/technician/page.tsx</files>
  <action>
    Use Browser Tool (if possible) or Simulate logic to verify Technician login.
    - User: `tech.test@teravolta.com` / `teravolta123`
    - Verify: Login -> Dashboard Redirect -> Job View.
    - Note specific error messages or blank screens.
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Technician flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Customer Flow</name>
  <files>Development/app/portal/customer/page.tsx</files>
  <action>
    Use Browser Tool to verify Customer experience.
    - User: `martines.aquiles.64@outlook.com` / `test1234`
    - Verify: Dashboard loading -> "Request Service" click -> Action result.
    - Check if previous Quotes are visible.
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Customer flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Admin Flow</name>
  <files>Development/app/portal/admin/page.tsx</files>
  <action>
    Use Browser Tool to verify Admin oversight.
    - User: `admin@teravolta.com` / `teravolta_admin_temp_pass`
    - Verify: Limited access checks (what they should NOT see).
    - Check "Technicians" list for status accuracy.
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Admin flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Super Admin Flow</name>
  <files>Development/app/portal/admin/page.tsx</files>
  <action>
    Use Browser Tool to verify Super Admin oversight.
    - User: `superadmin@teravolta.com` / `TeravoltaSuperAdmin2026!`
    - Verify: Full access checks (features Admin cannot see).
    - COMPARE with Admin view to spot restriction logic failures.
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Super Admin flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Public Quote Flow</name>
  <files>Development/app/quote/page.tsx</files>
  <action>
    Use Browser Tool to verify Public Quote submission.
    - Go to `/quote` (or click "Get Quote" on home).
    - Fill out form as a guest.
    - Submit.
    - Verify: Does it succeed? Does it appear in Admin Dashboard?
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Public Quote flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Customer Service Request Flow</name>
  <files>Development/app/portal/customer/request/page.tsx</files>
  <action>
    Use Browser Tool to verify Customer Service Request.
    - User: `martines.aquiles.64@outlook.com` / `test1234`
    - Go to `/portal/customer/request`.
    - Select a service (e.g., Efficiency) and submit.
    - Verify: Does it save? Does it appear in "My Projects"?
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Customer Request flow verified.</done>
</task>

<task type="auto">
  <name>Active Audit: Admin Project Creation Flow</name>
  <files>Development/app/portal/admin/projects/new/page.tsx</files>
  <action>
    Use Browser Tool to verify Admin Project creation.
    - User: `admin@teravolta.com` / `teravolta_admin_temp_pass`
    - Go to Projects -> New Project.
    - Create a test project assigned to a client.
    - Verify: Does it error? Does it persist?
  </action>
  <verify>Log findings in AUDIT_REPORT.md</verify>
  <done>Admin Project Creation flow verified.</done>
</task>

## Success Criteria
- [ ] `AUDIT_REPORT.md` created with specific bug list.
- [ ] "Disconnected" sections identified and named.
