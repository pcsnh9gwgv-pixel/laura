# 📋 Estado del Menú Móvil y Formulario de Contacto

## 🔴 PROBLEMA 1: Menú Móvil No Se Muestra

### Estado Actual:
El menú móvil **sigue sin mostrarse** después de múltiples intentos de corrección.

### Diagnóstico:
He identificado varios intentos de solución:
1. ✅ Añadido `!important` a estilos CSS
2. ✅ Eliminado código CSS duplicado
3. ✅ Verificado JavaScript de toggle
4. ❌ **El problema persiste**

### Posibles Causas:
1. **Caché del navegador/Cloudflare** no está actualizando los archivos CSS/JS
2. **Conflicto de JavaScript** entre múltiples archivos
3. **CSS no se está aplicando** correctamente en producción
4. **Build/deployment** no está tomando los últimos cambios

### 🧪 Archivo de Prueba Creado:
He creado `debug-mobile-menu.html` - una versión simplificada para diagnosticar:
- URL de prueba: `https://wildbreathing.com/debug-mobile-menu.html`
- CSS inline (no depende de styles.css)
- JavaScript minimalista
- Debug logging en consola

### ✅ Pasos para Diagnosticar:

#### **Opción 1: Probar archivo debug**
1. Abre en móvil: `https://wildbreathing.com/debug-mobile-menu.html`
2. Si este funciona → El problema está en styles.css o script.js del sitio principal
3. Si este NO funciona → El problema es de deployment/caché

#### **Opción 2: Limpiar caché completo**
```bash
# En tu navegador móvil:
1. Settings → Clear browsing data
2. Select "Cached images and files"
3. Select "All time"
4. Clear data
5. Reload wildbreathing.com
```

#### **Opción 3: Forzar purge de caché de Cloudflare**
1. Ve a: https://dash.cloudflare.com/
2. Tu dominio → Caching → Configuration
3. Click "Purge Everything"
4. Confirma
5. Espera 30 segundos
6. Prueba el sitio

#### **Opción 4: Verificar archivos desplegados**
```bash
# Verificar que styles.css tiene los cambios:
curl -I https://wildbreathing.com/styles.css
# Debe mostrar "last-modified" reciente

# Descargar y revisar:
curl https://wildbreathing.com/styles.css | grep "nav-list li"
# Debe mostrar: display: block !important;
```

---

## 📧 PROBLEMA 2: Formulario de Contacto

### Estado Actual:
El formulario en `/contacte.html` está configurado con **Formspree**, NO con Supabase.

### Configuración Actual:

**Archivo:** `contacte.html` (línea 84)
```html
<form class="contact-form" id="contactForm" 
      action="https://formspree.io/f/YOUR_FORM_ID" 
      method="POST">
```

### ⚠️ PROBLEMA: `YOUR_FORM_ID` es un placeholder

**Estado:** ❌ El formulario NO está funcional porque falta el ID real de Formspree.

---

## 🔧 SOLUCIONES PARA EL FORMULARIO

### **Opción A: Usar Formspree (más simple)**

#### **Paso 1: Crear cuenta Formspree**
1. Ve a: https://formspree.io/
2. Registra tu cuenta (gratis)
3. Crea un nuevo form
4. Copia el Form ID (ejemplo: `xayzdbqr`)

#### **Paso 2: Actualizar contacte.html**
Cambiar:
```html
action="https://formspree.io/f/YOUR_FORM_ID"
```
Por:
```html
action="https://formspree.io/f/xayzdbqr"  <!-- Tu ID real -->
```

#### **Ventajas de Formspree:**
- ✅ Setup en 5 minutos
- ✅ Recibe emails directamente
- ✅ Sin backend necesario
- ✅ 50 submissions/mes gratis
- ✅ Protección anti-spam

---

### **Opción B: Usar Supabase (más avanzado)**

Ya tienes Supabase configurado en el proyecto para otras funcionalidades (calendari, admin).

#### **Paso 1: Crear tabla en Supabase**
```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_level TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy para permitir inserts públicos
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Policy para admins (leer todos)
CREATE POLICY "Allow admin read" ON contact_submissions
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'laura@wildbreathing.com'
  );
```

#### **Paso 2: Actualizar contacte.html**
Reemplazar el form action y añadir JavaScript:

