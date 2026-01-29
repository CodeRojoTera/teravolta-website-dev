# Phase 1: Foundation & Data Integrity - Research

**Researched:** 2026-01-29
**Domain:** Database integrity, state machines, soft delete patterns, audit logging
**Confidence:** MEDIUM-HIGH

## Summary

Phase 1 addresses critical data integrity issues across three areas: user deletion with cascade handling, state machine implementation for project status transitions, and database constraint enforcement. The research focused on established patterns for PostgreSQL/Supabase environments with Next.js 15/TypeScript 5.

The standard approach combines PostgreSQL foreign key CASCADE constraints for hard deletes with a soft delete pattern using `deleted_at` timestamps and database views for filtering. State machine implementation should use a lightweight TypeScript solution rather than heavy libraries, given the relatively simple transition rules needed. Audit logging requires database triggers to capture deletion metadata comprehensively.

Key findings reveal that Supabase's soft delete support is primarily for auth users, requiring custom implementation for table-level soft deletes. RLS policies with soft delete create complexity that views can elegantly solve. State machines in TypeScript benefit from type-state programming where invalid transitions become compilation errors.

**Primary recommendation:** Implement PostgreSQL foreign key CASCADE for hard deletes, use views-based soft delete with `deleted_at` pattern, create a simple TypeScript type-safe state machine (not XState), and use database triggers for comprehensive audit logging.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL | 14+ (Supabase) | Relational database with CASCADE constraints | Native foreign key enforcement, trigger support, view-based filtering |
| @supabase/supabase-js | 2.90.0 | Database client for Next.js | Already in stack, typed queries, RLS integration |
| TypeScript | 5.0+ | Type-safe state machine implementation | Compile-time validation of state transitions via discriminated unions |
| Next.js Server Actions | 15.3.2 | Mutation handlers with validation | Built-in framework feature, type-safe, no additional library needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | Latest (3.x) | Schema validation for mutations | Validating status transitions, user deletion requests, audit metadata |
| date-fns | 4.1.0 (existing) | Grace period calculations | Already in stack, calculating 15-day deletion windows |
| react-i18next | Latest (13.x) | Bilingual status labels (EN/ES) | Industry standard for React i18n with full TypeScript support |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Simple TS state machine | XState 5.x | XState adds 50KB+ bundle, visual tooling, actor model - overkill for linear status transitions |
| PostgreSQL triggers | Application-level audit | Triggers catch all mutations (including manual DB changes), application-level misses edge cases |
| Views for soft delete | RLS-only approach | RLS with soft delete breaks UPDATE policies, views provide clean abstraction |

**Installation:**
```bash
npm install zod react-i18next i18next
```

## Architecture Patterns

### Recommended Project Structure
```
lib/
├── state-machines/       # State machine definitions
│   ├── project-states.ts # Status transition logic per service type
│   └── types.ts          # State machine type definitions
├── validations/          # Zod schemas
│   ├── status-transitions.ts
│   └── deletion-requests.ts
└── audit/                # Audit utilities
    └── log-helpers.ts    # Formatting audit metadata

supabase/
├── migrations/
│   ├── YYYYMMDD_add_cascade_constraints.sql
│   ├── YYYYMMDD_add_soft_delete_columns.sql
│   ├── YYYYMMDD_create_active_views.sql
│   └── YYYYMMDD_create_audit_triggers.sql
└── functions/            # Edge functions for complex logic

app/api/
├── admin/
│   ├── delete-user/      # Admin deletion endpoint
│   └── force-transition/ # Admin override transitions
```

### Pattern 1: Type-Safe State Machine
**What:** Use TypeScript discriminated unions to represent valid states and transitions, making invalid transitions unrepresentable at compile time.

**When to use:** For project status validation where each service type (efficiency, consulting, advocacy) has different valid transitions.

