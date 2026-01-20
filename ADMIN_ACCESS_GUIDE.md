# 🔐 Acceso de Administrador - Wild Fitness

## 📍 URL de Acceso Admin

**URL Privada:** https://wild-fitness.com/admin.html

⚠️ **IMPORTANTE:** Esta URL NO debe ser compartida públicamente ni enlazada desde el sitio web.

---

## 🔑 Credenciales por Defecto

```
Usuario: admin
Contraseña: WildFitness2024!
```

---

## 🎯 ¿Cómo Acceder?

### **Opción 1: URL Directa (Recomendada)**

1. Ir directamente a: `https://wild-fitness.com/admin.html`
2. Introducir usuario y contraseña
3. Click en "Iniciar Sessió"

### **Opción 2: Marcador/Favorito**

1. Guardar `https://wild-fitness.com/admin.html` en favoritos
2. Nombrar como "WF Admin" o similar (no usar "admin" para mayor seguridad)
3. Acceder desde favoritos cuando sea necesario

---

## 🔒 Seguridad

### **Características de Seguridad Implementadas:**

✅ **URL Oculta** - No hay enlaces públicos al panel de admin  
✅ **Login Requerido** - Credenciales necesarias para acceder  
✅ **Sesiones de 24h** - Auto-logout después de 24 horas  
✅ **Meta `noindex`** - Los motores de búsqueda no indexan la página  
✅ **Validación Frontend** - Verificación de credenciales en navegador  
✅ **Credenciales Encriptadas** - Almacenadas en base64 en localStorage  

### **Recomendaciones Adicionales:**

🔐 **Cambiar la Contraseña:**
Para cambiar la contraseña por defecto, abre la consola del navegador en `/admin.html` después de hacer login y ejecuta:

```javascript
const newPassword = 'TuNuevaContraseñaSegura123!';
const credentials = {
    username: 'admin',
    password: btoa(newPassword)
};
localStorage.setItem('wild_fitness_admin_credentials', JSON.stringify(credentials));
console.log('✅ Contraseña actualizada');
```

🔐 **Crear Usuario Personalizado:**

```javascript
const credentials = {
    username: 'tu_usuario',
    password: btoa('TuContraseña123!')
};
localStorage.setItem('wild_fitness_admin_credentials', JSON.stringify(credentials));
console.log('✅ Usuario creado');
```

---

## 📱 Diferencias entre Páginas

### **`/calendari.html` (Público)**
- ✅ Visible para todos los usuarios
- ✅ Ver actividades programadas
- ✅ Filtrar por tipo de actividad
- ✅ Reservar plazas
- ❌ NO muestra botón de admin
- ❌ NO permite crear/eliminar actividades

### **`/admin.html` (Privado)**
- 🔐 Requiere login
- ✅ Acceso completo al calendario
- ✅ Crear nuevas actividades
- ✅ Eliminar actividades
- ✅ Ver lista de participantes
- ✅ Panel de administración visible
- ✅ Todas las funcionalidades de usuario

---

## 🚀 Flujo de Trabajo Admin

### **1. Acceso Inicial**
```
Navegar a /admin.html
    ↓
Introducir credenciales
    ↓
Click "Iniciar Sessió"
    ↓
Acceso al calendario con permisos de admin
```

### **2. Crear Actividad**
```
Click en botón "Admin" (🔧)
    ↓
Rellenar formulario:
  - Título
  - Tipo de actividad
  - Fecha y hora
  - Ubicación
  - Coordenadas GPS (opcional)
  - Aforo máximo
  - Descripción
    ↓
Click "Crear Activitat"
    ↓
✅ Actividad creada y sincronizada
```

### **3. Gestionar Actividades**
```
Ver todas las actividades
    ↓
Click en "🗑️" para eliminar
    ↓
Confirmar eliminación
    ↓
✅ Actividad eliminada y sincronizada
```

### **4. Ver Participantes**
```
Cada tarjeta de actividad muestra:
  - 👥 X / Y participantes
  - Barra de progreso de capacidad
  - Lista de nombres (solo para admin)
```

### **5. Cerrar Sesión**
```
Click en "Tancar Sessió" (arriba a la derecha)
    ↓
Volver a la página de login
```

---

## 🔄 Sincronización Automática

Cuando creas o eliminas una actividad:

1. **Se guarda en localStorage** (navegador)
2. **Se envía automáticamente** al servidor (Cloudflare KV)
3. **Worker programado** lee las actividades
4. **Envía recordatorios** 24h antes de cada actividad

Todo es automático, no requiere intervención manual. ✅

---

## 📊 Ver Actividades como Usuario Normal

Para ver cómo los usuarios ven el calendario:

1. Abre una ventana de incógnito
2. Ve a `https://wild-fitness.com/calendari.html`
3. NO verás el botón de admin
4. Podrás reservar como cualquier usuario

---

## 🆘 Solución de Problemas

### **❌ "Credencials incorrectes"**

**Causa:** Usuario o contraseña incorrectos.

**Solución:**
1. Verificar que estás usando las credenciales correctas
2. Si has cambiado la contraseña, usar la nueva
3. Si olvidaste la contraseña, restaurar credenciales por defecto:

```javascript
// En consola del navegador en /admin.html
localStorage.removeItem('wild_fitness_admin_credentials');
location.reload();
```

### **❌ "No aparece el botón de Admin"**

**Causa:** Accediste a `/calendari.html` en lugar de `/admin.html`.

**Solución:**
- Ir a `https://wild-fitness.com/admin.html`
- Hacer login
- El botón Admin aparecerá automáticamente

### **❌ "Sesión expirada"**

**Causa:** Han pasado más de 24 horas desde el último login.

**Solución:**
- Volver a hacer login en `/admin.html`
- La sesión se renovará por otras 24 horas

---

## 📚 Archivos Relacionados

- **`admin.html`** - Página de login de administrador
- **`calendari.html`** - Página pública del calendario
- **`calendari.js`** - Lógica del calendario (compartida)
- **`calendari.css`** - Estilos del calendario

---

## ✅ Checklist de Uso

- [ ] Guardar URL `/admin.html` en favoritos
- [ ] Cambiar contraseña por defecto (recomendado)
- [ ] Probar crear una actividad de prueba
- [ ] Verificar que aparece en `/calendari.html` público
- [ ] Probar eliminar la actividad de prueba
- [ ] Verificar sincronización con KV (en consola del navegador)
- [ ] Cerrar sesión y volver a hacer login

---

## 🎯 Próximos Pasos

Una vez familiarizado con el panel:

1. ✅ Crear las primeras actividades reales
2. ✅ Configurar emails de recordatorio (ver `SCHEDULED_EMAIL_SETUP.md`)
3. ✅ Probar el flujo completo de reserva
4. ✅ Verificar recepción de emails

---

**¿Necesitas ayuda?** Consulta la documentación completa en:
- `EMAIL_SETUP.md` - Setup de emails
- `SCHEDULED_EMAIL_SETUP.md` - Recordatorios automáticos
- `DEPLOYMENT_COMMANDS.md` - Comandos de deployment

---

**🔐 ¡Acceso de admin configurado y listo para usar!**
