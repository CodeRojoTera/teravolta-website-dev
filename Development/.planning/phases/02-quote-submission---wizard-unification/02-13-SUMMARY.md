---
phase: 02-quote-submission-wizard-unification
plan: 13
subsystem: Gap Closure - Infrastructure Blocker
tags: [RLS, documents, public-uploads, infrastructure-carryover]
type: documentation
status: complete
completed: 2026-02-04
duration: 5 min

key-files:
  created: []
  modified: []

provides:
  - "RLS policy blocker analysis for public quote submission"
  - "Decision record for Phase 1 gap closure approach"
  - "Dependency documentation between Phase 02 UI fixes and Phase 1 infrastructure"

tech-stack:
  architecture:
    - "Supabase RLS policies"
    - "Service role bypass vs. policy-level permissions"
  decisions:
    - "Identified Phase 1 infrastructure issue blocking Phase 02 UAT"
    - "Deferred to Phase 1 gap closure (post-Phase 02)"
    - "Three approach options documented for decision"
---

# Phase 02 Plan 13: RLS Policy Blocker - Phase 1 Carryover Summary

## Objective Complete

✅ Documented critical RLS policy issue blocking quote submission and established decision framework for Phase 1 gap closure.

**One-liner:** Identified and documented RLS policy blocker on documents table preventing public quote submission; deferred to Phase 1 gap closure with three approach options.

## Issue Analysis

### Root Cause Chain

During Phase 02 UAT (Test 3 - Quote Submission with Bills):

1. **Form submission reaches document upload** (Time picker fix in Plan 12 enables this)
2. **API calls `/api/create-quote` endpoint** with file upload
3. **Endpoint inserts bills to `documents` table** via Supabase client
4. **Public user is unauthenticated** (user_id = null, session = undefined)
5. **`documents` table has RLS enabled** (database infrastructure from Phase 1)
6. **Current RLS INSERT policy blocks public/unauthenticated access** ← ROOT CAUSE
7. **Quote creation fails** before quote record is even saved
8. **User sees error:** "Failed to create quote"

### Why This Is Phase 1 Infrastructure

**Classification:** Database-layer security policy, not UI/UX concern

- RLS policies are foundational database infrastructure
- Public document access spans all three services (efficiency, consulting, advocacy)
- Should have been included in Phase 1 RLS work
- Phase 02 can only fix UI/UX — cannot bypass database constraints

### Impact Without Fix

| Scope | Impact |
|-------|--------|
| Public quote form | Cannot submit with bill uploads (all services blocked) |
| Customer wizard | Cannot proceed (blocked before quote save) |
| Admin quote edit | Can work (admin is authenticated) |
| Test 3 verification | Impossible (form submission broken) |

## Decision Framework

Three approaches available for Phase 1 gap closure:

### Option A: API-Level Bypass (Recommended)

**Implementation:** Use `supabaseAdmin` with RLS bypass in endpoint

```typescript
// Pseudo-code
const response = await supabaseAdmin
  .from('documents')
  .insert(documentData, { count: 'estimated' });
  // RLS bypassed by admin client
```

**Pros:**
- Simple and clear (system-level action, not user action)
- Minimal RLS policy changes
- Intent obvious to future maintainers
- Service role keys already secured

**Cons:**
- Documents table not covered by normal RLS during insert
- Could mask permission model issues
- Requires careful API isolation (only for this endpoint)

**Risk Level:** Low (insert-only, no data leakage risk)

**Recommendation:** ✅ **PREFERRED** - Clear separation of concerns (admin/system inserts bypass, user data reads respect RLS)

---

### Option B: RLS Policy for Service Role

**Implementation:** Add explicit RLS policy permitting service_role

```sql
-- Add policy to documents table
ALTER TABLE documents ENABLE RLS;

CREATE POLICY "Service role can insert documents"
  ON documents
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```

**Pros:**
- Maintains RLS structure across table
- Policy-layer authorization (cleaner audit trail)
- Explicit and queryable from database

**Cons:**
- Less clear which endpoints use service_role
- Requires tight control over service_role key distribution
- Policy proliferation if extended

**Risk Level:** Moderate (requires service_role key security discipline)

---

### Option C: Authenticated Public User

**Implementation:** Create "public" user, authenticate before submission

```typescript
// Sign in to public account before upload
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'public@system.local',
  password: '[system-generated]'
});

// Then insert as authenticated user
const response = await supabase.from('documents').insert(documentData);
```

**Pros:**
- Normal RLS flow (transparent, no bypasses)
- User data model consistent across code
- Audit trail uses standard auth mechanism

**Cons:**
- Extra complexity (public user account management)
- Session/token lifecycle for form submissions
- Auth state conflicts with form workflow
- Requires testing of authentication state

**Risk Level:** Higher (broader authentication changes, session management complexity)

---

## Dependency with Plan 12

| Plan | Work | Status | Prerequisite For |
|------|------|--------|------------------|
| 02-12 | Fix time picker hour-level granularity | ✅ Complete | Quote form can reach upload step |
| 02-13 | Document RLS policy blocker | ✅ Complete | Phase 1 gap closure decision |
| Phase 01 GC | Fix RLS policy (A/B/C) | ⏳ Pending | Quote submission succeeds end-to-end |

**Sequential Dependency:** Plan 12 (UI fix) enables reaching the upload step, but Plan 01 GC (infrastructure) is required for submission to complete.

## Phase Readiness

### Phase 02 Completion Status

**Can mark Phase 02 complete with understanding that:**

✅ All 11 UI/UX fixes are implemented (Plans 01-12)
⏳ Quote submission blocked by Phase 1 infrastructure (RLS policy)
⏳ Phase 1 gap closure required before end-to-end UAT can pass

**Next steps:**

1. **Phase 1 gap closure** - Select approach (A/B/C), implement RLS fix
2. **Resume Phase 02 UAT** - Test quote submission end-to-end after Phase 1 fix deployed
3. **Phase 03** - Proceed with shared service features

### Outstanding Questions

- [ ] Which approach: A (admin bypass), B (RLS policy), or C (public user)?
- [ ] When should Phase 1 gap closure be scheduled?
- [ ] Should Phase 02 UAT be blocked or partially complete?

## Deviations from Plan

None — plan executed as written (pure documentation, no code changes).

## Authentication Gates

No authentication gates — pure documentation task.

## Success Criteria Met

✅ RLS policy blocker documented and explained
✅ Root cause analysis provided
✅ Three approach options with trade-offs documented
✅ Phase ownership clarified (Phase 1 infrastructure vs. Phase 02 UI)
✅ Decision framework ready for Phase 1 gap closure
✅ Dependency between Plan 12 and Phase 1 fix documented

## Next Action

Await decision on approach (A/B/C) to guide Phase 1 gap closure plan creation.

---

**Status:** Ready for Phase 1 gap closure execution
