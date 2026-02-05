# Research for Phase 03: Shared Service Features

## Standard Stack

*   **Frontend Forms:** React Hook Form (RHF) with Zod for schema validation, as established by prior decisions. Components for reuse should be located in a shared component library or a dedicated folder within the relevant scope, leveraging shared constants defined in `lib/schemas/`.
*   **Data Fetching/Mutation:** Standard established method (likely React Query/TanStack Query or similar in a modern React app, but this needs confirmation by inspecting existing files). Assume standard REST/GraphQL interaction patterns are in place.
*   **UI Components:** Existing application patterns, specifically for the card-based property type selector, must be followed. Separate service field components are preferred over a "mega-component."
*   **Back-end Logic:** Service resolution logic for category validation should be automated via the database layer where possible, with server-side validation (e.g., using Zod schemas passed server-side) enforcing category rules to prevent disallowed uploads.

## Architecture Patterns

*   **Quote-to-Project Conversion:** This flow must map quote data precisely to the resulting project structure. The existing step flow *must* be preserved for UX consistency. This suggests a state machine or a sequential wizard component guided by the existing UX pattern.
*   **Service-Specific Portal Views:** Implement views using a pluggable pattern where the base view component handles common elements (e.g., header, navigation), and service-specific logic/components are rendered based on a service identifier (likely the `serviceType` prop mentioned).
*   **Document Filtering:** Implement filtering logic centrally (likely in a shared hook or utility function) that respects the `serviceType` prop for backwards compatibility, delegating final filtering logic to the `DocumentManager` where appropriate for service-specific rules.
*   **Security/Guarding:** UI access (components) and server-side access (page/API routes) must both guard inspection UIs, based on the "Inspection UI guarded at both component and page level" decision.

## Don't Hand-Roll

*   **Schema Validation:** Do not hand-roll validation logic; use Zod schemas co-located with shared constants in `lib/schemas/`.
*   **Complex Form Management:** Do not use manual state management for complex forms; use RHF as established.
*   **Time Input:** Do not use default time pickers; use one that supports hourly steps, or configure the existing one with `step="3600"` for cleaner UX.

## Common Pitfalls

*   **UX Regression:** Failing to preserve the existing step flow in refactors. **Verification:** Visually step through the quote-to-project conversion flow post-refactor.
*   **Security Bypass:** Relying solely on component-level guarding for sensitive actions like inspection. **Verification:** Test API calls directly to ensure server-side validation and page-level guards are active.
*   **Validation Drift:** Allowing the client-side schema to become the single source of truth for category rules. **Verification:** Ensure server-side validation explicitly re-enforces category rules based on service type.
*   **Legacy Compatibility:** Forgetting to support services that do not pass the `serviceType` prop. **Verification:** Test the filtering mechanism with a request that omits `serviceType` to ensure default/backwards-compatible behavior.

## Code Examples

*   **Property Selector:** Reference the existing implementation for the card-based property type selector for style and interaction patterns.
*   **RHF Admin Form:** Reference the existing Admin edit form structure that successfully integrates RHF with shared components.
*   **Time Picker Configuration:** Confirm the existing implementation of the hourly time picker using the correct step configuration (`step="3600"`).

## Confidence Score

**High (4/5)**: The prior decisions provide a strong foundation, clearly favouring RHF/Zod and preserving existing UX patterns. The primary unknowns are the exact path/usage of the established data fetching/mutation layer and the precise implementation details of the service plug-in pattern.

## Quality Gate Check

- [x] All domains investigated (Quote-to-Project, Portal Views, Document Filtering)
- [ ] Negative claims verified with official docs (N/A - claims are based on prior decisions)
- [ ] Multiple sources for critical claims (N/A - only using provided context)
- [x] Confidence levels assigned honestly (Yes)
- [x] Section names match what plan-phase expects (Yes: Standard Stack, Architecture Patterns, Don't Hand-Roll, Common Pitfalls, Code Examples)
