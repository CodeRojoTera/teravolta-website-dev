# Unified Service Request System

## Phase 0: Cleanup
- [x] Fix Resend API key in `.env.local`
- [x] Remove Reply Modal from inquiry detail page
- [ ] Test email sending works

## Phase 1: Dashboard Simplification
- [x] Add "Contacted" status to inquiries
- [x] Add "Internal Notes" field
- [x] Update status options: pending → contacted → completed
- [x] Create unified view with Inquiries + Quotes cards

## Phase 2: Onboarding Flow
- [x] Create magic link API route
- [x] Create onboarding email template
- [x] Create `/onboard/[token]` page
- [x] Auto-create user account
- [x] Auto-create linked project

## Phase 3: Invoice System
- [x] Add payment status to projects
- [x] Create invoice upload component (Firebase Storage)
- [x] Implement digital invoice email (UI ready, API pending)
- [x] Implement physical invoice storage (Firebase Storage)
- [x] Add invoice view to customer portal

## Phase 4: Energy Efficiency Payments
> ⚠️ **NOTA:** Pago simulado - Implementar Stripe antes de producción

- [x] Stripe integration (SIMULATED for dev)
- [x] Auto-account creation on payment
- [x] Scheduling system for technician visit
- [x] Customer portal shows scheduled date

## Phase 5: Field Service Management (Future)
> **Rol:** Técnico - nuevo tipo de usuario para trabajo de campo

### Dashboard de Técnico
- [ ] Crear rol `technician` en sistema
- [ ] Dashboard simplificado `/dev/technician`
- [ ] Vista móvil optimizada
- [ ] Ver solo trabajos asignados

### Flujo de Trabajo
- [ ] Check-in al llegar (timestamp automático)
- [ ] Check-out al terminar (timestamp automático)
- [ ] Formulario de reporte:
  - Descripción del trabajo
  - Fotos del trabajo realizado
  - Estado: Completado / Incompleto

### Manejo de Trabajo Incompleto
- [ ] Notificar a admins automáticamente
- [ ] Admin evalúa y toma medidas
- [ ] Sistema envía link de re-agendamiento al cliente
- [ ] Cliente selecciona nueva fecha
- [ ] Técnicos regresan a completar
