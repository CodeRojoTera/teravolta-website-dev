# Codebase Concerns

**Analysis Date:** 2026-01-28

## Tech Debt

**TypeScript Type Safety - Excessive `any` usage:**
- Issue: Multiple service files and components use `any` type instead of proper interfaces
- Files: `app/portal/technician/page.tsx`, `app/portal/admin/page.tsx`, `app/services/quoteService.ts`, `app/services/activeProjectService.ts`, `app/services/technicianService.ts`, `app/portal/admin/requests/page.tsx`
- Impact: Reduces type safety, makes refactoring dangerous, enables runtime errors that could be caught at compile time
- Fix approach: Replace all `any` types with proper TypeScript interfaces from `lib/types.ts`. Create new interfaces where needed. Run strict type checking post-fix.

**Build Configuration Ignores TypeScript Errors:**
- Issue: `next.config.ts` has `typescript: { ignoreBuildErrors: true }` and `eslint: { ignoreDuringBuilds: true }`
- Files: `next.config.ts`
- Impact: TypeScript and ESLint errors silently propagate to production. Compilation succeeds even with breaking code. Makes production builds unreliable.
- Fix approach: Remove error ignoring flags. Fix actual TypeScript/ESLint issues. Re-enable strict checking in CI/CD.

**Client-side Data Mapping - Missing Type Safety:**
- Issue: `mapToDB()` and `mapToType()` functions in service files use `any` return types
- Files: `app/services/quoteService.ts` (lines 88, 143), `app/services/activeProjectService.ts` (line 379)
- Impact: Database-to-TypeScript transformations are unvalidated. Typos in field mapping go undetected. Data corruption risk.
- Fix approach: Create strict mapping interface types. Validate at runtime or use typed mapper utilities. Add unit tests for all mappings.

**Incomplete Service Methods:**
- Issue: `ReviewService.hasUserReviewedProject(projectId)` is referenced but not implemented
- Files: `app/portal/customer/projects/[id]/page.tsx` (line 81 - TODO comment)
- Impact: Review functionality is incomplete. Null checks may fail. Users cannot reliably see review status.
- Fix approach: Implement missing ReviewService method. Add proper error handling in component.

**Placeholder Supabase Clients:**
- Issue: If environment variables are missing, fallback clients use placeholder URLs `https://placeholder.supabase.co`
- Files: `lib/supabase.ts` (lines 18-26)
- Impact: Requests to placeholder URLs will fail silently. No clear error to developer. Production will break if env vars missing.
- Fix approach: Throw error at startup if env vars missing instead of creating placeholder clients.

## Known Bugs

**Build Failures - Module Import Errors:**
- Symptoms: Build fails with "Module not found: Can't resolve" errors
- Files: `app/portal/account/page.tsx` attempting to import Header, Footer, Button, LanguageProvider, AuthProvider
- Trigger: Running `npm run build`
- Root cause: Component imports use relative paths with incorrect directory traversal (e.g., `../../components/Header`)
- Workaround: Files appear to be in wrong location or import paths incorrect. Check directory structure.

**Type Mismatch - createdAt Field:**
- Symptoms: Technician data treats `createdAt` as `any` instead of string
- Files: `lib/types.ts` (line 520) - `createdAt: any;`
- Trigger: Creating or loading technician records
- Workaround: Cast to string at usage sites, but this is fragile
- Fix approach: Use consistent string type. Ensure Supabase returns ISO timestamps.

**Error Handling - Missing Error Boundaries:**
- Symptoms: Unhandled Promise rejections or runtime errors crash pages without user feedback
- Files: Multiple API routes lack error context in catch blocks
- Trigger: Network failures, database errors, validation failures
- Root cause: Generic error messages, no user-friendly fallbacks
- Fix approach: Create custom error types. Implement error boundary components. Add retry logic where appropriate.

## Security Considerations

**API Key Exposure Risk - Email Service:**
- Risk: `RESEND_API_KEY` initialized at module level in `app/api/send-email/route.ts`
- Files: `app/api/send-email/route.ts` (line 5), `app/api/send-invoice/route.ts` (line 5), `app/api/notify-existing-client/route.ts` (line 4), `app/api/send-onboarding-email/route.ts` (line 6)
- Current mitigation: Key is from environment variables. No logging of actual key value.
- Recommendations:
  - Move Resend initialization into each route handler, not module level
  - Add API key rotation mechanism
  - Monitor for unauthorized email sending in logs
  - Consider moving to secure service layer

**Missing Request Validation - API Routes:**
- Risk: API endpoints don't validate incoming request structure. Arbitrary data can be sent to database.
- Files: `app/api/create-project/route.ts`, `app/api/create-quote/route.ts`, `app/api/assign-technician/route.ts`
- Current mitigation: Type inference from TypeScript, but no runtime schema validation
- Recommendations:
  - Add Zod or similar schema validation to all POST/PUT endpoints
  - Validate email addresses, phone numbers, dates before database insert
  - Reject payloads with unexpected fields
  - Add rate limiting

