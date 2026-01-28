# Architecture Patterns: Next.js 15 + Supabase Multi-Portal Platform

**Domain:** Service Management Platform (Multi-Portal SaaS)
**Stack:** Next.js 15 App Router + Supabase + TypeScript
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

This architecture research addresses the specific challenges of building a multi-portal service management platform with Next.js 15 App Router and Supabase. The current TeraVolta system has three role-based portals (admin, customer, technician) with a service layer pattern, but suffers from workflow incompleteness, incorrect data display, and unconstrained status transitions due to lack of formal state machine implementation.

**Key Recommendations:**
1. **Implement type-safe state machine** for project status transitions (prevents invalid state changes)
2. **Restructure service layer** to use Server Actions for mutations, Route Handlers for external APIs
3. **Optimize RLS performance** with targeted indexes and query patterns
4. **Adopt route groups** for clear portal separation while sharing common layouts
5. **Centralize business logic** in domain services with explicit state transition guards

## Recommended Architecture

### High-Level System Structure

```
Next.js 15 App Router (Server-First Architecture)
├── Public Layer (Marketing, Auth)
├── Portal Layer (Role-Based)
│   ├── /portal/(admin)/*     - Admin Dashboard
│   ├── /portal/(customer)/*  - Customer Dashboard
│   └── /portal/(technician)/* - Technician Dashboard
├── Service Layer (Domain Logic)
│   ├── Domain Services (Business Logic)
│   ├── State Machines (Workflow Control)
│   └── Data Access (Supabase Client)
└── Data Layer (Supabase)
    ├── PostgreSQL (RLS-Protected)
    ├── Storage (Document Management)
    └── Real-time (Live Updates)
```

### Component Boundaries

| Component | Responsibility | Communicates With | Location |
|-----------|---------------|-------------------|----------|
| **Portal Routes** | Role-specific UI, layout management, auth guards | Domain Services, React Context | `app/portal/(role)/` |
| **Domain Services** | Business logic, state transitions, data orchestration | State Machines, Supabase Client, API Routes | `app/services/` |
| **State Machines** | Status validation, transition guards, workflow rules | Domain Services | `lib/state-machines/` |
| **Server Actions** | Mutations, form handling, optimistic updates | Domain Services, Supabase | Colocated with components or `app/actions/` |
| **Route Handlers** | External APIs, webhooks, admin operations | Domain Services, Supabase Admin | `app/api/` |
| **Supabase Client** | Database queries, RLS enforcement, real-time subscriptions | PostgreSQL, Storage | `lib/supabase/` (client + server) |
| **Auth Provider** | Session management, role detection, user context | Supabase Auth, Middleware | `components/providers/` |

### Data Flow

```
1. User Interaction (Client Component)
   ↓
2. Server Action / Event Handler
   ↓
3. Domain Service (Business Logic)
   ↓
4. State Machine (Validates Transition)
   ↓
5. Supabase Client (Persists Data)
   ↓
6. RLS Policy Enforcement
   ↓
7. Real-time Subscription Update
   ↓
8. UI Re-render (Optimistic or Confirmed)
```

---

## Pattern 1: Multi-Portal Organization with Route Groups

**What:** Use Next.js App Router route groups to organize role-based portals while maintaining shared infrastructure.

**Why:** Route groups `(folderName)` organize routes logically without affecting URLs, enabling shared layouts per role while keeping URLs clean.

**Current State:** TeraVolta has `/portal/admin`, `/portal/customer`, `/portal/technician` as flat routes.

**Recommended Structure:**

```
app/
├── (marketing)/                 # Public site
│   ├── layout.tsx              # Marketing layout
│   ├── page.tsx                # Homepage
│   └── services/
│       └── page.tsx            # /services
│
├── portal/
│   ├── layout.tsx              # Shared portal shell (auth required)
│   ├── (admin)/                # Admin-specific routes
│   │   ├── layout.tsx          # Admin layout (sidebar, header)
│   │   ├── page.tsx            # /portal (admin dashboard)
│   │   ├── projects/
│   │   │   ├── page.tsx        # /portal/projects
│   │   │   └── [id]/page.tsx   # /portal/projects/123
│   │   ├── users/
│   │   │   └── page.tsx        # /portal/users
│   │   └── quotes/
│   │       └── page.tsx        # /portal/quotes
│   │
│   ├── (customer)/             # Customer-specific routes
│   │   ├── layout.tsx          # Customer layout
│   │   ├── page.tsx            # /portal (customer dashboard)
│   │   └── projects/
│   │       └── [id]/page.tsx   # /portal/projects/123
│   │
│   └── (technician)/           # Technician-specific routes
│       ├── layout.tsx          # Technician layout (mobile-optimized)
│       ├── page.tsx            # /portal (tech schedule)
│       └── jobs/
│           └── [id]/page.tsx   # /portal/jobs/123
│
├── api/                        # Route Handlers
│   ├── webhooks/
│   │   └── stripe/route.ts     # POST /api/webhooks/stripe
│   └── admin/
│       └── create-project/route.ts
│
└── actions/                    # Server Actions (optional centralization)
    ├── projectActions.ts
    └── quoteActions.ts
```

