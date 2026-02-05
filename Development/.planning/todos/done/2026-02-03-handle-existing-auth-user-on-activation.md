---
created: 2026-02-03T05:46
title: Handle existing auth user on activation
area: api
files:
  - Development/app/api/activate-account/route.ts:71
---

## Problem

Onboarding activation fails with a 500 when Supabase Auth returns "A user with this email address has already been registered". The activation flow should recover by locating the existing auth user and updating credentials, but the current error matching does not catch all variants.

## Solution

Harden the error handling in `createUser` to detect "already registered" variants (case-insensitive) and fall back to lookup/update. Add a test or a dev-only simulation to confirm the fallback path runs.
