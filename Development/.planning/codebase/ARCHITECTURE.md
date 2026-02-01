# Architecture

**Analysis Date:** 2026-01-28

## Pattern Overview

**Overall:** Layered client-server architecture with Next.js App Router, using a service abstraction layer for business logic separation from React components.

**Key Characteristics:**
- Next.js 15 (App Router) with TypeScript strict mode
- Supabase for authentication and database (PostgreSQL)
- Client-server separation: Server-side API routes handle admin/privileged operations, client-side handles user interactions
- Service layer pattern: Business logic encapsulated in service modules (`activeProjectService`, `notificationService`, etc.)
- Role-based access control (RBAC) with three portal contexts: customer, admin, technician
- Provider-based state management: Context API for auth, language, notifications
- Responsive UI with Tailwind CSS, supporting multiple roles/portals

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render user interfaces, handle user interactions, display data
- Location: `components/` and `app/` directories
- Contains: React components, pages, layouts
- Depends on: Service Layer, Providers, Types
- Used by: End users through browser

**Portal Layer (Role-Specific UI):**
- Purpose: Enforce role-based access and provide role-specific interfaces
- Location: `app/portal/admin/`, `app/portal/customer/`, `app/portal/technician/`
- Contains: Layout files, page components, role-specific dashboards
- Depends on: RoleGuard component, AuthProvider, Layout components
- Used by: Authenticated users with specific roles

**Service Layer (Business Logic):**
- Purpose: Encapsulate business logic, data operations, and external service calls
- Location: `app/services/`
- Contains: Service objects with methods for CRUD operations and data transformations
- Depends on: Supabase client, Types
- Used by: Components, API routes, other services

**API Route Layer (Backend Logic):**
- Purpose: Handle server-side operations, RLS bypass for privileged operations, external API calls
- Location: `app/api/`
- Contains: Route handlers for form submissions, email sending, user management
- Depends on: Supabase Admin client, Service Layer, Libraries
- Used by: Frontend fetch requests, webhooks

**Data/Integration Layer:**
- Purpose: Manage database connections and external service integrations
- Location: `lib/supabase.ts`, `lib/supabase-admin.ts`
- Contains: Supabase clients (browser and admin), environment configuration
- Depends on: Environment variables
- Used by: Services, API routes, Providers

**Type Layer:**
- Purpose: Centralized TypeScript type definitions for all data models
- Location: `lib/types.ts`
- Contains: Interfaces for User, Quote, Inquiry, ActiveProject, Technician, Appointment, etc.
- Depends on: Nothing
- Used by: All layers for type safety

**Provider Layer (State Management):**
- Purpose: Manage application-level state and context
- Location: `components/AuthProvider.tsx`, `components/LanguageProvider.tsx`, `components/NotificationContext.tsx`
- Contains: React Context providers for authentication, language/i18n, notifications
- Depends on: Supabase, Types
- Used by: All components via hooks (useAuth, useLanguage, useNotification)

## Data Flow

**Quote Request to Active Project Creation:**

1. User fills quote form (`app/quote/page.tsx`)
2. Form submission calls `/api/create-quote` (POST)
3. API route creates Quote record in `quotes` table via admin client
4. Admin reviews quote in `app/portal/admin/quotes/[id]/page.tsx`
5. Admin approves and clicks "Create Project"
6. This triggers `/api/create-project` (POST)
7. `ActiveProjectService.create()` is called, which internally calls `/api/create-project`
8. API route inserts into `active_projects` table
9. Customer sees project in dashboard via `app/portal/customer/page.tsx`
10. `ActiveProjectService.getByUserId()` fetches projects for logged-in user

**Authentication Flow:**

1. User lands on `/portal/login`
2. Supabase.auth.signInWithPassword() authenticates user
3. `AuthProvider` (in `components/AuthProvider.tsx`) listens to `onAuthStateChange`
4. Upon successful auth, fetches user role from `users` table via RLS-protected query
5. Sets `isAdmin` flag based on role
6. Router redirects to appropriate portal (`/portal/admin`, `/portal/customer`, `/portal/technician`)
7. `RoleGuard` component in layouts enforces access control

**Notification Flow:**

1. System event triggers (e.g., quote created, project scheduled)
2. Backend creates notification record via `/api/create-notification`
3. `NotificationService.shouldSend()` checks user preferences from `user_settings`
4. If approved, sends email via Resend API
5. In-app notification displays via `NotificationCenter` component
6. Real-time updates via `useNotification` hook

**State Management:**

- **Auth State:** `AuthProvider` manages user session, loading state, admin flag
- **Language State:** `LanguageProvider` manages locale and i18n
- **Notifications:** `NotificationContext` manages in-app notification queue and display
- **View Mode:** `ViewModeProvider` manages sidebar/modal state in portals
- **Component State:** useState for form data, UI toggles, pagination

## Key Abstractions

**Service Objects:**
- Purpose: Encapsulate CRUD and business logic for specific domains
- Examples: `ActiveProjectService`, `NotificationService`, `TechnicianService`, `QuoteService`
- Pattern: Exported as singleton object with named methods (getAll, getById, create, update, delete)
- Pattern example from `activeProjectService.ts`:
  ```typescript
  export const ActiveProjectService = {
    getAll: async (): Promise<ActiveProject[]> => { /* ... */ },
    getById: async (id: string): Promise<ActiveProject | null> => { /* ... */ },
    getByUserId: async (userId: string): Promise<ActiveProject[]> => { /* ... */ },
    create: async (data: Omit<ActiveProject, ...>) => { /* ... */ },
    update: async (id: string, data: Partial<ActiveProject>) => { /* ... */ },
  };
  ```

