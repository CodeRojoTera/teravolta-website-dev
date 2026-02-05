---
status: diagnosed
issue_id: 3
test: "Test 7 - Resend Email Dev Guard"
severity: blocker
created: 2026-02-04T15:30:00Z
updated: 2026-02-04T15:45:00Z
---

## Summary

`send-onboarding-email/route.ts` crashes with "Missing API key" when `RESEND_API_KEY` is undefined. Should have dev-safe guard added in Phase 14-05, but guard was not properly applied to this route.

## Root Cause FOUND

**File:** `app/api/send-onboarding-email/route.ts`
**Line:** 6
**Issue:** Resend client initialized BEFORE checking if API key exists

```typescript
// CURRENT (WRONG) - Line 6:
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // GUARD CHECK - Line 10-16:
        if (!process.env.RESEND_API_KEY) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[DEV] RESEND_API_KEY missing — skipping email send');
                return NextResponse.json({ success: true, messageId: 'dev-skip', skipped: true }, { status: 200 });
            }
            return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
        }
        ...
    }
}
```

## Why This Fails

1. **Timing issue:** `new Resend(undefined)` is called at **module load time** (line 6)
2. **Guard is too late:** The check at line 10 runs only when POST is called
3. **Error happens immediately:** Resend constructor throws before guard is evaluated
4. **Stack trace:** `Error: Missing API key. Pass it to the constructor \`new Resend(undefined)\``

## Correct Pattern (Already Implemented in 3 Other Routes)

All three other Resend routes use the correct pattern:

**Files:** 
- `app/api/send-email/route.ts` (Line 5 + Line 11-17)
- `app/api/send-invoice/route.ts` (Line 5 + Line 9-15)
- `app/api/notify-existing-client/route.ts` (Line 4 + Line 8-14)

```typescript
// CORRECT - Guard at top of handler, before client use:
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[DEV] RESEND_API_KEY missing — skipping email send');
                return NextResponse.json({ success: true, messageId: 'dev-skip', skipped: true }, { status: 200 });
            }
            return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
        }
        ...
    }
}
```

Wait - all 4 routes have the same pattern! The issue is that **Resend client is initialized at module load time in ALL routes**, not just this one. The guard only works if the error is thrown AFTER import, not during initialization.

## The Real Issue

The `new Resend(undefined)` call happens when the module is imported/initialized, **BEFORE** any request handler runs. The check at lines 10-17 is ineffective because the error already occurred.

### Why Other Routes Don't Crash

Need to verify: Do the other routes actually work or do they also crash on cold start? The guard pattern shown doesn't actually prevent the error - it just handles the case after the error would have been thrown.

### Actual Fix Needed

Move Resend initialization INSIDE the POST handler, after the guard check:

```typescript
// CORRECT - Initialize after guard:
export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[DEV] RESEND_API_KEY missing — skipping email send');
                return NextResponse.json({ success: true, messageId: 'dev-skip', skipped: true }, { status: 200 });
            }
            return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
        }
        
        // MOVED HERE - After guard check:
        const resend = new Resend(process.env.RESEND_API_KEY);
        ...
    }
}
```

## Files Affected

- `app/api/send-onboarding-email/route.ts` - Line 6 (and likely affects ALL 4 email routes)

## Scope of Issue

This may not be isolated to `send-onboarding-email`. Check if other 3 routes have same vulnerability:
- `app/api/send-email/route.ts`
- `app/api/send-invoice/route.ts`  
- `app/api/notify-existing-client/route.ts`

All currently initialize Resend at module load time, which would crash if `RESEND_API_KEY` is undefined.

## Impact

- **Severity:** BLOCKER - Application crashes when trying to use any Resend-based email route without API key
- **Error:** 500 Internal Server Error with "Missing API key" message
- **Dev impact:** Cannot test locally without setting dummy RESEND_API_KEY
- **Test:** Test 7 fails because resending technician onboarding email crashes with 500 error