**Example:**
```typescript
// Source: Based on Type-State Programming pattern from
// https://medium.com/@MichaelVD/composable-state-machines-in-typescript-type-safe-predictable-and-testable-5e16574a6906

type ServiceType = 'efficiency' | 'consulting' | 'advocacy';

// Common statuses shared across services
type CommonStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Service-specific statuses
type EfficiencyStatus = CommonStatus | 'pending_inspection' | 'pending_installation';
type ConsultingStatus = CommonStatus | 'requirements_defined' | 'rfp_preparation' | 'offers_evaluation' | 'supplier_selection';
type AdvocacyStatus = CommonStatus | 'pending_audit' | 'claim_formulation' | 'claim_filed' | 'asep_filed' | 'resolved';

type ProjectState<S extends ServiceType> =
  S extends 'efficiency' ? { service: S; status: EfficiencyStatus } :
  S extends 'consulting' ? { service: S; status: ConsultingStatus } :
  S extends 'advocacy' ? { service: S; status: AdvocacyStatus } :
  never;

// Transition validation function
function canTransition<S extends ServiceType>(
  current: ProjectState<S>['status'],
  next: ProjectState<S>['status'],
  service: S,
  isAdmin: boolean
): { valid: boolean; reason?: string } {
  // Common transitions allowed for all services
  if (next === 'cancelled') return { valid: true };
  if (current === 'cancelled') return { valid: false, reason: 'Cannot transition from cancelled' };

  // Service-specific transition rules
  if (service === 'efficiency') {
    const validTransitions: Record<EfficiencyStatus, EfficiencyStatus[]> = {
      'pending': ['pending_inspection', 'cancelled'],
      'pending_inspection': ['pending_installation', 'cancelled'],
      'pending_installation': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [], // Terminal state
      'cancelled': [] // Terminal state
    };
    const allowed = validTransitions[current as EfficiencyStatus] || [];
    const valid = allowed.includes(next as EfficiencyStatus);

    // Admins can force transitions with logging
    if (!valid && isAdmin) {
      return { valid: true, reason: 'admin_override' };
    }

    return { valid, reason: valid ? undefined : `Invalid transition from ${current} to ${next}` };
  }

  // Similar logic for consulting and advocacy...
  return { valid: false, reason: 'Unknown service type' };
}
```

### Pattern 2: Soft Delete with Views
**What:** Add `deleted_at` timestamp column, create views filtering `WHERE deleted_at IS NULL`, query views instead of base tables.

**When to use:** For user deletion with 15-day grace period and reactivation capability.

**Example:**
```sql
-- Source: https://supabase.com/docs/guides/troubleshooting/soft-deletes-with-supabase-js

-- Step 1: Add soft delete column
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE users ADD COLUMN deletion_scheduled_for TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE users ADD COLUMN deleted_by UUID REFERENCES users(id);

-- Step 2: Create view for active users
CREATE VIEW active_users AS
  SELECT * FROM users
  WHERE deleted_at IS NULL;

-- Step 3: Grant permissions on view
GRANT SELECT, INSERT, UPDATE ON active_users TO authenticated;

-- Step 4: RLS policies on view (not base table)
ALTER VIEW active_users SET (security_invoker = on);

-- Step 5: Application queries the view
-- SELECT * FROM active_users WHERE id = '...'
```

### Pattern 3: Audit Trigger for Deletions
**What:** Database trigger on DELETE converts to UPDATE with audit log entry, capturing all deletion metadata.

**When to use:** For comprehensive audit trail that captures manual deletions, admin deletions, and cascade deletions.

**Example:**
```sql
-- Source: Adapted from https://danschultzer.com/posts/deleted-record-audit-log-with-ecto-postgresql
-- and https://wiki.postgresql.org/wiki/Audit_trigger

-- Audit log table
CREATE TABLE deletion_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  record_data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_by UUID REFERENCES users(id),
  delete_reason TEXT,
  deletion_type TEXT NOT NULL, -- 'soft', 'hard', 'cascade'
  related_deletions JSONB DEFAULT '[]'::jsonb -- Array of related entity IDs
);

-- Trigger function for soft delete with audit
CREATE OR REPLACE FUNCTION soft_delete_with_audit()
RETURNS TRIGGER AS $$
DECLARE
  audit_user_id UUID;
BEGIN
  -- Get current user from session
  audit_user_id := current_setting('app.current_user_id', true)::uuid;

  -- Log the deletion
  INSERT INTO deletion_audit_log (
    table_name,
    record_id,
    record_data,
    deleted_by,
    deletion_type
  ) VALUES (
    TG_TABLE_NAME,
    OLD.id,
    row_to_json(OLD)::jsonb,
    audit_user_id,
    'soft'
  );

  -- Convert DELETE to UPDATE
  UPDATE users
  SET deleted_at = NOW(),
      deleted_by = audit_user_id
  WHERE id = OLD.id;

  -- Return NULL to prevent actual DELETE
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER soft_delete_users_trigger
  BEFORE DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_with_audit();
```

