# Antigravity Docs Audit - Inventory

Links: [SUMMARY.md](SUMMARY.md) | [DEPRECATED.md](DEPRECATED.md)

> Scope: This audit applies to the full version of the website in `Development/` and excludes the static site in `website static view dev/`.
> Source of truth: code + migrations + ROADMAP/PROJECT decisions. Docs are reconciled against those sources.

Total markdown files: 1742

## Inventory Table

| File | Scope | Status | Findings | Fixes Applied | Pending |
| --- | --- | --- | --- | --- | --- |
| .planning/.continue-here.md | Full | Updated | Scan hit remediated and scope clarified. | - [x] Removed legacy term references | - [x] None |
| .planning/.continue-milestone-creation.md | Full | Needs Review | Not touched in Plans 02-07/09; verify legacy terms. | - [x] None | - [ ] Needs review: scan for legacy stack references |
| .planning/PROJECT.md | Full | Updated | Stack language aligned to Supabase + Resend. | - [x] Updated legacy references | - [x] None |
| .planning/REQUIREMENTS.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for obsolete guidance. | - [x] None | - [ ] Needs review: confirm requirements match current stack |
| .planning/ROADMAP.md | Full | Updated | Phase 02.1 status and audit notes updated. | - [x] Updated phase progress | - [x] None |
| .planning/STATE.md | Full | Updated | Progress tracking updated during audit plans. | - [x] Updated phase status | - [x] None |
| .planning/codebase/ARCHITECTURE.md | Full | Needs Review | Not touched in Plans 02-07/09; verify legacy stack notes. | - [x] None | - [ ] Needs review: confirm architecture notes are current |
| .planning/codebase/CONCERNS.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for obsolete risks. | - [x] None | - [ ] Needs review: re-scan for legacy concerns |
| .planning/codebase/INTEGRATIONS.md | Full | Updated | Legacy integration references scoped. | - [x] Updated integration notes | - [x] None |
| .planning/phases/01-foundation--data-integrity/.continue-here.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy references. | - [x] None | - [ ] Needs review: scan for legacy stack mentions |
| .planning/phases/01-foundation--data-integrity/01-01-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/01-foundation--data-integrity/01-01-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-02-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/01-foundation--data-integrity/01-02-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-03-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/01-foundation--data-integrity/01-03-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-04-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/01-foundation--data-integrity/01-04-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-05-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/01-foundation--data-integrity/01-05-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-06-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-07-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-08-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-09-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-10-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-11-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-12-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-13-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-14-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-15-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/01-foundation--data-integrity/01-CONTEXT.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm context language |
| .planning/phases/01-foundation--data-integrity/01-RESEARCH.md | Full | Updated | Scan hit remediated in research notes. | - [x] Scoped legacy terms | - [x] None |
| .planning/phases/02-quote-submission---wizard-unification/.continue-here.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: scan for legacy stack mentions |
| .planning/phases/02-quote-submission---wizard-unification/02-01-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-01-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-02-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-02-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-03-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-03-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-04-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-04-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-05-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-05-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-06-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-06-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-07-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-07-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-08-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-08-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-09-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-09-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-10-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-10-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-11-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/02-quote-submission---wizard-unification/02-11-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/02-quote-submission---wizard-unification/02-CONTEXT.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm context language |
| .planning/phases/02-quote-submission---wizard-unification/02-RESEARCH.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm research language |
| .planning/phases/02-quote-submission---wizard-unification/02-UAT.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm UAT language |
| .planning/phases/02-quote-submission---wizard-unification/02-quote-submission---wizard-unification-VERIFICATION.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm verification language |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/.continue-here.md | Full | Updated | Scan hit remediated and scope clarified. | - [x] Removed legacy term references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-01-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-02-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-03-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-04-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-05-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-06-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-07-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-08-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-09-PLAN.md | Full | Updated | Scan hit remediated in plan text. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-RESEARCH.md | Full | Updated | Scan hit remediated in research notes. | - [x] Scoped legacy references | - [x] None |
| .planning/phases/03-shared-service-features/.continue-here.md | Full | Updated | Scan hit remediated and scope clarified. | - [x] Removed legacy term references | - [x] None |
| .planning/phases/03-shared-service-features/03-01-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/03-shared-service-features/03-01-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/03-shared-service-features/03-02-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/03-shared-service-features/03-02-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/03-shared-service-features/03-03-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/03-shared-service-features/03-03-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/03-shared-service-features/03-04-PLAN.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm plan language |
| .planning/phases/03-shared-service-features/03-04-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/03-shared-service-features/03-05-SUMMARY.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm summary language |
| .planning/phases/03-shared-service-features/03-RESEARCH.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm research language |
| .planning/research/ARCHITECTURE.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm research language |
| .planning/research/FEATURES.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm research language |
| .planning/todos/pending/2026-02-01-fix-global-typescript-errors.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| .planning/todos/pending/2026-02-02-fix-rls-policy-document-upload.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| .planning/todos/done/2026-02-03-audit-api-key-requirements.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| .planning/todos/pending/2026-02-03-audit-obsolete-antigravity-docs.md | Full | Updated | Scan hit remediated in todo context. | - [x] Scoped legacy references | - [x] None |
| .planning/todos/done/2026-02-03-configure-resend-api-key-dev-guard.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| .planning/todos/done/2026-02-03-handle-existing-auth-user-on-activation.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| .planning/todos/pending/2026-02-03-review-resend-email-usage.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm todo language |
| Development/.planning/codebase/ARCHITECTURE.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm codebase notes |
| Development/.planning/codebase/CONCERNS.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm codebase notes |
| Development/.planning/codebase/CONVENTIONS.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm codebase notes |
| Development/.planning/codebase/INTEGRATIONS.md | Full | Updated | Integration references aligned to Supabase + Resend. | - [x] Updated integration list | - [x] None |
| Development/.planning/codebase/STACK.md | Full | Updated | Stack versions aligned to current baseline. | - [x] Updated stack references | - [x] None |
| Development/.planning/codebase/STRUCTURE.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm codebase notes |
| Development/.planning/codebase/TESTING.md | Full | Needs Review | Not touched in Plans 02-07/09; verify for legacy terms. | - [x] None | - [ ] Needs review: confirm codebase notes |
| Development/DEPLOYMENT_CHECKLIST.md | Full | Updated | Deployment guidance aligned to Supabase + Resend. | - [x] Replaced legacy deployment steps | - [x] None |
| Development/README.md | Full | Updated | Scope notes aligned to full-version docs. | - [x] Added scope banner | - [x] None |
| Development/docs/API_REFERENCE.md | Full | Updated | API references aligned to current services. | - [x] Updated API scope notes | - [x] None |
| Development/docs/ARCHITECTURE.md | Full | Updated | Architecture narrative aligned to current stack. | - [x] Updated stack references | - [x] None |
| Development/docs/ATOMIC_ARCHITECTURE.md | Full | Updated | Atomic architecture aligned to current stack. | - [x] Updated stack references | - [x] None |
| Development/docs/ATOMIC_DATABASE.md | Full | Updated | Database reference aligned to Supabase baseline. | - [x] Updated schema notes | - [ ] Needs review: confirm authoritative migrations folder |
| Development/docs/AUDIT_PHASE2_PUBLIC.md | Full | Updated | Audit scope and status clarified. | - [x] Added scope notes | - [x] None |
| Development/docs/AUDIT_PHASE3_DASHBOARDS.md | Full | Updated | Audit scope and status clarified. | - [x] Added scope notes | - [x] None |
| Development/docs/BRANDING.md | Full | Updated | Branding scope aligned to full version only. | - [x] Added scope notes | - [x] None |
| Development/docs/NOTIFICATION_SYSTEM.md | Full | Updated | Notification system aligned to Resend. | - [x] Updated provider references | - [x] None |
| Development/docs/README.md | Full | Updated | Docs index aligned to current stack. | - [x] Updated links and scope notes | - [x] None |
| Development/docs/SERVICES_REFERENCE.md | Full | Updated | Service references aligned to current stack. | - [x] Updated stack references | - [x] None |
| Development/docs/SUPABASE_REFERENCE.md | Full | Updated | Supabase reference aligned to current baseline. | - [x] Updated schema references | - [ ] Needs review: confirm authoritative migrations folder |
| Development/docs/SYSTEM_NARRATIVE.md | Full | Updated | System narrative aligned to current stack. | - [x] Updated stack references | - [x] None |
| Development/docs/USER_FLOWS.md | Full | Updated | User flow language aligned to Supabase + Resend. | - [x] Updated flow references | - [x] None |
| Development/docs/audits/antigravity-2026-02/DEPRECATED.md | Full | Updated | Deprecated list finalized. | - [x] Recorded deprecated items | - [x] None |
| Development/docs/audits/antigravity-2026-02/INVENTORY.md | Full | Updated | Inventory finalized with statuses and checklists. | - [x] Set final statuses | - [x] None |
| Development/docs/audits/antigravity-2026-02/SUMMARY.md | Full | Updated | Summary finalized with change log and needs review. | - [x] Completed audit summary | - [x] None |
| Development/docs/legacy_firebase/FIREBASE_REFERENCE.md | Legacy | Legacy | Legacy Firebase reference retained for history. | - [x] Marked legacy and out of scope | - [ ] Needs review: confirm Firebase functions usage before removal |
| Development/docs/migration_gap_analysis_2026.md | Legacy | Legacy | Legacy migration analysis retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| Development/docs/on_hold/technician_flow_2026_01_08/technician_system_status.md | Legacy | Legacy | On-hold technician flow retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| Development/docs/supabase_migration_plan_2026.md | Legacy | Legacy | Legacy migration plan retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| Development/docs/user_migration_strategy.md | Legacy | Legacy | Legacy migration strategy retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| README.md | Full | Updated | Root README scope notes aligned. | - [x] Added scope banner | - [x] None |
| tasks record/2026-01-01_Unified-Service-Request-System/implementation_plan.md | Legacy | Legacy | Legacy task record retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| tasks record/2026-01-01_Unified-Service-Request-System/task.md | Legacy | Legacy | Legacy task record retained for history. | - [x] Marked legacy and out of scope | - [x] None |
| website static view dev/DEPLOYMENT_CHECKLIST.md | Static | Updated | Static site deployment scoped to static stack. | - [x] Added static scope notes | - [x] None |
| website static view dev/README.md | Static | Updated | Static site README scoped to static stack. | - [x] Added static scope notes | - [x] None |
| website static view dev/scripts/POPULATE_TEST_DATA_README.md | Static | Updated | Static script README scoped to static stack. | - [x] Added static scope notes | - [x] None |
| website static view dev/scripts/SYNC_USERS_README.md | Static | Updated | Static script README scoped to static stack. | - [x] Added static scope notes | - [x] None |
| .gemini/ | GSD tooling | No Change | Out of Scope — GSD required. | - [x] None | - [x] None |
| .planning/phases/01-foundation--data-integrity/01-06-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-07-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-08-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-09-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-10-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-11-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-12-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-13-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-14-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-15-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/01-foundation--data-integrity/01-foundation--data-integrity-VERIFICATION.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-01-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-02-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-03-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-04-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-05-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-06-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-07-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-08-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-09-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-10-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-10-SUMMARY.md | Full | Updated | Gap-closure plan 10 summary; added to inventory during plan 12. | - [x] Added to inventory | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-11-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-11-SUMMARY.md | Full | Updated | Gap-closure plan 11 summary; added to inventory during plan 12. | - [x] Added to inventory | - [x] None |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-CONTEXT.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-antigravity-docs-audit-rebuild-VERIFICATION.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/03-shared-service-features/03-05-PLAN.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| .planning/phases/03-shared-service-features/03-shared-service-features-VERIFICATION.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/.planning/phases/01-foundation--data-integrity/01-04-SUMMARY.md | Full | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@alloc/quick-lru/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@emnapi/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@emnapi/runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@emnapi/wasi-threads/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint-community/eslint-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint-community/regexpp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/config-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/config-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/eslintrc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/object-schema/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@eslint/plugin-kit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@googlemaps/js-api-loader/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@googlemaps/markerclusterer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@hookform/resolvers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@humanfs/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@humanfs/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@humanwhocodes/module-importer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@humanwhocodes/module-importer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@humanwhocodes/retry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@img/colour/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@img/colour/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@img/sharp-win32-x64/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@jridgewell/gen-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@jridgewell/remapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@jridgewell/resolve-uri/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@jridgewell/sourcemap-codec/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@jridgewell/trace-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@next/env/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@next/eslint-plugin-next/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@next/swc-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@nodelib/fs.scandir/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@nodelib/fs.stat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@nodelib/fs.walk/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@opentelemetry/api/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/GoogleMap.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/LoadScriptNext.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/addons/InfoBox.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/addons/MarkerClusterer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/directions/DirectionsRenderer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/dom/OverlayView.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Circle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Data.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/DrawingManager.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/InfoWindow.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Marker.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Polygon.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Polyline.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/drawing/Rectangle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/heatmap/HeatmapLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/kml/KmlLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/maps/BicyclingLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/maps/TrafficLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/maps/TransitLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/overlays/GroundOverlay.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/places/Autocomplete.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/places/StandaloneSearchBox.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/streetview/StreetViewPanorama.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/components/streetview/StreetViewService.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/docs/getting-started.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/docs/introduction.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/useGoogleMap.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/useJsApiLoader.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/api/src/useLoadScript.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/infobox/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@react-google-maps/marker-clusterer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@reduxjs/toolkit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@reduxjs/toolkit/node_modules/immer/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@rtsao/scc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@rushstack/eslint-patch/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@rushstack/eslint-patch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@standard-schema/spec/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@standard-schema/utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/auth-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/functions-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/postgrest-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/realtime-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/ssr/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/ssr/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/ssr/docs/design.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/storage-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@supabase/supabase-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@swc/counter/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@swc/counter/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tailwindcss/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tailwindcss/node/node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tailwindcss/oxide-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tailwindcss/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tailwindcss/postcss/node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@tybys/wasm-util/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-color/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-ease/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-interpolate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-scale/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-shape/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-time/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/d3-timer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/estree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/google.maps/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/json-schema/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/json5/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/phoenix/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/react-dom/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/use-sync-external-store/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@types/ws/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/eslint-plugin/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/project-service/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/scope-manager/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/tsconfig-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/type-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/typescript-estree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@typescript-eslint/visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/@unrs/resolver-binding-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/acorn-jsx/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/acorn/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/acorn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ajv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ajv/lib/dotjs/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ansi-styles/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/any-promise/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/anymatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/arg/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/arg/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/argparse/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/argparse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/aria-query/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array-buffer-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array-buffer-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array-includes/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array-includes/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.findlast/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.findlast/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.findlastindex/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.findlastindex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.flat/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.flat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.flatmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.flatmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.tosorted/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/array.prototype.tosorted/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/arraybuffer.prototype.slice/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/arraybuffer.prototype.slice/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ast-types-flow/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/async-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/async-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/autoprefixer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/available-typed-arrays/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/available-typed-arrays/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/axe-core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/axe-core/locales/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/axobject-query/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/balanced-match/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/balanced-match/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/baseline-browser-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/binary-extensions/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/brace-expansion/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/braces/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/browserslist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/busboy/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bind-apply-helpers/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bind-apply-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bind/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bind/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bound/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/call-bound/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/callsites/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/camelcase-css/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/caniuse-lite/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/chalk/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/chokidar/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/chokidar/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/chokidar/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/classnames/HISTORY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/classnames/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/clsx/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/color-convert/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/color-convert/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/color-name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/commander/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/commander/Readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/cookie/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/country-flag-icons/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/country-flag-icons/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/cross-env/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/cross-env/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/cross-spawn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/cssesc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/csstype/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-color/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-ease/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-interpolate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-scale/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-shape/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-time-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-time/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/d3-timer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/damerau-levenshtein/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/damerau-levenshtein/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-byte-offset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/data-view-byte-offset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/cdn.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/fp.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/gettingStarted.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/i18n.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/i18nContributionGuide.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/release.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/timeZones.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/unicodeTokens.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/date-fns/docs/webpack.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/decimal.js-light/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/decimal.js-light/LICENCE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/decimal.js-light/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/define-data-property/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/define-data-property/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/define-properties/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/define-properties/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/detect-libc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/didyoumean/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dlv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/doctrine/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/doctrine/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dotenv/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dotenv/README-es.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dotenv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dotenv/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dunder-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/dunder-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/electron-to-chromium/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/emoji-regex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/enhanced-resolve/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-abstract/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-abstract/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-define-property/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-define-property/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-errors/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-errors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-iterator-helpers/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-iterator-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-object-atoms/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-object-atoms/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-set-tostringtag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-set-tostringtag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-shim-unscopables/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-shim-unscopables/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-to-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-to-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-toolkit/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/es-toolkit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/escalade/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/escape-string-regexp/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-import-resolver-node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-import-resolver-node/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-import-resolver-node/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-import-resolver-typescript/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-module-utils/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-module-utils/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-module-utils/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/consistent-type-specifier-style.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/dynamic-import-chunkname.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/enforce-node-protocol-usage.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/exports-last.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/extensions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/first.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/group-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/imports-first.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/max-dependencies.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/named.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/namespace.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/newline-after-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-absolute-path.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-amd.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-anonymous-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-commonjs.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-cycle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-deprecated.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-duplicates.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-dynamic-require.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-empty-named-blocks.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-extraneous-dependencies.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-import-module-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-internal-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-mutable-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-named-as-default-member.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-named-as-default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-named-default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-named-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-namespace.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-nodejs-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-relative-packages.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-relative-parent-imports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-restricted-paths.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-self-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-unassigned-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-unresolved.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-unused-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-useless-path-segments.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/no-webpack-loader-syntax.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/order.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/prefer-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/docs/rules/unambiguous.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/memo-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-import/node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/accessible-emoji.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/alt-text.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-ambiguous-text.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-has-content.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-is-valid.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-activedescendant-has-tabindex.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-proptypes.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-unsupported-elements.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/autocomplete-valid.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/click-events-have-key-events.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/control-has-associated-label.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/heading-has-content.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/html-has-lang.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/iframe-has-title.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/img-redundant-alt.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/interactive-supports-focus.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/label-has-associated-control.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/label-has-for.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/lang.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/media-has-caption.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/mouse-events-have-key-events.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-access-key.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-aria-hidden-on-focusable.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-autofocus.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-distracting-elements.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-interactive-element-to-noninteractive-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-interactions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-to-interactive-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-tabindex.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-onchange.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-redundant-roles.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/no-static-element-interactions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/prefer-tag-over-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/role-has-required-aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/role-supports-aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/scope.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-jsx-a11y/docs/rules/tabindex-no-positive.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-react-hooks/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-react/node_modules/resolve/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-plugin-react/node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-scope/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint-visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eslint/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/espree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/esquery/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/esrecurse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/estraverse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/esutils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/eventemitter3/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-deep-equal/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-glob/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-glob/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-json-stable-stringify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-levenshtein/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-levenshtein/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fast-sha256/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fastq/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fastq/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/file-entry-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fill-range/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/find-up/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/flat-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/flat-cache/changelog.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/flatted/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/for-each/.github/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/for-each/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/for-each/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fraction.js/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/fraction.js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/function-bind/.github/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/function-bind/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/function-bind/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/function.prototype.name/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/function.prototype.name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/functions-have-names/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/functions-have-names/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/generator-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/generator-function/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/generator-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-intrinsic/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-intrinsic/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-symbol-description/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-symbol-description/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/get-tsconfig/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/globals/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/globalthis/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/globalthis/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/gopd/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/gopd/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/graceful-fs/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-bigints/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-bigints/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-flag/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-property-descriptors/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-property-descriptors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-symbols/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-symbols/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-tostringtag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/has-tostringtag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/hasown/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/hasown/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/iceberg-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ignore/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/immer/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/import-fresh/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/imurmurhash/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/input-format/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/input-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/internal-slot/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/internal-slot/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/internmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/invariant/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/invariant/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-async-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-async-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-bigint/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-bigint/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-binary-path/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-boolean-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-boolean-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-bun-module/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-callable/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-callable/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-core-module/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-core-module/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-data-view/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-data-view/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-date-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-date-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-extglob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-finalizationregistry/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-finalizationregistry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-generator-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-generator-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-map/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-map/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-negative-zero/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-negative-zero/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-number-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-number-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-number/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-regex/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-regex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-set/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-set/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-shared-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-shared-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-string/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-string/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-symbol/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-symbol/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-typed-array/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-typed-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakref/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakref/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/is-weakset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/isarray/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/isexe/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/iterator.prototype/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/iterator.prototype/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/jiti/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/js-tokens/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/js-tokens/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/js-yaml/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/json-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/json-schema-traverse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/json5/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/json5/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/jsx-ast-utils/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/jsx-ast-utils/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/jsx-ast-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/kdbush/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/keyv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/language-subtag-registry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/language-tags/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/levn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/libphonenumber-js/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/libphonenumber-js/CODE_OF_CONDUCT.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/libphonenumber-js/METADATA.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/libphonenumber-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/lightningcss-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/lightningcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/lilconfig/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/lines-and-columns/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/locate-path/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/lodash.merge/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/loose-envify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/magic-string/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/math-intrinsics/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/math-intrinsics/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/merge2/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/micromatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/minimatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/minimist/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/minimist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ms/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ms/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/mz/HISTORY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/mz/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/nanoid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/napi-postinstall/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/natural-compare/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/dist/compiled/@babel/runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/dist/compiled/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/dist/compiled/react-refresh/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/dist/compiled/regenerator-runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/next/node_modules/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/node-releases/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/normalize-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object-assign/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object-inspect/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object-keys/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.assign/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.assign/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.entries/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.entries/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.fromentries/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.fromentries/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.groupby/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.groupby/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.values/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/object.values/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/optionator/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/optionator/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/own-keys/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/own-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/p-limit/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/p-locate/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/parent-module/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/path-exists/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/path-key/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/path-parse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/picocolors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/picomatch/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/pify/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/pirates/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/possible-typed-array-names/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/possible-typed-array-names/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-import/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-load-config/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-nested/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-selector-parser/API.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-selector-parser/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-selector-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss-value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/prelude-ls/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/prelude-ls/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/prop-types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/prop-types/node_modules/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/punycode/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/queue-microtask/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-dom/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-hook-form/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-phone-number-input/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-phone-number-input/CODE_OF_CONDUCT.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-phone-number-input/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-phone-number-input/react-styleguidist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-phone-number-input/react-styleguidist/project/source/libphonenumber/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-redux/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react-redux/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/read-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/readdirp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/recharts/AGENTS.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/recharts/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/recharts/CONTRIBUTING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/recharts/DEVELOPING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/recharts/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/redux-thunk/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/redux-thunk/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/redux/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/redux/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/reflect.getprototypeof/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/reflect.getprototypeof/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/regexp.prototype.flags/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/regexp.prototype.flags/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/reselect/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resend/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resolve-from/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resolve-pkg-maps/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resolve/.github/INCIDENT_RESPONSE_PROCESS.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resolve/.github/THREAT_MODEL.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/resolve/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/reusify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/reusify/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/run-parallel/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-array-concat/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-array-concat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-push-apply/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-push-apply/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-regex-test/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/safe-regex-test/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/scheduler/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-function-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-function-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-function-name/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-function-name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/set-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/sharp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/shebang-command/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/shebang-regex/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-list/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-list/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-map/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-map/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-weakmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel-weakmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/side-channel/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/source-map-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/stable-hash/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/standardwebhooks/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/stop-iteration-iterator/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/stop-iteration-iterator/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/streamsearch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.includes/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.matchall/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.matchall/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.repeat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trim/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trim/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trimend/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trimend/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trimstart/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/string.prototype.trimstart/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/strip-bom/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/strip-json-comments/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/styled-jsx/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/styled-jsx/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/sucrase/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/supercluster/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/supports-color/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/supports-preserve-symlinks-flag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/supports-preserve-symlinks-flag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/svix/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/svix/node_modules/uuid/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/svix/node_modules/uuid/CONTRIBUTING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/svix/node_modules/uuid/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/svix/node_modules/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/lib/postcss-plugins/nesting/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/lib/value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/node_modules/fast-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/node_modules/jiti/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/src/postcss-plugins/nesting/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tailwindcss/src/value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tapable/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/thenify-all/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/thenify-all/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/thenify/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/thenify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tiny-invariant/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tinyglobby/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tinyglobby/node_modules/fdir/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tinyglobby/node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/to-regex-range/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ts-api-utils/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ts-api-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ts-interface-checker/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tsconfig-paths/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tsconfig-paths/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tslib/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/tslib/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/type-check/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-byte-offset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-byte-offset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typed-array-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typescript/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/typescript/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/unbox-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/unbox-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/undici-types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/unrs-resolver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/update-browserslist-db/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/uri-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/use-sync-external-store/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/util-deprecate/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/util-deprecate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/uuid/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/victory-vendor/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/victory-vendor/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-boxed-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-boxed-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-builtin-type/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-builtin-type/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-collection/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-collection/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-typed-array/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which-typed-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/which/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/word-wrap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/ws/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/yocto-queue/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| Development/node_modules/zod/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@alloc/quick-lru/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@emnapi/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@emnapi/runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@emnapi/wasi-threads/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@esbuild/win32-x64/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint-community/eslint-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint-community/regexpp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/config-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/config-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/eslintrc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/object-schema/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@eslint/plugin-kit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@googlemaps/js-api-loader/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@googlemaps/markerclusterer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@humanfs/core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@humanfs/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@humanwhocodes/module-importer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@humanwhocodes/module-importer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@humanwhocodes/retry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@img/colour/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@img/colour/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@img/sharp-win32-x64/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@jridgewell/gen-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@jridgewell/remapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@jridgewell/resolve-uri/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@jridgewell/sourcemap-codec/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@jridgewell/trace-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@next/env/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@next/eslint-plugin-next/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@next/swc-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@nodelib/fs.scandir/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@nodelib/fs.stat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@nodelib/fs.walk/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@opentelemetry/api/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@polka/url/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/GoogleMap.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/LoadScriptNext.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/addons/InfoBox.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/addons/MarkerClusterer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/directions/DirectionsRenderer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/dom/OverlayView.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Circle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Data.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/DrawingManager.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/InfoWindow.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Marker.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Polygon.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Polyline.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/drawing/Rectangle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/heatmap/HeatmapLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/kml/KmlLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/maps/BicyclingLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/maps/TrafficLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/maps/TransitLayer.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/overlays/GroundOverlay.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/places/Autocomplete.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/places/StandaloneSearchBox.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/streetview/StreetViewPanorama.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/components/streetview/StreetViewService.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/docs/getting-started.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/docs/introduction.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/useGoogleMap.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/useJsApiLoader.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/api/src/useLoadScript.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/infobox/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@react-google-maps/marker-clusterer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@reduxjs/toolkit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@reduxjs/toolkit/node_modules/immer/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@rollup/rollup-win32-x64-gnu/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@rollup/rollup-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@rtsao/scc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@rushstack/eslint-patch/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@rushstack/eslint-patch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@standard-schema/spec/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@standard-schema/utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/auth-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/functions-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/postgrest-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/realtime-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/ssr/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/ssr/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/ssr/docs/design.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/storage-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@supabase/supabase-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@swc/counter/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@swc/counter/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tailwindcss/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tailwindcss/node/node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tailwindcss/oxide-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tailwindcss/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tailwindcss/postcss/node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@tybys/wasm-util/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/chai/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-color/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-ease/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-interpolate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-scale/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-shape/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-time/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/d3-timer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/deep-eql/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/estree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/google.maps/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/json-schema/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/json5/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/phoenix/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/react-dom/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/use-sync-external-store/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@types/ws/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/eslint-plugin/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/project-service/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/scope-manager/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/tsconfig-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/type-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/typescript-estree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@typescript-eslint/visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@unrs/resolver-binding-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/expect/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/mocker/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/runner/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/snapshot/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/spy/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/@vitest/ui/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/acorn-jsx/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/acorn/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/acorn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ajv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ajv/lib/dotjs/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ansi-styles/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/any-promise/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/anymatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/arg/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/arg/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/argparse/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/argparse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/aria-query/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array-buffer-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array-buffer-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array-includes/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array-includes/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.findlast/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.findlast/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.findlastindex/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.findlastindex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.flat/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.flat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.flatmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.flatmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.tosorted/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/array.prototype.tosorted/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/arraybuffer.prototype.slice/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/arraybuffer.prototype.slice/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/assertion-error/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ast-types-flow/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/async-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/async-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/autoprefixer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/available-typed-arrays/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/available-typed-arrays/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/axe-core/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/axe-core/locales/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/axobject-query/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/balanced-match/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/balanced-match/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/baseline-browser-mapping/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/binary-extensions/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/brace-expansion/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/braces/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/browserslist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/busboy/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bind-apply-helpers/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bind-apply-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bind/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bind/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bound/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/call-bound/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/callsites/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/camelcase-css/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/caniuse-lite/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/chai/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/chalk/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/chokidar/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/chokidar/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/chokidar/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/classnames/HISTORY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/classnames/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/clsx/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/color-convert/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/color-convert/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/color-name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/commander/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/commander/Readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/cookie/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/country-flag-icons/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/country-flag-icons/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/cross-env/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/cross-env/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/cross-spawn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/cssesc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/csstype/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-color/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-ease/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-interpolate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-scale/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-shape/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-time-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-time/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/d3-timer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/damerau-levenshtein/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/damerau-levenshtein/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-byte-offset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/data-view-byte-offset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/cdn.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/fp.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/gettingStarted.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/i18n.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/i18nContributionGuide.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/release.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/timeZones.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/unicodeTokens.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/date-fns/docs/webpack.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/decimal.js-light/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/decimal.js-light/LICENCE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/decimal.js-light/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/define-data-property/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/define-data-property/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/define-properties/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/define-properties/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/detect-libc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/didyoumean/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dlv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/doctrine/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/doctrine/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dotenv/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dotenv/README-es.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dotenv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dotenv/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dunder-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/dunder-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/electron-to-chromium/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/emoji-regex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/enhanced-resolve/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-abstract/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-abstract/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-define-property/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-define-property/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-errors/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-errors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-iterator-helpers/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-iterator-helpers/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-module-lexer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-object-atoms/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-object-atoms/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-set-tostringtag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-set-tostringtag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-shim-unscopables/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-shim-unscopables/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-to-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-to-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-toolkit/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/es-toolkit/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/esbuild/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/esbuild/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/escalade/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/escape-string-regexp/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-import-resolver-node/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-import-resolver-node/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-import-resolver-node/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-import-resolver-typescript/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-module-utils/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-module-utils/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-module-utils/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/consistent-type-specifier-style.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/dynamic-import-chunkname.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/enforce-node-protocol-usage.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/exports-last.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/extensions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/first.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/group-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/imports-first.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/max-dependencies.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/named.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/namespace.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/newline-after-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-absolute-path.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-amd.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-anonymous-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-commonjs.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-cycle.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-deprecated.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-duplicates.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-dynamic-require.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-empty-named-blocks.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-extraneous-dependencies.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-import-module-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-internal-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-mutable-exports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-named-as-default-member.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-named-as-default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-named-default.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-named-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-namespace.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-nodejs-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-relative-packages.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-relative-parent-imports.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-restricted-paths.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-self-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-unassigned-import.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-unresolved.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-unused-modules.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-useless-path-segments.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/no-webpack-loader-syntax.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/order.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/prefer-default-export.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/docs/rules/unambiguous.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/memo-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/node_modules/debug/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/node_modules/debug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-import/node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/accessible-emoji.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/alt-text.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-ambiguous-text.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-has-content.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/anchor-is-valid.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-activedescendant-has-tabindex.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-proptypes.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/aria-unsupported-elements.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/autocomplete-valid.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/click-events-have-key-events.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/control-has-associated-label.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/heading-has-content.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/html-has-lang.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/iframe-has-title.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/img-redundant-alt.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/interactive-supports-focus.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/label-has-associated-control.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/label-has-for.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/lang.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/media-has-caption.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/mouse-events-have-key-events.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-access-key.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-aria-hidden-on-focusable.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-autofocus.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-distracting-elements.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-interactive-element-to-noninteractive-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-interactions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-to-interactive-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-tabindex.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-onchange.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-redundant-roles.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/no-static-element-interactions.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/prefer-tag-over-role.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/role-has-required-aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/role-supports-aria-props.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/scope.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-jsx-a11y/docs/rules/tabindex-no-positive.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-react-hooks/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-react/node_modules/resolve/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-plugin-react/node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-scope/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint-visitor-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eslint/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/espree/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/esquery/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/esrecurse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/estraverse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/estree-walker/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/esutils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/eventemitter3/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/expect-type/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/expect-type/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-deep-equal/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-glob/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-glob/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-json-stable-stringify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-levenshtein/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-levenshtein/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fast-sha256/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fastq/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fastq/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fflate/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fflate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/file-entry-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fill-range/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/find-up/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/flat-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/flat-cache/changelog.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/flatted/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/for-each/.github/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/for-each/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/for-each/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fraction.js/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/fraction.js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/function-bind/.github/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/function-bind/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/function-bind/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/function.prototype.name/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/function.prototype.name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/functions-have-names/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/functions-have-names/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/generator-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/generator-function/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/generator-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-intrinsic/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-intrinsic/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-symbol-description/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-symbol-description/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/get-tsconfig/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/globals/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/globalthis/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/globalthis/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/gopd/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/gopd/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/graceful-fs/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-bigints/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-bigints/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-flag/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-property-descriptors/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-property-descriptors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-symbols/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-symbols/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-tostringtag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/has-tostringtag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/hasown/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/hasown/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/iceberg-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ignore/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/immer/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/import-fresh/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/imurmurhash/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/input-format/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/input-format/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/internal-slot/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/internal-slot/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/internmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/invariant/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/invariant/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-async-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-async-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-bigint/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-bigint/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-binary-path/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-boolean-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-boolean-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-bun-module/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-callable/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-callable/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-core-module/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-core-module/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-data-view/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-data-view/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-date-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-date-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-extglob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-finalizationregistry/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-finalizationregistry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-generator-function/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-generator-function/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-map/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-map/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-negative-zero/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-negative-zero/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-number-object/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-number-object/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-number/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-regex/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-regex/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-set/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-set/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-shared-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-shared-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-string/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-string/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-symbol/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-symbol/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-typed-array/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-typed-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakref/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakref/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/is-weakset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/isarray/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/isexe/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/iterator.prototype/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/iterator.prototype/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/jiti/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/js-tokens/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/js-tokens/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/js-yaml/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/json-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/json-schema-traverse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/json5/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/json5/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/jsx-ast-utils/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/jsx-ast-utils/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/jsx-ast-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/kdbush/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/keyv/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/language-subtag-registry/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/language-tags/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/levn/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/libphonenumber-js/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/libphonenumber-js/CODE_OF_CONDUCT.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/libphonenumber-js/METADATA.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/libphonenumber-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/lightningcss-win32-x64-msvc/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/lightningcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/lilconfig/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/lines-and-columns/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/locate-path/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/lodash.merge/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/loose-envify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/magic-string/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/math-intrinsics/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/math-intrinsics/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/merge2/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/micromatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/minimatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/minimist/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/minimist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/mrmime/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ms/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ms/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/mz/HISTORY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/mz/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/nanoid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/napi-postinstall/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/natural-compare/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/dist/compiled/@babel/runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/dist/compiled/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/dist/compiled/react-refresh/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/dist/compiled/regenerator-runtime/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/next/node_modules/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/node-releases/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/normalize-path/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object-assign/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object-inspect/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object-keys/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.assign/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.assign/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.entries/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.entries/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.fromentries/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.fromentries/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.groupby/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.groupby/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.values/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/object.values/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/obug/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/optionator/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/optionator/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/own-keys/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/own-keys/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/p-limit/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/p-locate/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/parent-module/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/path-exists/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/path-key/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/path-parse/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pathe/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-cloudflare/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-connection-string/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-int8/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-pool/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-protocol/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg-types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pg/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pgpass/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/picocolors/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/picomatch/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pify/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/pirates/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/possible-typed-array-names/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/possible-typed-array-names/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-import/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-load-config/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-nested/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-selector-parser/API.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-selector-parser/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-selector-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss-value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postgres-array/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postgres-bytea/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postgres-date/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/postgres-interval/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/prelude-ls/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/prelude-ls/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/prop-types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/prop-types/node_modules/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/punycode/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/queue-microtask/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-dom/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-is/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-phone-number-input/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-phone-number-input/CODE_OF_CONDUCT.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-phone-number-input/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-phone-number-input/react-styleguidist/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-phone-number-input/react-styleguidist/project/source/libphonenumber/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-redux/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react-redux/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/react/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/read-cache/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/readdirp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/recharts/AGENTS.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/recharts/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/recharts/CONTRIBUTING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/recharts/DEVELOPING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/recharts/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/redux-thunk/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/redux-thunk/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/redux/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/redux/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/reflect.getprototypeof/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/reflect.getprototypeof/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/regexp.prototype.flags/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/regexp.prototype.flags/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/reselect/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resend/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resolve-from/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resolve-pkg-maps/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resolve/.github/INCIDENT_RESPONSE_PROCESS.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resolve/.github/THREAT_MODEL.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/resolve/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/reusify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/reusify/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/rollup/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/rollup/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/run-parallel/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-array-concat/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-array-concat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-push-apply/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-push-apply/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-regex-test/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/safe-regex-test/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/scheduler/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/semver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-function-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-function-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-function-name/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-function-name/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-proto/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/set-proto/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/sharp/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/shebang-command/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/shebang-regex/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-list/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-list/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-map/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-map/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-weakmap/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel-weakmap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/side-channel/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/siginfo/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/sirv/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/source-map-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/split2/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/stable-hash/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/stackback/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/standardwebhooks/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/std-env/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/stop-iteration-iterator/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/stop-iteration-iterator/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/streamsearch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.includes/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.matchall/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.matchall/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.repeat/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trim/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trim/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trimend/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trimend/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trimstart/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/string.prototype.trimstart/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/strip-bom/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/strip-json-comments/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/styled-jsx/license.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/styled-jsx/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/sucrase/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/supercluster/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/supports-color/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/supports-preserve-symlinks-flag/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/supports-preserve-symlinks-flag/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/svix/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/svix/node_modules/uuid/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/svix/node_modules/uuid/CONTRIBUTING.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/svix/node_modules/uuid/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/svix/node_modules/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/lib/postcss-plugins/nesting/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/lib/value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/node_modules/fast-glob/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/node_modules/jiti/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/src/postcss-plugins/nesting/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tailwindcss/src/value-parser/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tapable/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/thenify-all/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/thenify-all/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/thenify/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/thenify/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tiny-invariant/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinybench/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinyexec/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinyglobby/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinyglobby/node_modules/fdir/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinyglobby/node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tinyrainbow/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/to-regex-range/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/totalist/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ts-api-utils/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ts-api-utils/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ts-interface-checker/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tsconfig-paths/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tsconfig-paths/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tslib/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/tslib/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/type-check/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-buffer/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-buffer/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-byte-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-byte-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-byte-offset/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-byte-offset/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-length/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typed-array-length/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typescript/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/typescript/SECURITY.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/unbox-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/unbox-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/undici-types/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/unrs-resolver/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/update-browserslist-db/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/uri-js/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/use-sync-external-store/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/util-deprecate/History.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/util-deprecate/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/uuid/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/uuid/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/victory-vendor/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/victory-vendor/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vite/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vite/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vite/node_modules/fdir/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vite/node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vitest/LICENSE.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vitest/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/vitest/node_modules/picomatch/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-boxed-primitive/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-boxed-primitive/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-builtin-type/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-builtin-type/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-collection/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-collection/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-typed-array/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which-typed-array/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which/CHANGELOG.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/which/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/why-is-node-running/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/word-wrap/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/ws/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/xtend/README.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |
| node_modules/yocto-queue/readme.md | Legacy | Needs Review | Not yet audited; added by repo-wide scan. | - [x] None | - [ ] Needs review: not yet audited |

