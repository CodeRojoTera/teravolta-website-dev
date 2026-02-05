# Technology Stack

**Analysis Date:** 2026-01-28

## Languages

**Primary:**
- JavaScript (ES2017+) - Next.js/React frontend and API routes
- TypeScript 5 - Strict typing throughout codebase with `@types/*` packages

**Secondary:**
- None detected

## Runtime

**Environment:**
- Node.js 20 - Required version specified in `functions/package.json` engines
- Next.js 15.3.2 - React meta-framework for SSR, SSG, and API routes
- React 19 - UI library with latest hooks API

**Package Manager:**
- npm - Primary package manager
- Lockfiles: `package-lock.json` (root and functions/)

## Frameworks

**Core:**
- Next.js 15.3.2 - Full-stack React framework with API routes at `app/api/**`
- React 19.0.0 - Component-based UI library
- React DOM 19.0.0 - React rendering target for web

**UI & Visualization:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- PostCSS 8.5.5 - CSS processing tool
- Recharts 3.0.2 - React chart library for dashboards (used in `app/portal/admin/page.tsx`)

**Form & Input:**
- React Phone Number Input 3.4.14 - Phone number input validation and formatting

**Utilities:**
- date-fns 4.1.0 - Date manipulation (parsing, formatting, locale support with `es` and `enUS` locales)
- uuid 13.0.0 - Universally unique identifier generation for quotes, inquiries, and data records

**Maps & Location:**
- @react-google-maps/api 2.19.3 - Google Maps integration for location-based features

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.90.0 - Main database and auth client
- @supabase/ssr 0.8.0 - Server-side rendering support for Supabase sessions with cookie handling
- Resend 6.6.0 - Transactional email service API
- firebase-admin 13.6.0 - Firebase Admin SDK for Cloud Functions
- firebase-functions 7.0.2 - Firebase Cloud Functions framework for backend automation

**Infrastructure:**
- dotenv 17.2.3 - Environment variable loading from `.env.local`
- @opentelemetry/api 1.9.0 - Observability instrumentation API (partial integration detected)

**Dev Tools:**
- TypeScript 5 - Type checking and compilation
- ESLint 9.39.2 - Code linting with Next.js config
- autoprefixer 10.4.21 - CSS vendor prefix automation
- @tailwindcss/postcss 4 - Tailwind CSS PostCSS plugin
- cross-env 7.0.3 - Cross-platform environment variable setting

## Configuration

**Environment:**
- `.env.local` - Local development environment variables (Git-ignored, contains secrets)
  - `RESEND_API_KEY` - Resend email service API key
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin/service role key (sensitive)

- `functions/.env` - Firebase Functions environment
  - `ZOHO_EMAIL` - Zoho Mail SMTP sender email
  - `ZOHO_PASSWORD` - Zoho Mail SMTP app password (requires Firebase Blaze plan for outbound SMTP)

**Build:**
- `tsconfig.json` - TypeScript compiler config with:
  - Target: ES2017
  - Module: esnext with bundler resolution
  - Path alias: `@/*` maps to project root
  - Strict mode enabled
- `next.config.ts` - Next.js config with:
  - Image optimization disabled (`unoptimized: true`)
  - TypeScript errors ignored during build
  - ESLint ignored during build
  - Output mode: Dynamic (not static export, allows dynamic routes)
- `eslint.config.mjs` - ESLint configuration extending Next.js core-web-vitals with any-type enforcement disabled

## Platform Requirements

**Development:**
- Node.js 20+
- npm 10+ (inferred from Next.js 15 requirements)
- Windows/Linux/macOS compatible
- Supabase project with configured URL and keys

**Production:**
- Deployment: Vercel (implicit via Next.js 15.3.2 defaults) or self-hosted Node.js 20 environment
- Firebase project with Blaze pricing plan (required for Cloud Functions with outbound networking)
- Supabase PostgreSQL database
- Resend account with verified sender domain
- Zoho Mail account with app password configured

---

*Stack analysis: 2026-01-28*
