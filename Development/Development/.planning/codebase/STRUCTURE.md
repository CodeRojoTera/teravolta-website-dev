# Codebase Structure

**Analysis Date:** 2026-01-28

## Directory Layout

```
project-root/
├── app/                          # Next.js App Router (pages, layouts, API routes)
│   ├── page.tsx                  # Homepage/marketing site
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global Tailwind styles
│   ├── api/                      # API route handlers
│   │   ├── create-inquiry/
│   │   ├── create-quote/
│   │   ├── create-project/
│   │   ├── send-email/
│   │   ├── send-invoice/
│   │   └── ...                   # Other API endpoints
│   ├── portal/                   # Role-based portal routes
│   │   ├── admin/                # Admin dashboard and tools
│   │   │   ├── layout.tsx        # Admin layout with sidebar
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── inquiries/        # Inquiry management
│   │   │   ├── quotes/           # Quote management
│   │   │   ├── active-projects/  # Project management
│   │   │   ├── users/            # User management
│   │   │   ├── technicians/      # Technician management
│   │   │   ├── portfolio/        # Portfolio management
│   │   │   ├── requests/         # Service request tracking
│   │   │   └── settings/         # Admin settings
│   │   ├── customer/             # Customer portal
│   │   │   ├── layout.tsx        # Customer layout
│   │   │   ├── page.tsx          # Customer dashboard
│   │   │   ├── projects/         # View/manage projects
│   │   │   ├── request-service/  # Request service form
│   │   │   └── settings/         # Customer account settings
│   │   ├── technician/           # Technician portal
│   │   │   ├── layout.tsx        # Technician layout
│   │   │   ├── page.tsx          # Technician dashboard
│   │   │   └── [id]/             # Technician details
│   │   └── login/                # Portal login page
│   ├── quote/                    # Quote request flow
│   │   ├── page.tsx              # Quote form
│   │   └── results/              # Quote results display
│   ├── inquiry/                  # Contact/inquiry flow
│   │   ├── page.tsx              # Inquiry form
│   │   └── confirmation/         # Submission confirmation
│   ├── services/                 # Public service pages
│   │   ├── page.tsx              # Services overview
│   │   ├── efficiency/           # Efficiency service page
│   │   ├── consulting/           # Consulting service page
│   │   └── advocacy/             # Advocacy service page
│   ├── projects/                 # Portfolio/case studies
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── onboard/                  # User onboarding
│   ├── reschedule/               # Reschedule appointment
│   └── not-found.tsx             # 404 error page
│
├── components/                   # Reusable React components
│   ├── AuthProvider.tsx          # Auth context provider
│   ├── LanguageProvider.tsx      # i18n context provider
│   ├── NotificationContext.tsx   # Notifications state provider
│   ├── RoleGuard.tsx             # Role-based access control
│   ├── Header.tsx                # Site header/navigation
│   ├── Footer.tsx                # Site footer
│   ├── NotificationCenter.tsx    # In-app notifications UI
│   ├── ViewModeProvider.tsx      # Portal view mode state
│   ├── GlobalErrorSuppressor.tsx # Hydration error suppression
│   ├── DocumentManager.tsx       # Document upload/management
│   ├── ReviewModal.tsx           # Review/approval modal
│   ├── ProjectUpdates.tsx        # Project status updates
│   ├── ManualProjectWizard.tsx   # Create project manually
│   ├── admin/                    # Admin-specific components
│   │   ├── TechnicianModal.tsx   # Create/edit technician
│   │   └── InspectionViewer.tsx  # View inspection reports
│   ├── technician/               # Technician-specific components
│   │   ├── InspectionDashboard.tsx
│   │   ├── BoardForm.tsx         # Electrical board form
│   │   ├── StandardReportForm.tsx
│   │   └── BoardListManager.tsx
│   └── ui/                       # Shared UI components
│       ├── Button.tsx            # Reusable button component
│       ├── Toast.tsx             # Toast notification provider
│       ├── ConfirmationModal.tsx # Confirmation dialog
│       ├── Skeleton.tsx          # Loading skeleton
│       └── EmptyState.tsx        # Empty state display
│
├── lib/                          # Utilities and shared functions
│   ├── supabase.ts               # Supabase client (browser)
│   ├── supabase-admin.ts         # Supabase admin client (server)
│   ├── types.ts                  # Centralized TypeScript interfaces
│   ├── dateUtils.ts              # Date/time utilities
│   ├── documentUtils.ts          # Document handling utilities
│   ├── clientTypeUtils.ts        # Client type utilities
│   └── middleware.ts             # Next.js middleware (if applicable)
│
├── app/services/                 # Business logic service layer
│   ├── activeProjectService.ts   # Active project CRUD and operations
│   ├── quoteService.ts           # Quote management
│   ├── appointmentService.ts     # Appointment scheduling
│   ├── notificationService.ts    # Notification operations
│   ├── emailService.ts           # Email sending logic
│   ├── technicianService.ts      # Technician management
│   ├── reviewService.ts          # Review/approval logic
│   └── rescheduleService.ts      # Reschedule logic
│
├── public/                       # Static assets
│   ├── images/                   # Brand and UI images
│   │   ├── logos/                # Logo files
│   │   └── brand/                # Brand imagery
│   └── fonts/                    # Custom fonts (Gilroy family)
│
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migration files
│
├── docs/                         # Project documentation
│   ├── ATOMIC_ARCHITECTURE.md
│   ├── ATOMIC_DATABASE.md
│   ├── SYSTEM_NARRATIVE.md
│   └── ...                       # Other docs
│
├── .planning/                    # GSD planning documents
│   └── codebase/                 # Codebase analysis (this directory)
│
├── package.json                  # NPM dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
└── .env.local                    # Local environment variables (git ignored)
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router containing all pages, layouts, and API routes
- Contains: Page components, dynamic routes, route groups, API endpoints
- Key files: `page.tsx` (pages), `layout.tsx` (layouts), `route.ts` (API endpoints)

**components/**
- Purpose: Reusable React components shared across pages
- Contains: UI components, context providers, feature-specific components
- Key files: `AuthProvider.tsx`, `LanguageProvider.tsx`, `RoleGuard.tsx`

**lib/**
- Purpose: Shared utilities, database clients, and type definitions
- Contains: Supabase clients, TypeScript interfaces, utility functions
- Key files: `types.ts` (data models), `supabase.ts` (client), `supabase-admin.ts` (server)

**app/services/**
- Purpose: Business logic layer separating logic from components
- Contains: Service objects with CRUD and domain-specific operations
- Key files: `activeProjectService.ts`, `notificationService.ts`, etc.

**public/**
- Purpose: Static assets served directly without processing
- Contains: Images, fonts, favicons
- Key files: `images/logos/`, `images/brand/`, `fonts/`

**supabase/**
- Purpose: Database configuration and migrations
- Contains: SQL migration files for schema changes

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Main homepage/marketing site entry point
- `app/layout.tsx`: Root layout wrapping all pages with providers
- `app/portal/login/page.tsx`: Portal authentication entry point
- `app/api/*/route.ts`: API endpoint entry points

**Configuration:**
- `tsconfig.json`: TypeScript compiler configuration with path aliases (@/*)
- `next.config.js`: Next.js build and runtime configuration
- `package.json`: Project metadata and dependencies
- `.env.local`: Local environment variables (Supabase URL, keys, etc.)

**Core Logic:**
- `lib/types.ts`: Complete data model definitions (305+ lines)
- `lib/supabase.ts`: Supabase client initialization
- `lib/supabase-admin.ts`: Admin client for privileged operations
- `app/services/activeProjectService.ts`: Main project management service

**Testing & Utilities:**
- `lib/dateUtils.ts`: Date formatting and manipulation
- `lib/documentUtils.ts`: File upload and document handling
- `lib/clientTypeUtils.ts`: Client type classification

**Global Providers:**
- `components/AuthProvider.tsx`: Authentication context
- `components/LanguageProvider.tsx`: Internationalization context
- `components/NotificationContext.tsx`: Notification state management

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- API Routes: `route.ts` (Next.js convention)
- Components: PascalCase with .tsx extension (e.g., `AuthProvider.tsx`, `Header.tsx`)
- Services: camelCase with "Service" suffix (e.g., `activeProjectService.ts`)
- Utilities: camelCase (e.g., `dateUtils.ts`, `documentUtils.ts`)
- Types: camelCase (e.g., `types.ts`)

**Directories:**
- Feature folders: kebab-case (e.g., `active-projects`, `request-service`)
- Dynamic routes: square brackets (e.g., `[id]`, `[token]`)
- Nested routes: lowercase (e.g., `portal/admin`, `api/create-quote`)

**Components:**
- Portal layouts: `[role]/layout.tsx` pattern (admin, customer, technician)
- Page components: Use PascalCase in subdirectories (e.g., `QuoteResults.tsx`, `ContratarFlow.tsx`)
- Shared UI: Lowercase with hyphen (e.g., `Button.tsx`, `Toast.tsx`)

**Services:**
- Pattern: Export singleton object with named methods
- Methods: camelCase (getAll, getById, create, update, delete, getByUserId)
- Example: `activeProjectService.ts` exports `ActiveProjectService` object

**Types:**
- Interfaces: PascalCase (e.g., `ActiveProject`, `ClientReference`)
- Type unions: PascalCase (e.g., `ProjectStatus`, `ServiceType`)
- Constants: UPPER_SNAKE_CASE (e.g., `PROJECT_STATUSES`, `SYSTEM_TYPES`)

## Where to Add New Code

**New Feature (complete flow):**
- Primary code: `app/[feature]/page.tsx` or `app/[feature]/page.tsx + app/[feature]/[Component].tsx`
- API endpoint: `app/api/[operation]/route.ts`
- Service logic: `app/services/[featureName]Service.ts`
- Types: Add to `lib/types.ts` with JSDoc comments
- Tests: Alongside component files as `[file].test.tsx` (when testing is added)

**New Component/Module:**
- UI Component: `components/[FeatureName].tsx` or `components/[category]/[FeatureName].tsx`
- Context Provider: `components/[ContextName]Provider.tsx`
- Admin-specific: `components/admin/[FeatureName].tsx`
- Technician-specific: `components/technician/[FeatureName].tsx`
- Shared UI (primitive): `components/ui/[ComponentName].tsx`

**Utilities:**
- Shared helpers: `lib/[domain]Utils.ts`
- Service implementations: `app/services/[domainName]Service.ts`
- Format: Export named functions or singleton objects

**Database Operations:**
- New table operations: Extend appropriate service in `app/services/`
- Complex queries: Create dedicated service or add method to existing service
- Admin operations: Use `supabaseAdmin` client in API routes to bypass RLS
- Client operations: Use regular `supabase` client for RLS-protected queries

**API Endpoints:**
- New endpoint: `app/api/[operation]/route.ts`
- Pattern: Export POST, GET, PUT, DELETE functions as needed
- Validation: Check required fields at top of handler
- Error handling: Return NextResponse with appropriate status codes
- Admin access: Use `supabase-admin` client for bypass operations
- Example: `/api/create-inquiry` validates fields, calls admin client, returns response

## Special Directories

**app/portal/**
- Purpose: Role-based authenticated portal areas
- Generated: No
- Committed: Yes
- Contents: Admin, customer, and technician dashboards with layouts and navigation
- Pattern: Each role has a layout wrapping all child routes for consistent navigation

**public/images/**
- Purpose: Static brand imagery and logos
- Generated: No
- Committed: Yes
- Contents: Hero images, brand assets, project photos
- Strategy: Large images optimized externally; use next/image for lazy loading

**supabase/migrations/**
- Purpose: Database schema version control
- Generated: No
- Committed: Yes
- Contents: SQL migration files for schema changes
- Pattern: Migrations named with timestamp and description (e.g., `20260128_add_users_table.sql`)

**.next/**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No
- Contents: Compiled JavaScript, static optimization files
- Note: Ignored in .gitignore; regenerated on build

**node_modules/**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No
- Contents: All installed packages
- Management: Use package-lock.json for reproducible installs

---

*Structure analysis: 2026-01-28*
