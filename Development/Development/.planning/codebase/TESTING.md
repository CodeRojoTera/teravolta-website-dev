# Testing Patterns

**Analysis Date:** 2026-01-28

## Test Framework

**Runner:**
- Not currently configured - No test framework detected in `package.json`
- Common options: Jest, Vitest, or Next.js built-in testing
- No test files in application source code (`/app`, `/components`, `/lib`)

**Assertion Library:**
- Not applicable - No testing framework installed

**Run Commands:**
- No test scripts in `package.json`
- Would need to add test configuration and scripts

## Test File Organization

**Location:**
- No test files currently in codebase
- Recommended pattern (not yet implemented):
  - Co-located: `Button.tsx` and `Button.test.tsx` in same directory
  - Or separate: `/__tests__` folders at project root or module level

**Naming:**
- Would follow pattern: `[Component].test.tsx` or `[Component].spec.tsx`
- API routes would use: `[endpoint].test.ts`

**Structure:**
- Would be stored alongside components/functions or in centralized test directories

## Test Structure

**Suite Organization (Pattern):**
- Not yet implemented, but based on Next.js/React best practices:
  ```typescript
  describe('[Component Name]', () => {
    describe('[Feature]', () => {
      it('should [behavior]', () => {
        // arrange
        // act
        // assert
      });
    });
  });
  ```

**Patterns:**
- Arrange-Act-Assert (AAA) pattern recommended
- Setup/teardown would use `beforeEach`, `afterEach` hooks
- Mocking would be handled via mock libraries

## Mocking

**Framework:**
- Not yet configured - Would typically use Jest mocks or Vitest
- Supabase client is a good candidate for mocking (see usage in components and API routes)

**Patterns:**
- Would mock Supabase client calls in:
  - `components/AuthProvider.tsx` - `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange()`
  - `lib/clientTypeUtils.ts` - `supabase.from().select()`, `.update()`, `.eq()`
  - API routes - `supabaseAdmin.from().insert()`, `.select()`, etc.

**What to Mock:**
- External services: Supabase database operations, API calls (`fetch` calls)
- Authentication state
- Router navigation (`useRouter` from `next/navigation`)
- Toast notifications (`useToast()`)
- Search params (`useSearchParams()`)

**What NOT to Mock:**
- Local utility functions (should test directly)
- React hooks like `useState`, `useEffect` (test component behavior instead)
- Basic Tailwind/styling
- Business logic in isolated utilities

## Fixtures and Factories

**Test Data:**
- Not yet implemented
- Recommendation: Create factory functions for common data structures
  ```typescript
  // fixtures/quote.ts
  export const createMockQuote = (overrides?: Partial<Quote>): Quote => ({
    id: 'quote-123',
    client_name: 'John Doe',
    client_email: 'john@example.com',
    client_phone: '+507 1234-5678',
    service: 'efficiency',
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides
  });
  ```

**Location:**
- Would be stored in: `/__tests__/fixtures/` or `/fixtures/`
- Keep fixtures close to tests or in shared test utilities directory

## Coverage

**Requirements:**
- Not enforced currently
- Recommendation: Start with 80% coverage target
  - Critical paths: 100% (auth, form submission, data validation)
  - Components: 80% (happy path + error cases)
  - Utilities: 90% (all branches)

**View Coverage:**
- Would use: `jest --coverage` or `vitest run --coverage`
- Review coverage report in: `coverage/lcov-report/index.html`

## Test Types

**Unit Tests:**
- Scope: Individual functions and components in isolation
- Approach: Mock dependencies, test specific behavior
- Examples to test:
  - `getClientCategory()` in `lib/clientTypeUtils.ts` - all input variations
  - `updateClientType()` - happy path, missing user, invalid property type
  - Form validation logic in `InquiryForm.tsx`
  - Button component variants in `components/ui/Button.tsx`

**Integration Tests:**
- Scope: Multiple components working together
- Approach: Test with real context providers, minimal mocking
- Examples:
  - Form submission flow in `InquiryForm` (form → API call → redirect)
  - Authentication flow in `AuthProvider` with session changes
  - Client type update after quote submission

**E2E Tests:**
- Framework: Not configured - Would use Cypress or Playwright
- Scope: Full user workflows from start to finish
- Examples:
  - User submits inquiry → receives confirmation → gets redirected
  - Admin creates technician → technician can log in
  - Customer views project timeline → receives notification

## Common Patterns

**Async Testing:**
- Not yet implemented
- Would use patterns like:
  ```typescript
  it('should fetch user data', async () => {
    // Arrange
    const mockSupabase = jest.fn().mockResolvedValue({ data: user, error: null });

    // Act
    const result = await fetchUser(userId);

    // Assert
    expect(result).toEqual(user);
  });
  ```
- Or with async/await syntax expected by test framework

**Error Testing:**
- Test error paths in try-catch blocks
- Verify error logging and user feedback
- Example patterns:
  ```typescript
  it('should handle API errors gracefully', async () => {
    // Arrange
    mockSupabase.mockRejectedValue(new Error('Database error'));

    // Act
    const response = await createInquiry(formData);

    // Assert
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error'));
    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
  ```

## Test Coverage Priorities

**High Priority (Critical Paths):**
- API routes in `/app/api/` - Data mutation and validation
- Authentication in `components/AuthProvider.tsx` - Session management
- Form submission in `components/InquiryForm.tsx` - User input handling
- Database utilities in `lib/clientTypeUtils.ts` - Data consistency

**Medium Priority:**
- UI components in `components/ui/` - Rendering and interactions
- Context providers - State management
- Data transformation utilities

**Low Priority (Can defer):**
- Page layouts and styling
- Static content components
- Error boundary handling (initially)

## Setup Notes

**To implement testing:**
1. Install test framework: `npm install --save-dev jest @types/jest` or `npm install --save-dev vitest`
2. Add test configuration file: `jest.config.js` or `vitest.config.ts`
3. Add scripts to `package.json`:
   ```json
   {
     "test": "jest",
     "test:watch": "jest --watch",
     "test:coverage": "jest --coverage"
   }
   ```
4. Setup mocks for Supabase client in `jest.setup.js` or via mock files
5. Create test files alongside source code or in `__tests__` directories
6. Install testing library: `npm install --save-dev @testing-library/react`

---

*Testing analysis: 2026-01-28*
