# Coding Conventions

**Analysis Date:** 2026-01-28

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AuthProvider.tsx`, `InquiryForm.tsx`)
- Pages: lowercase with hyphens (e.g., `page.tsx` in routes like `/app/inquiry/page.tsx`)
- API routes: kebab-case directory names (e.g., `/app/api/create-inquiry/route.ts`)
- Utility/library files: camelCase (e.g., `clientTypeUtils.ts`, `dateUtils.ts`, `supabase.ts`)
- Configuration files: lowercase (e.g., `eslint.config.mjs`, `tsconfig.json`)

**Functions:**
- camelCase for all functions: `handleInputChange`, `checkUserRole`, `updateClientType`
- Async functions prefix with `fetch` or use verb first: `fetchData`, `createUser`, `submitForm`
- Handler functions start with `handle`: `handleSubmit`, `handlePhoneChange`, `handleInputChange`
- Utility functions use verb form: `getClientCategory`, `updateClientType`, `associateQuotesWithUser`

**Variables:**
- camelCase for all variables: `formData`, `isSubmitting`, `selectedService`, `fieldErrors`
- Boolean variables start with `is`, `has`, `can`, or `should`: `isClient`, `isSubmitting`, `hasError`, `canSubmitForm`
- Constants use UPPER_SNAKE_CASE: `PROJECT_STATUSES`, `EMPORIA_CLASSIFICATIONS`, `SYSTEM_TYPES`
- React state uses camelCase: `user`, `loading`, `isAdmin`, `fieldErrors`

**Types:**
- Interface names: PascalCase starting with context (e.g., `AuthContextType`, `LanguageContextType`, `ButtonProps`)
- Type aliases: PascalCase (e.g., `ServiceType`, `ProjectStatus`, `ClientType`)
- Union types use pipe notation: `'residential' | 'commercial' | 'both'`

## Code Style

**Formatting:**
- No Prettier config detected; using Next.js defaults
- 2-space indentation (observed in source files)
- Line length: No strict limit enforced (TSConfig targets ES2017+)

**Linting:**
- ESLint: `next/core-web-vitals` extends with `@typescript-eslint/no-explicit-any` disabled
- Rules enforced: Next.js Core Web Vitals, React best practices
- `any` type is explicitly allowed (rule disabled in `eslint.config.mjs`)
- TypeScript strict mode enabled in `tsconfig.json`

## Import Organization

**Order:**
1. React/Next.js imports: `import React, { ... } from 'react'`
2. Next.js specific: `import Link from 'next/link'`, `import { useRouter } from 'next/navigation'`
3. Third-party libraries: `import { useLanguage } from ...`, `import { supabase } from '@/lib/supabase'`
4. Local components: `import Header from '../components/Header'`
5. Utilities and types: `import { updateClientType } from '@/lib/clientTypeUtils'`

**Path Aliases:**
- `@/*` maps to the project root (configured in `tsconfig.json`)
- Used in imports: `@/lib/supabase`, `@/components/AuthProvider`, `@/lib/clientTypeUtils`
- Enables consistent imports regardless of nesting depth

## Error Handling

**Patterns:**
- Try-catch blocks in async functions with specific error logging:
  ```typescript
  try {
    const result = await operation();
  } catch (error) {
    console.error('Descriptive error message:', error);
    return NextResponse.json({ error: 'User-facing message' }, { status: 500 });
  }
  ```
- API routes: Return `NextResponse.json()` with status codes (400, 404, 500)
- Client-side: Use `toast` notifications for user feedback via `useToast()` hook (see `InquiryForm.tsx`)
- Supabase errors: Check for `.error` on result objects, use `maybeSingle()` for optional queries
- Ignore AbortError in auth flows (React 18 Strict Mode in development)

**Error Messages:**
- Console errors for debugging: `console.error('Error in [context]:', error)`
- User-facing errors via toast: `showToast('Error title', 'error')`
- API errors include `{ error: 'message' }` or `{ error: 'message', details: error.message }`

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- `console.error()` for failures: `console.error('Error creating inquiry:', error)`
- `console.log()` for informational tracking: `console.log('Updated clientType for...')`
- Suppress logging in certain contexts (e.g., AbortError in auth checks)

## Comments

**When to Comment:**
- Complex logic requiring explanation (e.g., client type calculation in `clientTypeUtils.ts`)
- Non-obvious business logic (e.g., "USER: Preserving the image as requested")
- Workarounds or known limitations (e.g., hydration mismatch handling)
- Function purpose with JSDoc

**JSDoc/TSDoc:**
- Used for utility functions with parameters and return descriptions:
  ```typescript
  /**
   * Updates the client type for a user based on their submitted quotes
   * This should be called after a quote is submitted with a valid property type
   *
   * @param email - The email of the user who submitted the quote
   * @param newPropertyType - The property type from the new quote
   */
  export async function updateClientType(email: string, newPropertyType: string): Promise<void>
  ```
- Optional for simple functions
- Include `@version`, `@created`, `@updated` for version tracking (see `lib/types.ts`)

## Function Design

**Size:**
- Components: 50-300 lines (observed in `InquiryForm.tsx`, `page.tsx`)
- Utility functions: 5-50 lines
- API routes: 10-60 lines with minimal logic (delegates to utils)

**Parameters:**
- Named parameters with type annotations: `function updateClientType(email: string, newPropertyType: string)`
- Optional parameters use `?`: `propertyType?: string`
- Destructured props in React components: `{ children, variant = 'primary', ... }`

**Return Values:**
- Explicit return types: `Promise<void>`, `Promise<User | null>`, `NextResponse`
- Use `void` for functions with no return value
- Return early for validation: `if (!data) return;`
- Async functions always return `Promise<T>`

## Module Design

**Exports:**
- Default exports for React components: `export default function Home() { ... }`
- Named exports for utilities: `export function getClientCategory(...)`
- Export interfaces/types as named exports: `export interface ClientReference { ... }`

**Barrel Files:**
- Not used in this codebase (components imported individually)
- Prefer direct imports to maintain clarity

## State Management

**React Context:**
- Used for global state: `AuthProvider`, `LanguageProvider`
- Pattern: `createContext`, `useContext` hook
- Includes loading states for async operations
- Context type interface defined: `AuthContextType`, `LanguageContextType`

**Component State:**
- `useState` for local form state: `const [formData, setFormData] = useState({...})`
- Refs for mount tracking: `const isMountedRef = useRef(false)`
- Timeout refs for cleanup: `const timeoutRef = useRef<NodeJS.Timeout | null>(null)`

## Data Validation

**Pattern:**
- Form validation in handlers: `handleInputChange`, `handlePhoneChange`
- Real-time validation with regex: `const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone number validation library: `isValidPhoneNumber()` from `react-phone-number-input`
- Field error state tracking: `const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})`
- Disable submit button during validation: `disabled={!canSubmitForm() || isSubmitting}`

---

*Convention analysis: 2026-01-28*
