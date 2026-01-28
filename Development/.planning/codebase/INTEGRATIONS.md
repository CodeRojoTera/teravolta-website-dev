# External Integrations

**Analysis Date:** 2026-01-28

## APIs & External Services

**Email Services:**
- Resend - Transactional email for invoice delivery and customer communications
  - SDK/Client: `resend` npm package (v6.6.0)
  - Auth: `RESEND_API_KEY` environment variable
  - Implementation: `app/api/send-email/route.ts` handles email sending
  - Used for: Invoice delivery, customer notifications, onboarding emails
  - Domain: Requires verified sender domain in production (not `resend.dev`)

**Email (Legacy/Backup):**
- Zoho Mail SMTP - Email notifications triggered by Firebase Cloud Functions
  - Client: `nodemailer` npm package (v6.9.13)
  - Host: smtp.zoho.com (port 465, SSL/TLS)
  - Auth: `ZOHO_EMAIL` and `ZOHO_PASSWORD` in Firebase functions config
  - Implementation: `functions/index.js` - Cloud Function triggered on Firestore inquiry creation
  - Trigger: `sendInquiryEmails` function on `inquiries/{inquiryId}` document creation
  - Emails sent: Admin notification + customer acknowledgment (bilingual: EN/ES)
  - Requirement: Firebase Blaze plan mandatory for outbound SMTP networking

**Maps & Geolocation:**
- Google Maps API - Location-based features for service areas and technician routing
  - SDK/Client: `@react-google-maps/api` npm package (v2.19.3)
  - Auth: API key (configuration location not detected in main codebase)
  - Implementation: Interactive map components in customer and admin portals

## Data Storage

**Databases:**
- Supabase PostgreSQL - Primary production database
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` (project URL)
  - Client: `@supabase/supabase-js` v2.90.0 for browser/client code
  - Client: `@supabase/ssr` v0.8.0 for Next.js SSR with cookie-based session management
  - Server Admin: `createClient()` with `SUPABASE_SERVICE_ROLE_KEY` in API routes
  - Auth Provider: Supabase Auth (magic links, email-based authentication)
  - Tables (inferred from API routes): `inquiries`, `quotes`, `users`, `projects`, `technicians`, `appointments`, `notifications`
  - Row Level Security (RLS): Enforced via auth policies (admin client bypasses RLS)

**File Storage:**
- Supabase Storage - Document uploads from inquiries
  - Access: Via Supabase client with auth tokens
  - Usage: Attachment storage for inquiry forms (referenced in Firebase function as downloadURL links)
  - Bucket pattern: Not explicitly named in examined code

**Caching:**
- None detected - Direct database queries without Redis or Memcached

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Custom email/magic-link based authentication
  - Implementation: OAuth-less email magic links via `create-magic-link/route.ts`
  - User activation flow: `activate-account/route.ts` handles account creation and confirmation
  - Admin operations: Service role key in `lib/supabase-admin.ts` for account creation/updates
  - Session management: Cookie-based via `@supabase/ssr` for Next.js SSR
  - User roles: Inferred from codebase: `admin`, `customer`, `technician`

## Monitoring & Observability

**Error Tracking:**
- Not detected in production use
- @opentelemetry/api 1.9.0 included but not fully integrated (partial instrumentation)

**Logs:**
- Console logging via `console.log()` and `console.error()`
- Firebase Cloud Functions: `functions:log` command available
- No centralized logging service detected

## CI/CD & Deployment

**Hosting:**
- Frontend: Likely Vercel (implicit via Next.js 15.3.2 defaults)
- Backend Functions: Firebase Cloud Functions (deployed via `firebase deploy --only functions`)
- Database: Supabase (cloud-hosted PostgreSQL)

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other CI service configuration found

**Deployment Commands:**
- Frontend: `npm run build` (Next.js compilation)
- Functions: `firebase deploy --only functions` from `functions/package.json`
- Functions local testing: `firebase emulators:start --only functions`
- Functions shell: `firebase functions:shell`

## Environment Configuration

**Required env vars (Frontend - `.env.local`):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-side only)
- `RESEND_API_KEY` - Resend email API key

**Required env vars (Functions - Firebase config or `.env`):**
- `ZOHO_EMAIL` - Sender email address (info@teravolta.com)
- `ZOHO_PASSWORD` - Zoho app password (must have Firebase Blaze plan)

**Environment Loading:**
- `dotenv` package for loading `.env.local` in development
- Next.js built-in env support for `NEXT_PUBLIC_*` prefix (exposed to browser)

**Secrets location:**
- `.env.local` - Local development (Git-ignored)
- Firebase Functions Config - Set via `firebase functions:config:set` or `.env` file
- Production: Vercel Environment Secrets (inferred), Firebase Functions Config (cloud-stored)

## Webhooks & Callbacks

**Incoming:**
- Firestore trigger: `sendInquiryEmails` - Triggered when inquiry document created
  - Path: `inquiries/{inquiryId}`
  - Action: Sends emails to admin and customer
  - Database: Firestore (part of Firebase, separate from Supabase)

**Outgoing:**
- Magic link emails - Sent to user email for authentication
- Invoice documents - Sent via Resend to customer email
- Inquiry confirmations - Sent via Zoho SMTP to customer email
- Admin notifications - Sent via Zoho SMTP to ops email
- No webhooks to external systems detected

## Data Synchronization

**Multi-Database Pattern (Detected):**
- Supabase PostgreSQL - Primary relational database for core app data (users, projects, quotes, technicians)
- Firestore (Firebase) - Secondary document store for inquiries with cloud function triggers
- Limitation: Data split across two systems; no detected synchronization mechanism between them
- Risk: Inquiry data in Firestore not automatically mirrored to Supabase

---

*Integration audit: 2026-01-28*
