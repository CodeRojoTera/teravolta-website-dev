# Test Data Population Script

Este script crea datos de prueba completos en Firebase para poblar el dashboard admin.

## Usuarios de Prueba

El script crea 6 usuarios de prueba con el siguiente flujo:

1. **aal35v@outlook.com** - Alberto Alvarado (Consulting)
2. **aal30v@outlook.com** - Ana López (Energy Efficiency) 
3. **martines.aquiles.64@outlook.com** - Aquiles Martínez (Advocacy)
4. **juan.mckclain@hotmail.com** - Juan McClain (Consulting)
5. **gian.varela.5533@gmail.com** - Gian Varela (Energy Efficiency)
6. **aal20v@fsu.edu** - Alejandro Alvarado (Advocacy)

## Datos Creados por Usuario

Para cada usuario se crea:

### 1. Usuario (users collection)
- Email, nombre, teléfono
- Rol: customer
- Fecha de creación

### 2. Consulta (inquiries collection)
- Información del cliente
- Servicio solicitado
- Estado: completed
- Fecha aleatoria (últimos 60 días)

### 3. Cotización (quotes collection)
- Monto aleatorio ($5,000 - $20,000)
- Estado variado (pending_review, approved, paid)
- 2 documentos de prueba adjuntos
- Fecha 2 días después de la consulta

### 4. Proyecto Activo (activeProjects collection)
- Solo para cotizaciones con estado "paid"
- Progreso aleatorio (20-80%)
- 2-4 actualizaciones de progreso
- Estado: active

### 5. Proyecto Portfolio (portfolioProjects collection)
- 1 proyecto completado destacado
- Para demostrar portfolio público

## Archivos de Prueba

Los archivos en `user test files/` se suben a Firebase Storage y se adjuntan a las cotizaciones:
- PDFs
- Excel (.xlsx)
- Word (.docx)
- Imágenes (.jpg, .png)

## Prerequisitos

1. Tener `serviceAccountKey.json` en la carpeta `scripts/`
2. Instalar dependencias: `npm install firebase-admin`
3. Tener los archivos de prueba en `user test files/`

## Uso

```bash
cd scripts
node populate-test-data.js
```

## Resultados Esperados

- 6 usuarios creados
- 6 consultas (todas completed)
- 6 cotizaciones con documentos
- ~4 proyectos activos
- 1 proyecto en portfolio
- ~12 documentos subidos a Storage

## Limpieza

Para limpiar datos de prueba, usa Firebase Console o crea un script de limpieza.

## Notas

- Los datos tienen fechas aleatorias de los últimos 60-90 días
- Los montos son aleatorios entre $5,000 y $20,000
- Los archivos se suben a `test-data/{userId}/{tipo}/` en Storage
- Todos los archivos subidos son públicos para facilitar acceso
