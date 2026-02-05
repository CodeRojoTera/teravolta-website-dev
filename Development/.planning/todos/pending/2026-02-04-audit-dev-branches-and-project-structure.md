---
created: 2026-02-04T14:00
title: Audit dev branches and reorganize project folder structure
area: planning
files:
  - .planning/STATE.md
  - Development/  (nested Next.js app root)
---

## Problem

Two issues surfaced during Phase 14 UAT:

**1. Nested Development/ folder**
The git repo root is `C:\Teravolta website dev\Development\` but the actual Next.js app
lives inside `Development/Development/`. This means:
- `tsc`, `next dev`, and other CLI tools must be run from the inner folder
- Git tracks all app code as `Development/app/...` instead of `app/...`
- Planning docs (`.planning/`) live at the repo root, app code one level deeper
- Confusing for anyone (or any AI) picking up the project cold

The outer folder also contains loose items: `branding Teravolta/`, `Source information for website/`,
`tasks record/`, `user test files/`, `website static view dev/`, stray files (`C`, `nul`,
`PHASE_2_UAT_DIAGNOSIS.yaml`). Some of these may be referenceable or may be dead.

**2. Stale git branches**
Current branches:
- `master` — main branch
- `gsd/phase-01-foundation-data-integrity`
- `gsd/phase-02-quote-submission-wizard-unification`
- `gsd/phase-02.1-antigravity-docs-audit-rebuild` (currently checked out)
- `gsd/phase-03-shared-service-features`

Phases 01–03 are complete. These branches are likely fully merged or redundant.
Need to confirm merge status and clean up before they accumulate further.

## Solution

TBD — scope this as two sub-tasks when planned:
1. Audit branches: confirm merged, delete safe ones, note any with unmerged work
2. Audit folder structure: decide canonical layout, move/flatten as needed, update
   all references (tsconfig paths, .planning file refs, CI if any)