### Pattern 4: Grace Period Scheduling
**What:** Schedule deletion for future date, allow cancellation, use PostgreSQL scheduled jobs or application-level cron.

**When to use:** 15-day grace period for user deletion.

**Example:**
```typescript
// Source: Application pattern combining date-fns with Next.js Server Actions
import { addDays } from 'date-fns';

async function scheduleUserDeletion(userId: string, requestedBy: string) {
  const scheduledFor = addDays(new Date(), 15);

  const { error } = await supabase
    .from('users')
    .update({
      deletion_scheduled_for: scheduledFor.toISOString(),
      deleted_by: requestedBy
    })
    .eq('id', userId);

  if (error) throw error;

  // Send notification with cancellation link
  await sendDeletionScheduledEmail(userId, scheduledFor);

  return { scheduledFor };
}

async function cancelScheduledDeletion(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({
      deletion_scheduled_for: null,
      deleted_by: null
    })
    .eq('id', userId);

  if (error) throw error;
}

// Daily cron job (Next.js Route Handler with Vercel Cron or external scheduler)
async function executeScheduledDeletions() {
  const now = new Date();

  const { data: usersToDelete } = await supabase
    .from('users')
    .select('id')
    .lte('deletion_scheduled_for', now.toISOString())
    .is('deleted_at', null);

  for (const user of usersToDelete || []) {
    await performSoftDelete(user.id, 'system');
  }
}
```

### Anti-Patterns to Avoid

- **Application-level cascade logic:** Don't manually delete related entities in application code. Use PostgreSQL CASCADE constraints. Reason: Race conditions, partial failures, manual deletions bypass app logic.

- **RLS policies on soft-deleted tables:** Don't add `WHERE deleted_at IS NULL` to RLS policies. Reason: Breaks UPDATE queries needed to set deleted_at. Use views instead.

- **String-based state machines:** Don't use plain strings for status validation. Reason: Typos, invalid states representable, no compile-time safety. Use TypeScript discriminated unions.

- **Soft delete for everything:** Don't use soft delete for transactional data like payments or audit logs. Reason: Compliance requirements often mandate hard deletion. Use soft delete only for user-recoverable entities.

- **Client-side status transitions:** Don't allow client to set any status. Reason: Business rule bypass, data integrity violations. Validate all transitions server-side.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Internationalization (EN/ES labels) | Custom translation object management | react-i18next 13.x | Handles pluralization, context, nested keys, namespace isolation, lazy loading, missing key detection |
| Date calculations (grace periods) | Custom date math | date-fns 4.1.0 (existing) | Handles timezones, DST, edge cases, locale-aware formatting already in stack |
| Schema validation (status transitions) | Manual if/else validation | zod 3.x | Type inference, composition, custom refinements, error messages, parse vs safeParse patterns |
| Cascade delete tracking | Manual array of deleted IDs | PostgreSQL CASCADE with RETURNING clause | Atomic, transaction-safe, returns all deleted rows, triggers fire correctly |
| Audit log formatting | String concatenation | PostgreSQL row_to_json() + JSONB | Preserves types, queryable, handles nested objects, null-safe |

**Key insight:** Database-level solutions (CASCADE, triggers, views) are more reliable than application-level equivalents because they catch manual operations, SQL client changes, and database admin actions. Application logic should validate business rules, not replicate database integrity constraints.

## Common Pitfalls

### Pitfall 1: Soft Delete RLS Policy Deadlock
**What goes wrong:** Adding `WHERE deleted_at IS NULL` to RLS SELECT policy prevents UPDATE queries from setting `deleted_at` because row becomes invisible before update completes.

**Why it happens:** UPDATE requires SELECT permission to see the row first. If RLS hides the row when `deleted_at IS NOT NULL`, the UPDATE that sets `deleted_at` can't proceed.

**How to avoid:** Use database views for filtering instead of RLS policies. RLS stays on base table without soft delete filter, view adds `WHERE deleted_at IS NULL`, application queries view.

**Warning signs:** UPDATE queries fail with "row not found" or "permission denied" when trying to soft delete. Tests pass but production fails.

### Pitfall 2: Incomplete Cascade Configuration
**What goes wrong:** User deletion leaves orphaned records in some tables (appointments, documents, notifications) causing foreign key violations or ghost data.

**Why it happens:** Forgetting to add `ON DELETE CASCADE` to all foreign key relationships. Only some tables configured, others use default `NO ACTION`.

