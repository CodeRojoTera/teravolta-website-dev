# TeraVolta Project Structure

This workspace contains **two separate versions** of the TeraVolta website:

---

## 📁 Folder Structure

```
Teravolta website dev/
├── Development/           ← Full version (work in progress)
│   └── docs/              ← Documentation for full version
│
└── website static view dev/   ← Static version (production-ready)
```

---

## 🌐 Static Version (`website static view dev/`)

**Purpose**: Production-ready static website for initial launch on teravolta.com

**Features**:
- Static pages (Home, Services, Projects, About)
- Contact form only
- No user authentication
- No dashboards
- No quote submission flow

**Status**: ✅ Ready for deployment to teravolta.com

> ⚠️ **DO NOT MODIFY** this folder when developing the full version.

---

## 💻 Full Version (`Development/`)

**Purpose**: Complete website with full functionality (work in progress)

**Features**:
- All static version features PLUS:
- Quote submission flow
- Service inquiry forms
- Energy Efficiency purchase flow
- Customer portal/dashboard
- Admin dashboard
- User authentication (Supabase)
- Invoice management
- Magic link onboarding

**Status**: 🚧 In development

---

## 📚 Documentation Scope

| Document | Applies To |
|----------|------------|
| `Development/docs/ARCHITECTURE.md` | Full version only |
| `Development/docs/USER_FLOWS.md` | Full version only |
| `Development/docs/SUPABASE_REFERENCE.md` | Full version only |
| `Development/docs/BRANDING.md` | **BOTH versions** |
| `Development/DEPLOYMENT_CHECKLIST.md` | Full version only |

---

## 🎨 Shared Branding

Both versions share the same visual identity defined in:
`Development/docs/BRANDING.md`

- Colors: `#004a90`, `#194271`, `#c3d021`
- Font: Gilroy
- Icons: RemixIcon (outline style)

---

## Development Rules

1. **When working on the full version**: Only modify files in `Development/`
2. **Never touch** `website static view dev/` unless explicitly requested
3. **Branding changes** apply to both versions
