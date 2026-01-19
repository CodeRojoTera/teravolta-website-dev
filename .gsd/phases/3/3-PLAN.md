# Phase 3: UI/UX Polish

> **Objective:** Harmonize visual styles, improve feedback mechanisms, and enhance user experience across all portals.

## 1. Scope Definition

Based on SPEC.md Goal #3: "Polish UI/UX: Refine visual consistency and feedback mechanisms across the application."

### In Scope
- Loading state improvements (skeletons, spinners)
- Toast/notification feedback consistency
- Form validation UX
- Empty state messaging
- Error handling UX
- Navigation feedback (active states)
- Mobile responsiveness fixes

### Out of Scope
- Major redesigns
- New feature development
- Backend changes (covered in Phase 2)

---

## 2. Implementation Plan

### Task 3.1: Improve Loading States
**Goal:** Provide clear visual feedback during async operations.

<task type="auto">
  <name>Audit Loading States</name>
  <files>app/portal/*/page.tsx, components/ui/Skeleton.tsx</files>
  <action>
    - Identify pages missing loading skeletons
    - Ensure all data-fetching pages show `PageLoadingSkeleton`
    - Add button loading states for form submissions
  </action>
  <verify>Visually check pages load with skeleton before data</verify>
  <done>All portal pages show loading skeleton before content</done>
</task>

<task type="auto">
  <name>Standardize Button Loading</name>
  <files>components/ui/Button.tsx</files>
  <action>
    - Add `isLoading` prop to Button component
    - Show spinner + disabled state when loading
    - Update forms to use loading button state
  </action>
  <verify>Form submit buttons show spinner during submission</verify>
  <done>All submit buttons show loading state</done>
</task>

---

### Task 3.2: Enhance Toast/Notification Feedback
**Goal:** Ensure users always know the result of their actions.

<task type="auto">
  <name>Audit Toast Usage</name>
  <files>app/**/*.tsx</files>
  <action>
    - Find all form submissions and async actions
    - Ensure every action has success/error toast
    - Standardize toast message format (icon + message)
  </action>
  <verify>Test form submissions show appropriate toasts</verify>
  <done>All user actions have toast feedback</done>
</task>

---

### Task 3.3: Improve Empty States
**Goal:** Replace empty/null states with helpful messaging.

<task type="auto">
  <name>Standardize Empty States</name>
  <files>components/ui/EmptyState.tsx, app/portal/*/page.tsx</files>
  <action>
    - Audit pages showing "No data" or blank content
    - Use EmptyState component consistently
    - Add actionable CTAs where appropriate (e.g., "Create your first...")
  </action>
  <verify>Empty tables/lists show helpful empty state</verify>
  <done>All empty lists use EmptyState component with CTA</done>
</task>

---

### Task 3.4: Form Validation UX
**Goal:** Provide inline validation and clear error messages.

<task type="auto">
  <name>Add Inline Validation</name>
  <files>app/quote/page.tsx, app/inquiry/InquiryForm.tsx, app/portal/customer/request-service/page.tsx</files>
  <action>
    - Add real-time validation for required fields
    - Show error messages below invalid fields
    - Disable submit until form is valid
    - Scroll to first error on submit
  </action>
  <verify>Submit invalid form shows inline errors</verify>
  <done>Forms show inline validation errors before submission</done>
</task>

---

### Task 3.5: Mobile Responsiveness Audit
**Goal:** Ensure all portals work well on mobile devices.

<task type="auto">
  <name>Fix Mobile Layout Issues</name>
  <files>app/portal/*/layout.tsx, app/portal/*/page.tsx</files>
  <action>
    - Test sidebar collapse on mobile
    - Fix table overflow (horizontal scroll or card view)
    - Ensure forms are touch-friendly
    - Test navigation on small screens
  </action>
  <verify>Test on 375px viewport width</verify>
  <done>All portal pages usable on mobile</done>
</task>

---

## 3. Success Criteria

- [ ] All pages show loading skeletons during data fetch
- [ ] All form submissions show button loading state
- [ ] All async actions provide toast feedback
- [ ] Empty states are helpful and actionable
- [ ] Forms show inline validation errors
- [ ] Portals are usable on mobile (~375px width)

## 4. Verification Strategy

- **Manual Testing:** Visual inspection of loading states, toasts, empty states
- **Browser Testing:** Use browser subagent to test responsive layouts
- **Code Audit:** grep for missing loading/error states
