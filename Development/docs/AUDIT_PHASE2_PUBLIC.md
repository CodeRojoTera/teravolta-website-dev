# Phase 2 Audit: Public Site & User Interactions

> **Generated**: 2026-01-20
> **Scope**: Public-facing interaction flows, page structure, and authentication logic.

## 1. Global Interaction Architecture

### Header (`components/Header.tsx`)
- **State**: Tracks `isMenuOpen`, `isAdminDropdownOpen`, `userRole`.
- **Logic**:
    - `useAuth` determines if "Sign In" or "User Menu" is shown.
    - Role-based menu rendering for `admin`, `technician`, `customer`.
    - `userRole` fetched dynamically from `users` table on mount.
- **Interactions**:
    - **Notifications**: `NotificationBell` component polling/subscription.
    - **Language**: Toggles `en/es` via `LanguageProvider`.

### Footer (`components/Footer.tsx`)
- **Structure**: Static navigational links (Company, Services, Legal).
- **Localization**: Fully localized strings.
- **Contact**: Displays static contact points (Email, Phone).

---

## 2. Public Service Pages

### Home (`app/page.tsx`)
- **Key Sections**:
    - **Hero**: `url('/images/brand/hero_main_updated.png')` with gradient overlay.
    - **Challenge & Solutions**: Interactive cards linking to service pages.
    - **Case Study**: Hardcoded feature "Solar Energy Implementation".
    - **CTA**: Prominent "Get Quote" actions.
- **Observation**: Uses `textura-alargada.svg` for branding consistency.

### Service Vertical Pages
All service pages follow a consistent layout: Hero -> Description -> Process/Benefits -> CTA.
- **Efficiency** (`/services/efficiency`):
    - Features: Energy monitoring, bill analysis.
    - Segmentation: Residential vs Business.
- **Consulting** (`/services/consulting`):
    - Focus: PPA Structuring, Market Regulation (Panama context).
    - Assets: "Strategic Roadmap" methodology.
- **Advocacy** (`/services/advocacy`):
    - Focus: ASEP representation, claims management.
    - Process: 3-step dispute resolution flow.

### Quote Page (`/quote/page.tsx`)
- **Type**: Complex Multi-step Wizard.
- **Flow**:
    1.  **Service Selection**: Consulting / Efficiency / Advocacy.
    2.  **Details**: Property type, consumption data.
    3.  **Contact**: User info + **File Upload**.
- **Technical**:
    - **Uploads**: Uses `lib/documentUtils::uploadDocument` (Bucket: `documents`).
    - **Submission**: POST `/api/create-quote`.
    - **Onboarding**: Option to trigger "Create Account" via Magic Link.

### Contact Page (`/contact/page.tsx`)
- **Type**: Form-based Inquiry.
- **Validation**:
    - **Phone**: `react-phone-number-input` for international formatting.
    - **Email**: Regex validation.
- **File Upload**: Drag-drop support for attachments.
- **Backend**:
    - Creates `inquiries` record via Supabase client.
    - Triggers `/api/send-email` for admin notification.

---

## 3. Authentication & Onboarding Flows

### Login (`app/portal/login/page.tsx`)
- **Access**: Public.
- **Logic**:
    - `supabase.auth.signInWithPassword`.
    - **Role Redirect**:
        - `admin/super_admin` -> `/portal/admin`
        - `technician` -> `/portal/technician`
        - `customer` -> `/portal/customer`
- **Constraint**: Sign-up link is explicitly **disabled** (Admin-only registration model).

### Forgot Password (`app/forgot-password/page.tsx`)
- **Status**: **SIMULATION ONLY**.
- **Critical Finding**: The logic relies on a `setTimeout` to simulate a success message. It **does not** trigger an actual password reset email via Supabase or API.
- **Action Required**: Logic must be implemented to call `supabase.auth.resetPasswordForEmail`.

### Onboarding / Activation (`app/onboard/[token]/page.tsx`)
- **Purpose**: Account activation for users created via Quote/Inquiry/Admin.
- **Flow**:
    1.  **Validate**: POST `/api/verify-token` (Checks `magic_links` table).
    2.  **Display**: Shows pre-filled user info (`MagicLinkData`).
    3.  **Set Password**: User inputs new password.
    4.  **Activate**: POST `/api/activate-account`.
        - Calls `supabase.auth.admin.createUser` (server-side).
        - Links orphan `active_projects`.
        - Converts `inquiries` or `quotes` to user ownership.
    5.  **Auto-Login**: Signs user in and redirects to portal.

---

## 4. Observations & Recommendations (Audit Output)
1.  **Forgot Password**: Needs immediate implementation of real logic.
2.  **Consistency**: Service pages share consistent UI/UX patterns (Good).
3.  **Security**:
    - Start of public sign-up is disabled (Good for restricted access model).
    - File uploads use strict type/size validation on client side (Verify server-side storage rules).
4.  **Localization**: All public pages correctly use `useLanguage` hook.

## Level 2: Deep Dive (Interaction & Atomic Logic)

### 1. Contact Form (`app/contact/page.tsx`)
**Atomic Interactions:**
-   **Client Type Toggle**: Switches between "Residential" and "Business" -> Conditionally renders "Company Name" field.
-   **Real-time Validation**:
    -   `Email`: Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` triggers instant error message.
    -   `Phone`: Uses `react-phone-number-input` with `isValidPhoneNumber` check.
-   **File Upload**:
    -   **Constraint**: Max 5 files, 10MB each.
    -   **Types**: PDF, JPG, PNG, DOCX, XLSX.
    -   **UX**: Drag & Drop zone + Progress bar simulation (10% -> 100%).
-   **Resilience**:
    -   Submit succeeds even if the *email notification* fails (logs error but shows success UI to user). This prevents data loss but risks admin unawareness.

### 2. Home Page (`app/page.tsx`)
**Key Technical Patterns:**
-   **Hydration Guard**: Uses `!isHydrated` check to render a loading spinner, preventing Next.js hydration mismatches on the complex Hero section.
-   **Visuals**:
    -   **Texture**: `textura-alargada.svg` used with `mixBlendMode: 'overlay'` and `opacity-[0.20]` for brand consistency.
    -   **Icons**: Strict "Icon Circle" compliance (Navy circle/White icon, Lime circle/Navy icon).

### 3. About Page (`app/about/page.tsx`)
**Data Structure:**
-   **Founders**: Hardcoded bios and images (Agustin, Roque, Alex).
-   **Impact Stats**: Hardcoded placeholders (e.g., "$12M Savings") with a visible **"Data Pending Verification"** badge in the UI.
-   **Responsive Layout**: Uses a horizontal scroll container for Founder cards on mobile, switching to a Grid on desktop.

### 4. Service Pages (e.g., `services/efficiency`)
**Pattern:**
-   **Content Injection**: All text driven by a localized `content` object.
-   **Visual Flow**: Uses a CSS-drawn connector line (`absolute top-[40px]`) to link process steps visually on desktop.