**Client Security Checks - Insufficient Authorization:**
- Risk: Customer project page checks ownership via `clientId !== user.id` but also accepts if `clientEmail !== user.email`, which could be spoofed
- Files: `app/portal/customer/projects/[id]/page.tsx` (lines 59-64)
- Current mitigation: Middleware checks authentication. Email comparison as secondary check.
- Recommendations:
  - Rely on user.id from authenticated session only
  - Add server-side authorization check via API
  - Log suspicious access attempts
  - Implement proper JWT validation

**Password Security - No Password Strength Policy:**
- Risk: No validation of password requirements during account creation
- Files: `app/api/activate-account/route.ts` - Creates users with email_confirm=true without password strength checks
- Current mitigation: Supabase auth handles some validation
- Recommendations:
  - Enforce password requirements (length, complexity)
  - Add password strength meter to frontend
  - Consider passwordless auth (magic links) which is already partially implemented

**Unencrypted Sensitive Data:**
- Risk: Sensitive fields (budget, bill amounts) stored in plaintext in database
- Files: Database schema includes `monthly_bill`, `budget` fields
- Impact: Unauthorized database access exposes financial information
- Recommendations:
  - Encrypt sensitive fields at rest (Supabase can do this)
  - Add field-level access control in RLS policies
  - Audit database access logs regularly

## Performance Bottlenecks

**Unoptimized Project Fetching:**
- Problem: `ActiveProjectService.getByUserId()` fetches entire project objects without pagination or filtering
- Files: `app/services/activeProjectService.ts` (lines 50-68)
- Cause: Uses `.select('*')` without limit. Large user datasets will cause slow page loads.
- Improvement path:
  - Add pagination with limit/offset
  - Only select necessary columns
  - Add caching layer for frequently accessed data
  - Consider server-side pagination component

**Calendar/Availability Queries - N+1 Problem:**
- Problem: `getAvailability` likely fetches all technicians, then queries appointments for each
- Files: `app/api/availability/route.ts` (lines 23, 47)
- Cause: No batch loading or joins
- Impact: Slow response time with many technicians
- Improvement path:
  - Use single query with JOINs
  - Cache availability for 5-15 minutes
  - Add query indexes on technician_id, appointment date fields

**Image Optimization Disabled:**
- Problem: `next.config.ts` has `images: { unoptimized: true }`
- Files: `next.config.ts` (line 6)
- Impact: Large unoptimized images sent to clients. Higher bandwidth costs. Slower mobile experience.
- Improvement path: Enable Next.js image optimization. Add proper image sizing. Use WebP format.

**Missing Database Indexes:**
- Problem: Heavy queries on user_id, technician_id, created_at without confirmed indexes
- Files: Across all service files
- Impact: Slow queries at scale. Linear scan of large tables.
- Improvement path: Add indexes on frequently queried fields in Supabase schema. Monitor query performance.

## Fragile Areas

**Service Reference-to-Entity Mapping:**
- Files: `app/services/quoteService.ts`, `app/services/activeProjectService.ts`
- Why fragile: Database column names (snake_case) must match mapping functions exactly. Typos silently create null values.
- Safe modification: Always run mapping tests after schema changes. Keep mapping functions adjacent to schema docs.
- Test coverage: No unit tests for mapToDB/mapToType functions visible

**Admin Portal - Complex State Management:**
- Files: `app/portal/admin/page.tsx` (useState for recentActivity, chartData with `any[]` types)
- Why fragile: State is defined as `any[]` with no validation. Chart data structure is unknown.
- Safe modification: Add TypeScript interfaces for admin state. Test all state transitions.
- Test coverage: No tests visible

**Authentication Flow - Magic Link Token Handling:**
- Files: `app/api/create-magic-link/route.ts`, `app/api/verify-token/route.ts`, `app/onboard/[token]/page.tsx`, `app/reschedule/[token]/page.tsx`
- Why fragile: Token verification happens in multiple places. No centralized validation. Tokens stored in URLs (XSS risk).
- Safe modification: Create single token service. Validate token format, expiration. Use secure, httpOnly cookies instead of URL params.
- Test coverage: No visible tests

**Project Status Transitions:**
- Files: `lib/types.ts` (PROJECT_STATUSES array), `app/services/activeProjectService.ts`
- Why fragile: 16 different status values. No state machine. Can transition from any state to any other state.
- Safe modification: Add state machine validation. Document allowed transitions. Enforce in update method.
- Test coverage: No visible tests

## Scaling Limits

