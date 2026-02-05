-- Migration: Universal Hierarchical RLS Security Patch & Technician Overhaul
-- Date: 2026-01-09
-- Purpose: 
-- 1. Add vacation_quota to technicians.
-- 2. Define Super Admin vs Admin hierarchy.
-- 3. Dynamically apply RLS to ALL public tables with role-based restrictions.

-- ==========================================
-- 1. TECHNICIAN SCHEMA UPDATES
-- ==========================================
ALTER TABLE public.technicians 
ADD COLUMN IF NOT EXISTS vacation_quota INTEGER DEFAULT 15;

COMMENT ON COLUMN public.technicians.vacation_quota IS 'Annual vacation days allowed for the technician';

-- ==========================================
-- 2. ROLE-BASED PERMISSION FUNCTIONS
-- ==========================================

-- Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is at least Admin (includes Super Admin)
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. DYNAMIC UNIVERSAL RLS PROTECTION
-- ==========================================
DO $$ 
DECLARE 
    r RECORD;
    is_sensitive BOOLEAN;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        -- 1. Enable RLS
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
        
        -- 2. Clear old Management Policies
        EXECUTE 'DROP POLICY IF EXISTS "Admins manage all" ON public.' || quote_ident(r.tablename) || ';';
        EXECUTE 'DROP POLICY IF EXISTS "Super Admins manage all" ON public.' || quote_ident(r.tablename) || ';';
        EXECUTE 'DROP POLICY IF EXISTS "Admins limited management" ON public.' || quote_ident(r.tablename) || ';';
        
        -- 3. Apply Hierarchical Policies
        
        -- POLICY: Super Admins can do EVERYTHING on EVERY table
        EXECUTE 'CREATE POLICY "Super Admins manage all" ON public.' || quote_ident(r.tablename) || 
                ' FOR ALL USING (public.is_super_admin());';

        -- Determine if table is sensitive (Only Super Admin can Update/Delete)
        -- 'users' and 'admin_inquiries' are sensitive.
        is_sensitive := (r.tablename IN ('users', 'admin_inquiries', 'admin_requests'));

        IF is_sensitive THEN
            -- Admins can only READ sensitive tables (No Insert/Update/Delete)
            EXECUTE 'CREATE POLICY "Admins limited management" ON public.' || quote_ident(r.tablename) || 
                    ' FOR SELECT USING (public.is_admin_or_super());';
        ELSE
            -- Admins can manage OPERATIONAL tables fully
            EXECUTE 'CREATE POLICY "Admins limited management" ON public.' || quote_ident(r.tablename) || 
                    ' FOR ALL USING (public.is_admin_or_super());';
        END IF;
        
    END LOOP;
END $$;

-- 4. Re-grant specific self-service rights for safety (Post-dynamic sweep)
-- Some tables need specific user-level access that was defined in previous migrations
-- We don't overwrite them here, but we should ensure they aren't blocked by the "FOR ALL" of admins
-- Actually, RLS policies are permissive (OR), so adding more policies is fine.
