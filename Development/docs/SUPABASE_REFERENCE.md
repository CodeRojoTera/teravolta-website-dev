# TeraVolta Supabase Reference

Reference for Supabase Tables, Storage Buckets, and RLS Policies.

---

## Database Tables (PostgreSQL)

### `users`
User account information (synced with Auth).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Supabase Auth ID (PK) |
| `email` | text | User email |
| `full_name` | text | Display name |
| `phone` | text | Phone number |
| `company` | text | Company name (optional) |
| `role` | text | `super_admin`, `admin`, `customer`, `technician` |
| `created_at` | timestamptz | Account creation date |

**RLS**: Users read own. Admins read all.

---

### `technicians`
Technician profiles and availability.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | User ID (PK, FK to users.id) |
| `uid` | uuid | Linked Auth User ID |
| `name` | text | Technician full name |
| `email` | text | Contact email |
| `phone` | text | Contact phone |
| `specialties` | text[] | Array of skills (e.g. `smart_meter`, `audit`) |
| `is_active` | boolean | Active status |
| `created_at` | timestamptz | Creation date |

**RLS**: Public read (for specialized availability checks maybe?), Auth read default.

---

### `quotes`
Quote requests.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `client_name` | text | Client name |
| `client_email` | text | Client email |
| `client_phone` | text | Client phone |
| `service` | text | Service type |
| `monthly_bill` | text | Monthly energy bill range |
| `bill_files` | jsonb | File metadata |
| `status` | text | `pending`, `reviewed`, `converted` |
| `linked_project_id` | uuid | Associated project ID |
| `reviewed_at` | timestamptz | Date of review |
| `reviewed_by` | text | Admin email who reviewed |
| `created_at` | timestamptz | Submission date |

**RLS**: Public insert. Admins read all.

---

### `inquiries`
Service inquiries.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `full_name` | text | Client name |
| `email` | text | Client email |
| `phone` | text | Client phone |
| `company` | text | Company name |
| `service` | text | Service type |
| `project_description` | text | Content/Description |
| `address` | text | Project address |
| `city` | text | City |
| `state` | text | State/Province |
| `zip_code` | text | Zip Code |
| `preferred_contact` | text | `email`, `phone`, `whatsapp` |
| `timeline` | text | Desired timeline |
| `budget` | text | Estimated budget |
| `property_type` | text | `residential`, `commercial`, etc. |
| `attachments` | jsonb | File metadata |
| `status` | text | `new`, `in_progress`, `resolved` |
| `created_at` | timestamptz | Submission date |

**RLS**: Public insert. Admins read all.

---

### `active_projects`
Active client projects.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `user_id` | uuid | Owner ID |
| `client_name` | text | Client name |
| `client_email` | text | Client email |
| `client_phone` | text | Client phone |
| `client_company` | text | Client company (for B2B projects) |
| `address` | text | Installation address |
| `service` | text | Service type |
| `status` | text | `active`, `pending_installation`, etc. |
| `assigned_to` | uuid[] | Technician IDs (UUIDs) |
| `appointment_id` | uuid | Linked appointment |
| `scheduled_date` | date | Date |
| `scheduled_time` | time | Time |
| `phases` | jsonb | Payment milestones (Efficiency/Consulting) |
| `created_at` | timestamptz | Creation date |

**RLS**: Users read own. Admins read all.

---

### `electrical_boards`
Electrical panels identified during Efficiency inspections.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `appointment_id` | uuid | FK to appointments |
| `name` | text | Board Name/Location |
| `system_type` | text | `monophase`, `triphase`, etc. |
| `has_neutral` | boolean | Neutral wire presence |
| `emporia_classification` | text | `standard`, `special`, `incompatible` |
| `incompatibility_reason` | text | Reason if incompatible |
| `ct_status` | text | `fits`, `no_fit` |
| `ct_issue` | text | Issue details if no fit |
| `recommended_solution` | text | `standard`, `special_adapter`, `void` |
| `observations` | text | Tech notes |
| `photos` | text[] | Array of photo URLs |
| `created_at` | timestamptz | Creation date |
| `updated_at` | timestamptz | Last update |

**RLS**: Technicians (assigned) insert/update. Admins read all.

---

### `appointments`
Field service visits.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `project_id` | uuid | Related Project |
| `technician_id` | uuid | Assigned Tech (FK to `technicians.id`) |
| `date` | timestamptz | Appointment datetime |
| `status` | text | `scheduled`, `in_progress`, `completed` |
| `client_name` | text | Client info |
| `client_address` | text | Client info |
| `created_at` | timestamptz | Creation date |
| `check_in_time` | timestamptz | Tech check-in |
| `check_out_time` | timestamptz | Tech check-out |
| `photos` | text[] | Evidence photos |

