# Research: Phase 14 — Code Quality & Type Safety - Urgent Hardening

**Date:** 2026-02-04
**Discovery Level:** 0 (internal codebase fixes, no external dependencies)

---

## Diagnostic Results

### TypeScript Errors: 15 errors across 6 files

Run: `npx tsc --noEmit -p ./Development/tsconfig.json`

#### Error Group A: Missing State Setter — `technicians/page.tsx`
**File:** `Development/app/portal/admin/technicians/page.tsx`
**Errors:** 4 (lines 64, 84, 206, 210)
**Root cause:** `resendingId` and `setResendingId` are used but never declared as state.
- Line 64: `setResendingId(tech.id || '')` — called in `handleResendInvite`
- Line 84: `setResendingId(null)` — called in `finally` block
- Line 206: `disabled={resendingId === tech.id}` — used in button
- Line 210: `resendingId === tech.id ? <spinner> : <icon>` — conditional render
**Fix:** Add `const [resendingId, setResendingId] = useState<string | null>(null);` after the existing `useState` declarations (after line 24, `searchQuery` state).

#### Error Group B: Missing Translation Key — `users/[id]/page.tsx`
**File:** `Development/app/portal/admin/users/[id]/page.tsx`
**Errors:** 1 (line 582)
**Root cause:** `t.profile` is referenced in the technician profile editor section but `profile` key is missing from the `t` translation object (lines 170-202).
**Context:** Line 582: `<h2 ...>{t.profile}</h2>` inside `{user.role === 'technician' && technicianData && (...)}`
**Fix:** Add `profile` key to the `t` object after `onlySuperCanEdit`:
  - ES: `'Perfil'`
  - EN: `'Profile'`

#### Error Group C: Argument Type Mismatch — `users/[id]/page.tsx`  
**File:** `Development/app/portal/admin/users/[id]/page.tsx`
**Errors:** 1 (line 283)
**Root cause:** A value of type `string | undefined` is passed to a function expecting `string`.
**Context:** Line 283 — likely `TechnicianService.update(technicianData.id, ...)` where `technicianData.id` is optional (from the Technician type which has `id?: string`).
**Fix:** Add a guard: `if (!technicianData?.id) return;` before the service call, OR use non-null assertion `technicianData.id!` if the surrounding context already guarantees it exists (the `if (!technicianData) return;` on line 279 ensures `technicianData` exists but not `.id`). Best: add `if (!technicianData?.id) return;`.

#### Error Group D: Duplicate Object Keys — `ContratarFlow.tsx`
**File:** `Development/app/services/efficiency/contratar/ContratarFlow.tsx`
**Errors:** 7 (lines 371-377)
**Root cause:** Object literal has duplicate keys. Lines 360-377 show the object has two blocks of identical keys:
```
service: 'efficiency',        // first occurrence ~365
package: 'Standard',          // first occurrence ~366
status: 'pending_assignment', // first occurrence ~367
paymentStatus: 'paid',        // first occurrence ~368
assignedTo: [],               // first occurrence ~369
scheduledDate: ...,           // first occurrence ~370
scheduledTime: ...,           // first occurrence ~370
service: 'efficiency',        // DUPLICATE line 371
package: 'Standard',          // DUPLICATE line 372
status: 'pending_assignment', // DUPLICATE line 373
paymentStatus: 'paid',        // DUPLICATE line 374
assignedTo: [],               // DUPLICATE line 375
scheduledDate: ...,           // DUPLICATE line 376
scheduledTime: ...,           // DUPLICATE line 377
```
**Fix:** Remove the duplicate block (lines 371-377). The first occurrence already sets these values.

