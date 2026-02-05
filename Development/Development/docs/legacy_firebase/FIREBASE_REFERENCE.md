# TeraVolta Firebase Reference

Quick reference for Firebase collections, storage paths, and security rules.

---

## Firestore Collections

### `users`
User account information.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Firebase Auth UID |
| `email` | string | User email |
| `fullName` | string | Display name |
| `phone` | string | Phone number |
| `company` | string | Company name (optional) |
| `role` | string | `super_admin`, `admin`, or `customer` |
| `createdAt` | timestamp | Account creation date |

**Security**: Read/write by authenticated users for own document. Admins can read all.

---

### `quotes`
Quote requests from potential clients.

| Field | Type | Description |
|-------|------|-------------|
| `clientName` | string | Client name |
| `clientEmail` | string | Client email |
| `clientPhone` | string | Client phone |
| `service` | string | Service type |
| `monthlyBill` | string | Monthly energy bill range |
| `billFiles` | array | Uploaded bill file metadata |
| `status` | string | `pending`, `reviewed`, `converted` |
| `linkedProjectId` | string | Associated project ID |
| `createdAt` | timestamp | Submission date |

**Security**: Public create. Authenticated read.

---

### `inquiries`
Service inquiry/contact form submissions.

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | string | Client name |
| `email` | string | Client email |
| `phone` | string | Client phone |
| `company` | string | Company name |
| `service` | string | Service type |
| `message` | string | Inquiry message |
| `attachments` | array | Uploaded file metadata |
| `status` | string | `new`, `in_progress`, `resolved` |
| `createdAt` | timestamp | Submission date |

**Security**: Public create. Authenticated read.

---

### `activeProjects`
Active client projects.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string/null | Associated user UID (null for orphan projects) |
| `clientName` | string | Client name |
| `clientEmail` | string | Client email |
| `clientPhone` | string | Client phone |
| `clientCompany` | string | Company name |
| `address` | string | Installation address |
| `service` | string | Service type |
| `package` | string | Selected package (for efficiency) |
| `status` | string | `pending_assignment`, `pending_installation`, `in_progress`, `active`, `paused`, `completed`, `cancelled`, `urgent_reschedule` |
| `paymentStatus` | string | `pending`, `partial`, `paid` |
| `sourceQuoteId` | string | Source quote ID |
| `sourceInquiryId` | string | Source inquiry ID |
| `appointmentId` | string | Linked appointment ID |
| `assignedTo` | array | IDs of assigned technicians |
| `scheduledDate` | string | Scheduled date YYYY-MM-DD |
| `scheduledTime` | string | Scheduled time HH:MM |
| `createdAt` | timestamp | Project creation date |

**Security**: Public create. Customers read own projects. Admins read all.

---

### `appointments`
Field service appointments.

| Field | Type | Description |
|-------|------|-------------|
| `projectId` | string | Associated project ID |
| `technicianId` | string | Assigned technician ID |
| `technicianUid` | string | Assigned technician Auth UID (for RLS) |
| `technicianName` | string | Technician name (denormalized) |
| `date` | timestamp | Date of appointment |
| `status` | string | `scheduled`, `on_route`, `in_progress`, `completed`, `cancelled` |
| `clientName` | string | Client name |
| `clientAddress` | string | Client address |
| `clientPhone` | string | Client phone |
| `notes` | string | Internal notes |
| `checkInTime` | timestamp | Tech check-in |
| `checkOutTime` | timestamp | Tech check-out |
| `createdAt` | timestamp | Creation date |

**Security**: Admins full access. Technicians read/update own.

---

### `magicLinks`
Onboarding invitation tokens.

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | Unique random token |
| `email` | string | Recipient email |
| `fullName` | string | Recipient name |
| `phone` | string | Recipient phone |
| `company` | string | Company name |
| `role` | string | `customer`, `admin`, or `super_admin` |
| `service` | string | Associated service |
| `inquiryId` | string | Source inquiry ID |
| `quoteId` | string | Source quote ID |
| `expiresAt` | timestamp | Expiration date (24h) |
| `used` | boolean | Whether link has been used |
| `usedAt` | timestamp | When link was used |
| `createdAt` | timestamp | Creation date |