**How to avoid:** Audit all foreign key relationships systematically. Query PostgreSQL system catalog to find FKs without CASCADE:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON rc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND rc.delete_rule != 'CASCADE';
```

**Warning signs:** Foreign key constraint errors during deletion. Records with null user_id when user still exists elsewhere. Orphaned appointments or documents.

### Pitfall 3: State Transition Validation Only in UI
**What goes wrong:** Admin manually updates database or API called directly, bypassing UI validation. Invalid status combinations appear (e.g., efficiency project with consulting status).

**Why it happens:** Trusting UI-only validation. No server-side enforcement or database constraints on status values.

**How to avoid:**
1. Add CHECK constraints in PostgreSQL for service-specific statuses
2. Validate transitions in Next.js Server Actions before database update
3. Use TypeScript types to prevent invalid status assignment at compile time

**Warning signs:** Projects with impossible status values. Transitions that should be blocked appearing in database. Status inconsistent with service type.

### Pitfall 4: Grace Period Without Project Hold
**What goes wrong:** User schedules deletion, projects continue running for 15 days, then projects fail when user deleted. Technicians can't complete appointments, clients can't be contacted.

**Why it happens:** Deletion scheduling doesn't pause project workflows. No mechanism to hold active projects during grace period.

**How to avoid:** When deletion scheduled, set all active projects to `on_hold_deletion_pending` status. Add banner to user portal showing grace period. Notify project stakeholders (assigned technicians).

**Warning signs:** Appointments scheduled during deletion grace period. Projects marked completed after user deletion scheduled. Technician assignment failing silently.

### Pitfall 5: Missing Audit Context
**What goes wrong:** Audit log shows record was deleted but not who initiated or why. Can't distinguish admin deletion from user self-service from cascade.

**Why it happens:** Trigger only captures row data, not request context. PostgreSQL session doesn't carry application user ID.

**How to avoid:** Set session variable before deletion:
```typescript
// In Server Action
await supabase.rpc('set_config', {
  setting_name: 'app.current_user_id',
  new_value: currentUser.id,
  is_local: true
});

await supabase.from('users').delete().eq('id', targetUserId);
```
Trigger reads `current_setting('app.current_user_id')` to log actor.

**Warning signs:** Audit log entries with null `deleted_by`. Can't answer "who deleted this?" Cannot distinguish cascade from direct deletion.

## Code Examples

Verified patterns from official sources:

### Cascade Delete Configuration
```sql
-- Source: https://supabase.com/docs/guides/database/postgres/cascade-deletes

-- User table (parent)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deletion_scheduled_for TIMESTAMPTZ DEFAULT NULL
);

-- Projects table (child) - CASCADE on user deletion
ALTER TABLE active_projects
  DROP CONSTRAINT IF EXISTS active_projects_user_id_fkey,
  ADD CONSTRAINT active_projects_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

-- Appointments table (child) - CASCADE on project deletion
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_project_id_fkey,
  ADD CONSTRAINT appointments_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES active_projects(id)
    ON DELETE CASCADE;

-- Documents table (multiple parents) - CASCADE for all
ALTER TABLE documents
  ADD CONSTRAINT documents_linked_entity_fkey
    FOREIGN KEY (linked_entity_id)
    REFERENCES active_projects(id)
    ON DELETE CASCADE;

-- Electrical boards - CASCADE on appointment deletion (already configured)
-- See: 20260114180000_create_electrical_boards.sql line 4
```

### Next.js Server Action with Validation
```typescript
// Source: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
'use server'

import { z } from 'zod';
import { createClient } from '@/lib/supabase-admin';

const deleteUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.enum(['user_request', 'admin_action', 'inactivity', 'violation']),
  immediate: z.boolean().default(false)
});

