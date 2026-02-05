---
created: 2026-02-03T18:58
title: Review Resend email usage
area: api
files:
  - Development/app/api/send-email/route.ts
  - Development/app/api/send-onboarding-email/route.ts
  - Development/app/api/send-invoice/route.ts
  - Development/app/api/notify-existing-client/route.ts
---

## Problem

Resend is used in multiple API routes. We need a full audit to ensure consistent guards, error handling, and production-safe behavior across all email paths.

## Solution

Inventory every Resend usage, confirm env var requirements, and align behavior (dev skips vs prod errors). Add any missing guards or docs. Consider a plan if scope grows.