## Scan Hits

### Markdown scan hits - Unassigned (Plan09)
- .planning/.continue-here.md - Status: Updated
- .planning/PROJECT.md - Status: Updated
- .planning/STATE.md - Status: Updated
- .planning/codebase/INTEGRATIONS.md - Status: Updated
- .planning/phases/01-foundation--data-integrity/01-RESEARCH.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/.continue-here.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-01-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-01-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-02-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-02-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-03-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-03-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-04-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-04-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-05-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-05-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-06-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-06-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-07-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-07-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-08-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-08-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-09-PLAN.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-09-SUMMARY.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-10-PLAN.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-11-PLAN.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-CONTEXT.md - Status: Needs Review
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-RESEARCH.md - Status: Updated
- .planning/phases/02.1-antigravity-docs-audit-rebuild/02.1-antigravity-docs-audit-rebuild-VERIFICATION.md - Status: Needs Review
- .planning/phases/03-shared-service-features/.continue-here.md - Status: Updated
- .planning/todos/pending/2026-02-03-audit-obsolete-antigravity-docs.md - Status: Updated
- Development/.planning/codebase/INTEGRATIONS.md - Status: Updated
- Development/.planning/codebase/STACK.md - Status: Updated
- Development/docs/audits/antigravity-2026-02/DEPRECATED.md - Status: Updated
- Development/docs/audits/antigravity-2026-02/INVENTORY.md - Status: Updated
- Development/docs/audits/antigravity-2026-02/SUMMARY.md - Status: Updated
- tasks record/2026-01-01_Unified-Service-Request-System/implementation_plan.md - Status: Legacy
- tasks record/2026-01-01_Unified-Service-Request-System/task.md - Status: Legacy