export async function deleteUser(formData: FormData) {
  const supabase = createClient();

  // Validate input
  const parsed = deleteUserSchema.safeParse({
    userId: formData.get('userId'),
    reason: formData.get('reason'),
    immediate: formData.get('immediate') === 'true'
  });

  if (!parsed.success) {
    return {
      error: 'Invalid input',
      details: parsed.error.flatten()
    };
  }

  const { userId, reason, immediate } = parsed.data;

  try {
    // Check for active projects
    const { data: projects } = await supabase
      .from('active_projects')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['in_progress', 'scheduled', 'pending_installation']);

    if (projects && projects.length > 0 && !immediate) {
      return {
        error: 'User has active projects',
        projectCount: projects.length
      };
    }

    if (immediate) {
      // Admin instant hard delete
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      // Audit log created by trigger
      return { success: true, type: 'immediate' };
    } else {
      // Schedule soft delete for 15 days
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + 15);

      const { error } = await supabase
        .from('users')
        .update({
          deletion_scheduled_for: scheduledFor.toISOString(),
          deleted_by: userId // or admin ID if admin-initiated
        })
        .eq('id', userId);

      if (error) throw error;

      return {
        success: true,
        type: 'scheduled',
        scheduledFor: scheduledFor.toISOString()
      };
    }
  } catch (e) {
    console.error('Delete user error:', e);
    return { error: 'Failed to delete user' };
  }
}
```

### Bilingual Status Labels with react-i18next
```typescript
// Source: https://react.i18next.com/
// translations/en.json
{
  "status": {
    "common": {
      "pending": "Pending",
      "in_progress": "In Progress",
      "completed": "Completed",
      "cancelled": "Cancelled"
    },
    "efficiency": {
      "pending_inspection": "Awaiting Inspection",
      "pending_installation": "Scheduled for Installation"
    },
    "consulting": {
      "requirements_defined": "Requirements Phase",
      "rfp_preparation": "Preparing RFP",
      "offers_evaluation": "Evaluating Offers",
      "supplier_selection": "Selecting Supplier"
    },
    "advocacy": {
      "pending_audit": "Awaiting Audit",
      "claim_formulation": "Formulating Claim",
      "claim_filed": "Claim Filed",
      "asep_filed": "ASEP Submission",
      "resolved": "Resolved"
    }
  }
}

// translations/es.json
{
  "status": {
    "common": {
      "pending": "Pendiente",
      "in_progress": "En Progreso",
      "completed": "Completado",
      "cancelled": "Cancelado"
    },
    "efficiency": {
      "pending_inspection": "Esperando Inspección",
      "pending_installation": "Programado para Instalación"
    },
    // ... Spanish translations
  }
}

// Component usage
import { useTranslation } from 'react-i18next';