---

### `user_settings`
User preferences (Notification, UI).

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | uuid | PK, FK to users |
| `preferences` | jsonb | JSON blob of settings |
| `updated_at` | timestamptz | Last update |

---

### `admin_inquiries` & `admin_requests`
Administrative workflows.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `requester_id` | uuid | Requesting User ID |
| `related_entity_id` | uuid | Linked Project/Technician ID |
| `type` | text | Request type |
| `status` | text | `pending`, `approved`, `rejected` |
| `payload` | jsonb | Additional data |

---

### `technician_leave_requests`
Technician availability/leave tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `technician_id` | uuid | FK to technicians |
| `start_date` | date | Start of leave |
| `end_date` | date | End of leave |
| `status` | text | `pending`, `approved`, `rejected` |
| `leave_type` | text | `vacation`, `sickness`, `other`, `unplanned`, `suspension` |
| `reason` | text | Reason for leave |
| `created_at` | timestamptz | Request date |

**RLS**: Technicians see own. Admins manage all.

---

### `reschedule_tokens`
Secure one-time-use tokens for customer self-rescheduling.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `appointment_id` | uuid | FK to appointments |
| `token` | uuid | Secure Public Token |
| `expires_at` | timestamptz | Expiration Time |
| `used_at` | timestamptz | Nullable. Consumption ts |
| `created_by` | uuid | Admin ID |
| `created_at` | timestamptz | Creation Time |

**RLS**: Public read (token index). Admins manage all.

**RLS**: Public read (token index). Admins manage all.

---

### `technician_reviews`
Customer ratings and reviews for technicians.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `technician_id` | uuid | FK to technicians |
| `project_id` | uuid | FK to active_projects |
| `reviewer_id` | uuid | FK to users (Customer) |
| `rating` | int | 1-5 Star Rating |
| `comment` | text | Optional feedback |
| `created_at` | timestamptz | Review date |

**RLS**: Customers insert (own). Everyone reads.

---

### `notifications`
In-app notifications for users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `user_id` | uuid | FK to users (recipient) |
| `type` | text | `info`, `success`, `warning`, `error` |
| `title` | text | Notification title |
| `message` | text | Notification body |
| `link` | text | Optional navigation link |
| `read` | boolean | Read status |
| `created_at` | timestamptz | Creation date |

**RLS**: Users read own. System inserts via API.

---

### `documents`
File/document metadata for all entities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `entity_type` | text | `active_projects`, `quotes`, `inquiries`, `users` |
| `entity_id` | uuid | FK to parent entity |
| `file_name` | text | Original filename |
| `file_url` | text | Storage URL |
| `file_size` | bigint | Size in bytes |
| `file_type` | text | MIME type |
| `category` | text | `bill`, `contract`, `evidence`, `other` |
| `uploaded_by` | uuid | FK to users |
| `created_at` | timestamptz | Upload date |

**RLS**: Users read own entity docs. Admins read all.

---

### `portfolio_projects`
Admin-managed portfolio showcase items.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `title` | text | Project title |
| `client` | text | Client name |
| `category` | text | `efficiency`, `consulting`, `advocacy` |
| `challenge` | text | Problem description |
| `solution` | text | Solution implemented |
| `result` | text | Outcome/results |
| `images` | text[] | Array of image URLs |
| `featured` | boolean | Featured on homepage |
| `published` | boolean | Publicly visible |
| `completed_at` | date | Completion date |
| `created_at` | timestamptz | Creation date |

**RLS**: Public read (if published). Admins manage all.

---

### `magic_links`
Onboarding magic link tokens.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `email` | text | Target user email |
| `token` | uuid | Secure token |
| `role` | text | Assigned role on activation |
| `expires_at` | timestamptz | Expiration time |
| `used_at` | timestamptz | Nullable - usage timestamp |
| `created_by` | uuid | Admin who created link |
| `created_at` | timestamptz | Creation date |

**RLS**: Public validate (by token). Admins create.

---

## Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `inquiries` | Yes | Inquiry attachments |
| `quotes` | Yes | Bill uploads |
| `projects` | No | Project documents (RLS protected) |
| `portfolio` | Yes | Portfolio images |
| `appointments` | Yes | Appointment evidence photos |

## Security Model
- **Auth**: Supabase Auth (Email/Password + Magic Links)
- **RLS**: Enabled on all tables.
- **Service Role**: Used in API routes (`supabaseAdmin`) for privileged operations (Creating users, Assigning techs).
- **Middleware**: `middleware.ts` protects `/portal/*` routes server-side.

