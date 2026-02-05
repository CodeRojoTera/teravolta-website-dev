---
status: diagnosed
issue_id: 2
test: "Test 5 - ContratarFlow Component Renders"
severity: major
created: 2026-02-04T15:30:00Z
updated: 2026-02-04T15:45:00Z
---

## Summary

ManualProjectWizard component throws "Each child in a list should have a unique key prop" warning at line 357-370 area.

## Root Cause FOUND

**File:** `components/ManualProjectWizard.tsx`
**Line:** 568
**Issue:** Using array index as key in dynamic list

```tsx
// CURRENT (WRONG):
{formData.project.phases.map((phase, idx) => (
    <div key={idx} className="flex gap-2 items-center">
    ...
))}
```

## Why This Is Wrong

1. **Phase structure has unique IDs:** Line 48 defines phases as `{ id: string; name: string; amount: number }[]`
2. **IDs are guaranteed unique:** Line 609 generates each phase with `crypto.randomUUID()`
3. **Index keys break React reconciliation:** When phases are reordered, deleted, or new ones added mid-list, index keys cause React to lose track of which phase is which, leading to duplicate key warnings and potential state confusion
4. **Affects phase state updates:** Inputs for phase name and amount (lines 569-590) may show wrong values when list changes

## Fix Required

**Change line 568 from:**
```tsx
<div key={idx} className="flex gap-2 items-center">
```

**To:**
```tsx
<div key={phase.id} className="flex gap-2 items-center">
```

## Additional Context

- Public quote form renders without errors (different code path, likely doesn't have dynamic phase list)
- ManualProjectWizard is used in Admin → Projects → Create Project Wizard
- The phases list allows add/remove (line 609 adds, line 593 removes), making it dynamic

## Files Affected

- `components/ManualProjectWizard.tsx` - Line 568

## Impact

- **User visible:** React console warning "Each child in a list should have a unique key prop"
- **Functional:** Potential state management issues when adding/removing/reordering phases
- **Severity:** Major (broken React warning indicates state reconciliation issue)