function ProjectStatus({ project }: { project: ActiveProject }) {
  const { t } = useTranslation();

  // Get translated label based on service type
  const statusKey = project.service === 'efficiency'
    ? `status.efficiency.${project.status}`
    : project.status in COMMON_STATUSES
    ? `status.common.${project.status}`
    : `status.${project.service}.${project.status}`;

  const label = t(statusKey, { defaultValue: project.status });

  return <StatusBadge label={label} status={project.status} />;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual cascade deletion in app code | PostgreSQL ON DELETE CASCADE | PostgreSQL 8.0+ (2005) | Atomic operations, no race conditions, triggers fire correctly |
| Application-only soft delete | Database views + deleted_at | Modern SaaS pattern (2020s) | RLS compatible, query simplification, audit trail |
| Heavy state machine libraries (XState) | Type-state programming with TypeScript unions | TypeScript 4.0+ discriminated unions (2020) | Zero runtime cost, compile-time safety, smaller bundles |
| Supabase deleteUser() soft delete | Custom table soft delete with views | Supabase auth-only limitation (ongoing) | Full control over soft delete logic, reactivation flows |
| String literals for status | Branded types with exhaustive checks | TypeScript 5.0 (2023) | IDE autocomplete, refactor safety, impossible states prevented |

**Deprecated/outdated:**
- XState v4: Replaced by v5 with breaking changes to TypeScript integration (requires TypeScript 5.0+)
- Firebase-based deletion: Project migrated to Supabase-only (decision 2026-01-28)
- react-intl: Still valid but react-i18next has larger ecosystem and better TypeScript support
- Global CASCADE ON DELETE for all tables: Modern practice is selective CASCADE with SET NULL for audit preservation

## Open Questions

Things that couldn't be fully resolved:

1. **Technician reassignment system details**
   - What we know: Context mentions "There was a system developed to reassign appointments of technicians depending on different situations"
   - What's unclear: Exact implementation, whether it handles deletion scenarios, if it needs fixing or just adaptation
   - Recommendation: During implementation, audit existing technician reassignment code in codebase. If functional, extend it for deletion scenario. If broken, fix as part of this phase per user decision.

2. **Exact cascade relationships for documents table**
   - What we know: Documents link to multiple entity types (projects, users, technicians) via `linked_to.type` and `linked_to.id`
   - What's unclear: Whether documents should CASCADE delete or SET NULL when parent deleted (preserve for audit)
   - Recommendation: Consult user on document retention policy. Likely: CASCADE for user documents, SET NULL for project documents (keep for compliance).

3. **Reactivation password reset requirement**
   - What we know: User marked this as "Claude's discretion" in CONTEXT.md
   - What's unclear: Security vs UX tradeoff - should reactivated users immediately access account or require password reset?
   - Recommendation: Require password reset for accounts deleted >7 days. Immediate access for same-day cancellations. Prevents unauthorized reactivation of compromised accounts.

4. **Admin notification delivery mechanism**
   - What we know: User wants both email AND dashboard notifications
   - What's unclear: Whether to use Resend for email, Supabase Realtime for dashboard, or build notification system
   - Recommendation: Use existing Resend integration for email. For dashboard, check if notifications table already has real-time subscription. If not, poll-based initially with real-time as Phase 2 enhancement.

5. **Service-specific status color schemes**
   - What we know: User wants different color palettes per service type (EE, Consulting, Advocacy) with neutral colors for common statuses
   - What's unclear: Specific color values, accessibility requirements (WCAG 2.1 AA compliance?)
   - Recommendation: Use WCAG 2.1 AA compliant color system (4.5:1 contrast). Define in Tailwind config as custom color scale per service. Common statuses use gray scale.

## Sources

### Primary (HIGH confidence)
- PostgreSQL Official Documentation (2025) - Cascade delete behavior and constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- Supabase Official Docs - Cascade deletes guide: https://supabase.com/docs/guides/database/postgres/cascade-deletes
- Supabase Official Docs - Soft deletes with supabase-js: https://supabase.com/docs/guides/troubleshooting/soft-deletes-with-supabase-js
- Next.js Official Docs - Server Actions and Mutations: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- XState Official Docs: https://stately.ai/docs/xstate
- react-i18next Official Documentation: https://react.i18next.com/

### Secondary (MEDIUM confidence)
- Dan Schultzer - Deleted record audit log with PostgreSQL (Feb 2025): https://danschultzer.com/posts/deleted-record-audit-log-with-ecto-postgresql
- PostgreSQL Wiki - Audit trigger patterns: https://wiki.postgresql.org/wiki/Audit_trigger
- Medium - Composable State Machines in TypeScript: https://medium.com/@MichaelVD/composable-state-machines-in-typescript-type-safe-predictable-and-testable-5e16574a6906
- Stripe Engineering Blog - Designing accessible color systems: https://stripe.com/blog/accessible-color-systems
- Carbon Design System - Status indicator pattern: https://carbondesignsystem.com/patterns/status-indicator-pattern/
- MakerKit - Real-time Notifications with Supabase and Next.js: https://makerkit.dev/blog/tutorials/real-time-notifications-supabase-nextjs

### Tertiary (LOW confidence - needs validation)
- WebSearch results on TypeScript state machine libraries (2026) - multiple lightweight alternatives to XState
- GitHub discussions on Supabase soft delete implementation: https://github.com/orgs/supabase/discussions/2799
- Community blog posts on Next.js Server Actions error handling patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - PostgreSQL CASCADE, Supabase client, TypeScript are established, verified approaches. react-i18next industry standard.
- Architecture: MEDIUM-HIGH - Patterns from official docs (Supabase, PostgreSQL) with some synthesis for specific use case (multi-service state machine). Soft delete + views pattern is proven but requires custom implementation.
- Pitfalls: MEDIUM - Based on documented issues (RLS + soft delete, incomplete CASCADE) and common database integrity mistakes. Some inference from general patterns applied to specific stack.
- Code examples: MEDIUM-HIGH - Adapted from official documentation with modifications for TeraVolta's three-service architecture. State machine example is synthesized pattern, not copy-paste from docs.

**Research date:** 2026-01-29
**Valid until:** 2026-03-01 (30 days for stable patterns, PostgreSQL/Supabase features unlikely to change)

**Notes:**
- XState not recommended despite being "standard" for state machines - overkill for this use case
- Soft delete pattern requires custom implementation - Supabase only supports it natively for auth.users
- User decisions from CONTEXT.md constrained research scope (no alternatives to locked decisions)
- Missing details on existing technician reassignment system - requires codebase audit during implementation
