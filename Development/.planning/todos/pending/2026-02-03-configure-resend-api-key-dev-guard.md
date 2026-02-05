---
created: 2026-02-03T05:47
title: Configure Resend key or dev guard
area: api
files:
  - Development/app/api/send-email/route.ts:11
  - Development/.env.local:1
---

## Problem

Inquiry submission logs a 500 from `/api/send-email` because `RESEND_API_KEY` is missing. This creates noisy failures during local testing and can interrupt onboarding feedback loops even though email is non-critical in dev.

## Solution

Provide a dev-safe path: either set `RESEND_API_KEY` locally or gate send-email in development (log + return success). Document required env vars for email in local setup.