**Key Benefits:**
- **URL Consistency:** All portals use `/portal/*` base path
- **Layout Isolation:** Each role has custom layout without affecting others
- **Middleware Efficiency:** Single middleware checks `/portal/*` for auth
- **Code Colocation:** Role-specific components stay near their routes

**Implementation:**

```typescript
// app/portal/layout.tsx - Shared portal shell
export default async function PortalLayout({ children }) {
  const user = await getCurrentUser(); // Server Component
  if (!user) redirect('/login');

  return (
    <div className="portal-container">
      <AuthProvider user={user}>
        {children}
      </AuthProvider>
    </div>
  );
}

// app/portal/(admin)/layout.tsx - Admin-specific layout
export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}

// middleware.ts - Single auth check
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/portal')) {
    return checkAuth(request);
  }
}
```

**Source Confidence:** HIGH - [Official Next.js Route Groups Documentation](https://nextjs.org/docs/app/getting-started/project-structure)

---

## Pattern 2: Service Layer with Server Actions + Route Handlers

**What:** Hybrid approach using Server Actions for mutations and Route Handlers for external APIs.

**Why:** Server Actions provide type-safe, co-located mutations with automatic revalidation. Route Handlers expose public APIs for webhooks and external clients.

**Current Issue:** TeraVolta mixes concerns - some operations use API routes unnecessarily, bypassing type safety.

**Decision Matrix:**

| Use Case | Pattern | Reason |
|----------|---------|--------|
| Form submission | Server Action | Type-safe, progressive enhancement, automatic revalidation |
| Project status update | Server Action | Component-local, optimistic updates |
| Document upload | Server Action | Direct file handling, no serialization needed |
| Stripe webhook | Route Handler | External client, needs public URL |
| Admin bulk operations | Route Handler | Service role key required, admin-only |
| Public quote form | Server Action | Client-side form, server validation |
| Technician assignment | Server Action | Internal operation, needs auth context |

**Recommended Pattern:**

```typescript
// app/actions/projectActions.ts - Server Actions
'use server';

import { revalidatePath } from 'next/cache';
import { ProjectStateMachine } from '@/lib/state-machines/projectStateMachine';
import { createServerClient } from '@/lib/supabase/server';

export async function updateProjectStatus(
  projectId: string,
  newStatus: ProjectStatus
) {
  const supabase = createServerClient();

  // 1. Fetch current project
  const { data: project } = await supabase
    .from('active_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  // 2. Validate state transition
  const machine = new ProjectStateMachine(project.status);
  if (!machine.canTransitionTo(newStatus)) {
    throw new Error(`Cannot transition from ${project.status} to ${newStatus}`);
  }

  // 3. Update database
  const { error } = await supabase
    .from('active_projects')
    .update({ status: newStatus })
    .eq('id', projectId);

  if (error) throw error;

  // 4. Revalidate UI
  revalidatePath(`/portal/projects/${projectId}`);

  return { success: true };
}

export async function assignTechnician(
  projectId: string,
  technicianId: string
) {
  'use server';

  const supabase = createServerClient();

  // Business logic with state validation
  const machine = new ProjectStateMachine(currentStatus);
  machine.transition('assign');

  await supabase
    .from('active_projects')
    .update({
      assigned_to: [technicianId],
      status: machine.getCurrentState()
    })
    .eq('id', projectId);

  revalidatePath('/portal/projects');
}
```

```typescript
// app/api/webhooks/stripe/route.ts - Route Handler for external API
import { createServiceClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  // Verify webhook signature
  const event = await stripe.webhooks.constructEvent(
    await request.text(),
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  // Use service role client for admin operations
  const supabase = createServiceClient();

  if (event.type === 'payment_intent.succeeded') {
    await supabase
      .from('active_projects')
      .update({ payment_status: 'paid' })
      .eq('stripe_payment_id', event.data.object.id);
  }

  return Response.json({ received: true });
}
```

**Migration Strategy for Current Code:**

1. **Keep existing API routes** for admin operations (`/api/create-project`, `/api/create-technician`)
2. **Convert form submissions** to Server Actions (`updateStatus`, `assignTechnician`)
3. **Convert client-side mutations** in service layer to Server Actions
4. **Retain webhooks** as Route Handlers

**Source Confidence:** HIGH - [Next.js API Routes vs Server Actions Guide](https://makerkit.dev/blog/tutorials/server-actions-vs-route-handlers), [When to Use Each Pattern](https://www.pronextjs.dev/should-i-use-server-actions-or-apis)

---

## Pattern 3: Type-Safe State Machine for Project Workflows

**What:** Implement a finite state machine to constrain project status transitions and prevent invalid workflows.

**Why:** Current system has 16 statuses with no transition rules, leading to data inconsistency and incomplete workflows.

**Problem Analysis:**

Current TeraVolta statuses (16 total):
```typescript
'pending_onboarding' | 'pending_payment' | 'pending_scheduling' |
'scheduled' | 'pending_documents' | 'pending_assignment' |
'pending_installation' | 'in_progress' | 'active' | 'paused' |
'pending_client' | 'in_review' | 'completed' | 'cancelled' |
'urgent_reschedule' | 'incomplete'
```

**Issues:**
- No enforcement of valid transitions (can jump from `pending_onboarding` to `completed`)
- Unclear dependency chains (does `pending_installation` require `pending_assignment`?)
- No role-based transition guards (can customers change status to `pending_assignment`?)

**Recommended Implementation:**

### Option A: Lightweight TypeScript State Machine (No Library)

**When to use:** Simple workflows, TypeScript-first projects, minimal dependencies.

```typescript
// lib/state-machines/projectStateMachine.ts
export type ProjectStatus =
  | 'pending_onboarding'
  | 'pending_payment'
  | 'pending_documents'
  | 'pending_scheduling'
  | 'scheduled'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled';

export type ProjectEvent =
  | 'ONBOARD'
  | 'PAY'
  | 'UPLOAD_DOCS'
  | 'SCHEDULE'
  | 'START'
  | 'COMPLETE'
  | 'CANCEL';

type StateConfig = {
  on: Partial<Record<ProjectEvent, ProjectStatus>>;
  guards?: Partial<Record<ProjectEvent, (context: any) => boolean>>;
};

const stateMachine: Record<ProjectStatus, StateConfig> = {
  pending_onboarding: {
    on: {
      ONBOARD: 'pending_payment',
      CANCEL: 'cancelled',
    },
  },
  pending_payment: {
    on: {
      PAY: 'pending_documents',
      CANCEL: 'cancelled',
    },
  },
  pending_documents: {
    on: {
      UPLOAD_DOCS: 'pending_scheduling',
      CANCEL: 'cancelled',
    },
    guards: {
      UPLOAD_DOCS: (ctx) => ctx.requiredDocs.every(d => d.uploaded),
    },
  },
  pending_scheduling: {
    on: {
      SCHEDULE: 'scheduled',
      CANCEL: 'cancelled',
    },
  },
  scheduled: {
    on: {
      START: 'in_progress',
      CANCEL: 'cancelled',
    },
  },
  in_progress: {
    on: {
      COMPLETE: 'pending_review',
      CANCEL: 'cancelled',
    },
  },
  pending_review: {
    on: {
      COMPLETE: 'completed',
    },
  },
  completed: {
    on: {}, // Terminal state
  },
  cancelled: {
    on: {}, // Terminal state
  },
};

export class ProjectStateMachine {
  private currentState: ProjectStatus;
  private context: any;

  constructor(initialState: ProjectStatus, context: any = {}) {
    this.currentState = initialState;
    this.context = context;
  }

  canTransition(event: ProjectEvent): boolean {
    const stateConfig = stateMachine[this.currentState];
    const nextState = stateConfig.on[event];

    if (!nextState) return false;

    const guard = stateConfig.guards?.[event];
    if (guard && !guard(this.context)) return false;

    return true;
  }

  transition(event: ProjectEvent): ProjectStatus {
    if (!this.canTransition(event)) {
      throw new Error(
        `Invalid transition: ${event} from ${this.currentState}`
      );
    }

    const stateConfig = stateMachine[this.currentState];
    this.currentState = stateConfig.on[event]!;
    return this.currentState;
  }

  getCurrentState(): ProjectStatus {
    return this.currentState;
  }

  getAvailableEvents(): ProjectEvent[] {
    return Object.keys(stateMachine[this.currentState].on) as ProjectEvent[];
  }
}
```

**Usage in Service Layer:**

```typescript
// app/services/activeProjectService.ts
import { ProjectStateMachine } from '@/lib/state-machines/projectStateMachine';

export async function transitionProjectStatus(
  projectId: string,
  event: ProjectEvent,
  context?: any
) {
  const { data: project } = await supabase
    .from('active_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  const machine = new ProjectStateMachine(project.status, {
    ...project,
    ...context,
  });

  // Validate transition
  if (!machine.canTransition(event)) {
    throw new Error(
      `Cannot perform ${event} from ${project.status}. ` +
      `Available: ${machine.getAvailableEvents().join(', ')}`
    );
  }

  // Perform transition
  const newStatus = machine.transition(event);

  // Update database
  await supabase
    .from('active_projects')
    .update({ status: newStatus })
    .eq('id', projectId);

  return newStatus;
}
```

**Benefits:**
- **Type-Safe:** TypeScript compiler catches invalid transitions at compile time
- **Zero Dependencies:** No external libraries required
- **Testable:** Pure functions, easy to unit test
- **Explicit:** All valid transitions declared upfront
- **Debuggable:** Clear error messages for invalid transitions

### Option B: XState (For Complex Workflows)

**When to use:** Hierarchical states, parallel workflows, visual debugging needs.

```typescript
// lib/state-machines/projectMachine.ts
import { createMachine, interpret } from 'xstate';

export const projectMachine = createMachine({
  id: 'project',
  initial: 'pending_onboarding',
  states: {
    pending_onboarding: {
      on: { ONBOARD: 'pending_payment' },
    },
    pending_payment: {
      on: { PAY: 'pending_documents' },
    },
    pending_documents: {
      on: {
        UPLOAD_DOCS: {
          target: 'pending_scheduling',
          guard: 'allDocsUploaded',
        },
      },
    },
    pending_scheduling: {
      on: { SCHEDULE: 'scheduled' },
    },
    scheduled: {
      on: { START: 'in_progress' },
    },
    in_progress: {
      on: { COMPLETE: 'pending_review' },
    },
    pending_review: {
      on: { APPROVE: 'completed' },
    },
    completed: {
      type: 'final',
    },
  },
}, {
  guards: {
    allDocsUploaded: (context, event) => {
      return context.requiredDocs.every(d => d.uploaded);
    },
  },
});
```

**XState Benefits:**
- Visual state charts (Stately Studio)
- Hierarchical states (substates for complex flows)
- Parallel states (multiple workflows simultaneously)
- History states (remember previous states)
- Built-in TypeScript support

**XState Tradeoffs:**
- Additional dependency (100KB+ bundle size)
- Learning curve for team
- Overkill for simple linear workflows

**Recommendation for TeraVolta:**

Start with **Option A (Lightweight TypeScript)** because:
1. Workflows are primarily linear (onboarding → payment → documents → scheduling → completion)
2. No parallel state requirements
3. Team already familiar with TypeScript patterns
4. Zero bundle size impact
5. Can migrate to XState later if complexity increases

**Source Confidence:** HIGH - [TypeScript State Machines Without Libraries](https://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h), [Composable State Machines in TypeScript](https://medium.com/@MichaelVD/composable-state-machines-in-typescript-type-safe-predictable-and-testable-5e16574a6906)

---

## Pattern 4: Optimized Supabase RLS Strategy

**What:** Selective RLS usage with performance-optimized patterns and targeted indexes.

**Why:** Current system may suffer from RLS performance issues due to inefficient join patterns and missing indexes.

**Problem:** Supabase RLS policies are "implicit WHERE clauses" that execute on every query. Complex policies with joins can cause O(n) performance degradation resembling n+1 query problems.

**Recommended Strategy:**

### Rule 1: RLS for SELECT, Server-Side for Mutations

```typescript
// lib/supabase/client.ts - Client-side (RLS-protected)
import { createClientComponentClient } from '@supabase/ssr';

export const supabase = createClientComponentClient();

// Good: SELECT queries with RLS
export async function getUserProjects(userId: string) {
  const { data } = await supabase
    .from('active_projects')
    .select('*')
    .eq('user_id', userId); // Redundant with RLS but improves performance

  return data;
}
```

```typescript
// lib/supabase/server.ts - Server-side (mutations)
import { createServerClient } from '@supabase/ssr';

export async function updateProject(projectId: string, updates: any) {
  'use server';

  const supabase = createServerClient();

  // Server Actions bypass RLS for writes, but validate auth explicitly
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  // Custom authorization logic
  if (user.role !== 'admin') {
    throw new Error('Only admins can update projects');
  }

  await supabase
    .from('active_projects')
    .update(updates)
    .eq('id', projectId);
}
```

**Rationale:** RLS SELECT policies are cacheable and parallelizable. Mutations benefit from explicit authorization logic in Server Actions.

### Rule 2: Optimize RLS Join Patterns

**Anti-Pattern:**

```sql
-- Slow: Subquery in join WHERE clause
CREATE POLICY "users_see_team_projects" ON active_projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE team_members.team_id = active_projects.team_id
    )
  );
```

**Recommended Pattern:**

```sql
-- Fast: Reverse the join direction
CREATE POLICY "users_see_team_projects" ON active_projects
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );
```

**Why:** Postgres optimizer can cache `auth.uid()` lookup once per statement instead of per row.

### Rule 3: Cache auth.uid() with SELECT Wrapper

```sql
-- Slow: Function called per row
CREATE POLICY "user_projects" ON active_projects
  FOR SELECT USING (user_id = auth.uid());

-- Fast: Cached per statement
CREATE POLICY "user_projects" ON active_projects
  FOR SELECT USING (user_id = (SELECT auth.uid()));
```

### Rule 4: Add Explicit Indexes

```sql
-- Index columns used in RLS policies
CREATE INDEX idx_active_projects_user_id ON active_projects(user_id);
CREATE INDEX idx_active_projects_assigned_to ON active_projects USING GIN(assigned_to);
CREATE INDEX idx_appointments_technician_id ON appointments(technician_id);
CREATE INDEX idx_team_members_composite ON team_members(user_id, team_id);
```

**Rule of Thumb:** If column appears in RLS policy, it needs an index (unless it's already a primary key).

### Rule 5: Duplicate Filters in Application Code

```typescript
// Even though RLS filters by user_id, add explicit filter for performance
const { data } = await supabase
  .from('active_projects')
  .select('*')
  .eq('user_id', userId) // Explicit filter helps query planner
  .order('created_at', { ascending: false });
```

**Why:** Explicit filters allow Postgres to use indexes efficiently even when RLS policy also filters.

### Rule 6: Role-Based RLS Optimization

```sql
-- Add role check to prevent unnecessary policy evaluation
CREATE POLICY "customer_see_own_projects" ON active_projects
  FOR SELECT USING (
    (SELECT auth.jwt()->>'role') = 'customer'
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "admin_see_all_projects" ON active_projects
  FOR SELECT USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );
```

**Why:** Early role check short-circuits expensive user_id lookups for admin users.

### TeraVolta-Specific RLS Policies

```sql
-- Customers see their own projects
CREATE POLICY "customer_projects" ON active_projects
  FOR SELECT USING (
    user_id = (SELECT auth.uid())
  );

-- Technicians see assigned projects
CREATE POLICY "technician_projects" ON active_projects
  FOR SELECT USING (
    (SELECT auth.uid()) = ANY(assigned_to)
  );

-- Admins see all projects
CREATE POLICY "admin_projects" ON active_projects
  FOR SELECT USING (
    (SELECT auth.jwt()->>'role') = 'admin'
  );

-- Required indexes
CREATE INDEX idx_projects_user_id ON active_projects(user_id);
CREATE INDEX idx_projects_assigned_to ON active_projects USING GIN(assigned_to);
```

**Source Confidence:** HIGH - [Supabase RLS Performance Official Guide](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv), [RLS Performance Patterns](https://github.com/orgs/supabase/discussions/14576)

---

## Pattern 5: Shared Business Logic Architecture

**What:** Centralize domain logic in service classes that are consumed by both Server Actions and Route Handlers.

**Why:** Prevents duplication of business rules across Server Actions and API routes.

**Recommended Structure:**

```
lib/
├── services/              # Domain services (pure business logic)
│   ├── ProjectService.ts
│   ├── QuoteService.ts
│   └── TechnicianService.ts
├── state-machines/        # Workflow validation
│   ├── projectStateMachine.ts
│   └── quoteStateMachine.ts
├── supabase/
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client (cookies)
│   └── admin.ts           # Service role client
└── validators/            # Zod schemas
    ├── projectSchemas.ts
    └── quoteSchemas.ts

app/
├── actions/               # Server Actions (UI-facing)
│   ├── projectActions.ts  # Calls ProjectService
│   └── quoteActions.ts    # Calls QuoteService
└── api/                   # Route Handlers (external-facing)
    ├── webhooks/
    │   └── stripe/route.ts # Calls ProjectService
    └── admin/
        └── bulk-update/route.ts # Calls ProjectService
```

**Example Implementation:**

```typescript
// lib/services/ProjectService.ts - Pure domain logic
import { ProjectStateMachine } from '@/lib/state-machines/projectStateMachine';
import { SupabaseClient } from '@supabase/supabase-js';

export class ProjectService {
  constructor(private supabase: SupabaseClient) {}

  async transitionStatus(
    projectId: string,
    event: ProjectEvent,
    context?: any
  ): Promise<ProjectStatus> {
    // 1. Fetch project
    const { data: project } = await this.supabase
      .from('active_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    // 2. Validate transition
    const machine = new ProjectStateMachine(project.status, context);
    if (!machine.canTransition(event)) {
      throw new Error(`Cannot transition: ${event} from ${project.status}`);
    }

    // 3. Perform transition
    const newStatus = machine.transition(event);

    // 4. Update database
    await this.supabase
      .from('active_projects')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    return newStatus;
  }

  async assignTechnician(
    projectId: string,
    technicianId: string
  ): Promise<void> {
    // Business logic: Check technician availability
    const isAvailable = await this.checkTechnicianAvailability(technicianId);
    if (!isAvailable) {
      throw new Error('Technician not available');
    }

    // Update project
    await this.supabase
      .from('active_projects')
      .update({
        assigned_to: [technicianId],
        status: 'scheduled',
      })
      .eq('id', projectId);

    // Notify technician (side effect)
    await this.notifyTechnician(technicianId, projectId);
  }

  private async checkTechnicianAvailability(
    technicianId: string
  ): Promise<boolean> {
    // Complex business logic...
    return true;
  }

  private async notifyTechnician(
    technicianId: string,
    projectId: string
  ): Promise<void> {
    // Notification logic...
  }
}
```

```typescript
// app/actions/projectActions.ts - Server Action wrapper
'use server';

import { ProjectService } from '@/lib/services/ProjectService';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function assignTechnician(
  projectId: string,
  technicianId: string
) {
  const supabase = createServerClient();
  const service = new ProjectService(supabase);

  try {
    await service.assignTechnician(projectId, technicianId);
    revalidatePath('/portal/projects');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

```typescript
// app/api/webhooks/stripe/route.ts - Route Handler wrapper
import { ProjectService } from '@/lib/services/ProjectService';
import { createServiceClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const event = await verifyStripeWebhook(request);

  const supabase = createServiceClient(); // Service role
  const service = new ProjectService(supabase);

  if (event.type === 'payment_intent.succeeded') {
    await service.transitionStatus(
      event.metadata.projectId,
      'PAY'
    );
  }

  return Response.json({ received: true });
}
```

**Benefits:**
- Business logic shared between Server Actions and API routes
- Service layer is framework-agnostic (could extract to separate package)
- Easy to test (inject mock Supabase client)
- Single source of truth for business rules

---

## Pattern 6: Real-Time State Synchronization

**What:** Use Supabase real-time subscriptions to keep multi-portal views synchronized.

**Why:** When admin updates project status, customer and technician portals should update immediately without manual refresh.

**Implementation:**

```typescript
// components/providers/RealtimeProvider.tsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function RealtimeProvider({ children, userId, role }) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Subscribe to relevant tables based on role
    const channelName = `user:${userId}`;

    const newChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project updated:', payload);
          // Trigger React Query invalidation or state update
          queryClient.invalidateQueries(['projects', userId]);
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [userId]);

  return <>{children}</>;
}
```

**Use Cases:**
- Admin assigns technician → Technician portal shows new job immediately
- Customer schedules appointment → Admin dashboard updates instantly
- Technician completes job → Customer sees status change in real-time

**Performance Consideration:** Subscribe only to rows relevant to current user (use RLS-style filters in subscription).

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: God Service Objects

**What:** Single service class handling all operations for an entity.

**Why bad:** Becomes massive, hard to test, violates single responsibility principle.

**Example:**

```typescript
// BAD: 2000+ line service file
export const ActiveProjectService = {
  getAll,
  getById,
  create,
  update,
  delete,
  assignTechnician,
  uploadDocument,
  deleteDocument,
  addTimeline,
  updateStatus,
  scheduleAppointment,
  // ... 50+ more methods
};
```

**Instead:** Split by domain concern:

```typescript
// GOOD: Focused services
export class ProjectQueryService {
  getAll() {}
  getById() {}
  getByUserId() {}
}

export class ProjectMutationService {
  create() {}
  update() {}
  delete() {}
}

export class ProjectWorkflowService {
  transitionStatus() {}
  assignTechnician() {}
}

export class ProjectDocumentService {
  upload() {}
  delete() {}
}
```

### Anti-Pattern 2: Client-Side State Machine

**What:** Implementing state machine logic in client components.

**Why bad:**
- Circumventable (user can manipulate client-side code)
- Not enforced at database level
- Inconsistent across portals

**Example:**

```typescript
// BAD: Client-side validation only
function ProjectCard({ project }) {
  const canComplete = project.status === 'in_progress';

  return (
    <button
      disabled={!canComplete}
      onClick={() => updateStatus('completed')}
    >
      Complete
    </button>
  );
}
```

**Instead:** Server-side enforcement:

```typescript
// GOOD: Server Action enforces state machine
'use server';
export async function completeProject(projectId: string) {
  const machine = new ProjectStateMachine(currentStatus);
  if (!machine.canTransition('COMPLETE')) {
    throw new Error('Cannot complete project in current state');
  }
  // ... update
}

// Client just calls action
function ProjectCard({ project }) {
  return (
    <form action={completeProject}>
      <input type="hidden" name="projectId" value={project.id} />
      <button type="submit">Complete</button>
    </form>
  );
}
```

### Anti-Pattern 3: Mixing Read and Write Clients

**What:** Using same Supabase client for reads and writes without considering RLS.

**Why bad:** RLS policies may not apply correctly to mutations, leading to security vulnerabilities.

**Example:**

```typescript
// BAD: Using client-side supabase for admin operations
export async function createProject(data: any) {
  const { data: project } = await supabase
    .from('active_projects')
    .insert(data); // May fail due to RLS
}
```

**Instead:** Use appropriate client:

```typescript
// GOOD: Server Action with server client
'use server';
export async function createProject(data: any) {
  const supabase = createServerClient(); // Server-side, cookies-based

  // Or for admin operations:
  const supabase = createServiceClient(); // Service role, bypasses RLS

  const { data: project } = await supabase
    .from('active_projects')
    .insert(data);
}
```

### Anti-Pattern 4: Direct Status Updates Without Validation

**What:** Allowing arbitrary status changes without state machine validation.

**Current TeraVolta Issue:** Code like this exists:

```typescript
// BAD: No validation
await supabase
  .from('active_projects')
  .update({ status: 'completed' }) // Can set ANY status
  .eq('id', projectId);
```

**Instead:** Force all updates through state machine:

```typescript
// GOOD: Validated transition
const service = new ProjectService(supabase);
await service.transitionStatus(projectId, 'COMPLETE'); // Validates
```

### Anti-Pattern 5: Portal-Specific Business Logic

**What:** Duplicating business rules in each portal's code.

**Why bad:** Inconsistent behavior across portals, maintenance nightmare.

**Example:**

```typescript
// BAD: Logic duplicated in each portal
// app/portal/(admin)/projects/page.tsx
const canAssign = project.status === 'pending_assignment';

// app/portal/(customer)/projects/page.tsx
const canSchedule = project.status === 'pending_scheduling';

// app/portal/(technician)/jobs/page.tsx
const canStart = project.status === 'scheduled';
```

**Instead:** Centralize in state machine:

```typescript
// GOOD: Single source of truth
const machine = new ProjectStateMachine(project.status);
const canAssign = machine.canTransition('ASSIGN');
const canSchedule = machine.canTransition('SCHEDULE');
const canStart = machine.canTransition('START');
```

---

## Migration Path for Current TeraVolta System

### Phase 1: Foundation (Week 1)
1. Create state machine implementation (`lib/state-machines/projectStateMachine.ts`)
2. Add RLS indexes to existing policies
3. Create separate Supabase client utilities (`lib/supabase/{client,server,admin}.ts`)
4. Refactor existing service layer to use appropriate clients

### Phase 2: Portal Restructure (Week 2)
1. Introduce route groups for portals
2. Move portal-specific components into route group folders
3. Create shared portal layout with auth enforcement
4. Implement role-based middleware

### Phase 3: State Machine Integration (Week 2-3)
1. Wrap all status updates with state machine validation
2. Add state machine methods to service layer
3. Update UI to show available transitions only
4. Add error handling for invalid transitions

### Phase 4: Server Actions Migration (Week 3-4)
1. Convert form submissions to Server Actions
2. Replace client-side mutations in service layer
3. Keep existing API routes for webhooks and admin operations
4. Add `revalidatePath` to Server Actions for cache invalidation

### Phase 5: Real-Time & Polish (Week 4)
1. Implement real-time subscriptions for cross-portal updates
2. Add optimistic updates to Server Actions
3. Performance audit of RLS policies
4. Documentation and team training

---

## Testing Strategy

### Unit Tests: State Machine

```typescript
// __tests__/projectStateMachine.test.ts
describe('ProjectStateMachine', () => {
  it('allows valid transitions', () => {
    const machine = new ProjectStateMachine('pending_payment');
    expect(machine.canTransition('PAY')).toBe(true);

    const newStatus = machine.transition('PAY');
    expect(newStatus).toBe('pending_documents');
  });

  it('prevents invalid transitions', () => {
    const machine = new ProjectStateMachine('pending_payment');
    expect(machine.canTransition('COMPLETE')).toBe(false);

    expect(() => machine.transition('COMPLETE')).toThrow();
  });

  it('respects guards', () => {
    const machine = new ProjectStateMachine('pending_documents', {
      requiredDocs: [
        { uploaded: false },
        { uploaded: false },
      ],
    });

    expect(machine.canTransition('UPLOAD_DOCS')).toBe(false);
  });
});
```

### Integration Tests: Server Actions

```typescript
// __tests__/projectActions.test.ts
import { assignTechnician } from '@/app/actions/projectActions';
import { createServerClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('assignTechnician', () => {
  it('assigns technician and updates status', async () => {
    const mockSupabase = createMockSupabaseClient();
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await assignTechnician('project-123', 'tech-456');

    expect(result.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('active_projects');
  });

  it('prevents assignment to unavailable technician', async () => {
    // ... test error case
  });
});
```

### E2E Tests: Portal Workflows

```typescript
// e2e/customer-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('customer can complete project workflow', async ({ page }) => {
  // 1. Login as customer
  await page.goto('/portal/login');
  await page.fill('[name="email"]', 'customer@test.com');
  await page.click('button[type="submit"]');

  // 2. View project
  await page.goto('/portal/projects/test-project-id');

  // 3. Should see payment button (status: pending_payment)
  await expect(page.locator('button:has-text("Pay Now")')).toBeVisible();

  // 4. Complete payment
  await page.click('button:has-text("Pay Now")');

  // 5. Should transition to document upload (status: pending_documents)
  await expect(page.locator('text=Upload Documents')).toBeVisible();

  // 6. Should NOT see completed status yet
  await expect(page.locator('text=Completed')).not.toBeVisible();
});
```

---

## Performance Benchmarks

### Target Metrics

| Operation | Target | Current (Est.) | Optimization |
|-----------|--------|---------------|--------------|
| Load customer dashboard | < 200ms | ~800ms | Add RLS indexes, optimize queries |
| Update project status | < 100ms | ~300ms | Server Action, state machine cache |
| Assign technician | < 150ms | ~500ms | Background notification job |
| Real-time update latency | < 50ms | N/A | Supabase subscriptions |
| Search projects (admin) | < 300ms | ~1000ms | Add GIN indexes, pagination |

### Monitoring

```typescript
// lib/monitoring/performance.ts
export async function measureAction<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

    // Send to analytics
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'server_action_timing', {
        action_name: name,
        duration_ms: duration,
      });
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} FAILED after ${duration.toFixed(2)}ms`);
    throw error;
  }
}

// Usage in Server Action
export async function assignTechnician(projectId: string, techId: string) {
  'use server';
  return measureAction('assignTechnician', async () => {
    // ... implementation
  });
}
```

---

## Security Considerations

### 1. RLS Policy Enforcement

Always enable RLS on tables with sensitive data:

```sql
ALTER TABLE active_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

### 2. Service Role Usage

Only use service role client in API routes, never client-side:

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Service client cannot be used on client-side!');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Never expose to client
  );
}
```

### 3. Role-Based Access in Server Actions

```typescript
'use server';
export async function deleteProject(projectId: string) {
  const user = await getCurrentUser();

  if (user.role !== 'admin') {
    throw new Error('Unauthorized: Admin only');
  }

  // ... proceed with deletion
}
```

### 4. Input Validation with Zod

```typescript
// lib/validators/projectSchemas.ts
import { z } from 'zod';

export const UpdateProjectSchema = z.object({
  projectId: z.string().uuid(),
  status: z.enum([
    'pending_payment',
    'pending_documents',
    'scheduled',
    // ... all valid statuses
  ]),
  assignedTo: z.array(z.string().uuid()).optional(),
});

// Server Action
export async function updateProject(input: unknown) {
  'use server';

  const validated = UpdateProjectSchema.parse(input);
  // ... proceed with validated data
}
```

---

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Database** | Supabase Free Tier | Supabase Pro + Read Replicas | Supabase Enterprise + Connection Pooling |
| **Real-Time** | Direct WebSocket connections | Broadcast-only channels | Redis pub/sub layer |
| **File Storage** | Supabase Storage | Supabase + CDN | Separate CDN (Cloudflare R2) |
| **Caching** | Next.js built-in cache | Redis for session data | Multi-layer cache (CDN + Redis + Next.js) |
| **Search** | Postgres full-text search | Postgres + materialized views | Dedicated search (Algolia/Typesense) |
| **Background Jobs** | Server Actions (sync) | Vercel Cron + Queue | Separate job queue (BullMQ + Redis) |

---

## Tools and Ecosystem

### Development

- **TypeScript:** Type-safe state machines and domain models
- **Zod:** Runtime validation for Server Actions
- **Supabase CLI:** Local development, migrations
- **Stately Studio:** Visual state machine design (optional)

### Testing

- **Vitest:** Unit tests for state machines and services
- **Playwright:** E2E tests for portal workflows
- **MSW:** Mock Supabase for integration tests

### Monitoring

- **Sentry:** Error tracking for Server Actions
- **Vercel Analytics:** Performance monitoring
- **Supabase Dashboard:** Query performance, RLS policy analysis

### Documentation

- **Storybook:** Component library documentation
- **Typedoc:** Auto-generated API docs from TypeScript

---

## Sources

### Official Documentation (HIGH Confidence)
- [Next.js App Router Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Supabase + Next.js Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase RLS Performance Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)

### Architecture Patterns (HIGH Confidence)
- [Next.js Architecture in 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Modern Full Stack Application Architecture Using Next.js 15+](https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/)
- [Next.js 15 App Router Advanced Patterns for 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7)

### Supabase Best Practices (HIGH Confidence)
- [Supabase + Next.js The Real Way](https://medium.com/@iamqitmeeer/supabase-next-js-guide-the-real-way-01a7f2bd140c)
- [Next.js + Supabase: What Would I Do Differently](https://catjam.fi/articles/next-supabase-what-do-differently)
- [RLS Performance Discussion (GitHub)](https://github.com/orgs/supabase/discussions/14576)

### Server Actions vs API Routes (HIGH Confidence)
- [Next.js API Routes vs Server Actions](https://medium.com/@shavaizali159/next-js-api-routes-vs-server-actions-which-one-to-use-and-why-809f09d5069b)
- [Should I Use Server Actions Or APIs?](https://www.pronextjs.dev/should-i-use-server-actions-or-apis)
- [Server Actions vs Route Handlers](https://makerkit.dev/blog/tutorials/server-actions-vs-route-handlers)

### State Machines (MEDIUM Confidence)
- [You Don't Need a Library for State Machines](https://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h)
- [Composable State Machines in TypeScript](https://medium.com/@MichaelVD/composable-state-machines-in-typescript-type-safe-predictable-and-testable-5e16574a6906)
- [XState GitHub Repository](https://github.com/statelyai/xstate)

### Multi-Portal Patterns (MEDIUM Confidence)
- [Building Scalable RBAC in Next.js](https://medium.com/@muhebollah.diu/building-a-scalable-role-based-access-control-rbac-system-in-next-js-b67b9ecfe5fa)
- [Multi-Role Government App Folder Structure](https://medium.com/@shankhwarshipra2001/my-real-world-folder-structure-for-a-multi-role-multi-language-government-app-in-next-js-e8a35a224bea)
- [SaaS Architecture Patterns with Next.js](https://vladimirsiedykh.com/blog/saas-architecture-patterns-nextjs)

---

## Conclusion

The recommended architecture for TeraVolta's Next.js 15 + Supabase platform prioritizes:

1. **Type-safe state machines** to prevent invalid workflow transitions
2. **Route groups** for clean multi-portal organization
3. **Server Actions** for mutations with **Route Handlers** for external APIs
4. **Optimized RLS** with targeted indexes and performance patterns
5. **Centralized domain services** shared across action types
6. **Real-time synchronization** for cross-portal updates

This approach addresses the current issues of incomplete workflows, incorrect data display, and unconstrained status transitions while setting up a foundation for scalable growth.

**Next Steps:**
1. Implement lightweight TypeScript state machine (no library required)
2. Add RLS indexes to existing policies (immediate performance win)
3. Restructure portals with route groups (better organization)
4. Refactor status updates to use state machine validation (prevents bugs)
5. Convert UI mutations to Server Actions (type safety + cache invalidation)
