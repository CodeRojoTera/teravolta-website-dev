/**
 * Shared constants for quote and project wizards
 * 
 * Single source of truth for:
 * - Property type options (all 4 wizards)
 * - Document categories (service-specific filtering)
 * - Inspection requirements (efficiency service)
 * 
 * @version 1.0.0
 * @created 2026-02-02
 */

// ============================================================================
// Property Types
// ============================================================================

/**
 * All supported property types across the platform.
 * Used in all quote wizards and manual project creation.
 * 
 * Per WIZ-01: All 4 wizards must use these exact 6 options.
 */
export const PROPERTY_TYPES = [
  'residential',
  'apartment',
  'small-business',
  'hotel',
  'building',
  'industrial',
] as const;

/**
 * TypeScript type derived from PROPERTY_TYPES constant.
 * Provides compile-time validation for property type values.
 */
export type PropertyType = typeof PROPERTY_TYPES[number];

/**
 * Bilingual labels for property types with Remix Icons.
 * Used for dropdowns, cards, and display throughout the app.
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, { en: string; es: string; icon: string }> = {
  residential: {
    en: 'Residential',
    es: 'Residencial',
    icon: 'ri-home-line',
  },
  apartment: {
    en: 'Apartment',
    es: 'Apartamento',
    icon: 'ri-building-line',
  },
  'small-business': {
    en: 'Small Business',
    es: 'Pequeña Empresa',
    icon: 'ri-store-line',
  },
  hotel: {
    en: 'Hotel',
    es: 'Hotel',
    icon: 'ri-hotel-line',
  },
  building: {
    en: 'Building / Common Areas',
    es: 'Edificio / Áreas Comunes',
    icon: 'ri-building-2-line',
  },
  industrial: {
    en: 'Industrial',
    es: 'Industrial',
    icon: 'ri-building-4-line',
  },
};

// ============================================================================
// Service Types
// ============================================================================

/**
 * Service types offered by Teravolta.
 * Determines which fields are shown/required in wizards.
 */
export type ServiceType = 'efficiency' | 'consulting' | 'advocacy';

// ============================================================================
// Document Categories
// ============================================================================

/**
 * Allowed document categories filtered by service type.
 * Per SVC-01: Prevent confusion by only showing relevant categories.
 * 
 * Usage:
 * - efficiency: Collects utility bills, meter readings, site plans
 * - consulting: Collects contracts, reports, deliverables
 * - advocacy: Adds claim evidence and regulatory filings
 */
export const SERVICE_DOCUMENT_CATEGORIES: Record<ServiceType, readonly string[]> = {
  efficiency: [
    'bill',
    'invoice',
    'meter_reading',
    'site_plan',
    'payment_proof',
    'other',
  ] as const,
  consulting: [
    'contract',
    'invoice',
    'report',
    'deliverable',
    'rfp',
    'payment_proof',
    'other',
  ] as const,
  advocacy: [
    'contract',
    'invoice',
    'report',
    'deliverable',
    'payment_proof',
    'claim_evidence',
    'regulatory_filing',
    'other',
  ] as const,
};

// ============================================================================
// Inspection Requirements
// ============================================================================

/**
 * Property types that REQUIRE inspection for efficiency service.
 * 
 * Per CONTEXT.md Decision 1:
 * - Commercial-scale properties (hotel, building, industrial): REQUIRED
 * - Smaller properties (residential, apartment, small-business): OPTIONAL
 * 
 * Only applies to efficiency service. Consulting and advocacy don't have inspections.
 */
export const INSPECTION_REQUIRED_TYPES: readonly PropertyType[] = [
  'hotel',
  'building',
  'industrial',
] as const;