**Type Interfaces:**
- Purpose: Enforce consistent data structure across the application
- Examples: `ClientReference` (reused in Quote, ActiveProject, etc.), `ClientProfile` (extends ClientReference)
- Pattern: Hierarchical composition - base types extended by specific types
- Example from `lib/types.ts`:
  ```typescript
  export interface ClientReference {
    userId: string | null;
    clientEmail: string;
    clientName: string;
    clientPhone: string;
    clientCompany?: string;
  }
  export interface ClientProfile extends ClientReference {
    clientType: 'residential' | 'business';
    address?: Address;
  }
  ```

**Provider Hooks:**
- Purpose: Provide centralized access to global state from any component
- Examples: `useAuth()`, `useLanguage()`, `useNotification()`
- Pattern: Custom hooks that call useContext() internally
- Usage: All components consume via hooks, not direct context access

**Role Guard Pattern:**
- Purpose: Enforce role-based access control at layout level
- Location: `components/RoleGuard.tsx`
- Pattern: Checks user role against required roles, blocks access if unauthorized

**Portal Layouts:**
- Purpose: Provide consistent header/sidebar/navigation for each role
- Locations: `app/portal/admin/layout.tsx`, `app/portal/customer/layout.tsx`, `app/portal/technician/layout.tsx`
- Pattern: Wrap all child routes with authenticated navigation, handle mobile responsiveness

## Entry Points

**Main Website:**
- Location: `app/page.tsx`
- Triggers: User visits /
- Responsibilities: Render marketing homepage with hero, services, case studies, CTA

**Quote Flow:**
- Location: `app/quote/page.tsx`
- Triggers: User clicks "Get Quote"
- Responsibilities: Display quote form, validate input, submit to `/api/create-quote`

**Inquiry/Contact:**
- Location: `app/inquiry/page.tsx`
- Triggers: User submits contact form
- Responsibilities: Display inquiry form, submit to `/api/create-inquiry`

**Portal Login:**
- Location: `app/portal/login/page.tsx`
- Triggers: User visits /portal/login or auth redirect
- Responsibilities: Authenticate user with Supabase, redirect to role-specific dashboard

**Admin Dashboard:**
- Location: `app/portal/admin/page.tsx` (wrapped by `app/portal/admin/layout.tsx`)
- Triggers: Admin user logs in
- Responsibilities: Display admin dashboard, navigation sidebar, role-based features

**Customer Dashboard:**
- Location: `app/portal/customer/page.tsx` (wrapped by `app/portal/customer/layout.tsx`)
- Triggers: Customer user logs in
- Responsibilities: Display customer projects, pending requests, notifications

**Technician Dashboard:**
- Location: `app/portal/technician/page.tsx` (wrapped by `app/portal/technician/layout.tsx`)
- Triggers: Technician user logs in
- Responsibilities: Display assigned projects, calendar, inspection forms

## Error Handling

**Strategy:** Multi-layered error handling with graceful degradation

**Patterns:**
- **Component Level:** Try-catch blocks in useEffect with state updates; show error toast to user via `useToast()`
- **Service Level:** Throw errors upward to be caught by components; log errors for debugging
- **API Level:** Return NextResponse with appropriate status codes (400 for validation, 500 for server errors)
- **Global:** `GlobalErrorSuppressor` component suppresses hydration errors in development
- **Auth Errors:** Caught by providers, automatically redirect to login on 401

Example from `app/portal/customer/page.tsx`:
```typescript
try {
    const projectsData = await ActiveProjectService.getByUserId(user.id);
    if (isMounted) setProjects(projectsData || []);
} catch (error: any) {
    if (isMounted) console.error('Error fetching dashboard data:', error);
}
```

## Cross-Cutting Concerns

**Logging:**
- Pattern: console.error() for errors, console.log() for debug info
- Implemented in: Service methods, API routes, effect hooks
- Note: Development only in client components due to hydration suppression

**Validation:**
- Server-side: Required field checks in API routes (e.g., `/api/create-inquiry`)
- Client-side: Form libraries or manual validation before submission
- Type-level: TypeScript interfaces enforce structure

**Authentication:**
- Provider: Supabase Auth (email/password, magic links)
- Flow: `AuthProvider` manages session state
- Protection: RLS policies in Supabase enforce row-level access control
- Admin Operations: Use `supabase-admin` client in API routes to bypass RLS for privileged ops

**Authorization:**
- Pattern: Role-based access control (RBAC)
- Roles: 'customer', 'admin', 'super_admin', 'technician'
- Implementation: `RoleGuard` component checks user.role before rendering
- Enforcement: RLS policies restrict database access by role

**Internationalization (i18n):**
- Framework: Custom `LanguageProvider` using React Context
- Supported Languages: 'en' (English), 'es' (Spanish)
- Usage: `const { t } = useLanguage()` then `t('key.path')`
- Storage: Language preference in localStorage

---

*Architecture analysis: 2026-01-28*
