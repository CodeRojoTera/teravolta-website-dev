# Codebase Concerns

**Analysis Date:** 2026-01-29

## Tech Debt

### Build Configuration Ignoring Errors

**Issue:** Build passes despite TypeScript errors

**Files:** `next.config.ts`

**Current State:**
```typescript
typescript: {
  ignoreBuildErrors: true,
},
eslint: {
  ignoreDuringBuilds: true,
}
```

**Impact:**
- Hidden type safety issues in production builds
- Runtime errors can occur in code that compiles
- Makes it harder to track down bugs
- Reduces code quality confidence

**Fix approach:**
1. Enable `ignoreBuildErrors: false` in development
2. Create `.eslintignore` file for legitimate exclusions
3. Add pre-commit hook to catch TypeScript errors before push
4. Gradually fix accumulated errors (estimate: 10-15 errors)

**Priority:** HIGH - Security and stability risk

---

### Type Safety Suppressions

**Issue:** Multiple `@ts-ignore` comments bypassing type checking

**Files:**
- `app/api/send-onboarding-email/route.ts` (lines 67, 70)
- `app/portal/admin/active-projects/[id]/page.tsx` (line 361)
- `app/portal/admin/quotes/[id]/page.tsx` (lines 258, 470, 866)

**Impact:**
- Hidden type mismatches that could fail at runtime
- Makes code harder to maintain and refactor
- Masks API contract changes

**Fix approach:**
1. Audit each `@ts-ignore` to understand the real type issue
2. Either:
   - Fix the actual type mismatch
   - Use proper type casting with `as` operator
   - Update type definitions if they're wrong

**Priority:** MEDIUM - Maintenance risk

---

## Known Bugs

### User Deletion Data Loss

**Bug:** Hard delete operation fails to delete related records

**Files:** `app/portal/admin/users/clients/page.ts` (lines 186-236)

**Symptoms:**
- User deleted but projects, appointments, documents remain
- Orphaned records reference non-existent user
- "undefined" client names in project lists
- Cascade constraints not enforced at database level

**Trigger:** Admin clicks "Hard Delete" button on client user

**Details:**
The deletion code:
```typescript
// 1. Deletes inquiries by email
await supabase.from('inquiries').delete().eq('email', email)

// 2. Deletes quotes by email
await supabase.from('quotes').delete().eq('client_email', email)

// 3. Deletes projects using wrong field
await supabase.from('active_projects').delete().eq('client_id', userId)
// ^^ ERROR: Field 'client_id' doesn't exist - should be 'user_id'

// 4. Deletes user
await supabase.from('users').delete().eq('id', userId)
```

**Orphaned data:**
- ❌ `appointments` (references deleted user)
- ❌ `notifications` (references deleted user)
- ❌ `documents` (references deleted user)
- ❌ `electrical_boards` (via broken appointments)
- ❌ `admin_requests` (if user is `requested_by`)

**Workaround:** None - must manually clean database

**Fix approach:**
1. Implement proper database CASCADE constraints (see CASCADE Constraints section)
2. Update deletion code to use correct field names
3. Add deletion transaction to handle all related records
4. Add RLS policies to prevent orphaned record queries

**Priority:** CRITICAL - Data integrity and clean-up risk

---

### Broken Hard Delete Query

**Bug:** Foreign key field name mismatch

**Files:** `app/portal/admin/users/clients/page.ts`

**Problem:**
- Code tries to delete from `active_projects` using `.eq('client_id', userId)`
- Database schema uses `user_id` field, not `client_id`
- Query silently fails, leaving all projects orphaned

**Impact:** Projects not deleted when user account deleted

**Workaround:** Manual SQL deletion required

**Fix approach:** Change field name to `user_id`

---

## Security Considerations

### Environment Variables Exposed in Code

**Risk:** Hardcoded public keys in TypeScript

**Files:** `lib/supabase.ts`