```html
<form class="contact-form" id="contactForm">
  <!-- campos del formulario -->
</form>

<script type="module">
import { supabase } from './supabase-config.js';

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    experience_level: document.getElementById('experience').value,
    message: document.getElementById('message').value
  };
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([formData]);
  
  if (error) {
    alert('Error al enviar el formulario: ' + error.message);
  } else {
    alert('¡Formulario enviado! Te contactaremos pronto.');
    document.getElementById('contactForm').reset();
  }
});
</script>
```

#### **Ventajas de Supabase:**
- ✅ Control total de los datos
- ✅ Integración con el resto del sistema
- ✅ Dashboard para ver submissions
- ✅ Notificaciones personalizadas posibles
- ✅ Gratis hasta 500MB storage

---

## 📊 COMPARACIÓN: Formspree vs Supabase

| Característica | Formspree | Supabase |
|----------------|-----------|----------|
| **Setup Time** | 5 min ⚡ | 30 min 🔧 |
| **Dificultad** | Fácil 🟢 | Medio 🟡 |
| **Notificación Email** | Automática ✅ | Manual (webhooks) ⚠️ |
| **Almacenamiento** | En Formspree | En tu DB ✅ |
| **Control de datos** | Limitado | Total ✅ |
| **Límite gratis** | 50/mes | Ilimitado ✅ |
| **Anti-spam** | Incluido ✅ | Manual ⚠️ |

---

## 🎯 RECOMENDACIÓN

### **Para Lanzar Rápido:** 
👉 **Usa Formspree**
- Setup en 5 minutos
- Funciona inmediatamente
- Recibes emails automáticos

### **Para Largo Plazo:**
👉 **Migra a Supabase**
- Mayor control
- Integración con admin dashboard
- Sin límites de submissions
- Datos en tu propiedad

---

## 📝 CHECKLIST DE ACCIONES

### ✅ Menú Móvil:
- [ ] Purgar caché de Cloudflare
- [ ] Probar debug-mobile-menu.html
- [ ] Verificar que styles.css se actualizó
- [ ] Limpiar caché del navegador móvil
- [ ] Si nada funciona: Revisar deployment logs en Cloudflare

### ✅ Formulario de Contacto:

**Opción A (Rápida):**
- [ ] Crear cuenta Formspree
- [ ] Obtener Form ID
- [ ] Actualizar contacte.html con ID real
- [ ] Commit y deploy
- [ ] Probar envío de formulario

**Opción B (Avanzada):**
- [ ] Crear tabla en Supabase
- [ ] Configurar RLS policies
- [ ] Actualizar contacte.html con JavaScript
- [ ] Añadir manejo de errores
- [ ] Configurar email notifications (opcional)
- [ ] Probar envío de formulario

---

## 🔗 URLs Útiles

- **Página principal:** https://wildbreathing.com/
- **Contacto:** https://wildbreathing.com/contacte.html
- **Debug menu:** https://wildbreathing.com/debug-mobile-menu.html
- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Formspree:** https://formspree.io/
- **Supabase:** https://supabase.com/

---

## 💡 NOTA IMPORTANTE SOBRE EL MENÚ MÓVIL

Si después de:
1. Purgar caché de Cloudflare
2. Limpiar caché del navegador
3. Verificar que debug-mobile-menu.html funciona

**El menú SIGUE sin funcionar**, entonces necesitamos:

### Investigar más a fondo:
```javascript
// En consola del móvil (DevTools):
console.log('Nav List:', document.querySelector('.nav-list'));
console.log('Nav Toggle:', document.querySelector('.nav-toggle'));
console.log('Computed display:', 
  window.getComputedStyle(document.querySelector('.nav-list')).display
);
console.log('Computed transform:', 
  window.getComputedStyle(document.querySelector('.nav-list')).transform
);
```

Si los elementos existen pero no son visibles, el problema es **CSS**.  
Si los elementos no existen, el problema es **HTML/JavaScript**.

---

**Última actualización:** 2026-01-20  
**Commits relacionados:**
- `f04aadd` - Remove duplicate CSS rules
- `b690bd8` - Fix mobile menu visibility
- `a16d1f2` - Add debug mobile menu page
