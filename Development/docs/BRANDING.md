# TeraVolta Branding Guidelines

This document defines the visual identity and branding rules for the TeraVolta website.

---

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Logo Usage](#logo-usage)
- [Icons](#icons)
- [Button Styles](#button-styles)
- [UI Components](#ui-components)
- [Responsive Design](#responsive-design)

---

## Color Palette

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **TeraVolta Blue (Primary)** | `#004a90` | Primary brand color - headers, links, text accents |
| **TeraVolta Blue (Dark)** | `#194271` | Footer background, dark sections, hover states |
| **TeraVolta Green (Accent)** | `#c3d021` | Call-to-action buttons, highlights, active states |

### Secondary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| White | `#ffffff` | Backgrounds, text on dark surfaces |
| Gray Light | `#f3f4f6` | Card backgrounds, subtle highlights |
| Gray Medium | `#e5e7eb` | Borders, dividers |
| Gray Text | `#6b7280` | Secondary text, descriptions |
| Red (Error) | `#dc2626` | Error states, destructive actions |
| Green (Success) | `#16a34a` | Success states, confirmations |

### Color Usage Rules

1. **Blue on White**: Primary text, headings, and links on white backgrounds use `#004a90`
2. **White on Blue**: Text on blue backgrounds (`#194271`) uses white
3. **Green Accent**: The accent green `#c3d021` is reserved for:
   - Primary CTA buttons
   - Active navigation states
   - Icon circles (with blue icons inside)
   - Highlight badges

### Icon Circle Rules

| Circle Color | Icon Color | Example Usage |
|--------------|------------|---------------|
| `#c3d021` (Green) | `#194271` (Dark Blue) | Feature icons, service cards |
| `#194271` (Dark Blue) | `#ffffff` (White) | Footer icons, dark sections |

**Important**: Never use opacity-based backgrounds for icon circles (e.g., `bg-[#c3d021]/20`). Always use solid colors.

---

## Typography

### Font Family

**Gilroy** - The official TeraVolta typeface

| Weight | Name | Usage |
|--------|------|-------|
| 300 | Light | Large decorative text |
| 400 | Regular | Body text, paragraphs |
| 500 | Medium | Labels, subheadings |
| 700 | Bold | Headings, emphasis |
| 800 | ExtraBold | Hero titles |

### Font Files

Located in `/public/fonts/`:
- `Gilroy-Light.otf`
- `Gilroy-Regular.ttf`
- `Gilroy-Medium.otf`
- `Gilroy-Bold.ttf`
- `Gilroy-ExtraBold.ttf`

### Type Scale (Fluid)

Uses CSS clamp for responsive sizing:

```css
--font-h1: clamp(2rem, 2.2vw + 1rem, 3.5rem);
--font-h2: clamp(1.6rem, 1.4vw + 1rem, 2.6rem);
--font-h3: clamp(1.35rem, 1vw + 1rem, 2rem);
--font-body: clamp(1rem, 0.35vw + 0.95rem, 1.2rem);
--font-label: clamp(0.9rem, 0.25vw + 0.85rem, 1.05rem);
```

### Typography Rules

1. **Headings** (h1-h3): Bold (700), line-height 1.2
2. **Body text**: Regular (400), line-height 1.6
3. **Subheadings** (h4-h6): Medium (500)
4. **Headings on white**: Use blue `#004a90`
5. **Headings on dark**: Use white `#ffffff`

---

## Logo Usage

### Logo Files

Located in `/public/images/logos/`:

| File | Dimensions | Usage |
|------|------------|-------|
| `horizontal.png` | Wide | Header, documentation |
| `vertical.png` | Tall | Loading screens, mobile |
| `icon.png` | Square | Favicon, app icon |

### Logo Placement

- **Header**: Horizontal logo, height ~40px
- **Footer**: Horizontal or vertical logo
- **Loading States**: Vertical logo centered

### Logo Rules

1. Always use official logo files - no recreations
2. Maintain padding around logo (minimum 16px)
3. Logo links to homepage (`/`)
4. On hover: subtle scale effect allowed

---

## Icons

### Icon Library

**Remix Icon** - Loaded via CDN

```html
@import url('https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css');
```

### Icon Style Rules

1. **Always use outline style** (`-line` suffix, never `-fill`)
2. Icons inherit parent text color by default
3. Icon size typically matches font size

### Common Icons

| Icon | Class | Usage |
|------|-------|-------|
| Home | `ri-home-line` | Navigation |
| Services | `ri-briefcase-line` | Services section |
| Projects | `ri-building-line` | Projects section |
| Contact | `ri-mail-line` | Contact section |
| Quote | `ri-calculator-line` | Quote/pricing |
| User | `ri-user-line` | Account, profile |
| Admin | `ri-dashboard-line` | Admin access |
| Settings | `ri-settings-4-line` | Settings |
| Logout | `ri-logout-box-r-line` | Logout action |
| Check | `ri-check-line` | Success, selected |
| Error | `ri-error-warning-line` | Errors, warnings |
| Upload | `ri-upload-cloud-line` | File upload |
| Download | `ri-download-line` | File download |
| Phone | `ri-phone-line` | Phone numbers |
| Email | `ri-mail-line` | Email addresses |
| Location | `ri-map-pin-line` | Addresses |

---

## Button Styles

### Primary Button (CTA)

```css
background: #c3d021;
color: #194271;
font-weight: bold;
border-radius: rounded-lg (8px) or rounded-full (pill);
```

**Hover**: Slightly darker green

### Secondary Button (Outline)

```css
background: transparent;
border: 2px solid #004a90;
color: #004a90;
```

**Hover**: Fill with blue, white text

### Button Variants

| Type | Background | Border | Text | Radius |
|------|------------|--------|------|--------|
| Primary | `#c3d021` | None | `#194271` | Full/Large |
| Secondary | Transparent | `#004a90` | `#004a90` | Full/Large |
| Danger | `#dc2626` | None | White | Large |
| Ghost | Transparent | None | `#004a90` | None |

### Button States

- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner icon + "Loading..." text
- **Hover**: Smooth color transition (200ms)

---

## UI Components

### Cards

```css
background: white;
border-radius: 12-16px (rounded-xl to rounded-2xl);
box-shadow: subtle drop shadow;
padding: 24-32px;
```

### Forms

- **Input fields**: Border gray-300, focus ring blue
- **Labels**: Text gray-600, font-medium
- **Placeholders**: Text gray-400

### Modals

- **Background overlay**: Black at 50% opacity
- **Modal**: White, rounded-2xl, shadow-2xl
- **Max width**: md (448px) to lg (512px)

### Status Indicators

| Status | Color | Background |
|--------|-------|------------|
| Pending | Yellow | `#f59e0b` |
| In Progress | Blue | `#3b82f6` |
| Completed | Green | `#16a34a` |
| Cancelled | Red | `#dc2626` |

---

## Responsive Design

### Breakpoints

Following Tailwind CSS defaults:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Fluid Spacing

```css
--spacing-section: clamp(2.5rem, 4vw, 6rem);
--spacing-card: clamp(1.25rem, 2vw, 2.25rem);
--spacing-gap: clamp(1.25rem, 2vw, 2.5rem);
```

### Mobile Considerations

- Header collapses to hamburger menu at `lg` breakpoint
- Cards stack vertically on mobile
- Full-width buttons on mobile forms
- Touch-friendly tap targets (min 44px)

---

## Texture & Backgrounds

### Pattern Usage

Located in `/public/images/`:
- `Textura Alargada.svg` - Seamless tileable pattern

**Rules**:
- Use at natural scale, no distortion
- Tile seamlessly as background
- No opacity modifications per tile
- Appears in CTA sections on home page

### Gradient Backgrounds

**Blue gradient** (for full-page overlays):
```css
background: linear-gradient(to bottom right, #004a90, #194271);
```

Used in:
- Login page
- Onboarding pages
- Error pages

---

## Accessibility

### Color Contrast

- All text maintains WCAG AA contrast ratio (4.5:1 minimum)
- Blue `#004a90` on white passes AA
- White on `#194271` passes AAA

### Focus States

- Visible focus rings on interactive elements
- Focus ring uses brand blue

### Motion

- Respect `prefers-reduced-motion` preference
- Keep animations subtle and purposeful

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Technical structure
- [User Flows](./USER_FLOWS.md) - User journeys
- [Firebase Reference](./FIREBASE_REFERENCE.md) - Database info