#### Error Group E: Optional `id` on Document — `DocumentList.tsx`
**File:** `Development/components/DocumentList.tsx`
**Errors:** 1 (line 266)
**Root cause:** `Document.id` is typed as `id?: string` (optional) in `lib/types.ts`. `handleDelete(doc.id)` passes `string | undefined` but `handleDelete` signature is `(docId: string) => Promise<void>`.
**Fix:** Guard the delete call: `onClick={() => doc.id && handleDelete(doc.id)}` OR `onClick={() => handleDelete(doc.id!)}`. The former is safer (won't attempt delete if no id).

#### Error Group F: Unknown Property in Type — `project-service.ts`
**File:** `Development/lib/services/project-service.ts`
**Errors:** 1 (line 181)
**Root cause:** `pending_inspection` is used as a key in the `efficiency` progress map but is NOT in `EfficiencyStatus` type (checked `lib/state-machines/types.ts`). The valid statuses for efficiency are: `pending_onboarding`, `pending_payment`, `pending_scheduling`, `scheduled`, `pending_installation`, `pending_documents`, `pending_assignment`, `active`, `paused`, `pending_client`, `in_review`, `urgent_reschedule`, `incomplete`, `in_progress`, `completed`, `cancelled`, `on_hold`.
**Fix:** Remove the `pending_inspection: 28` entry from the efficiency progress map (line 181). It's not a valid status — inspections are tracked via appointments, not project status.

#### Error Group G: Next.js Generated Route Types — `.next/types/...`
**File:** `Development/.next/types/app/api/admin/projects/[id]/status/route.ts`
**Errors:** 2 (lines 49, 283 in generated file)
**Root cause:** Next.js 15+ requires route handler params to be `Promise<{id: string}>` not `{id: string}`. Both GET and PATCH in `Development/app/api/admin/projects/[id]/status/route.ts` use the old sync signature:
```ts
{ params }: { params: { id: string } }  // OLD (Next.js 14)
```
Should be:
```ts
{ params }: { params: Promise<{ id: string }> }  // Next.js 15+
```
**Fix:** Update both GET (line 121) and PATCH (line 55) handler signatures to use `Promise<{ id: string }>` and `await params` before accessing `params.id`. Also check `Development/app/api/projects/[id]/status/route.ts` — same route exists for non-admin and likely has the same issue (PATCH confirmed at line 55).

---

### API Key Audit

#### Environment Variables in Use
| Variable | Used In | Risk |
|----------|---------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | middleware, 3 API routes, lib/supabase.ts, scripts | Low — public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | middleware, 3 API routes, lib/supabase.ts, scripts | Low — anon key (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | lib/supabase-admin.ts, scripts | HIGH — service role bypasses RLS |
| `RESEND_API_KEY` | 4 API routes (send-email, notify-existing-client, send-invoice, send-onboarding-email) | MEDIUM — can send emails |
| `NEXT_PUBLIC_APP_URL` | 3 API routes for magic link generation | Low — base URL |

#### Current `.env.local` Status
- `NEXT_PUBLIC_SUPABASE_URL` — present ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — present ✓
- `RESEND_API_KEY` — present in `.env.local` (value: `re_2rfewtLT_...`) ✓
- `SUPABASE_SERVICE_ROLE_KEY` — NOT in `.env.local` ⚠️ (only in production env)
- `NEXT_PUBLIC_APP_URL` — NOT in `.env.local` ⚠️ (defaults to localhost:3000)

#### Resend Hardening Issues
All 4 Resend routes instantiate `new Resend(process.env.RESEND_API_KEY)` at MODULE level (top of file), BEFORE any request handler runs. This means:
1. If `RESEND_API_KEY` is missing, the Resend client is created with `undefined` — it won't crash at startup but will fail at send time with an unhelpful error.
2. Only `send-email/route.ts` has a guard (`if (!process.env.RESEND_API_KEY)` check inside the handler).
3. The other 3 routes (`notify-existing-client`, `send-invoice`, `send-onboarding-email`) have NO guard.

**Decision (from STATE.md 2026-02-03):** Allow dev-only skips for Resend when `RESEND_API_KEY` missing.

**Hardening plan:**
- Move `new Resend(...)` inside each handler (lazy init) OR add env guard at top that returns early in dev
- Add consistent dev-safe guard to all 4 routes: if `!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production'`, return `{success: true, messageId: 'dev-skip'}` with 200
- In production, missing key = 500 error

#### API Key Documentation Needed
Create `docs/API_KEYS.md` listing all env vars, their purpose, where to obtain them, and which are required vs optional per environment.

---

### Standard Stack (No New Dependencies)
All fixes are internal TypeScript corrections. No new packages needed.

### Architecture Patterns
- Next.js 15+ dynamic route params are `Promise<{id: string}>` — must `await`
- `useState` for loading indicators on async operations (established pattern: see `loading` state in same file)
- Translation objects (`t`) follow inline object pattern in each component
- Document type `id` is optional (Firestore legacy) — always guard before use

### Don't Hand Roll
Nothing applies — all fixes are straightforward TypeScript corrections.

### Common Pitfalls
- Next.js 15 params are async — forgetting `await` causes runtime "params.id is a Promise" bugs
- Module-level Resend init with undefined key silently fails — always check env before instantiation
- Duplicate object keys: later key silently overwrites earlier — TypeScript now catches this
