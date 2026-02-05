-- Migration: Allow service role to insert deletion audit rows
-- Phase: 01-foundation--data-integrity
-- Created: 2026-02-01

CREATE POLICY "Service role can insert deletion audit"
ON public.deletion_audit_log
FOR INSERT
TO service_role
WITH CHECK (true);
