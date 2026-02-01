-- ============================================================================
-- CASCADE Constraints Migration
-- Purpose: Ensure proper cleanup on deletion, prevent orphaned records
-- Strategy: CASCADE for owned data, SET NULL for audit trail
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- APPOINTMENTS: CASCADE on project deletion, SET NULL on technician deletion
-- ----------------------------------------------------------------------------

-- appointments.project_id -> active_projects (CASCADE - appointment belongs to project)
ALTER TABLE public.appointments
DROP CONSTRAINT IF EXISTS appointments_project_id_fkey;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES public.active_projects(id)
ON DELETE CASCADE;

-- appointments.technician_id -> technicians (SET NULL - preserve appointment history)
ALTER TABLE public.appointments
DROP CONSTRAINT IF EXISTS appointments_technician_id_fkey;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_technician_id_fkey
FOREIGN KEY (technician_id)
REFERENCES public.technicians(id)
ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- DOCUMENTS: CASCADE on project deletion, SET NULL on user deletion
-- ----------------------------------------------------------------------------

-- documents.project_id -> active_projects (CASCADE - document belongs to project)
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_project_id_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES public.active_projects(id)
ON DELETE CASCADE;

-- documents.user_id -> users (SET NULL - preserve document history)
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_user_id_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- documents.uploaded_by -> users (SET NULL - preserve uploader history)
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_uploaded_by_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_uploaded_by_fkey
FOREIGN KEY (uploaded_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- documents.deleted_by -> users (SET NULL - preserve deletion audit trail)
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_deleted_by_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_deleted_by_fkey
FOREIGN KEY (deleted_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- INVOICES: CASCADE on user deletion (from public.users)
-- ----------------------------------------------------------------------------

-- invoices.user_id -> users (CASCADE - invoice belongs to user)
ALTER TABLE public.invoices
DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;

ALTER TABLE public.invoices
ADD CONSTRAINT invoices_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- ----------------------------------------------------------------------------
-- MAGIC_LINKS: CASCADE on quote/inquiry deletion
-- ----------------------------------------------------------------------------

-- magic_links.quote_id -> quotes (CASCADE - magic link belongs to quote)
ALTER TABLE public.magic_links
DROP CONSTRAINT IF EXISTS magic_links_quote_id_fkey;

ALTER TABLE public.magic_links
ADD CONSTRAINT magic_links_quote_id_fkey
FOREIGN KEY (quote_id)
REFERENCES public.quotes(id)
ON DELETE CASCADE;

-- magic_links.inquiry_id -> inquiries (CASCADE - magic link belongs to inquiry)
ALTER TABLE public.magic_links
DROP CONSTRAINT IF EXISTS magic_links_inquiry_id_fkey;

ALTER TABLE public.magic_links
ADD CONSTRAINT magic_links_inquiry_id_fkey
FOREIGN KEY (inquiry_id)
REFERENCES public.inquiries(id)
ON DELETE CASCADE;

-- ----------------------------------------------------------------------------
-- TECHNICIAN_REVIEWS: SET NULL to preserve review history
-- ----------------------------------------------------------------------------

ALTER TABLE public.technician_reviews
ALTER COLUMN project_id DROP NOT NULL;

ALTER TABLE public.technician_reviews
ALTER COLUMN technician_id DROP NOT NULL;

-- technician_reviews.project_id -> active_projects (SET NULL - preserve review even if project deleted)
ALTER TABLE public.technician_reviews
DROP CONSTRAINT IF EXISTS technician_reviews_project_id_fkey;

ALTER TABLE public.technician_reviews
ADD CONSTRAINT technician_reviews_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES public.active_projects(id)
ON DELETE SET NULL;

-- technician_reviews.reviewer_id -> users (SET NULL - preserve review even if reviewer deleted)
ALTER TABLE public.technician_reviews
DROP CONSTRAINT IF EXISTS technician_reviews_reviewer_id_fkey;

ALTER TABLE public.technician_reviews
ADD CONSTRAINT technician_reviews_reviewer_id_fkey
FOREIGN KEY (reviewer_id)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- technician_reviews.technician_id -> technicians (SET NULL - preserve review even if technician deleted)
ALTER TABLE public.technician_reviews
DROP CONSTRAINT IF EXISTS technician_reviews_technician_id_fkey;

ALTER TABLE public.technician_reviews
ADD CONSTRAINT technician_reviews_technician_id_fkey
FOREIGN KEY (technician_id)
REFERENCES public.technicians(id)
ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- USERS -> OWNED DATA: CASCADE on user deletion
-- ----------------------------------------------------------------------------

-- active_projects.user_id -> users (CASCADE)
ALTER TABLE public.active_projects
DROP CONSTRAINT IF EXISTS active_projects_user_id_fkey;

ALTER TABLE public.active_projects
ADD CONSTRAINT active_projects_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- quotes.user_id -> users (CASCADE)
ALTER TABLE public.quotes
DROP CONSTRAINT IF EXISTS quotes_user_id_fkey;

ALTER TABLE public.quotes
ADD CONSTRAINT quotes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- notifications.user_id -> users (CASCADE)
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- inquiries.user_id -> users (CASCADE)
ALTER TABLE public.inquiries
DROP CONSTRAINT IF EXISTS inquiries_user_id_fkey;

ALTER TABLE public.inquiries
ADD CONSTRAINT inquiries_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- admin_inquiries.requested_by -> users (SET NULL to preserve request)
ALTER TABLE public.admin_inquiries
ALTER COLUMN requested_by DROP NOT NULL;

ALTER TABLE public.admin_inquiries
DROP CONSTRAINT IF EXISTS admin_inquiries_requested_by_fkey;

ALTER TABLE public.admin_inquiries
ADD CONSTRAINT admin_inquiries_requested_by_fkey
FOREIGN KEY (requested_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- RESCHEDULE TOKENS: SET NULL on user deletion
-- ----------------------------------------------------------------------------

-- reschedule_tokens.created_by -> users (SET NULL)
ALTER TABLE public.reschedule_tokens
DROP CONSTRAINT IF EXISTS reschedule_tokens_created_by_fkey;

ALTER TABLE public.reschedule_tokens
ADD CONSTRAINT reschedule_tokens_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- Comments for documentation
-- ----------------------------------------------------------------------------

COMMENT ON CONSTRAINT appointments_project_id_fkey ON public.appointments IS 'CASCADE: appointments deleted when project deleted';
COMMENT ON CONSTRAINT appointments_technician_id_fkey ON public.appointments IS 'SET NULL: preserve appointment history when technician deleted';
COMMENT ON CONSTRAINT documents_project_id_fkey ON public.documents IS 'CASCADE: documents deleted when project deleted';
COMMENT ON CONSTRAINT documents_user_id_fkey ON public.documents IS 'SET NULL: preserve document when user deleted';
COMMENT ON CONSTRAINT documents_uploaded_by_fkey ON public.documents IS 'SET NULL: preserve document when uploader deleted';
COMMENT ON CONSTRAINT documents_deleted_by_fkey ON public.documents IS 'SET NULL: preserve deletion audit when user deleted';
COMMENT ON CONSTRAINT invoices_user_id_fkey ON public.invoices IS 'CASCADE: invoices deleted when user deleted';
COMMENT ON CONSTRAINT active_projects_user_id_fkey ON public.active_projects IS 'CASCADE: projects deleted when user deleted';
COMMENT ON CONSTRAINT quotes_user_id_fkey ON public.quotes IS 'CASCADE: quotes deleted when user deleted';
COMMENT ON CONSTRAINT notifications_user_id_fkey ON public.notifications IS 'CASCADE: notifications deleted when user deleted';
COMMENT ON CONSTRAINT inquiries_user_id_fkey ON public.inquiries IS 'CASCADE: inquiries deleted when user deleted';
COMMENT ON CONSTRAINT admin_inquiries_requested_by_fkey ON public.admin_inquiries IS 'SET NULL: preserve admin inquiry when requester deleted';
COMMENT ON CONSTRAINT reschedule_tokens_created_by_fkey ON public.reschedule_tokens IS 'SET NULL: preserve token when creator deleted';
COMMENT ON CONSTRAINT magic_links_quote_id_fkey ON public.magic_links IS 'CASCADE: magic links deleted when quote deleted';
COMMENT ON CONSTRAINT magic_links_inquiry_id_fkey ON public.magic_links IS 'CASCADE: magic links deleted when inquiry deleted';
COMMENT ON CONSTRAINT technician_reviews_project_id_fkey ON public.technician_reviews IS 'SET NULL: preserve review when project deleted';
COMMENT ON CONSTRAINT technician_reviews_reviewer_id_fkey ON public.technician_reviews IS 'SET NULL: preserve review when reviewer deleted';
COMMENT ON CONSTRAINT technician_reviews_technician_id_fkey ON public.technician_reviews IS 'SET NULL: preserve review when technician deleted';

COMMIT;