**Database Connection Pooling:**
- Current capacity: Supabase free tier has connection limits (~10 simultaneous)
- Limit: Will fail under load with concurrent API requests
- Scaling path: Enable pgBouncer connection pooling in Supabase. Monitor connection usage. Scale to Pro tier as needed.

**Real-time Subscriptions - Missing Limits:**
- Current capacity: Code doesn't limit concurrent subscriptions
- Limit: Supabase real-time can't handle 1000+ concurrent subscriptions efficiently
- Scaling path: Implement subscription pooling. Use room-based subscriptions. Cache and poll instead of subscribing to everything.

**File Storage - No Size Limits:**
- Current capacity: Supabase storage not configured with upload size limits
- Limit: Users could upload large files, consuming storage quota quickly
- Scaling path: Add client-side file size validation. Set server-side upload limits. Implement file cleanup/archival.

**Technician Availability Calculation:**
- Current capacity: `getTechnicianAvailability()` loops through entire leave database
- Limit: Slow with 100+ technicians or 10000+ leave records
- Scaling path: Create materialized view of available technicians. Cache availability. Use specialized scheduling service.

## Dependencies at Risk

**Supabase SSR Package - Deprecation Risk:**
- Risk: Using `@supabase/ssr` which has complex cookie management requirements
- Files: `middleware.ts`, `lib/supabase.ts`
- Impact: Future auth changes might break cookie sync
- Migration plan: Keep up with Supabase auth documentation. Test auth flow after upgrades. Consider fallback to standard client.

**Resend Email Service - Provider Lock-in:**
- Risk: All email infrastructure depends on Resend. No fallback service.
- Files: `app/api/send-email/route.ts`, `app/api/send-invoice/route.ts`, etc.
- Impact: If Resend has outage, no emails sent
- Migration plan: Create email service abstraction. Support multiple providers (Resend + SendGrid). Add queue system for retry.

**Next.js 15 - Rapid Release Cycle:**
- Risk: Upgrading frequently can introduce breaking changes
- Files: All routes, all components
- Impact: Build failures, runtime errors after upgrades
- Migration plan: Pin minor versions. Test thoroughly before upgrading. Keep changelog of breaking changes.

## Missing Critical Features

**Review System - Not Fully Implemented:**
- Problem: Customer project page has review modal but ReviewService methods incomplete
- Blocks: Customers cannot leave feedback. Technician ratings not available.
- Implementation needed: Create reviews table. Implement ReviewService fully. Add review display on project page and technician profile.

**Document Management - No Versioning:**
- Problem: Uploaded documents have no version history or change tracking
- Blocks: Cannot audit document changes. No rollback if wrong file uploaded.
- Implementation needed: Add versioned_documents table. Track document edits. Allow restore to previous version.

**Notification System - Only Creates, Doesn't Deliver:**
- Problem: `create-notification/route.ts` creates records but no actual notification delivery (push, SMS, etc.)
- Blocks: Users don't receive alerts. Projects have silent status changes.
- Implementation needed: Integrate push notification service. Add SMS notifications. Implement in-app notification feed.

**Project Timeline - Incomplete Implementation:**
- Problem: `timeline` field exists but is rarely populated. No timeline view on customer dashboard.
- Blocks: Customers can't see project history. No audit trail of who did what and when.
- Implementation needed: Implement timeline entry creation. Display timeline UI. Add activity feed.

## Test Coverage Gaps

**No Unit Tests for Service Mapping:**
- What's not tested: `mapToDB()` and `mapToType()` functions in all service files
- Files: `app/services/quoteService.ts`, `app/services/activeProjectService.ts`, `app/services/technicianService.ts`
- Risk: Silent data corruption during field mapping. Typos in snake_case/camelCase conversion
- Priority: High - Core data pipeline

**No API Endpoint Tests:**
- What's not tested: All POST/PUT routes in `app/api/`
- Files: `app/api/create-project/route.ts`, `app/api/send-email/route.ts`, etc.
- Risk: Breaking changes not caught. Invalid input handling not validated
- Priority: High - User-facing API surface

**No Integration Tests for Authentication:**
- What's not tested: Full auth flow (magic link → token → activation → login)
- Files: `middleware.ts`, `app/api/create-magic-link/route.ts`, `app/api/verify-token/route.ts`, `app/api/activate-account/route.ts`
- Risk: Auth flow breaks silently. Users locked out by undetected bugs
- Priority: Critical - System is customer-blocking

**No E2E Tests for User Workflows:**
- What's not tested: Customer inquiry → quote → project creation → technician assignment
- Risk: Breaking changes to core business flow go undetected
- Priority: High - Revenue-critical path

**Missing Error Scenario Tests:**
- What's not tested: Network failures, database errors, missing environment variables
- Risk: Production failures cause crashes instead of graceful degradation
- Priority: Medium - Resilience

---

*Concerns audit: 2026-01-28*
