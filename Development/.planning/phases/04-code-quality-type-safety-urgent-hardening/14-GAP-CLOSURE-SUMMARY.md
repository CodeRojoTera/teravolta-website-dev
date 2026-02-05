# Phase 14 Gap Closure Planning Summary

**Phase:** 14 - Code Quality & Type Safety - Urgent Hardening  
**Mode:** gap_closure (planning diagnosed UAT failures)  
**Date:** 2026-02-04  
**Status:** Planning Complete ✓

---

## Executive Summary

Phase 14 Wave 1 execution (5 plans) fixed 18 of 19 TypeScript errors and hardened API key configuration. UAT testing identified **3 new gaps** from the executed work:

| Gap | Severity | Status | Plan |
|-----|----------|--------|------|
| ManualProjectWizard payment phases using array index as key | Major | Planned | 14-06 |
| Resend routes initializing client before guard check | BLOCKER | Planned | 14-06 |
| Technician dashboard 400 Bad Request on inquiries query | Major | Investigation | 14-07 |

---

## Gap Analysis

### Gap 1: ManualProjectWizard Key Prop (Major)

**Test:** 5 (ContratarFlow Component Renders)  
**Error:** "Each child in a list should have a unique key prop" at line 357 (actually 568)  
**Location:** `Development/components/ManualProjectWizard.tsx:568`  
**Root Cause:** Payment phases map uses `key={idx}` (array index — anti-pattern)

```tsx
// WRONG (current)
{formData.project.phases.map((phase, idx) => (
    <div key={idx} className="flex gap-2 items-center">

// RIGHT (fix)
{formData.project.phases.map((phase) => (
    <div key={phase.id} className="flex gap-2 items-center">
```

**Impact:** 
- React reconciliation errors when phases reorder or change
- Console warning on every render
- Potential data loss if phase list modifies

**Fix Scope:** 1 file, 1-line change

---

### Gap 2: Resend Dev-Safe Guard Timing (BLOCKER)

**Test:** 7 (Resend Email Dev Guard)  
**Error:** "500 error 'Missing API key'" when RESEND_API_KEY missing  
**Affected Routes:**
- `Development/app/api/send-onboarding-email/route.ts`
- `Development/app/api/send-email/route.ts`
- `Development/app/api/send-invoice/route.ts`
- `Development/app/api/notify-existing-client/route.ts`

**Root Cause:** Resend client initialized at MODULE LOAD TIME, before guard check in POST handler

```typescript
// WRONG (current)
const resend = new Resend(process.env.RESEND_API_KEY);  // Line 6 — crashes if undefined!

export async function POST(request: Request) {
    if (!process.env.RESEND_API_KEY) {  // Guard check too late
        // ...

// RIGHT (fix)
export async function POST(request: Request) {
    if (!process.env.RESEND_API_KEY) {  // Guard check first
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DEV] RESEND_API_KEY missing — skipping email send');
            return NextResponse.json({ success: true, skipped: true }, { status: 200 });
        }
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);  // Safe to initialize
```

**Impact:**
- Dev testing without RESEND_API_KEY crashes entire route (500)
- Blocks technician onboarding test flow
- Same pattern in 4 routes (must fix all)

**Fix Scope:** 4 files, move client initialization inside POST handler

---

### Gap 3: Technician Dashboard 400 Error (Major — Investigation Needed)

**Test:** 2 (Technician Resend Invite Button)  
**Error:** "400 Bad Request on GET /rest/v1/inquiries after technician onboarding"  
**Status:** Root cause NOT YET IDENTIFIED — requires investigation

**Known Information:**
- Resend button works (technician onboarded successfully)
- Error appears when dashboard loads AFTER onboarding
- Query: GET /rest/v1/inquiries with email filter
- Likely causes: malformed query, type mismatch, RLS policy issue, or missing required parameter

**Investigation Plan:**
1. Locate technician dashboard component (`/portal/technician/page.tsx`)
2. Find inquiries query and identify filter parameters
3. Check Supabase RLS policies on inquiries table
4. Capture exact error response from browser network tab
5. Test query in Supabase console with same parameters
6. Apply fix based on root cause diagnosis

