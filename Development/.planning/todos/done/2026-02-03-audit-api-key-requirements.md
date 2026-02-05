---
created: 2026-02-03T05:48
title: Audit API key usage and failures
area: api
files:
  - Development/lib/supabase-admin.ts:6
  - Development/app/api/send-email/route.ts:11
  - Development/app/api/create-quote/route.ts:19
---

## Problem

Local testing surfaced multiple 500s tied to missing or misconfigured API keys (Supabase service role, Resend). There is no consolidated map of required keys or a clear fail-fast UX in development.

## Solution

Inventory all API routes and services that depend on external keys, document required env vars, and add guardrails (clear error messages or dev fallbacks). Include a quick checklist for local setup.
