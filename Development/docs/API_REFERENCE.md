# TeraVolta API Reference

> Complete documentation of all REST API endpoints.

---

## Overview

All API routes are located in `app/api/`. They use the Next.js App Router API route conventions.

### Authentication

| Endpoint Type | Auth Required | Client |
|--------------|---------------|--------|
| Public | No | `supabase` (anon) |
| Admin | Yes (Admin role) | `supabaseAdmin` (service role) |
| Privileged | Token-based | `supabaseAdmin` (service role) |

---

## Endpoints

### POST `/api/activate-account`

**Purpose:** Activate a user account from a magic link token. Links orphaned quotes/inquiries to the user.

**Auth:** Privileged (requires valid magic link token)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "newPassword123",
  "token": "uuid-magic-link-token",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid",
  "role": "customer"
}
```

**Side Effects:**
- Creates Supabase Auth user
- Creates `users` table record
- Links any `quotes` with matching email
- Links any `inquiries` with matching email
- Marks magic link as used

---

### POST `/api/assign-technician`

**Purpose:** Assign a technician to an active project.

**Auth:** Admin required

**Request Body:**
```json
{
  "projectId": "uuid",
  "technicianId": "uuid"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### GET `/api/availability`

**Purpose:** Get available appointment slots for technicians.

**Auth:** Public

**Query Parameters:**
- `date` (optional): Specific date (YYYY-MM-DD)
- `technicianId` (optional): Specific technician

**Response:**
```json
{
  "slots": [
    {
      "date": "2026-01-20",
      "time": "09:00",
      "available": true,
      "technicianId": "uuid"
    }
  ]
}
```

---

### POST `/api/create-magic-link`

**Purpose:** Generate an onboarding magic link for a user.

**Auth:** Admin required

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "customer",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "token": "uuid",
  "link": "https://teravolta.com/onboard/uuid",
  "expiresAt": "2026-01-17T00:00:00Z"
}
```

---

### POST `/api/create-notification`

**Purpose:** Create a notification for any user (bypasses RLS). Respects user preferences.

**Auth:** Privileged (service role)

**Request Body:**
```json
{
  "userId": "uuid",
  "type": "info",
  "title": "New Assignment",
  "message": "You have been assigned to a project.",
  "link": "/portal/technician"
}
```

**Response:**
```json
{
  "id": "uuid",
  "created": true
}
```

**Note:** Returns `{ "suppressed": true }` if user has disabled notifications for this type.

---

### POST `/api/create-project`

**Purpose:** Create an active project from a quote or inquiry.

**Auth:** Admin required

**Request Body:**
```json
{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "+1234567890",
  "service": "efficiency",
  "address": "123 Main St",
  "quoteId": "uuid",       // Optional - link to quote
  "inquiryId": "uuid"      // Optional - link to inquiry
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid"
}
```

**Side Effects:**
- Creates `active_projects` record
- Transfers documents from source quote/inquiry
- Updates quote/inquiry status to 'approved'
- Creates notification for user

---

### POST `/api/create-technician`

**Purpose:** Create a new technician profile and auth user.

**Auth:** Admin required

**Request Body:**
```json
{
  "email": "tech@example.com",
  "fullName": "Jane Tech",
  "phone": "+1234567890",
  "specialties": ["smart_meter", "audit"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "authId": "uuid"
}
```

---

### POST `/api/notify-existing-client`

**Purpose:** Send a notification to an existing client about project updates.

**Auth:** Admin required

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "Project Update",
  "message": "Your project status has changed.",
  "link": "/portal/customer/projects/uuid"
}
```

---

### POST `/api/resend-onboarding`

**Purpose:** Resend the onboarding email to a user.

**Auth:** Admin required

**Request Body:**
```json
{
  "email": "user@example.com",
  "userId": "uuid"
}
```

---

### POST `/api/send-email`

**Purpose:** Generic email sending endpoint (uses Resend API).

**Auth:** Internal use

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "html": "<h1>Email content</h1>",
  "text": "Plain text fallback"
}
```

**Note:** For preference-aware emails, use `EmailService.sendWithPreferenceCheck()` instead.

---

### POST `/api/send-invoice`

**Purpose:** Send an invoice email to a client.

**Auth:** Admin required

**Request Body:**
```json
{
  "projectId": "uuid",
  "invoiceNumber": "INV-2026-001",
  "amount": 1500.00,
  "dueDate": "2026-02-01"
}
```

---

### POST `/api/send-onboarding-email`

**Purpose:** Send the onboarding/welcome email with magic link.

**Auth:** Admin required

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "uuid-magic-link-token",
  "language": "en"
}
```

---

### POST `/api/update-user-password`

**Purpose:** Update password for a pre-existing auth user (during onboarding).

**Auth:** Privileged (requires valid magic link token)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "newPassword123",
  "token": "uuid-magic-link-token"
}
```

---

### POST `/api/verify-token`

**Purpose:** Validate a magic link token.

**Auth:** Public

**Request Body:**
```json
{
  "token": "uuid-magic-link-token"
}
```

**Response:**
```json
{
  "valid": true,
  "email": "user@example.com",
  "role": "customer",
  "fullName": "John Doe",
  "expiresAt": "2026-01-17T00:00:00Z"
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal failure |

---

## Related Documentation

- [Services Reference](./SERVICES_REFERENCE.md) - Client-side service layer
- [Supabase Reference](./SUPABASE_REFERENCE.md) - Database tables
- [Notification System](./NOTIFICATION_SYSTEM.md) - Notification details
