---
status: investigating
trigger: "Phase 2 UAT - Issue Diagnosis (5 issues)"
created: 2026-02-02T00:00:00Z
updated: 2026-02-02T00:00:00Z
---

## Current Focus
hypothesis: Analyzing 5 reported UAT issues systematically
test: Code review and schema comparison
expecting: Root cause analysis for each issue
next_action: Complete analysis of all 5 issues and document findings

## Symptoms

### Issue 1: Industrial Property Type Missing Icon
- expected: All 6 property types should have icons
- actual: Industrial card appears blank/no icon
- location: PropertyTypeSelector component, /quote step 2
- code_location: components/wizards/shared/PropertyTypeSelector.tsx

### Issue 2: RLS Policy Blocks Document Upload
- expected: Quote submission should complete successfully with valid inspection booking details
- actual: Upload fails with 401 Unauthorized, "new row violates row-level security policy for table \"documents\""
- error: POST to documents table fails
- code_location: lib/documentUtils.ts:200 (uploadDocument function)

### Issue 3: Time Picker Shows Minutes Instead of Hours
- expected: Hour-level granularity for inspection scheduling
- actual: Time picker allows minute selection (--:-- format)
- location: app/quote/page.tsx, step 4
- code_location: Line 895, type="time" input

### Issue 4: Inspection Scheduling Step Doesn't Skip When Not Requested
- expected: Skip step 4 when inspectionRequested checkbox is unchecked
- actual: Step 4 still shown when residential + checkbox unchecked
- location: app/quote/page.tsx, step 4 rendering
- code_location: Line 872

### Issue 5: "Installation Address" Label Wrong for Non-Efficiency Services
- expected: Service-specific labels: "Installation Address" for efficiency only, "Address" for consulting/advocacy
- actual: All services show "Installation Address"
- location: ManualProjectWizard.tsx
- code_location: Line 260 (en), Line 300 (es)

## Evidence

### Issue 1: Industrial Property Icon
- File: lib/schemas/constants.ts lines 40-73
- Finding: PROPERTY_TYPE_LABELS defines icon for industrial with 'ri-factory-line'
- File: components/wizards/shared/PropertyTypeSelector.tsx lines 44-58
- Finding: Icon is rendered from PROPERTY_TYPE_LABELS correctly
- Implication: Icon is defined in constants and code correctly renders it. Root cause is likely CSS/icon library issue.

### Issue 2: RLS Policy Block Document Upload
- File: supabase/migrations/20260129000003_create_documents_table.sql
- Finding 1: Table schema uses columns: name, size_bytes, linked_entity_type, linked_entity_id, uploaded_at
- File: lib/documentUtils.ts lines 115-175
- Finding 2: documentUtils tries to INSERT with WRONG column names:
  - file_name (should be name)
  - size (should be size_bytes)
  - entity_type (should be linked_entity_type)
  - entity_id (should be linked_entity_id)
- Implication: Column name mismatch causes INSERT to fail with RLS-like error.

### Issue 3: Time Picker Minute Granularity
- File: app/quote/page.tsx lines 895-900
- Finding: HTML5 type="time" input with no step attribute or custom component
- Implication: Standard HTML time input defaults to minute granularity

### Issue 4: Inspection Step Not Skipped
- File: app/quote/page.tsx line 872
- Finding: Step 4 conditional: currentStep === 4 && service === 'efficiency'
- Finding: Missing check for inspectionRequested flag
- Implication: Form has checkbox but step 4 rendering doesn't check it

### Issue 5: Installation Address Label Hardcoded
- File: components/ManualProjectWizard.tsx lines 260 and 300
- Finding: address: 'Installation Address' hardcoded for all services
- Finding: Service type available as formData.project.service
- Implication: Label should be conditional but is hardcoded

## Eliminated
(none)

## Resolution

### Issue 1: Industrial Property Icon Missing
- root_cause: Icon class 'ri-factory-line' defined in code but possibly not loaded in Remix Icons library
- phase_responsibility: Phase 2
- fix_approach: Verify Remix Icons version supports 'ri-factory-line'. If not, replace with alternative icon.

### Issue 2: RLS Policy Blocks Document Upload
- root_cause: documentUtils.ts inserts with wrong column names (file_name→name, size→size_bytes, entity_type→linked_entity_type, entity_id→linked_entity_id)
- phase_responsibility: Phase 2
- fix_approach: Update documentUtils.ts lines 161-170 to use correct column names matching schema

### Issue 3: Time Picker Shows Minutes
- root_cause: HTML5 type="time" input natively provides minute granularity with no step constraint
- phase_responsibility: Phase 2
- fix_approach: Add step="3600" attribute or implement custom hour-only component

### Issue 4: Inspection Scheduling Step Doesn't Skip
- root_cause: Step 4 conditional checks service but NOT inspectionRequested flag
- phase_responsibility: Phase 2
- fix_approach: Update line 872 condition to include inspectionRequested check

### Issue 5: Installation Address Label Wrong
- root_cause: Address label hardcoded to 'Installation Address' for all services
- phase_responsibility: Phase 2
- fix_approach: Make label conditional on formData.project.service type
