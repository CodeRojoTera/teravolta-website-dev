# TeraVolta Services Reference

> Documentation of the client-side service layer.

---

## Overview

Services are located in `app/services/`. They provide a clean abstraction over Supabase operations for use in React components.

### Client Usage

All services use the public Supabase client (`lib/supabase.ts`) and operate within RLS policies.

```typescript
import { ActiveProjectService } from '@/app/services/activeProjectService';
import { NotificationService } from '@/app/services/notificationService';
```

---

## ActiveProjectService

**File:** `app/services/activeProjectService.ts`

Manages active client projects.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getAll()` | - | `Promise<ActiveProject[]>` | Fetch all projects |
| `getById(id)` | `id: string` | `Promise<ActiveProject \| null>` | Fetch single project |
| `getByUserId(userId)` | `userId: string` | `Promise<ActiveProject[]>` | Fetch user's projects |
| `getByTechnicianId(techId)` | `techId: string` | `Promise<ActiveProject[]>` | Fetch technician's assigned projects |
| `create(data)` | `Omit<ActiveProject, 'id' \| 'createdAt'>` | `Promise<string>` | Create project, returns ID |
| `update(id, updates)` | `id: string, updates: Partial<ActiveProject>` | `Promise<void>` | Update project |
| `addTimelineEntry(projectId, entry)` | `projectId: string, entry: any` | `Promise<void>` | Add timeline/progress entry |
| `assignTechnicians(projectId, techIds)` | `projectId: string, techIds: string[]` | `Promise<void>` | Assign technicians (sends notifications) |
| `uploadDocument(file, entityType, entityId, category)` | `File, string, string, string` | `Promise<any>` | Upload to Storage + create record |
| `getDocuments(entityType, entityId)` | `string, string` | `Promise<any[]>` | Get documents for entity |
| `deleteDocument(docId, storagePath)` | `string, string` | `Promise<void>` | Delete document |

---

## AppointmentService

**File:** `app/services/appointmentService.ts`

Manages field service appointments.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `create(data)` | `Omit<Appointment, 'id' \| 'createdAt'>` | `Promise<string>` | Create appointment |
| `getByTechnician(techId)` | `techId: string` | `Promise<Appointment[]>` | Get by technician record ID |
| `getByTechnicianUid(uid)` | `uid: string` | `Promise<Appointment[]>` | Get by auth user ID |
| `getByProject(projectId)` | `projectId: string` | `Promise<Appointment[]>` | Get project appointments |
| `getByDate(dateString)` | `dateString: string` | `Promise<Appointment[]>` | Get by date (YYYY-MM-DD) |
| `update(id, data)` | `id: string, data: Partial<Appointment>` | `Promise<void>` | Update appointment |
| `updateStatus(id, status)` | `id: string, status: AppointmentStatus` | `Promise<void>` | Update status with timestamps |
| `addPhotoEvidence(id, photoUrl)` | `id: string, photoUrl: string` | `Promise<void>` | Add evidence photo |
| `reportIncident(appointmentId, reason, comment, techUid)` | Multiple | `Promise<{ outcome, newTechnician? }>` | Report incident, auto-reassign if possible |
| `reassign(appointmentId, newTechId, projectId)` | `string, string, string` | `Promise<void>` | Reassign to new tech (sends notification) |

### Status Types

```typescript
type AppointmentStatus = 'scheduled' | 'on_route' | 'in_progress' | 'completed' | 'cancelled';
```

---

## EmailService

**File:** `app/services/emailService.ts`

Email dispatch wrapper (uses Resend API via `/api/send-email`).

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `send(data)` | `{ to, subject, html?, text? }` | `Promise<any>` | Send email (no preference check) |
| `sendRescheduleLink(to, token, clientName, language)` | Multiple | `Promise<any>` | Send reschedule link email |
| `sendWithPreferenceCheck(userId, type, data)` | `userId: string, type: string, EmailData` | `Promise<any>` | Send only if user allows |

### Usage Example

```typescript
// For registered users - respects preferences
await EmailService.sendWithPreferenceCheck(userId, 'status_update', {
  to: email,
  subject: 'Project Update',
  html: '<p>Your project status changed.</p>'
});

