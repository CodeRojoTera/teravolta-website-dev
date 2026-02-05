---
status: diagnosed
issue_id: 1
test: "Test 2 - Technician Resend Invite Button"
severity: major
created: 2026-02-04T15:30:00Z
updated: 2026-02-04T15:45:00Z
---

## Summary

After technician completes onboarding, technician dashboard loads but shows 400 Bad Request on GET `/rest/v1/inquiries?select=*&email=eq.[email]&status=in.(pending,contacted)` query.

## Symptoms

- **Expected:** Technician dashboard loads without any 400 errors
- **Actual:** Dashboard loads, but API call to Supabase REST API returns 400 Bad Request
- **Error:** `GET /rest/v1/inquiries?select=*&email=eq.[email]&status=in.(pending,contacted)` returns 400
- **Context:** User already sees dashboard, so not a blocker for page load, but data fetch is broken
- **Reproduction:** Complete technician onboarding, then navigate to technician dashboard

## Investigation Status

**INCOMPLETE - Requires further investigation**

The exact query location and cause needs investigation. Possible causes:
1. Email parameter not being URL-encoded properly (special characters in email)
2. Supabase REST API doesn't support the query syntax being used
3. Inquiries table doesn't exist or user lacks permissions
4. Query is being sent to wrong table

## Root Cause

**UNKNOWN** - Code location for this query not yet identified in primary search

## Investigation Needed

- [ ] Find where technician dashboard queries inquiries
- [ ] Identify the exact query being sent
- [ ] Check if inquiries table exists and has proper RLS policies
- [ ] Verify email parameter encoding
- [ ] Check Supabase API logs for error details

## Files to Investigate

- `app/portal/technician/page.tsx` - Does not show inquiries query (uses appointments instead)
- `components/technician/*.tsx` - Potential location for inquiries query
- `app/services/*Service.ts` - Service layer may have the query

## Notes

The technician dashboard in `app/portal/technician/page.tsx` loads appointments via `AppointmentService`, not inquiries. The 400 error appears to be from a different query source - possibly a service, component, or context provider attempting to fetch related inquiry data.

