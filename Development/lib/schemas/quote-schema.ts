/**
 * Quote form validation schemas
 * 
 * Discriminated union by service type with service-specific field requirements:
 * - efficiency: propertySize, booking fields, optional inspection request
 * - consulting: timeline, budget, projectDescription (REQUIRED)
 * - advocacy: claim fields (REQUIRED), no timeline/budget/projectDescription
 * 
 * Per WIZ-02: device_option and connectivity are INTENTIONALLY EXCLUDED.
 * These are collected AFTER inspection, not during quote submission.
 * 
 * Per CONTEXT.md Decision 2: Phases are admin-only, not collected in customer quotes.
 * 
 * @version 1.0.0
 * @created 2026-02-02
 */

import { z } from 'zod';
import { 
  PROPERTY_TYPES, 
  INSPECTION_REQUIRED_TYPES, 
  SERVICE_DOCUMENT_CATEGORIES,
  type PropertyType,
  type ServiceType,
} from './constants';

// ============================================================================
// Base Quote Schema (Common Fields)
// ============================================================================

/**
 * Common fields shared across all service types.
 * Every quote must have contact info, location, and property details.
 */
export const baseQuoteSchema = z.object({
  // Contact Information
  clientName: z.string().min(1, 'Name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().min(1, 'Phone number is required'),
  clientCompany: z.string().optional(),
  
  // Location
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  // Property
  propertyType: z.enum(PROPERTY_TYPES, {
    errorMap: () => ({ message: 'Please select a valid property type' }),
  }),
  
  // Optional Message
  message: z.string().optional(),
});

// ============================================================================
// Service-Specific Schemas
// ============================================================================

/**
 * Efficiency service quote schema.
 * 
 * Key exclusions per WIZ-02:
 * - device_option: Collected after inspection (customer doesn't know yet)
 * - connectivity: Collected after inspection (depends on site assessment)
 * 
 * Per EE-04: Optional inspection request flag for commercial properties.
 */
export const efficiencyQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('efficiency'),
  
  // Optional property details (helps with estimation)
  propertySize: z.string().optional(),
  operatingHours: z.string().optional(),
  
  // Optional booking (if customer wants to schedule inspection during quote)
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
  
  // Optional inspection request (EE-04)
  // For commercial properties, admin may require inspection
  inspectionRequested: z.boolean().optional(),
});

/**
 * Consulting service quote schema.
 * 
 * Per CONS-13, CONS-14: Requires timeline, budget, and project description.
 * Per CONTEXT.md Decision 2: Phases are defined by admin during pricing, not in quote.
 */
export const consultingQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('consulting'),
  
  // Required consulting-specific fields
  timeline: z.string().min(1, 'Timeline is required for consulting services'),
  budget: z.string().min(1, 'Budget is required for consulting services'),
  projectDescription: z.string().min(1, 'Project description is required'),
  
  // Note: propertySize NOT required for consulting (not relevant to most projects)
});

/**
 * Advocacy service quote schema.
 * 
 * Per ADVO-11: Requires claim-specific fields.
 * Per requirements: Does NOT collect timeline, budget, or projectDescription.
 * Advocacy claims focus on incident details and damage assessment.
 */
export const advocacyQuoteSchema = baseQuoteSchema.extend({
  service: z.literal('advocacy'),
  
  // Required advocacy-specific fields
  claimType: z.string().min(1, 'Claim type is required'),
  distributorCompany: z.string().min(1, 'Distributor company is required'),
  claimAmount: z.string().min(1, 'Claim amount is required'),
  incidentDate: z.string().min(1, 'Incident date is required'),
  damageDescription: z.string().min(1, 'Damage description is required'),
  
  // Note: timeline, budget, projectDescription intentionally excluded per requirements
});

// ============================================================================
// Discriminated Union
// ============================================================================

/**
 * Main quote validation schema using discriminated union.
 * 
 * TypeScript narrows the type based on the 'service' field:
 * - service: 'efficiency' → efficiencyQuoteSchema
 * - service: 'consulting' → consultingQuoteSchema
 * - service: 'advocacy' → advocacyQuoteSchema
 * 
 * This provides compile-time type safety AND runtime validation.
 */
export const quoteSchema = z.discriminatedUnion('service', [
  efficiencyQuoteSchema,
  consultingQuoteSchema,
  advocacyQuoteSchema,
]);

// ============================================================================
// TypeScript Type Exports
// ============================================================================

/**
 * Inferred TypeScript types from Zod schemas.
 * Use these for type-safe form handling with React Hook Form.
 */
export type QuoteFormData = z.infer<typeof quoteSchema>;
export type EfficiencyQuoteData = z.infer<typeof efficiencyQuoteSchema>;
export type ConsultingQuoteData = z.infer<typeof consultingQuoteSchema>;
export type AdvocacyQuoteData = z.infer<typeof advocacyQuoteSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines if inspection is required for efficiency service.
 * 
 * Per CONTEXT.md Decision 1:
 * - hotel, building, industrial = REQUIRED (commercial-scale)
 * - residential, apartment, small-business = OPTIONAL
 * 
 * Only applies to efficiency service. Other services don't have inspections.
 * 
 * @param propertyType - The type of property
 * @returns true if inspection is required, false if optional
 * 
 * @example
 * isInspectionRequired('hotel') // true
 * isInspectionRequired('residential') // false
 */
export function isInspectionRequired(propertyType: PropertyType): boolean {
  return INSPECTION_REQUIRED_TYPES.includes(propertyType);
}

/**
 * Returns allowed document categories for a service type.
 * 
 * Per SVC-01: Filter categories to prevent confusion.
 * Each service has specific document types that are relevant:
 * - efficiency: bills, meter readings, site plans
 * - consulting: contracts, reports, deliverables
 * - advocacy: adds claim evidence and regulatory filings
 * 
 * @param service - The service type
 * @returns Array of allowed document category strings
 * 
 * @example
 * getDocumentCategories('efficiency') // ['bill', 'invoice', 'meter_reading', ...]
 * getDocumentCategories('consulting') // ['contract', 'invoice', 'report', ...]
 */
export function getDocumentCategories(service: ServiceType): readonly string[] {
  return SERVICE_DOCUMENT_CATEGORIES[service];
}

/**
 * Determines if bill upload should be shown for a service.
 * 
 * Bill upload only shows for efficiency service, not consulting/advocacy.
 * Per EE-01 and success criteria #3.
 * 
 * @param service - The service type
 * @returns true if bill upload should be shown, false otherwise
 * 
 * @example
 * shouldShowBillUpload('efficiency') // true
 * shouldShowBillUpload('consulting') // false
 */
export function shouldShowBillUpload(service: ServiceType): boolean {
  return service === 'efficiency';
}