// For guests or transactional - always sends
await EmailService.send({
  to: guestEmail,
  subject: 'Welcome',
  html: '<p>Welcome to TeraVolta!</p>'
});
```

---

## NotificationService

**File:** `app/services/notificationService.ts`

In-app notification system.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getUnreadCount(userId)` | `userId: string` | `Promise<number>` | Get unread count |
| `getNotifications(userId, limit?)` | `userId: string, limit?: number` | `Promise<Notification[]>` | Get user notifications |
| `markAsRead(notificationId)` | `notificationId: string` | `Promise<void>` | Mark single as read |
| `markAllAsRead(userId)` | `userId: string` | `Promise<void>` | Mark all as read |
| `shouldSend(userId, type, channel)` | `userId: string, type: string, channel: 'in_app' \| 'email'` | `Promise<boolean>` | Check user preferences |
| `create(notification)` | `Omit<Notification, 'id' \| 'created_at'>` | `Promise<void>` | Create notification (respects preferences) |

### Notification Types

```typescript
type NotificationType = 'info' | 'success' | 'warning' | 'error';
```

---

## QuoteService

**File:** `app/services/quoteService.ts`

Quote request management.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getAll()` | - | `Promise<Quote[]>` | Fetch all quotes |
| `getById(id)` | `id: string` | `Promise<Quote \| null>` | Fetch single quote |
| `create(data)` | `Omit<Quote, 'id' \| 'createdAt'>` | `Promise<string>` | Create quote |
| `updateStatus(id, status)` | `id: string, status: QuoteStatus` | `Promise<void>` | Update status |

### Quote Status

```typescript
type QuoteStatus = 'pending_review' | 'in_review' | 'approved' | 'rejected' | 'cancelled' | 'project_linked';
```

---

## RescheduleService

**File:** `app/services/rescheduleService.ts`

Customer self-rescheduling via secure tokens.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createToken(appointmentId, createdBy)` | `string, string` | `Promise<{ token, expiresAt }>` | Create reschedule token |
| `validateToken(token)` | `token: string` | `Promise<{ valid, appointment?, error? }>` | Validate token |
| `reschedule(token, newDate, newTime)` | `string, string, string` | `Promise<void>` | Perform reschedule |

---

## ReviewService

**File:** `app/services/reviewService.ts`

Technician review and rating system.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `submitReview(data)` | `{ technicianId, projectId, rating, comment }` | `Promise<void>` | Submit review |
| `getReviews(technicianId)` | `technicianId: string` | `Promise<Review[]>` | Get technician reviews |
| `requestReview(email, projectId, clientName, userId?)` | Multiple | `Promise<void>` | Send review request email (respects preferences) |

---

## TechnicianService

**File:** `app/services/technicianService.ts`

Technician profile and availability management.

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getAll()` | - | `Promise<Technician[]>` | Get all technicians |
| `getById(id)` | `id: string` | `Promise<Technician \| null>` | Get by record ID |
| `getByUid(uid)` | `uid: string` | `Promise<Technician \| null>` | Get by auth user ID |
| `create(data)` | `TechnicianData` | `Promise<string>` | Create technician |
| `update(id, data)` | `id: string, data: Partial<Technician>` | `Promise<void>` | Update technician |
| `getAvailability(techId, date)` | `string, string` | `Promise<Slot[]>` | Get available slots |
| `requestLeave(data)` | `LeaveRequestData` | `Promise<void>` | Submit leave request |

---

## Related Documentation

- [API Reference](./API_REFERENCE.md) - REST API endpoints
- [Supabase Reference](./SUPABASE_REFERENCE.md) - Database tables
- [Notification System](./NOTIFICATION_SYSTEM.md) - Notification details