**Fix Scope:** Unknown until investigation (likely 1-2 files)

---

## Gap Closure Plan Structure

### Wave 2 (Depends on Wave 1 completion)

**14-06: Fix ManualProjectWizard + Move Resend Initialization**
- **Type:** execute (autonomous, no checkpoints)
- **Files Modified:** 5 total
  - ManualProjectWizard.tsx (1-line key fix)
  - send-onboarding-email/route.ts (move init)
  - send-email/route.ts (move init)
  - send-invoice/route.ts (move init)
  - notify-existing-client/route.ts (move init)
- **Tasks:** 2 parallel sub-tasks
  - Task 1: Fix ManualProjectWizard key prop
  - Task 2: Move Resend client init inside POST handlers (4 routes)
- **Verification:** TypeScript clean, no React key warnings, dev email skip works
- **Estimated Duration:** 20-30 minutes

**14-07: Investigate & Fix Technician Dashboard 400 Error**
- **Type:** execute (has checkpoint for decision)
- **Depends On:** 14-06 (sequential — must complete 14-06 first)
- **Files Modified:** TBD (1-3 files after investigation)
- **Tasks:** 2 sequential tasks
  - Task 1: **checkpoint:decision** — Investigate root cause
  - Task 2: Apply fix based on investigation findings
- **Verification:** Dashboard loads, inquiries query returns 200, data displays
- **Estimated Duration:** 30-45 minutes (investigation + fix)

---

## Wave Dependency Graph

```
Wave 1 (Original - COMPLETE):
  14-01 ─┐
  14-02 ─┤
  14-03 ├─→ (All parallel) → WAVE 1 COMPLETE
  14-04 ─┤
  14-05 ─┘

Wave 2 (Gap Closure):
  14-06 (Fix ManualProjectWizard + Resend timing)
    ↓
  14-07 (Investigate & fix technician dashboard)
```

**Total Sequence:** 14-01..05 → 14-06 → 14-07

---

## Execution Instructions

To execute the gap closure plans:

```bash
# Start fresh context
/clear

# Execute Plan 06 (fix ManualProjectWizard + Resend timing)
/gsd-execute-phase 14 --plan 06

# After 06 completes, execute Plan 07 (investigate dashboard)
/gsd-execute-phase 14 --plan 07
```

---

## Success Criteria

### Phase 14 Complete (All 7 plans done)

- [x] Wave 1 (5 plans): 18 TypeScript errors fixed, API keys hardened
- [ ] 14-06 (ManualProjectWizard + Resend init):
  - No React key warnings on payment phases
  - Resend routes initialize inside POST handler
  - Dev mode gracefully skips when RESEND_API_KEY missing
  - All 4 Resend routes have identical guard pattern
- [ ] 14-07 (Technician dashboard):
  - Root cause of 400 error identified
  - Inquiries query returns 200 (not 400)
  - Technician dashboard loads cleanly
  - Technician can view assigned work
- [ ] TypeScript: `npx tsc --noEmit` shows ≤1 error (unrelated to Phase 14)
- [ ] All prior Phase 14 plans remain passing (no regression)
- [ ] Production deployment ready: All Phase 14 requirements (QUALITY-01, QUALITY-02, CONFIG-01, CONFIG-02) satisfied

---

## Files Created

| File | Purpose |
|------|---------|
| 14-06-PLAN.md | Execute plan: Fix ManualProjectWizard + move Resend init |
| 14-07-PLAN.md | Execute plan: Investigate & fix technician dashboard 400 error |
| ROADMAP.md | Updated to include 2 gap closure plans, mark Wave 1 complete |

---

## Git Status

**Commit:** 361c28ee  
**Message:** docs(14): create gap closure plans for UAT failures

Committed files:
- .planning/phases/04-code-quality-type-safety-urgent-hardening/14-06-PLAN.md
- .planning/phases/04-code-quality-type-safety-urgent-hardening/14-07-PLAN.md
- .planning/ROADMAP.md

---

*Planning completed: 2026-02-04 14:57 UTC*
*Ready for execution: Run `/gsd-execute-phase 14 --plan 06` to start Wave 2*
