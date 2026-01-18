# TeraVolta Documentation

> ⚠️ **Scope**: This documentation applies to the **full version** of the website located in `/Development/`. It does NOT apply to the static version in `/website static view dev/`.
>
> The only exception is `BRANDING.md` which applies to **both versions**.

Welcome to the TeraVolta website documentation.

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | Technical architecture, stack, and structure |
| [User Flows](./USER_FLOWS.md) | Detailed user journey documentation |
| [Supabase Reference](./SUPABASE_REFERENCE.md) | Database tables, storage, and RLS policies |
| [API Reference](./API_REFERENCE.md) | REST API endpoints documentation |
| [Services Reference](./SERVICES_REFERENCE.md) | Client-side service layer documentation |
| [Notification System](./NOTIFICATION_SYSTEM.md) | In-app and email notification system |
| [Branding Guidelines](./BRANDING.md) | Colors, typography, icons, and UI standards |
| [Deployment Checklist](../DEPLOYMENT_CHECKLIST.md) | Production deployment steps |

## Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase config:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - RESEND_API_KEY

# Run development server
npm run dev
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages and API routes |
| `app/api/` | REST API endpoints (14 endpoints) |
| `app/services/` | Client-side service layer (8 services) |
| `app/portal/` | Role-based dashboards (admin, customer, technician) |
| `components/` | Reusable React components |
| `lib/` | Utilities, types, and Supabase clients |
| `docs/` | This documentation |

## Quick Reference

### User Roles

| Role | Dashboard | Permissions |
|------|-----------|-------------|
| `super_admin` | `/portal/admin` | Full access to everything |
| `admin` | `/portal/admin` | Manage clients, projects, quotes |
| `technician` | `/portal/technician` | View assignments, update status, inspect boards |
| `customer` | `/portal/customer` | View own projects, documents, pending requests |

### Main User Flows

1. **Quote Request**: Public → `/quote` → Multi-step form → Admin review → Project creation
2. **Service Inquiry**: Public → `/inquiry/[service]` → Form → Admin review → Project conversion
3. **Onboarding**: Magic link → `/onboard/[token]` → Set password → Portal redirect
4. **Technician Inspection**: Login → View assignments → Start job → Board inspection → Complete

### Core Supabase Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (synced with Auth) |
| `quotes` | Quote requests from public form |
| `inquiries` | Service inquiries |
| `active_projects` | Active client projects |
| `appointments` | Field service visits |
| `electrical_boards` | Efficiency inspection data |
| `notifications` | In-app notification system |
| `documents` | File metadata |
| `user_settings` | User preferences (notification settings) |

### Authentication

- **Provider**: Supabase Auth (Email/Password + Magic Links)
- **Middleware**: `middleware.ts` protects `/portal/*` routes server-side
- **RLS**: Row Level Security enabled on all tables

## Need Help?

- Check the [Architecture](./ARCHITECTURE.md) for technical details
- See [User Flows](./USER_FLOWS.md) for journey documentation
- Review [Supabase Reference](./SUPABASE_REFERENCE.md) for database info
- See [API Reference](./API_REFERENCE.md) for endpoint documentation

