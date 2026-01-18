# Unified Service Request System - Implementation Plan

## Goal
Simplify the admin workflow by removing manual email replies from the dashboard and implementing an automated onboarding + invoicing system.

---

## Phase 1: Simplify Inquiry/Quote Dashboard

### Changes to Inquiries Module
- [ ] Remove "Reply via Email" button and modal
- [ ] Add "Contacted" status (manual toggle)
- [ ] Add "Internal Notes" field (textarea for admin notes)
- [ ] Simplify statuses: `pending` → `contacted` → `completed`
- [ ] Add "Complete & Send Onboarding" button

### Changes to Quotes Module
- [ ] Create unified view with 2 cards: "Inquiries" + "Specialized Quotes"
- [ ] Add same statuses: `pending` → `contacted` → `accepted`
- [ ] Add "Accept & Send Onboarding" button

---

## Phase 2: Automated Onboarding Flow

### Magic Link System
- [ ] Create `/api/create-magic-link` route
- [ ] Generate unique token + expiry (24h)
- [ ] Store in Firestore `magicLinks` collection

### Onboarding Email
- [ ] Create email template with magic link
- [ ] Send via Resend when admin clicks "Complete" or "Accept"
- [ ] Include: Welcome message, link to set password, service info

### Account Creation Page
- [ ] Create `/onboard/[token]` route
- [ ] Validate token
- [ ] Pre-fill client data (name, email, phone)
- [ ] Client only sets password
- [ ] Auto-create user in Firebase Auth + Firestore

### Auto-Create Project
- [ ] On account creation, auto-create `activeProject`
- [ ] Link to original inquiry/quote
- [ ] Set initial status: "En Progreso"

---

## Phase 3: Payment & Invoice System

### Payment Status
- [ ] Add `paymentStatus` field to projects: `pending` | `paid`
- [ ] Add toggle button in project detail view

### Invoice Upload
- [ ] Add `invoiceType` field: `digital` | `physical`
- [ ] Create file upload component
- [ ] Store in Firebase Storage: `invoices/{projectId}/`
- [ ] Save metadata in Firestore

### Invoice Delivery Logic
| Type | Action |
|------|--------|
| Digital | Upload → Send via Resend → Mark as sent |
| Physical | Upload → Mark as "Delivered Physically" → Store only |

### Client Access
- [ ] Show invoice in Customer Portal project detail
- [ ] Download button for PDF/image

---

## Phase 4: Energy Efficiency Payment + Scheduling

### Payment Flow
- [ ] Add payment button after quote generation (Stripe)
- [ ] Process payment
- [ ] Auto-create account + project

### Scheduling System
- [ ] After payment, show calendar/date picker for technician visit
- [ ] Store `scheduledVisitDate` in project
- [ ] Send confirmation email with date

### Customer Portal View
- [ ] Show project details including:
  - Service type
  - Payment status
  - **Scheduled visit date/time**
  - Project progress
- [ ] Allow rescheduling (optional)

### Invoice Generation
- [ ] Auto-generate invoice after payment
- [ ] Send to client via Email or store for physical delivery

---

## Technical Requirements

### New Collections/Fields

```
inquiries/{id}
  └── status: 'pending' | 'contacted' | 'completed'
  └── internalNotes: string
  └── linkedProjectId: string (after completion)

quotes/{id}
  └── status: 'pending' | 'contacted' | 'accepted'
  └── internalNotes: string
  └── linkedProjectId: string (after acceptance)

magicLinks/{token}
  └── email: string
  └── inquiryId | quoteId: string
  └── createdAt: timestamp
  └── expiresAt: timestamp
  └── used: boolean

activeProjects/{id}
  └── paymentStatus: 'pending' | 'paid'
  └── invoiceType: 'digital' | 'physical' | null
  └── invoiceUrl: string (Storage path)
  └── invoiceSentAt: timestamp | null
```

### New API Routes
- `POST /api/create-magic-link`
- `POST /api/send-onboarding-email`
- `POST /api/send-invoice`

### New Pages
- `/onboard/[token]` - Password setup page

### Environment Variables
- `RESEND_API_KEY` ✅ (already configured)

---

## Verification Plan

### Manual Tests
1. Create test inquiry → Mark contacted → Add notes → Complete → Verify email sent
2. Click magic link → Set password → Verify account created
3. Verify project auto-created and linked
4. Upload invoice (digital) → Verify email sent to client
5. Upload invoice (physical) → Verify stored but not sent
6. Login as client → Verify invoice visible in portal

---

## Priority Order

1. ✅ Fix Resend API key (immediate)
2. Phase 1: Dashboard simplification
3. Phase 2: Onboarding flow
4. Phase 3: Invoice system
5. Phase 4: Payment integration (future)

---

**Estimated Time:** 6-8 hours for Phases 1-3

---

## Phase 5: Field Service Management (Future)

> **Nuevo Rol:** Técnico - usuarios de campo que realizan instalaciones

### Technician Role Setup
- [ ] Add `technician` role to user system
- [ ] Create `/dev/technician` dashboard
- [ ] Mobile-optimized layout
- [ ] Limited permissions (only assigned projects)

### Work Assignment
- [ ] Admin assigns technician to project
- [ ] Technician sees assigned jobs in their dashboard
- [ ] Show client address, scheduled date, service details

### Check-in/Check-out System
- [ ] "Llegué" button → Records timestamp + optional GPS
- [ ] "Terminé" button → Records completion timestamp
- [ ] Calculate total time on site

### Work Report Form
- [ ] Description of work performed
- [ ] Photo upload (multiple images)
- [ ] Work status: `completed` | `incomplete`
- [ ] If incomplete: reason field (required)

### Incomplete Work Flow
```
Technician marks incomplete → System notifies admins →
Admin reviews and decides → System sends reschedule link →
Client picks new date → New visit assigned to technician
```

### Database Changes
```
users/{id}
  └── role: 'admin' | 'super_admin' | 'customer' | 'technician'

activeProjects/{id}
  └── assignedTechnician: userId
  └── visits: [
        {
          scheduledDate: timestamp,
          checkIn: timestamp,
          checkOut: timestamp,
          status: 'completed' | 'incomplete',
          report: { description, photos[], incompleteReason? }
        }
      ]
```

### Estimated Time: +10-15 hours
