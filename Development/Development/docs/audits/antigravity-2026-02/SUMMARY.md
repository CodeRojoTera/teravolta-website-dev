# Antigravity Docs Audit - Summary

Links: [INVENTORY.md](INVENTORY.md) | [DEPRECATED.md](DEPRECATED.md)

> Scope: This audit applies to the full version of the website in `Development/` and excludes the static site in `website static view dev/`.
> Source of truth: code + migrations + ROADMAP/PROJECT decisions. Conflicts are flagged for review.

## Initial Findings

- **Confirmation required:** Authoritative migrations folder conflict (root `supabase/` vs `Development/supabase/`) impacts schema truth for doc updates.
- **Confirmation required:** Firebase Cloud Functions usage in production remains unclear, blocking final disposition of legacy Firebase guidance.
- **High-risk conflict:** Legacy migration and Firebase references persist across inventory entries marked "Needs Review"; scope scan required before final cleanup.

## Inventory Snapshot

- Total markdown files: 1742
- Scan scope: excludes `.claude/`, `.opencode/`, and `.gemini/`
- Inventory reference: [INVENTORY.md](INVENTORY.md)

## Change Log (Plan 02.1-08)

- Finalized inventory statuses with per-file findings and checklists.
- Completed deprecated list with actions and replacements.
- Consolidated needs-review items and open questions from research.

## Snapshot of Phase Edits (Plans 02-07, 09)

- Core docs aligned to Supabase + Resend (architecture, database, services, user flows).
- Legacy Firebase and migration artifacts marked as legacy and scoped out.
- Static site docs scoped to static stack only.
- Scan-hit remediation applied to planning artifacts and flagged comments.

## Checklist

### Fixes Applied

- [x] Updated core full-version docs to current stack baseline
- [x] Scoped static docs and audit-phase docs
- [x] Marked legacy migration/Firebase docs as legacy
- [x] Remediated scan-flagged markdown and comment hits
- [x] Finalized inventory and deprecated list
- [x] Added initial findings and inventory snapshot to summary

### Pending

- [ ] Confirm authoritative migrations folder (root `supabase/` vs `Development/supabase/`)
- [ ] Confirm whether Firebase Cloud Functions are still used in production

## Needs Review

- Authoritative migrations folder conflict (root `supabase/` vs `Development/supabase/`).
- Firebase Cloud Functions usage in production (affects legacy Firebase docs disposition).

## Open Questions

1. Which Supabase migrations folder is authoritative (root `supabase/` vs `Development/supabase/`)?
2. Are Firebase Cloud Functions still used in production, or fully deprecated?

## Notes

- Inventory entries marked "Needs Review" require a focused legacy-term scan before final disposition.
- Deprecated items are retained until the open questions are resolved.
