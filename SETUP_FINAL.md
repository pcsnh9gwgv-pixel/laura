# 🚀 Setup Final - Wild Fitness

## ✅ Cambios Implementados

### 📸 **1. GALERÍA DE FOTOS**
He añadido 3 fotos profesionales de Laura en la página principal:

**Ubicación:** Entre "Sobre Laura" y "Especialitats"

**Fotos añadidas:**
- `laura-trail-1.jpg` (180 KB) - Laura en acción durante trail running
- `laura-trail-2.jpg` (260 KB) - Laura en competición
- `laura-training-group.jpg` (165 KB) - Entrenamiento en grupo al atardecer

**Características:**
- ✅ Grid de 3 columnas en desktop
- ✅ 1 columna en móvil
- ✅ Hover effects con overlay y zoom
- ✅ Lazy loading para performance
- ✅ Responsive design completo

---

### 📧 **2. FORMULARIO DE CONTACTO CON SUPABASE**

He integrado completamente Supabase para gestionar los contactos del sitio web.

**Archivo actualizado:** `contacte.html`

**Funcionalidades:**
- ✅ Envío a Supabase directamente
- ✅ Validación de campos
- ✅ Estados de loading ("Enviant...")
- ✅ Mensajes de éxito/error
- ✅ Fallback a WhatsApp si hay error
- ✅ Reset del formulario después de enviar

---

## 🗄️ **3. CONFIGURAR SUPABASE**

### **PASO 1: Crear la Tabla**

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Click en **SQL Editor** (menú lateral izquierdo)
3. Click en **New Query**
4. Copia **TODO el contenido** del archivo `supabase-contact-table.sql`
5. Pégalo en el editor
6. Click en **Run** (o presiona Ctrl+Enter)

**Resultado esperado:**
```
Success: CREATE TABLE
Success: CREATE INDEX (3x)
Success: CREATE POLICY (4x)
Success: CREATE FUNCTION
Success: CREATE TRIGGER
Success: CREATE VIEW
```

### **PASO 2: Verificar la Tabla**

En el SQL Editor, ejecuta:
```sql
SELECT * FROM contact_submissions LIMIT 1;
```

Debería devolver 0 rows (tabla vacía pero funcional).

### **PASO 3: Probar Insert**

```sql
INSERT INTO contact_submissions (name, email, phone, location, service, message)
VALUES ('Test User', 'test@example.com', '640915772', 'barcelona', 'trail', 'Mensaje de prueba');
```

Si funciona, verás: `Success: INSERT 0 1`

### **PASO 4: Ver en Table Editor**

1. Click en **Table Editor** (menú lateral)
2. Selecciona tabla **contact_submissions**
3. Deberías ver el registro de prueba

---

## 🎯 **ESTRUCTURA DE LA TABLA**

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único (auto-generado) |
| `name` | TEXT | Nombre completo (requerido) |
| `email` | TEXT | Email (requerido) |
| `phone` | TEXT | Teléfono (opcional) |
| `location` | TEXT | Barcelona/Girona/Online/Altre |
| `service` | TEXT | Trail/Força/Trekking/Online/Mixte |
| `message` | TEXT | Mensaje con objetivos (requerido) |
| `created_at` | TIMESTAMP | Fecha de creación (auto) |
| `status` | TEXT | new/contacted/converted/archived |
| `notes` | TEXT | Notas internas del admin |

---

## 🔐 **SEGURIDAD (RLS)**

La tabla tiene **Row Level Security** habilitado:

✅ **Público puede:**
- Insertar registros (enviar formulario)

✅ **Solo admins pueden:**
- Ver todos los registros
- Actualizar registros (cambiar status, añadir notas)
- Eliminar registros

**Emails admin autorizados:**
- `laura@wildbreathing.com`
- `info@wildbreathing.com`

---

## 📱 **CÓMO FUNCIONA EL FORMULARIO**

### **Usuario envía formulario:**
1. Usuario rellena el formulario en `/contacte.html`
2. Click en "Enviar Sol·licitud"
3. JavaScript valida los campos
4. Envía datos a Supabase
5. Muestra mensaje de éxito
6. Formulario se resetea

### **Admin ve los contactos:**
Hay dos opciones:

**Opción A: Supabase Dashboard**
1. Ve a https://supabase.com/dashboard
2. Table Editor → contact_submissions
3. Ve todos los contactos con filtros y búsqueda

**Opción B: Admin Dashboard (tu sitio)**
1. Ve a https://wildbreathing.com/admin.html
2. Login con tus credenciales
3. (Necesitarás agregar una sección de contactos)

---

## 🔔 **NOTIFICACIONES (OPCIONAL)**

La tabla tiene un **trigger** que se ejecuta cuando llega un nuevo contacto.

Para recibir emails automáticos:

### **Método 1: Supabase Webhooks**
1. Supabase Dashboard → Database → Webhooks
2. Create a new webhook
3. Table: `contact_submissions`
4. Events: `INSERT`
5. Type: HTTP request
6. URL: Tu servicio de emails (Zapier, Make, etc.)

