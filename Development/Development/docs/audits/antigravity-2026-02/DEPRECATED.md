# Antigravity Docs Audit - Deprecated List

Links: [INVENTORY.md](INVENTORY.md) | [SUMMARY.md](SUMMARY.md)

> Scope: Full version docs in `Development/` only. Static site docs are out of scope.
> Source of truth: code + migrations + ROADMAP/PROJECT decisions.

## Deprecated Items

| File/Section | Status | Action | Replacement | Notes |
| --- | --- | --- | --- | --- |
| Development/docs/legacy_firebase/FIREBASE_REFERENCE.md | Legacy | Marked legacy and out of scope | Development/docs/SUPABASE_REFERENCE.md | Retained for history; confirm Firebase functions usage before removal. |
| Development/docs/migration_gap_analysis_2026.md | Legacy | Marked legacy and out of scope | Development/docs/ATOMIC_DATABASE.md | Historical migration snapshot. |
| Development/docs/supabase_migration_plan_2026.md | Legacy | Marked legacy and out of scope | Development/docs/ATOMIC_DATABASE.md | Superseded by current migrations. |
| Development/docs/user_migration_strategy.md | Legacy | Marked legacy and out of scope | Development/docs/ARCHITECTURE.md | Superseded by current auth/data model. |
| Development/docs/on_hold/technician_flow_2026_01_08/technician_system_status.md | Legacy | Marked legacy and out of scope | Development/docs/USER_FLOWS.md | On-hold flow not part of current stack. |
| tasks record/2026-01-01_Unified-Service-Request-System/implementation_plan.md | Legacy | Marked legacy and out of scope | Development/docs/USER_FLOWS.md | Historical task record. |
| tasks record/2026-01-01_Unified-Service-Request-System/task.md | Legacy | Marked legacy and out of scope | Development/docs/USER_FLOWS.md | Historical task record. |

## Actions Checklist

- [x] Identify legacy Firebase, migration, and task-record docs
- [x] Mark legacy items with scope and out-of-scope notes
- [ ] Confirm Firebase Cloud Functions usage before deleting legacy Firebase docs
- [ ] Confirm authoritative migrations folder before deleting migration plans

## Notes

- Deprecated items are retained as historical artifacts until open questions are resolved.
- Once confirmed, remove or archive legacy items to reduce confusion.
