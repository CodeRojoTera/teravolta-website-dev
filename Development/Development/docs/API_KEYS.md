# API Keys & Environment Variables

Reference for all environment variables required by the TeraVolta platform.

## Supabase

| Variable | Purpose | Required (Dev) | Required (Prod) | Source |
|----------|---------|----------------|-----------------|--------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL — used by client and server | Yes | Yes | Supabase Dashboard → Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous (public) key — used by client-side queries with RLS | Yes | Yes | Supabase Dashboard → Settings → API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service-role key — bypasses RLS, used by server-side admin operations | Yes | Yes | Supabase Dashboard → Settings → API |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to the client. It is imported only in server-side files (e.g., `lib/supabase-admin.ts`).

## Email (Resend)

| Variable | Purpose | Required (Dev) | Required (Prod) | Source |
|----------|---------|----------------|-----------------|--------|
| RESEND_API_KEY | Resend email API key — used by all `/api/send-*` and `/api/notify-*` routes | No (skipped with warning) | Yes | [Resend Dashboard](https://resend.com/dashboard) → API Keys |

> **Dev behavior:** When `RESEND_API_KEY` is missing in a non-production environment, all email routes return `{ success: true, skipped: true }` with a `[DEV]` console warning instead of crashing. In production, missing key returns HTTP 503.

### Routes using Resend
- `POST /api/send-email` — Generic outbound email
- `POST /api/notify-existing-client` — Project-initiated client notification
- `POST /api/send-invoice` — Invoice delivery with document links
- `POST /api/send-onboarding-email` — Account activation / welcome email (customers + technicians)

## Application

| Variable | Purpose | Required (Dev) | Required (Prod) | Source |
|----------|---------|----------------|-----------------|--------|
| NEXT_PUBLIC_APP_URL | Base URL for the application — used to construct magic links and portal URLs in emails | No (defaults to `http://localhost:3000`) | Yes | Set to your production domain (e.g., `https://app.teravolta.com`) |

## Setup Checklist

### Local Development (`.env.local`)
1. Copy `.env.local.example` to `.env.local` (if example exists)
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project
3. Set `SUPABASE_SERVICE_ROLE_KEY` from Supabase (keep secret)
4. Optionally set `RESEND_API_KEY` to test email sending; omit to use dev-skip mode
5. `NEXT_PUBLIC_APP_URL` defaults to `http://localhost:3000` — override if needed

### Production
All variables marked **Required (Prod) = Yes** MUST be set in your hosting environment (e.g., Vercel environment variables).
