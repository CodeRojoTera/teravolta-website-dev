# 🚀 TeraVolta - Production Deployment Checklist

Este documento contiene todas las configuraciones, ajustes y consideraciones necesarias para llevar el proyecto TeraVolta de desarrollo a producción de manera segura.

---

## 📋 Tabla de Contenidos

1. [Firebase Security Rules](#firebase-security-rules)
2. [Environment Variables](#environment-variables)
3. [Next.js Configuration](#nextjs-configuration)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Uploads & Storage](#file-uploads--storage)
6. [Performance Optimization](#performance-optimization)
7. [SEO & Analytics](#seo--analytics)
8. [Pre-Deployment Testing](#pre-deployment-testing)

---

## 🔒 Firebase Security Rules

### ⚠️ CRÍTICO: Actualizar antes de producción

**Ubicación:** Firebase Console → Firestore Database → Rules

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

### Firebase Storage Rules

**Ubicación:** Firebase Console → Storage → Rules

**Reglas para Producción:**

```javascript
rules_version = '2';
service firebase.storage {
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

> **Nota:** Para que `request.auth.token.role` funcione, necesitas configurar Custom Claims en Firebase Authentication.

---

## 🔐 Environment Variables

### Archivo: `.env.local` (Desarrollo)

```env
# Firebase Configuration (Development)
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teravolta-41afd.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teravolta-41afd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teravolta-41afd.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### ⚠️ Para Producción:

1. **Crear un proyecto Firebase separado para producción**
2. **Actualizar todas las variables en el hosting (Vercel/Netlify)**
3. **Nunca commitear `.env.local` al repositorio**

**Archivo `.env.production` (crear):**

```env
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teravolta-prod.firebaseapp.com
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
      'firebasestorage.googleapis.com', // Para imágenes de Firebase
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

### Configurar Custom Claims (Firebase)

Para que las Security Rules funcionen correctamente con roles, necesitas configurar Custom Claims:

**Opción 1: Firebase Admin SDK (Recomendado para producción)**

Crear un Cloud Function para asignar roles:

```javascript
// functions/src/assignRole.js
const admin = require('firebase-admin');
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

**Opción 2: Manualmente vía Firebase Console (Solo para setup inicial)**

1. Ve a Firebase Console → Authentication
2. Selecciona el usuario
3. En la pestaña "Custom claims", agrega: `{"role": "super_admin"}`

---

## 📁 File Uploads & Storage

### Límites de Tamaño

**Configurar en Firebase Console → Storage:**

- **Imágenes de proyectos:** Máximo 5MB
- **Documentos (PDF/Excel/Word):** Máximo 10MB

### Validación en el Cliente

Ya implementado en:
- `app/admin/projects/[id]/page.tsx` - Imágenes
- `app/admin/quotes/[id]/page.tsx` - Documentos

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

Firebase Console → Firestore → Indexes

Índices recomendados:
- `inquiries`: createdAt (desc)
- `projects`: isPublished (asc), createdAt (desc)
- `quotes`: status (asc), createdAt (desc)

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
3. **Implementar en `app/layout.tsx`:**

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
- [ ] Revisar Security Rules en Firebase
- [ ] Configurar monitoreo (Firebase Analytics)

---

## 📞 Soporte & Maintenance

### Logs y Monitoreo

**Firebase Console:**
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

## ✅ Checklist Final Pre-Lanzamiento

- [ ] Firebase Security Rules actualizadas
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
# # #   D E P L O Y M E N T _ C H E C K L I S T   U P D A T E   -   2 0 2 6 - 0 1 - 0 1   # # #   F u t u r e   F e a t u r e s   N o t e d :   -   T i m e   d i s p l a y   i n   l o c a l   t i m e z o n e   f o r   i n q u i r i e s   -   D i r e c t   p a y m e n t   o p t i o n   f o r   E f i c i e n c i a   E n e r g e t i c a   -   A u t o m a t i c   i n v o i c e / q u o t e   P D F   g e n e r a t i o n   s y s t e m   ( f u t u r e   p h a s e )  
 