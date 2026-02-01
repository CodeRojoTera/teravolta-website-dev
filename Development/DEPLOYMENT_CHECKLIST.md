# 🚀 TeraVolta - Production Deployment Checklist

Este documento contiene todas las configuraciones, ajustes y consideraciones necesarias para llevar el proyecto TeraVolta de desarrollo a producción de manera segura.

---

## 📋 Tabla de Contenidos

1. [FFirebase Security Rules](#fFirebase-security-rules)
2. [Environment Variables](#environment-variables)
3. [Next.js Configuration](#nextjs-configuration)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Uploads & Storage](#file-uploads--storage)
6. [Performance Optimization](#performance-optimization)
7. [SEO & Analytics](#seo--analytics)
8. [Pre-Deployment Testing](#pre-deployment-testing)

---

## 🔒 FFirebase Security Rules

### ⚠️ CRÍTICO: Actualizar antes de producción

**Ubicación:** FFirebase Console → Firestore Database → Rules

**Estado Actual:** Reglas de desarrollo (permisivas para testing)

**Cambios Necesarios para Producción:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    function isSuperAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Solo el dueño puede leer su propio documento, o los admins
      allow read: if isOwner(userId) || isAdmin();
      // Solo el dueño puede editar su perfil, o los admins
      allow update: if isOwner(userId) || isAdmin();
      // Solo admins pueden crear y eliminar usuarios
      allow create, delete: if isAdmin();
    }
    
    // Inquiries collection
    match /inquiries/{inquiryId} {
      // Solo admins pueden leer
      allow read: if isAdmin();
      // Público puede crear (desde el formulario web)
      allow create: if true;
      // Solo admins pueden modificar/eliminar
      allow update, delete: if isAdmin();
    }
    
    // Projects collection
    match /projects/{projectId} {
      // Público puede leer solo proyectos publicados
      allow read: if resource.data.isPublished == true || isAdmin();
      // Solo admins pueden crear/editar/eliminar
      allow create, update, delete: if isAdmin();
    }
    
    // Quotes collection
    match /quotes/{quoteId} {
      // Solo admins pueden leer
      allow read: if isAdmin();
      // Público puede crear (desde el formulario web)
      allow create: if true;
      // Solo admins pueden modificar/eliminar
      allow update, delete: if isAdmin();
    }
    
    // Deletion Requests
    match /deletionRequests/{requestId} {
      // Solo admins pueden leer
      allow read: if isAdmin();
      // Admins pueden crear solicitudes
      allow create: if isAdmin();
      // Solo super admins pueden aprobar/rechazar
      allow update, delete: if isSuperAdmin();
    }
  }
}
```

### FFirebase Storage Rules

**Ubicación:** FFirebase Console → Storage → Rules

**Reglas para Producción:**

```javascript
rules_version = '2';
service fFirebase.storage {
  match /b/{bucket}/o {
    
    // Projects images
    match /projects/{imageId} {
      // Público puede leer
      allow read: if true;
      // Solo admins pueden escribir
      allow write: if request.auth != null && 
                      request.auth.token.role in ['admin', 'super_admin'];
    }
    
    // Quote documents
    match /quotes/{quoteId}/{document} {
      // Solo admins pueden leer/escribir
      allow read, write: if request.auth != null && 
                           request.auth.token.role in ['admin', 'super_admin'];
    }
  }
}
```

> **Nota:** Para que `request.auth.token.role` funcione, necesitas configurar Custom Claims en FFirebase Authentication.

---

## 🔐 Environment Variables

### Archivo: `.env.local` (Desarrollo)

```env
# FFirebase Configuration (Development)
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teravolta-41afd.fFirebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teravolta-41afd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teravolta-41afd.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### ⚠️ Para Producción:

1. **Crear un proyecto FFirebase separado para producción**
2. **Actualizar todas las variables en el hosting (Vercel/Netlify)**
3. **Nunca commitear `.env.local` al repositorio**

**Archivo `.env.production` (crear):**

```env
# FFirebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teravolta-prod.fFirebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teravolta-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teravolta-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-prod-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-prod-app-id

# Analytics (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ⚙️ Next.js Configuration

### Archivo: `next.config.ts`

**Estado Actual:**
```typescript
const nextConfig: NextConfig = {
  // Sin static export para permitir rutas dinámicas del admin
  images: {
    unoptimized: true,
  },
};
```

### ⚠️ Cambios para Producción:

```typescript
const nextConfig: NextConfig = {
  images: {
    // CAMBIAR: Habilitar optimización de imágenes
    unoptimized: false,
    domains: [
      'fFirebasestorage.googleapis.com', // Para imágenes de FFirebase
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // AGREGAR: Optimizaciones de producción
  reactStrictMode: true,
  poweredByHeader: false, // Ocultar header "X-Powered-By"
  
  // AGREGAR: Compresión
  compress: true,
  
  // OPCIONAL: Redirecciones
  async redirects() {
    return [
      // Ejemplo: redirigir /home a /
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // AGREGAR: Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};
```

---

## 👤 Authentication & Authorization

### Configurar Custom Claims (FFirebase)

Para que las Security Rules funcionen correctamente con roles, necesitas configurar Custom Claims:

**Opción 1: FFirebase Admin SDK (Recomendado para producción)**

Crear un Cloud Function para asignar roles:

```javascript
// functions/src/assignRole.js
const admin = require('fFirebase-admin');
admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Verificar que quien llama es super_admin
  if (!context.auth || context.auth.token.role !== 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can set roles');
  }

  try {
    await admin.auth().setCustomUserClaims(data.uid, {
      role: data.role // 'admin', 'super_admin', 'customer'
    });

    // Actualizar también en Firestore para consistencia
    await admin.firestore().collection('users').doc(data.uid).update({
      role: data.role
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

**Opción 2: Manualmente vía FFirebase Console (Solo para setup inicial)**

1. Ve a FFirebase Console → Authentication
2. Selecciona el usuario
3. En la pestaña "Custom claims", agrega: `{"role": "super_admin"}`

---

## 📁 File Uploads & Storage

### Límites de Tamaño

**Configurar en FFirebase Console → Storage:**

- **Imágenes de proyectos:** Máximo 5MB
- **Documentos (PDF/Excel/Word):** Máximo 10MB

### Validación en el Cliente

Ya implementado en:
- `aapp/admin/projects/[id]/page.tsx` - Imágenes
- `aapp/admin/quotes/[id]/page.tsx` - Documentos

### ⚠️ Agregar validación del lado del servidor

Crear Cloud Functions para validar archivos:

```javascript
// functions/src/validateUpload.js
exports.validateFileUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;
  const size = parseInt(object.size);

  // Validar tipo de archivo
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(contentType)) {
    // Eliminar archivo no permitido
    await admin.storage().bucket().file(filePath).delete();
    console.error(`File deleted: invalid type ${contentType}`);
    return;
  }

  // Validar tamaño (10MB)
  if (size > 10 * 1024 * 1024) {
    await admin.storage().bucket().file(filePath).delete();
    console.error(`File deleted: exceeds size limit`);
    return;
  }
});
```

---

## ⚡ Performance Optimization

### 1. Lazy Loading de Componentes Pesados

```typescript
// Ejemplo: En dashboard
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
});
```

### 2. Optimización de Firestore Queries

**Crear índices compuestos:**

FFirebase Console → Firestore → Indexes

Índices recomendados:
- `inquiries`: createdAt (desc)
- `projects`: isPublished (asc), createdAt (desc)
- `quotes`: status (asc), createdAt (desc)
- `notifications`: recipientId (asc), createdAt (desc)

### 3. Caching

Implementar estrategias de cache en las queries:

```typescript
// Ejemplo con React Query (opcional)
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

---

## 📊 SEO & Analytics

### Google Analytics

1. **Crear propiedad GA4**
2. **Agregar tracking ID a `.env.production`**
3. **Implementar en `aapp/layout.tsx`:**

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Meta Tags

Verificar que todas las páginas tengan:
- `<title>` único
- `<meta name="description">`
- Open Graph tags para redes sociales

---

## 🧪 Pre-Deployment Testing

### Checklist de Testing

- [ ] **Autenticación**
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Registro de usuarios
  - [ ] Recuperación de contraseña

- [ ] **Admin Dashboard**
  - [ ] Acceso basado en roles funciona
  - [ ] Dashboard muestra métricas correctas
  - [ ] Inquiries: List, Detail, Delete
  - [ ] Projects: List, Create, Edit, Image Upload, Publish
  - [ ] Quotes: List, Detail, Document Upload
  - [ ] Users: List, Filter
  - [ ] Requests: List, Approve/Reject (Super Admin)

- [ ] **Página Pública**
  - [ ] Home carga correctamente
  - [ ] Services muestra información
  - [ ] Projects muestra solo publicados
  - [ ] Contact form funciona
  - [ ] Quote form funciona

- [ ] **Responsive**
  - [ ] Mobile (< 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (> 1024px)

- [ ] **Performance**
  - [ ] Lighthouse score > 90
  - [ ] First Contentful Paint < 1.8s
  - [ ] Time to Interactive < 3.8s

---

## 🚀 Deployment Steps

### 1. Build Local

```bash
npm run build
```

Verificar que no haya errores.

### 2. Deploy a Vercel/Netlify

**Vercel (Recomendado):**

```bash
npm install -g vercel
vercel --prod
```

**Variables de Entorno en Vercel:**
1. Dashboard → Project → Settings → Environment Variables
2. Agregar todas las variables de `.env.production`

### 3. Configurar Dominio

1. Agregar dominio personalizado en Vercel
2. Configurar DNS en tu proveedor
3. Esperar propagación (24-48 horas)

### 4. Post-Deployment

- [ ] Verificar que todas las rutas funcionan
- [ ] Probar formularios de contacto/quote
- [ ] Verificar admin dashboard
- [ ] Revisar Security Rules en FFirebase
- [ ] Configurar monitoreo (FFirebase Analytics)

---

## 📞 Soporte & Maintenance

### Logs y Monitoreo

**FFirebase Console:**
- Firestore → Uso y facturación
- Storage → Archivos y tamaño
- Authentication → Usuarios activos

**Vercel Dashboard:**
- Analytics → Visitas y rendimiento
- Logs → Errores y warnings

### Backups

**Firestore:**
Configurar exports automáticos:
```bash
gcloud firestore export gs://[BUCKET_NAME]
```

**Storage:**
Backups manuales periódicos de archivos críticos.

---

## 🏗️ Final Architecture Cleanup

### ⚠️ CRÍTICO: Renombrar prefijo de rutas `/dev`

**Estado Actual:**
Las rutas del dashboard administrativo y de clientes viven bajo el prefijo `/dev` (ej. `/dev/admin`, `/dev/customer`). Esto fue útil durante el desarrollo para aislar la lógica.

**Cambio Necesario para Producción:**
Antes de lanzar, se recomienda renombrar el directorio `aapp/dev` a una ruta más profesional para el usuario final.

**Opciones Recomendadas:**
- `/portal` (ej. `teravolta.com/portal/login`)
- `/app` (ej. `teravolta.com/aapp/dashboard`)
- `/members`

**Pasos de Ejecución:**
1. Renombrar carpeta `aapp/dev` a `aapp/portal`.
2. Actualizar todas las referencias internas (Sidebar, Header, Login redirects).
3. Verificar `middleware.ts` si existen reglas de protección de rutas.
4. Actualizar `components/Header.tsx` y `aapp/portal/login/page.tsx` con las nuevas rutas.

---

## ✅ Checklist Final Pre-Lanzamiento

- [ ] FFirebase Security Rules actualizadas
- [ ] Storage Rules configuradas
- [ ] Variables de entorno de producción configuradas
- [ ] Custom Claims implementados
- [ ] Next.js config optimizado
- [ ] Headers de seguridad agregados
- [ ] Analytics configurado
- [ ] SEO verificado
- [ ] Testing completo realizado
- [ ] Build de producción exitoso
- [ ] Dominio configurado
- [ ] Backups configurados
- [ ] Monitoreo activo

---

**Última actualización:** 2026-01-01  
**Versión del proyecto:** 1.0.0  
**Contacto:** [Tu email de soporte]

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-01 ### Firestore Rules Update (Email Reply)
**Impact:** High  
**Requiere acción en producción:** Sí (`fFirebase deploy --only firestore:rules`)

- Added `match /messages/{messageId}` subcollection rule under `inquiries`.
- Allows Admins to read/write reply messages.
- Added `RESEND_API_KEY` environment variable for email sending.

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-01 ### Phase 2: Onboarding System
**Impact:** High  
**Requiere acción en producción:** Sí (`fFirebase deploy --only firestore:rules`)

**New API Routes:**
- `/api/create-magic-link` - Generates secure magic links for client onboarding
- `/api/send-onboarding-email` - Sends onboarding email via Resend

**New Pages:**
- `/onboard/[token]` - Client account activation page with password setup

**Firestore Rules Updated:**
- Added `magicLinks` collection (public read, admin create)
- Updated `activeProjects` rules (allow userId matching, allow client create)

**Database Collections:**
- `magicLinks` - Stores magic link tokens with 24h expiry
- `activeProjects` - Updated to link with userId from onboarding

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-01 ### Phase 3: Invoice Storage
**Impact:** Medium  
**Requiere acción en producción:** Sí (`fFirebase deploy --only storage`)

**Storage Rules Updated:**
- Added `invoices/{projectId}/{fileName}` rules (authenticated write/read)

**Functionality Added:**
- Invoice upload in admin project detail page
- Files stored at `invoices/{projectId}/{filename}`
- Download URL saved to `activeProjects.invoiceUrl`
- Customer portal shows invoice download button when available

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-02 ### Phase 4: Energy Efficiency Payments

> ⚠️ **CRITICAL: PAGO SIMULADO** - Implementar Stripe ANTES de producción

**Impact:** HIGH  
**Requiere acción en producción:** Sí - Integrar Stripe antes de ir a producción

**Archivos Modificados:**
- `/aapp/services/efficiency/contratar/ContratarFlow.tsx`
  - Agregados campos de contacto (nombre, email, teléfono, dirección)
  - `handleConfirmAppointment` ahora crea proyecto en Firestore
  - Envía magic link para creación automática de cuenta

**Flujo Actual (SIMULADO):**
1. Usuario completa formulario con datos de contacto + tarjeta
2. Pago "procesado" (simulado - solo espera 3 segundos)
3. Usuario selecciona fecha/hora de instalación
4. Al confirmar cita:
   - Se crea proyecto en `activeProjects` con `paymentStatus: 'paid'`
   - Se envía magic link por email para crear cuenta
5. Cliente recibe email y crea su cuenta

**ANTES DE PRODUCCIÓN:**
- [ ] Integrar Stripe Checkout o Payment Intents
- [ ] Remover simulación de pago (línea con comentario `⚠️ SIMULATED`)
- [ ] Agregar Stripe webhook para confirmar `paymentStatus`
- [ ] Agregar `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` a .env
### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-01 ### Future Features Noted: - Time display in local timezone for inquiries - Direct payment option for Eficiencia Energetica - Automatic invoice/quote PDF generation system (future phase)
---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-03 ### Staff Email Hosting Considerations

**Impact:** Medium  
**Requiere acción en producción:** No (configuración manual)

**Decisión Actual:**
- **Proveedor**: Zoho Mail Free (hasta 5 usuarios, 5GB/usuario)
- **Dominio**: `@teravolta.com`
- **Flujo**: Creación manual de cuentas en panel de Zoho

**Flujo de Onboarding Staff:**
1. Super Admin crea cuenta manualmente en Zoho Admin Panel
2. Super Admin registra al staff en el sistema (formulario)
3. Sistema envía email de bienvenida al correo personal con instrucciones
4. Staff configura su contraseña y accede

**Alternativas para Crecimiento Futuro:**
| Proveedor | Precio | API Disponible |
|-----------|--------|----------------|
| Zoho Mail Premium | $3/user/mes | ✅ Admin API |
| Google Workspace | $6/user/mes | ✅ Admin SDK |
| Hostinger | $0.59/user | ❌ Manual |
| Neo | $1.99/user | ❌ Manual |

**ANTES DE PRODUCCIÓN (si necesitan automatización):**
- [ ] Evaluar si automatización es necesaria
- [ ] Migrar a Zoho Premium o Google Workspace para API
- [ ] Implementar integración de API para creación automática

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-04 ### Audit & Onboarding Fix

**Impact:** Medium  
**Requiere acción en producción:** Sí (deploy de API routes)

**Problema Resuelto:** Error `auth/email-already-in-use` durante onboarding de admins

**Causa:** Cuando un admin es creado desde el dashboard, el usuario ya existe en FFirebase Auth. 
El onboarding intentaba crear el usuario de nuevo con `createUserWithEmailAndPassword`.

**Solución Implementada:**

1. **Nuevo API Endpoint:** `/api/update-user-password`
   - Actualiza contraseña de usuarios existentes vía FFirebase Admin SDK
   - Valida token de magic link por seguridad
   - Archivo: `aapp/api/update-user-password/route.ts`

2. **Onboarding Modificado:** `aapp/onboard/[token]/page.tsx`
   - Detecta error `auth/email-already-in-use`
   - Llama al nuevo API para actualizar contraseña
   - Hace sign-in automático con la nueva contraseña
   - Usa `{ merge: true }` en setDoc para no sobrescribir datos existentes

**Documentación Creada:**
Se creó carpeta `docs/` con documentación completa:
- `docs/ARCHITECTURE.md` - Arquitectura técnica y stack
- `docs/USER_FLOWS.md` - Flujos de usuario con diagramas Mermaid
- `docs/FIREBASE_REFERENCE.md` - Referencia de colecciones Firestore
- `docs/BRANDING.md` - Guía de branding (colores, tipografía, iconos)
- `docs/README.md` - Índice de documentación

**Auditoría Visual Completada:**
| Página | Estado |
|--------|--------|
| Home | ✅ |
| Services | ✅ |
| Quote Form | ✅ |
| Contratar Flow | ✅ |
| Contact | ✅ |
| Admin Dashboard | ✅ |
| Customer Portal | ✅ |

**Elementos de Branding Verificados:**
- Primary Blue: `#004a90`
- Dark Blue: `#194271`
- Accent Green: `#c3d021`
- Font: Gilroy (300-800 weights)
- Icons: RemixIcon (outline style)

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-05 ### Phase 5: UI/UX Enhancements & Feedback

**Impact:** Medium
**Requiere acción en producción:** No

**New UI Components & Integrations:**
- **Standardized Feedback**: Toast notifications, Skeleton loaders, and Empty states integrated site-wide.
- **Form Validation**: Real-time validation for Email/Phone fields in Quote, Contact, and Inquiry forms.
- **Upload Progress**: Resumable uploads with progress bars implemented for all file inputs (Quote, Portfolio Admin, Contact).
- **Security Rules (Storage)**: Storage rules must remain compatible with `uploadBytesResumable` which creates a resumable session.

**Files Modified:**
- `components/ui/Toast.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/EmptyState.tsx`
- `aapp/quote/page.tsx`
- `aapp/contact/page.tsx`
- `aapp/inquiry/InquiryForm.tsx`
- `aapp/portal/admin/portfolio/[id]/page.tsx`

---

**Última actualización:** 2026-01-05
**Versión del proyecto:** 1.0.2
**Documentación:** Ver carpeta `/docs` para referencia completa

---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-07 ### Phase 6: Technician Automation (Phase 1)
**Impact:** High
**Requiere acción en producción:** Sí (deploy de API + Firestore Rules)

**New API Routes:**
- `/api/availability` - Checks technician calendar availability (Server-Side)
- `/api/assign-technician` - Assigns technician, creates appointment & updates project

**Firestore Collections:**
- `appointments` - Stores field service visits.
- `activeProjects` - Added statuses: `pending_assignment`, `urgent_reschedule`.

**Security Improvements:**
- Moved availability logic to `fFirebase-admin` (API) to protect technician schedules.
- `appointments` collection secured (Technicians can only see their own).

---

**Última actualización:** 2026-01-07
**Versión del proyecto:** 1.1.0
**Documentación:** Ver carpeta `/docs` para referencia completa
---

### DEPLOYMENT_CHECKLIST UPDATE - 2026-01-08 ### Phase 6: Supabase Migration (Complete)
**Impact:** Critical
**Requiere acción en producción:** Só (Full Deployment)

**Architecture Changes:**
- **Database:** Migrated from FFirebase Firestore to Supabase (PostgreSQL).
- **Auth:** Migrated from FFirebase Auth to Supabase Auth.
- **Storage:** Migrated from FFirebase Storage to Supabase Storage (Buckets).

**Removed Dependencies:**
- Removed Firebase SDK and Firebase-admin.
- Removed lib/fFirebase.ts.

**New Documentation:**
- docs/SUPABASE_REFERENCE.md - Reference for new Tables and Buckets.
- docs/ARCHITECTURE.md - Updated to reflect new stack.

**Deployment Actions:**
1. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.
2. Ensure RESEND_API_KEY is set.
3. Run Database Migrations (if not already applied remotely).


- [ ] Create 'appointments' bucket in Supabase Storage (Public) for Technician evidence photos.

## 2026-01-09 - System Refinements & Document Schema Fixes
- **Impact Level**: Medium
- **Production Action Required**: Run migration reconcile_documents_schema_v2 (Already applied via MCP).
- **Changes**:
  - Rreconciled documents table schema with application data model.
  - Standardized translations and service labels (e.g., 'Energy Advocacy').
  - Implemented /api/notify-existing-client for manual project creation.
  - Fixed document transfer logic in /api/create-project.
- **Files Modified**: app/services/activeProjectService.ts, app/api/create-project/route.ts, components/ManualProjectWizard.tsx, app/portal/customer/projects/[id]/page.tsx.

## Future Roadmap & Realtime Configuration
- **Supabase Realtime**: Explicitly **DISABLED** in lib/supabase.ts (as of Jan 2026) to prevent unused WebSocket connections and console errors.
- **Future Requirements**:
  - **Live Chat**: Interaction between customers and technicians.
  - **Live Driver Tracking**: Real-time location updates.
- **Implementation Note**: When implementing these features, re-enable Realtime in lib/supabase.ts and configure channel-specific subscriptions to maintain performance.