### **Método 2: Edge Function + Resend**
```javascript
// Crear en Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'resend'

const resend = new Resend('tu_api_key_resend')

serve(async (req) => {
  const { record } = await req.json()
  
  await resend.emails.send({
    from: 'Wild Fitness <notificaciones@wildbreathing.com>',
    to: 'laura@wildbreathing.com',
    subject: `Nuevo contacto: ${record.name}`,
    html: `
      <h2>Nuevo contacto recibido</h2>
      <p><strong>Nombre:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Teléfono:</strong> ${record.phone}</p>
      <p><strong>Ubicación:</strong> ${record.location}</p>
      <p><strong>Servicio:</strong> ${record.service}</p>
      <p><strong>Mensaje:</strong><br>${record.message}</p>
    `
  })
  
  return new Response('OK')
})
```

---

## 📊 **VISTA ADMIN (OPCIONAL)**

He creado una vista SQL `contact_submissions_summary` que muestra:
- Resumen de cada contacto
- Preview del mensaje (primeros 100 caracteres)
- Categoría de edad (new/recent/old)

Úsala en tu admin dashboard:
```sql
SELECT * FROM contact_submissions_summary;
```

---

## 🧪 **TESTING**

### **Test 1: Formulario Funcional**
1. Ve a: https://wildbreathing.com/contacte.html
2. Rellena todos los campos
3. Click "Enviar Sol·licitud"
4. Deberías ver: "✅ Formulari enviat correctament!"

### **Test 2: Verificar en Supabase**
1. Supabase Dashboard → Table Editor
2. contact_submissions
3. Deberías ver el registro recién enviado

### **Test 3: Error Handling**
1. Desconecta internet (modo avión)
2. Intenta enviar formulario
3. Deberías ver: "❌ Error al enviar..." con link a WhatsApp

---

## 🎨 **GALERÍA DE FOTOS**

### **Desktop:**
```
┌────────────┬────────────┬────────────┐
│  Foto 1    │  Foto 2    │  Foto 3    │
│ Trail 1    │ Trail 2    │ Training   │
│  (hover    │  (hover    │  (hover    │
│   zoom)    │   zoom)    │   zoom)    │
└────────────┴────────────┴────────────┘
```

### **Mobile:**
```
┌─────────────────┐
│    Foto 1       │
│   Trail 1       │
├─────────────────┤
│    Foto 2       │
│   Trail 2       │
├─────────────────┤
│    Foto 3       │
│   Training      │
└─────────────────┘
```

---

## 📋 **CHECKLIST POST-DEPLOYMENT**

Después de que Cloudflare despliegue los cambios:

### ✅ **Fotos:**
- [ ] Las 3 fotos se ven correctamente
- [ ] Hover effects funcionan (zoom + overlay)
- [ ] Responsive en móvil (1 columna)
- [ ] Lazy loading funciona (inspeccionar con DevTools)

### ✅ **Formulario:**
- [ ] Ejecutar SQL en Supabase (crear tabla)
- [ ] Probar envío de formulario
- [ ] Verificar datos en Supabase Table Editor
- [ ] Probar error handling (sin internet)
- [ ] Verificar que redirect a WhatsApp funciona

### ✅ **Menú Móvil:**
- [ ] Purgar caché de Cloudflare (CRÍTICO)
- [ ] Limpiar caché del navegador móvil
- [ ] Probar debug-mobile-menu.html
- [ ] Verificar menú principal funciona

---

## 🚀 **DEPLOYMENT**

**Estado actual:**
✅ Commit: `07ea6c6`
✅ Pusheado a: `origin/main`
⏳ Esperando: Despliegue automático en Cloudflare Pages

**Para forzar deployment:**
1. https://dash.cloudflare.com/
2. Workers & Pages → Proyecto `laura`
3. Deployments → Busca `07ea6c6`
4. "..." → "Retry deployment"

**Después del deployment:**
1. **PURGA CACHÉ:** Caching → Purge Everything
2. Espera 30 segundos
3. Prueba el sitio en móvil
4. Hard refresh (Ctrl+Shift+R)

---

## 🔗 **URLs IMPORTANTES**

- **Sitio:** https://wildbreathing.com/
- **Contacto:** https://wildbreathing.com/contacte.html
- **Debug menu:** https://wildbreathing.com/debug-mobile-menu.html
- **Cloudflare:** https://dash.cloudflare.com/
- **Supabase:** https://supabase.com/dashboard

---

## 📞 **SOPORTE**

Si algo no funciona:

1. **Fotos no aparecen:**
   - Verifica que se desplegaron: `/images/laura-trail-*.jpg`
   - Purga caché de Cloudflare

2. **Formulario no envía:**
   - Verifica que ejecutaste el SQL en Supabase
   - Abre consola del navegador (F12) para ver errores
   - Verifica que `supabase-config.js` tiene las credenciales correctas

3. **Menú móvil no funciona:**
   - Purga caché de Cloudflare (CRÍTICO)
   - Prueba debug-mobile-menu.html
   - Limpiar caché navegador móvil

---

## 🎉 **RESULTADO FINAL**

Tu sitio ahora tiene:
- ✅ Galería profesional de fotos de Laura
- ✅ Sistema completo de gestión de contactos
- ✅ Integración con Supabase
- ✅ Formulario con validación y feedback
- ✅ Fallback a WhatsApp
- ✅ Admin dashboard ready
- ✅ Notificaciones configurables

**Última actualización:** 2026-01-20
**Commit:** `07ea6c6`