### Text scan hits (.txt) - Plan07
- None

### Code comment hits - Batch A (Plan04)
- Development/app/contact/page.tsx - Status: Remediated (Plan 14 — legacy note added)
- Development/app/inquiry/InquiryForm.tsx - Status: Remediated (Plan 14 — legacy note added)
- Development/functions/index.js - Status: Remediated (Plan 14 — full legacy header added)
- Development/lib/dateUtils.ts - Status: Needs Review
- Development/lib/types.ts - Status: Remediated (Plan 14 — Firestore refs scoped as legacy)
- Development/supabase/migrations/20260108_fix_uid_types.sql - Status: Remediated (Plan 14 — legacy context header added)
- Development/supabase/migrations/20260108_import_active_projects.sql - Status: Needs Review
- lib/types.ts - Status: Needs Review

### Code comment hits - Batch B (Plan09)
- website static view dev/app/contact/page.tsx - Status: Needs Review
- website static view dev/functions/index.js - Status: Needs Review
- website static view dev/lib/firebase.ts - Status: Needs Review
- website static view dev/scripts/cleanup-test-data.js - Status: Needs Review
- website static view dev/scripts/populate-test-data.js - Status: Needs Review
- website static view dev/scripts/sync-users-to-auth.js - Status: Needs Review
- website static view dev/test_security.ts - Status: Needs Review

## Checklist

### Fixes Applied

- [x] Scoped full-version docs to Supabase + Resend baseline
- [x] Marked legacy migration and Firebase docs as legacy
- [x] Remediated scan hits in planning and audit plan files
- [x] Scoped static-site docs to static stack only
- [x] Finalized audit inventory, deprecated list, and summary

### Pending

- [ ] Confirm authoritative migrations folder (root `supabase/` vs `Development/supabase/`)
- [ ] Confirm whether Firebase Cloud Functions are still used in production

## Needs Review

- Authoritative migrations folder conflict (root `supabase/` vs `Development/supabase/`).
- Firebase Cloud Functions usage in production (affects legacy Firebase docs disposition).

## Notes

- Entries marked "Needs Review" were not updated in Plans 02-07/09 and require a legacy-term scan.
- Legacy entries are retained for history and clearly labeled as out of scope for current stack guidance.
