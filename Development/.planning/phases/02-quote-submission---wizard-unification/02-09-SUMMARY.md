---
phase: 02-quote-submission-wizard-unification
plan: 09
subsystem: public-quote-form
tags: [ui-fix, remix-icons, time-input, ux-improvement]

requires:
  - 02-01-zod-schema-foundation
  - 02-02-shared-wizard-components
  - 02-03-public-quote-form-rhf-refactor

provides:
  - industrial-icon-fix
  - hourly-time-picker-constraint

affects:
  - all-property-type-displays
  - booking-time-inputs

tech-stack:
  added: []
  patterns:
    - html5-time-input-step-attribute

key-files:
  created: []
  modified:
    - Development/lib/schemas/constants.ts (industrial icon fix)
    - Development/app/quote/page.tsx (time input step attribute)

decisions:
  - id: ri-building-4-line-replacement
    choice: Replace ri-factory-line with ri-building-4-line
    rationale: ri-factory-line doesn't exist in current Remix Icons version
  - id: hourly-time-step
    choice: step="3600" on time input
    rationale: Hour-level selection provides cleaner UX and reduces data noise

metrics:
  duration: 2 min
  completed: 2026-02-02
---

# Phase 02 Plan 09: Quote Form UI Fixes Summary

**Fixed industrial property icon (ri-building-4-line) and constrained time picker to hourly increments (step="3600")**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-02T18:17:53Z
- **Completed:** 2026-02-02T18:19:42Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Industrial property type card now displays an icon (ri-building-4-line)
- Time picker in booking step constrained to hourly increments only
- Visual consistency achieved across all 6 property type cards
- Cleaner UX for booking time selection

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace industrial icon with ri-building-4-line** - `57e2339` (fix)
2. **Task 2: Add step="3600" to time input** - `276b487` (fix)

## Files Created/Modified

- `lib/schemas/constants.ts` - Changed industrial.icon from 'ri-factory-line' to 'ri-building-4-line'
- `app/quote/page.tsx` - Added step="3600" attribute to time input element

## What Was Fixed

### Issue 1: Missing Industrial Property Icon

**Problem:** Industrial property type card showed no icon while other property types displayed icons correctly.

**Root cause:** `ri-factory-line` doesn't exist in the current Remix Icons library version.

**Solution:** Replaced with `ri-building-4-line` which:
- Exists in current Remix Icons library
- Semantically appropriate for industrial buildings
- Matches the visual style of other property type icons

**Impact:** All 6 property type cards now display consistently with icons.

### Issue 2: Time Picker Allowed Minute-Level Selection

**Problem:** Time input allowed selecting specific minutes (e.g., 2:45 PM) instead of hourly increments only.

**Root cause:** HTML time input without `step` attribute defaults to 1-minute granularity.

**Solution:** Added `step="3600"` attribute where:
- 3600 seconds = 1 hour
- Constrains picker to hourly options (2:00 PM, 3:00 PM, etc.)
- Prevents minute-level selection

**Impact:** Cleaner UX and reduced data noise for booking times.

## Decisions Made

### 1. Icon Replacement Choice
**Context:** ri-factory-line icon doesn't exist in current Remix Icons version

**Decision:** Use ri-building-4-line as replacement

**Rationale:**
- Available in current Remix Icons library
- Semantically appropriate (industrial buildings)
- Visual consistency with other property type icons
- Better than generic fallback icons

### 2. Hourly Time Step
**Context:** Time picker UX and data quality considerations

**Decision:** Constrain to hourly increments with step="3600"

**Rationale:**
- Most booking systems use hourly slots
- Reduces scheduling complexity for admin
- Prevents unrealistic minute-level expectations
- Cleaner data for analysis

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Both fixes were straightforward single-attribute changes.

## Next Phase Readiness

**Status:** ✅ READY

**Blockers:** None

**Notes:**
- Quote form UI now polished and consistent
- All property types display with icons
- Time picker provides appropriate granularity
- Phase 02 (Quote Submission & Wizard Unification) complete

## Implementation Notes

### For Future Developers

**Remix Icons usage:**
Always verify icon names exist in the current library version:
- Check: https://remixicon.com/
- Pattern: `ri-{name}-{variant}` (e.g., ri-building-4-line)
- Common variants: -line (outline), -fill (solid)

**HTML time input step attribute:**
Controls granularity of time selection:
- No step: 1-minute increments (default)
- step="60": 1-minute increments (explicit)
- step="900": 15-minute increments
- step="1800": 30-minute increments
- step="3600": 1-hour increments (our choice)

**Property type icons in constants.ts:**
All property type icons are centralized in `PROPERTY_TYPE_LABELS`:
- Single source of truth
- Used by PropertyTypeSelector component
- Displayed in all 4 wizards (public quote, manual wizard, etc.)
- Changes here propagate everywhere

### Testing Verification

**Visual verification:**
1. Navigate to `/quote`
2. Select "Efficiency" service
3. Step 1: Verify all 6 property type cards show icons (including industrial)
4. Proceed to Step 4 (booking)
5. Click time field - should show only hour options (no minutes)

**Code verification:**
- TypeScript compilation passes
- No console errors in browser
- Icon displays correctly on industrial card
- Time picker accepts only hourly values

## Performance Impact

- **Bundle size:** No change (icons already loaded, HTML attribute has no cost)
- **Render performance:** No change
- **User experience:** Improved (visual consistency + cleaner time selection)

## Lessons Learned

1. **Verify external dependencies:** Icon libraries can change between versions - always verify availability
2. **HTML semantics matter:** Step attribute is standard HTML5, provides native UX without JavaScript
3. **Small fixes, big impact:** Two single-line changes significantly improve form polish
4. **Constants centralization works:** Single source of truth made this fix easy to locate and apply

---

**Status:** ✅ COMPLETE
**Duration:** 2 minutes
**Commits:** 2 (57e2339, 276b487)