**Security**: Server-side only via Admin SDK.

---

### `documents`
Project documents.

| Field | Type | Description |
|-------|------|-------------|
| `entityType` | string | `activeProjects`, `quotes`, etc. |
| `entityId` | string | Associated entity ID |
| `fileName` | string | Original file name |
| `storagePath` | string | Firebase Storage path |
| `downloadURL` | string | Public download URL |
| `contentType` | string | MIME type |
| `size` | number | File size in bytes |
| `uploadedBy` | string | Uploader UID |
| `uploadedAt` | timestamp | Upload date |

---

### `invoices`
Client invoices.

| Field | Type | Description |
|-------|------|-------------|
| `projectId` | string | Associated project ID |
| `userId` | string | Client UID |
| `amount` | number | Invoice amount |
| `currency` | string | Currency code |
| `status` | string | `pending`, `paid`, `overdue` |
| `dueDate` | timestamp | Payment due date |
| `paidAt` | timestamp | Payment date |
| `createdAt` | timestamp | Invoice creation date |

---

### `notifications`
System notifications for users.

| Field | Type | Description |
|-------|------|-------------|
| `recipientId` | string | Target user UID |
| `title` | string | Notification title |
| `message` | string | Notification content |
| `type` | string | `info`, `warning`, `success` |
| `read` | boolean | Whether it has been read |
| `createdAt` | timestamp | Notification date |

---

### `adminInquiries`
Internal inquiries from admins to super_admins.

| Field | Type | Description |
|-------|------|-------------|
| `requestedBy` | string | Admin UID |
| `subject` | string | Inquiry subject |
| `message` | string | Inquiry content |
| `status` | string | `open`, `closed` |
| `requestedAt` | timestamp | Submission date |

---

### `deletionRequests`
Requests to delete system entities.

| Field | Type | Description |
|-------|------|-------------|
| `requestedBy` | string | Admin UID |
| `entityType` | string | Type of entity to delete |
| `entityId` | string | ID of entity to delete |
| `reason` | string | Reason for deletion |
| `status` | string | `pending`, `approved`, `rejected` |
| `createdAt` | timestamp | Request date |

---

## Firebase Storage Structure

```
/
├── inquiries/
│   └── {inquiryId}/
│       └── {filename}           # Inquiry attachments
│
├── quotes/
│   └── {timestamp}_{filename}   # Quote bill files
│
└── projects/
    └── {projectId}/
        └── documents/
            └── {filename}       # Project documents

├── portfolio/
│   └── {timestamp}_{filename}   # Portfolio project images
```

---

## Security Rules Summary

### Firestore (`firestore.rules`)

```javascript
// Public create access
quotes            → allow create
inquiries         → allow create  
activeProjects    → allow create
magicLinks        → allow read, update (onboarding)
portfolioProjects → allow read

// Authenticated access
users             → read/write where uid == auth.uid
activeProjects    → read where userId == auth.uid OR clientId == auth.uid
documents         → read/write by admins, read by authenticated users
invoices          → read where userId == auth.uid
deletionRequests  → create if authenticated, read own
notifications     → read/update own

// Admin access
*                 → read/write if role === 'admin' || 'super_admin'
deletionRequests  → update by admin, delete by super_admin
adminInquiries    → read/write by admin (own) or super_admin (all)
```

### Storage (`storage.rules`)

```javascript
// Public access
/inquiries/**  → allow read, write
/quotes/**     → allow read, write

// Authenticated access
/projects/**   → allow read, write if authenticated
```

---

## Common Queries

### Get user's projects
```typescript
const projects = await getDocs(
  query(
    collection(db, 'activeProjects'),
    where('userId', '==', user.uid)
  )
);
```

### Get orphan projects (for onboarding)
```typescript
const orphans = await getDocs(
  query(
    collection(db, 'activeProjects'),
    where('clientEmail', '==', email),
    where('userId', '==', null)
  )
);
```

### Get documents for a project
```typescript
const docs = await getDocs(
  query(
    collection(db, 'documents'),
    where('entityType', '==', 'activeProjects'),
    where('entityId', '==', projectId)
  )
);
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Full technical architecture
- [User Flows](./USER_FLOWS.md) - User journey documentation
