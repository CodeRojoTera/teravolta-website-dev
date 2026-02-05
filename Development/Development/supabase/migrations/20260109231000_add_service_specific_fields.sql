-- Migration: Add service-specific fields to active_projects
-- Date: 2026-01-09
-- Purpose: Store property, device, and service details from quotes/inquiries

-- Property and location fields
ALTER TABLE active_projects
ADD COLUMN IF NOT EXISTS property_type text,
ADD COLUMN IF NOT EXISTS property_size text,
ADD COLUMN IF NOT EXISTS monthly_bill text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip_code text;

-- Efficiency-specific fields
ALTER TABLE active_projects
ADD COLUMN IF NOT EXISTS connectivity_type text,
ADD COLUMN IF NOT EXISTS device_option text;

-- Consulting/Advocacy fields
ALTER TABLE active_projects
ADD COLUMN IF NOT EXISTS timeline text,
ADD COLUMN IF NOT EXISTS budget text,
ADD COLUMN IF NOT EXISTS project_description text;

-- Source tracking
ALTER TABLE active_projects
ADD COLUMN IF NOT EXISTS source_quote_id uuid,
ADD COLUMN IF NOT EXISTS source_inquiry_id uuid;

-- Add comments for documentation
COMMENT ON COLUMN active_projects.property_type IS 'Type of property: residential, apartment, small-business, office, industrial';
COMMENT ON COLUMN active_projects.connectivity_type IS 'Efficiency: wifi or 3g';
COMMENT ON COLUMN active_projects.device_option IS 'Efficiency: purchase or rent';
COMMENT ON COLUMN active_projects.source_quote_id IS 'Link to original quote (Efficiency flow)';
COMMENT ON COLUMN active_projects.source_inquiry_id IS 'Link to original inquiry (Consulting/Advocacy flow)';