**Current Implementation:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase environment variables');
}
```

**Current Mitigation:**
- Uses `NEXT_PUBLIC_*` prefix (intended public exposure)
- Creates placeholder clients if missing

**Recommendations:**
1. Verify Supabase RLS policies block unauthorized access
2. Add monitoring for unusual API usage patterns
3. Rotate anon key quarterly
4. Document which operations are allowed with anon key vs admin key

**Priority:** MEDIUM - Conditional on RLS policy strength

---

### Missing Row-Level Security (RLS) Validation

**Risk:** No application-level validation of RLS policies

**Files:** Various API routes: `app/api/create-quote/route.ts`, etc.

**Current State:**
- API routes validate required fields but not ownership
- Admin client (`supabaseAdmin`) bypasses RLS
- No audit log when admin performs data operations

**Missing:**
- ❌ Verification that user can access/modify their records
- ❌ Audit trail for admin operations
- ❌ Rate limiting on API endpoints
- ❌ CSRF token validation

**Recommendations:**
1. Add user ID validation on all endpoints
2. Create audit log table for admin operations
3. Implement rate limiting (e.g., 100 requests/hour per IP)
4. Add CSRF token validation on mutation endpoints

**Priority:** HIGH - User data privacy risk

---

### Weak Password Reset Handling

**Risk:** Magic link tokens could be intercepted

**Files:** Multiple routes using magic links

**Current State:**
- Magic links generated and sent via email
- No rate limiting on token generation
- No expiration validation visible in code

**Recommendations:**
1. Verify tokens expire after 24 hours
2. Implement rate limiting: max 5 tokens per email per hour
3. Add one-time-use enforcement
4. Log token generation and usage

**Priority:** MEDIUM - Authentication risk

---

## Performance Bottlenecks

### Unoptimized Supabase Queries

**Problem:** No query optimization or pagination visible

**Files:** Admin dashboard pages
- `app/portal/admin/active-projects/page.tsx`
- `app/portal/admin/quotes/page.tsx`

**Current State:**
- Likely fetching all records for list views
- No pagination indicator visible
- No caching strategy

**Impact:**
- Slow page loads as data grows
- High bandwidth usage
- Poor UX with large datasets

**Improvement path:**
1. Add pagination: 25 items per page default
2. Implement cursor-based pagination for large tables
3. Add `.limit()` to all list queries
4. Create database indexes on `status`, `created_at`, `user_id`
5. Consider Redis caching for frequently accessed data

**Priority:** MEDIUM - Affects user experience as data grows

---

### Image Optimization Disabled

**Problem:** All images served unoptimized

**Files:** `next.config.ts`

**Current State:**
```typescript
images: {
  unoptimized: true,
}
```

**Impact:**
- Slower page loads, especially on mobile
- Larger bandwidth usage
- Poor Core Web Vitals score

**Fix approach:**
1. Enable optimization in production
2. Configure image domains for external URLs
3. Use Next.js `Image` component instead of `<img>`
4. Test and measure improvement

**Priority:** MEDIUM - UX and performance

---

## Fragile Areas

### Hybrid Documents Schema

**Files:** Database `documents` table

**Why Fragile:**
- Has BOTH specific foreign keys AND polymorphic fields
- Missing `deleted_at` for soft delete support
- Redundant columns: `url` and `download_url`
- Column naming inconsistency: `size` not `size_bytes`

**Current Schema:**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),        -- FK approach
  project_id UUID REFERENCES active_projects(id), -- FK approach
  entity_type TEXT,                          -- Polymorphic approach
  entity_id UUID,                            -- Polymorphic approach
  category TEXT,
  name TEXT,
  url TEXT,                                  -- Redundant with download_url
  file_name TEXT,
  storage_path TEXT,
  download_url TEXT,
  content_type TEXT,
  size BIGINT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Safe Modification:**
1. Don't add new features using `entity_type`/`entity_id`
2. When adding columns, always add `deleted_at` for soft delete support
3. Don't rely on both FK and polymorphic patterns in same query
4. Create views to normalize the access pattern

**Test Coverage Gaps:**
- No tests for cascading document deletion
- No tests for soft delete on documents

**Fix approach:** Phase 2 refactor to pure polymorphic or pure FK pattern

**Priority:** MEDIUM - Maintenance burden

---

### Multi-Wizard Inconsistency

**Files:**
- `app/quote/page.tsx` - Public form
- `components/ManualProjectWizard.tsx` - Admin manual entry
- `app/portal/admin/quotes/[id]/page.tsx` - Quote review
- `app/portal/customer/request-service/page.tsx` - Customer service request

**Why Fragile:**
- 4 different implementations collecting different data sets
- Service-specific fields not consistently enforced
- Property type options vary between forms (2 vs 6 options)
- Device/connectivity fields removed from some wizards but expected by database

**Data Integrity Risks:**
1. Efficiency projects created without `device_option` field
2. Bill uploads shown for non-efficiency services (confusing UX)
3. Property size collected as text vs dropdown (different formats)
4. Consulting projects created with missing budget/timeline

**Safe Modification:**
- When updating one wizard, check all 4 implementations
- Add service type field validation to all forms
- Standardize field sets across all entry points

**Test Coverage Gaps:**
- No integration tests for wizard → database roundtrip
- No tests for service-specific field validation

**Priority:** HIGH - Data quality and consistency

---

### Efficiency Workflow Incomplete

**Files:**
- Stage 1: `app/quote/page.tsx` ✅ WORKS
- Stage 2: `components/technician/InspectionDashboard.tsx` ✅ PARTIALLY WORKS
- Stage 3: Missing integration to pricing
- Admin review: No UI to see `electrical_boards` data

**Why Fragile:**
- Inspection data collected but not shown to admin
- Pricing done manually without inspection context
- No validation that inspection is complete before activation
- Customer can't see why they're being charged

**Missing Workflow Steps:**
1. No UI for admin to review `electrical_boards` before pricing
2. No linkage between `recommended_solution` and price calculation
3. No state check: status can't transition to `accepted` without inspection completion
4. No customer visibility into inspection findings

**Safe Modification:**
- Don't add more services until efficiency is fully implemented
- Mark workflow steps clearly as "partial implementation"

**Test Coverage Gaps:**
- No end-to-end test of full efficiency workflow
- No tests for inspection → pricing transition

**Priority:** HIGH - Product completeness

---

### Missing CASCADE Constraints (15+ foreign keys)

**Files:** Database schema, migrations in `supabase/migrations/`

**Why Fragile:**
- Deleting a user doesn't cascade to their projects/appointments
- Deleting an appointment doesn't cascade to electrical_boards (though this one HAS cascade)
- Application must handle cascade in code
- Easy to forget a related table when deleting

**Missing CASCADE:**
| Parent | Child | Current | Needed |
|--------|-------|---------|--------|
| users | active_projects | NO ACTION | CASCADE |
| users | inquiries | NO ACTION | CASCADE |
| users | invoices | NO ACTION | CASCADE |
| users | notifications | NO ACTION | CASCADE |
| users | documents (user_id) | NO ACTION | CASCADE |
| users | admin_requests | NO ACTION | CASCADE |
| users | deletion_requests | NO ACTION | CASCADE |
| active_projects | appointments | NO ACTION | CASCADE |
| active_projects | documents (project_id) | NO ACTION | CASCADE |
| quotes | magic_links | NO ACTION | CASCADE |
| inquiries | magic_links | NO ACTION | CASCADE |

**Safe Modification:**
- Run Phase 01-02 migration to add CASCADE constraints
- This will prevent data leaks on user deletion
- Need to handle `SET NULL` for audit trail fields (e.g., `uploaded_by`, `reviewer_id`)

**Priority:** CRITICAL - Data integrity and cleanup

**Impact if not fixed:**
- Hard delete never fully cleans database
- Orphaned records accumulate
- RLS queries return broken references
- Storage cleanup script can't identify unused documents

---

### Partial Soft Delete Implementation

**Files:**
- `supabase/migrations/` has `deletion_requests` table
- No `deleted_at` columns on most tables
- `active_users` view doesn't exist
- No deletion audit log table

**Why Fragile:**
- `deletion_requests` table suggests workflow was started but not completed
- Code doesn't use it consistently
- Unclear if soft delete or hard delete should be used
- Admin deletion UI offers both but without clear consequences

**Current State:**
- `deletion_requests` table exists but is orphaned (no migrations reference it)
- `users` table has no `deleted_at` column
- No cleanup job to hard delete after waiting period

**Safe Modification:**
- Use hard delete (CASCADE) until soft delete is fully implemented
- Don't add new records to `deletion_requests` without using it
- Create view `active_users` as `SELECT * FROM users WHERE deleted_at IS NULL`

**Priority:** MEDIUM - Architectural confusion

---

## Scaling Limits

### No Pagination in List Views

**Current Capacity:**
- Works fine with <1000 records per table
- Breaks down around 10K records (slow page loads)
- At 100K records: unusable

**Limit:** ~5,000 records per view before UX degradation

**Scaling Path:**
1. Add offset/limit pagination to all list views (Phase 2)
2. Migrate to cursor-based pagination for >50K records (Phase 3)
3. Add search/filter indexes to reduce result sets (Phase 2)
4. Consider materialized views for aggregations

**Files to Update:**
- `app/portal/admin/active-projects/page.tsx`
- `app/portal/admin/quotes/page.tsx`
- `app/portal/admin/users/clients/page.tsx`

---

### No Image Caching Strategy

**Current State:**
- All images served from Supabase Storage with unoptimized setting
- No CDN caching headers configured
- Browser cache not optimized

**Scaling Limit:** High bandwidth costs as image library grows

**Scaling Path:**
1. Add Cache-Control headers to storage bucket
2. Configure CDN (e.g., Cloudflare) in front of storage
3. Implement image optimization in Next.js
4. Use WebP format with fallbacks

---

## Dependencies at Risk

### Supabase Version Lock

**Risk:** Supabase 2.90.0 may have security vulnerabilities

**Files:** `package.json`

**Current:** `@supabase/supabase-js: ^2.90.0`

**Migration Plan:**
- Monitor Supabase releases for security patches
- Update to 3.x when released (breaking changes expected)
- Pin version to known-good release for production

**Priority:** LOW - Supabase maintains backward compatibility

---

### Next.js 15.3.2 Version

**Risk:** Newer Next.js may have incompatibilities with existing code

**Files:** `package.json`

**Current:** `next: 15.3.2`

**Status:** Recent version, should be stable

**Recommendations:**
- Keep up with minor/patch updates
- Test major version upgrades in staging first

---

## Missing Critical Features

### No Document Requirement Specification

**Problem:** Users don't know what documents to upload

**Impact:** Support burden from confused users, incomplete records

**Files:** Status flow for `pending_documents` state

**What's Missing:**
- No way to define "document requirements" per project
- UI shows generic "Upload Bills" button
- No checklist of what's needed

**Blocking:** Phase cannot progress until documents are provided, but users don't know which ones

---

### No Customer Portal Quote/Inquiry Views

**Problem:** Customers can't view their quotes or inquiries in detail

**Files:** `/portal/customer/*`

**Missing Routes:**
- ❌ `/portal/customer/quotes`
- ❌ `/portal/customer/quotes/[id]`
- ❌ `/portal/customer/inquiries`

**Impact:**
- Customers must use email links to view details
- Can't see all their requests in one place
- Can't compare multiple quotes
- Can't see inspection results

---

## Test Coverage Gaps

### No E2E Tests for Quote → Project Workflow

**What's Not Tested:**
- Quote creation → magic link generation → onboarding
- Form data persistence across tabs
- Service-specific field validation
- Wizard data completeness checks

**Files:** No test files for:
- `app/quote/page.tsx`
- `app/portal/admin/quotes/[id]/page.tsx`

**Risk:** Bugs in critical user-facing workflows go unnoticed

**Priority:** HIGH - Critical path testing

---

### No Tests for Cascade Deletion

**What's Not Tested:**
- User deletion cascades to all related records
- Orphaned records aren't created
- Storage cleanup can find unused documents

**Files:** No migration tests

**Risk:** Data loss when implementing CASCADE constraints

---

### No Tests for Service-Specific Logic

**What's Not Tested:**
- Bill uploads only appear for efficiency
- Timeline/budget fields only appear for consulting
- Inspection required only for efficiency
- Pricing calculated differently per service

**Files:** No tests for:
- Service type validation
- Conditional field rendering
- Service-specific workflows

**Risk:** Service logic silently breaks when forms are refactored

---

### Missing Integration Tests

**What's Not Tested:**
- API routes with real Supabase (no mocking)
- Multi-step workflows (form → API → database → redirect)
- RLS policies blocking unauthorized access
- Magic link flows

**Current Test Setup:** `vitest` configured but no visible tests

**Risk:** Integration bugs only discovered in production

---

## Build & Deployment Issues

### Build Passes with TypeScript Errors

**Risk:** Production code may have type errors

**Impact:**
- Runtime errors in edge cases
- Hard to debug in production
- Reduces confidence in code quality

**Solution:** Run `next build` and address all errors before deployment

---

### ESLint Disabled During Build

**Risk:** Code quality issues not caught

**Impact:**
- Inconsistent code style
- Unused variables accumulate
- Dead code not detected

**Solution:** Enable eslint and create `.eslintignore` for legitimate exceptions

---

## Undocumented Tables

**Files:** `supabase/migrations/` (36 migrations)

**Discovered During Audit:**
- `admin_requests` - Request tracking (incidents, reassignments, reschedules)
- `deletion_requests` - User deletion workflow
- `portfolio_projects` - Public portfolio/case studies
- `magic_links` - Authentication tokens
- `reschedule_tokens` - Appointment rescheduling
- `user_settings` - Preferences/notification settings
- `electrical_boards` - Panel inspection data

**Risk:** Code may rely on these tables without visibility

**Fix approach:** Document each table's purpose in codebase:
1. Create `docs/DATABASE_SCHEMA.md`
2. List each table's purpose, FK relationships, and TTL if applicable
3. Link from relevant code files

---

## Architectural Concerns

### Mixed Responsibility in Admin Pages

**Problem:** Admin pages handle multiple concerns: data display, editing, deletion

**Files:** `app/portal/admin/users/clients/page.tsx` is 400+ lines

**Impact:** Hard to test, hard to refactor, easy to break multiple things at once

**Fix approach:** Extract into smaller components:
- `<ClientListView>` - display only
- `<ClientDeleteModal>` - deletion logic
- `<ClientEditForm>` - editing form

---

### No Error Boundary Implementation

**Risk:** Unhandled React errors crash entire page

**Files:** No ErrorBoundary components found

**Recommendations:**
1. Add root-level error boundary in layout
2. Add error boundaries around each route
3. Log errors to monitoring service
4. Show user-friendly error messages

---

## Recommendations Summary

### CRITICAL (Fix Now)
1. ✅ Implement CASCADE constraints (Phase 01-02)
2. ✅ Fix user deletion data loss (wrong field name)
3. Fix build config to not ignore TypeScript errors

### HIGH (Fix in Phase 2)
1. Complete efficiency workflow Stage 3 (inspection → pricing)
2. Add pagination to list views
3. Implement RLS validation in API routes
4. Add service-specific field validation to all wizards

### MEDIUM (Fix in Phase 3)
1. Refactor documents table schema
2. Add comprehensive test coverage
3. Enable image optimization
4. Create database audit log

### LOW (Nice to have)
1. Add customer quote/inquiry portal views
2. Document all database tables
3. Migrate to error boundaries
4. Implement caching strategy

---

*Concerns audit: 2026-01-29*
