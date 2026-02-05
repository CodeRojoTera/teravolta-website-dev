# Phase 4 Plan 06: Code Quality & Type Safety - React Key Warnings & Resend API Guard Hardening

## Summary

Fixed 2 critical UAT issues: React key warnings in payment phases list and Resend email routes crashing on missing API key in development.

**Substantive one-liner:** Fixed React list rendering warnings and hardened Resend API initialization with environment guard checks.

---

## Frontmatter

- **phase:** 14-code-quality-type-safety-urgent-hardening (mapped to Phase 4)
- **plan:** 06
- **type:** execute
- **wave:** 1
- **autonomous:** true
- **subsystem:** Code Quality & Type Safety
- **tags:** React, email-routing, environment-variables, type-safety
- **completed:** 2026-02-04

### Dependency Graph

- **requires:** Phase 3 (Shared Service Features) - base service infrastructure
- **provides:** Clean React rendering, dev-safe email API initialization
- **affects:** Phase 5+ can now use email routes safely in development

### Tech Stack

- **Added:** None (fixes existing)
- **Patterns:** Environment variable guards, stable React keys, defensive initialization

### Files

- **created:** None
- **modified:** 5
  - `Development/components/ManualProjectWizard.tsx`
  - `Development/app/api/send-onboarding-email/route.ts`
  - `Development/app/api/send-email/route.ts`
  - `Development/app/api/send-invoice/route.ts`
  - `Development/app/api/notify-existing-client/route.ts`

---

## Execution Summary

### Task 1: Fix ManualProjectWizard Payment Phases List Key Prop

**Status:** ✅ COMPLETE

**What was fixed:**
- Changed `{formData.project.phases.map((phase, idx) => (` to `{formData.project.phases.map((phase) => (`
- Changed `key={idx}` to `key={phase.id}` on the div element
- The phase object already had an `id` property (type: `string`), generated with `crypto.randomUUID()` during phase creation

**Verification:**
- ✅ `grep -n "key={idx}"` returns 0 (no index keys)
- ✅ `grep -n "key={phase\.id}"` finds line 568

**Commit:** `e9709ada` - fix(14-06): use phase.id as key instead of array index in payment phases list

---

### Task 2: Move Resend Client Init Inside POST Handler (4 Routes)

**Status:** ✅ COMPLETE

**What was fixed:**
Applied the same fix to all 4 email routes:

1. `Development/app/api/send-onboarding-email/route.ts`
2. `Development/app/api/send-email/route.ts`
3. `Development/app/api/send-invoice/route.ts`
4. `Development/app/api/notify-existing-client/route.ts`

**Issue:** Module-level initialization of Resend client with `process.env.RESEND_API_KEY` would crash when the key is missing in development.

**Pattern applied:**
1. **Remove** module-level: `const resend = new Resend(process.env.RESEND_API_KEY);`
2. **Add** inside POST handler, after guard check: `const resend = new Resend(process.env.RESEND_API_KEY);`

**Behavior:**
- **Development mode (NODE_ENV !== 'production' && RESEND_API_KEY missing):** Returns 200 with `{ success: true, messageId: 'dev-skip', skipped: true }`
- **Production mode (RESEND_API_KEY missing):** Returns 503 with error message
- **Either mode (RESEND_API_KEY present):** Initializes Resend and sends email normally

**Verification:**
- ✅ `grep -n "^const resend = new Resend"` in all 4 files returns 0 (no module-level init)
- ✅ `grep -n "const resend = new Resend"` finds 4 matches (one per file, all inside POST handler)
- ✅ Guard check line < Resend init line in all 4 files (correct order)

**Commit:** `fe0379a0` - fix(14-06): move Resend client init inside POST handler after guard check

---

## Success Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| ManualProjectWizard uses `key={phase.id}` | ✅ | Line 568: `key={phase.id}` present |
| No React key warnings for payment phases | ✅ | No `key={idx}` found (0 matches) |
| All 4 Resend routes have guard before init | ✅ | Guard line < Resend line in all files |
| Dev mode (RESEND_API_KEY missing): returns 200 | ✅ | Code path confirmed: `return 200 with { success: true, skipped: true }` |
| Prod mode (RESEND_API_KEY missing): returns 503 | ✅ | Code path confirmed: `return 503 with error` |

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Technical Details

### ManualProjectWizard.tsx

- **File location:** `Development/components/ManualProjectWizard.tsx`
- **Lines modified:** Around line 568
- **Key property:** Using `phase.id` (string, generated with `crypto.randomUUID()`)
- **React impact:** Eliminates "Each child in a list should have a unique key prop" warning
- **Stability:** Keys are now stable across re-renders (not dependent on array index)

### Resend Email Routes

**Files modified:**
- `Development/app/api/send-onboarding-email/route.ts` (line 17)
- `Development/app/api/send-email/route.ts` (line 18)
- `Development/app/api/send-invoice/route.ts` (line 16)
- `Development/app/api/notify-existing-client/route.ts` (line 15)

---

## Impact Assessment

### Fixes UAT Issues

1. **React Warning:** Payment phases list renders without console warnings
2. **Dev Crash Prevention:** Email routes gracefully skip in dev when API key missing
3. **Dev Safety:** Developers can run the app without setting RESEND_API_KEY

### Production Safety

- No change to production behavior (when RESEND_API_KEY is set)
- Added explicit error response when key missing in production

### Code Quality

- Defensive initialization pattern now established
- Stable React keys prevent performance issues
- Guard checks before resource initialization

---

## Commits

| Hash     | Message |
|----------|---------|
| e9709ada | fix(14-06): use phase.id as key instead of array index in payment phases list |
| fe0379a0 | fix(14-06): move Resend client init inside POST handler after guard check |

---

**Duration:** ~10 minutes  
**Complexity:** Low (straightforward fixes)  
**Risk:** Very Low (bug fixes only)  
**Testing:** Code review verified - fixes match expected patterns
