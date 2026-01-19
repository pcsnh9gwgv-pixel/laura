# 📧 Configuración del Formulario de Contacto

Este documento explica cómo configurar el formulario de contacto para gestionar los datos de los clientes mediante servicios externos gratuitos.

## 🎯 Opciones de Base de Datos Externa Gratuita

### Opción 1: Formspree (Recomendado) ⭐

**Formspree** es el servicio más simple y recomendado para gestionar formularios sin backend.

#### Características:
- ✅ **100% Gratuito** hasta 50 envíos/mes
- ✅ Recibe los datos por **email**
- ✅ Dashboard web para ver todos los envíos
- ✅ Protección anti-spam incluida
- ✅ Sin necesidad de programación backend
- ✅ Exportación de datos a CSV

#### Configuración:

1. **Registrarse en Formspree:**
   - Visita: https://formspree.io/
   - Crea una cuenta gratuita con tu email
   - Verifica tu cuenta

2. **Crear un nuevo formulario:**
   - Haz clic en "New Form"
   - Dale un nombre: "Wild Fitness - Contacto"
   - Copia el **Form ID** (formato: `f/xxxxxxxxxxx`)

3. **Actualizar el código:**
   - Abre el archivo `index.html`
   - Busca la línea (aproximadamente línea 264):
     ```html
     <form id="contactForm" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```
   - Reemplaza `YOUR_FORM_ID` con tu ID real:
     ```html
     <form id="contactForm" class="contact-form" action="https://formspree.io/f/xvgopbld" method="POST">
     ```

4. **¡Listo!** 🎉
   - Los mensajes llegarán a tu email
   - Puedes ver todos los envíos en el dashboard de Formspree
   - Exporta los datos cuando quieras

---

### Opción 2: Google Sheets + Google Apps Script

**Guarda los datos directamente en una hoja de cálculo de Google.**

#### Características:
- ✅ **100% Gratuito** sin límites
- ✅ Los datos se guardan en **Google Sheets**
- ✅ Fácil de analizar y exportar
- ✅ Notificaciones por email opcionales

#### Configuración:

1. **Crear Google Sheet:**
   - Abre: https://sheets.google.com
   - Crea una nueva hoja: "Wild Fitness - Contactos"
   - En la primera fila añade los encabezados:
     ```
     Timestamp | Nombre | Email | Teléfono | Nivel | Mensaje
     ```

2. **Crear Google Apps Script:**
   - En Google Sheets, ve a: **Extensiones > Apps Script**
   - Borra el código predeterminado
   - Pega este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const params = e.parameter;
    
    // Agregar fila con los datos
    sheet.appendRow([
      new Date(),
      params.name || '',
      params.email || '',
      params.phone || '',
      params.level || '',
      params.message || ''
    ]);
    
    // Enviar email de notificación (opcional)
    MailApp.sendEmail({
      to: 'info@wild-fitness.com', // Cambia por tu email
      subject: '🏔️ Nuevo contacto Wild Fitness',
      body: `Nuevo mensaje de contacto:
      
Nombre: ${params.name}
Email: ${params.email}
Teléfono: ${params.phone}
Nivel: ${params.level}
Mensaje: ${params.message}

Fecha: ${new Date().toLocaleString('es-ES')}`
    });
    
    // Respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Implementar el script:**
   - Haz clic en **Implementar > Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Copia la **URL de la implementación**

4. **Actualizar JavaScript:**
   - Abre `script.js`
   - Busca la sección del formulario (línea ~130)
   - Reemplaza la URL de Formspree por tu URL de Google Apps Script:

```javascript
const response = await fetch('TU_URL_DE_GOOGLE_APPS_SCRIPT', {
    method: 'POST',
    body: formData
});
```

---

### Opción 3: EmailJS

**Envía emails directamente desde JavaScript sin backend.**

#### Características:
- ✅ **200 emails/mes gratis**
- ✅ Sin backend necesario
- ✅ Múltiples plantillas de email
- ✅ Integración rápida

#### Configuración:

1. **Registrarse:** https://www.emailjs.com/
2. **Configurar servicio de email** (Gmail, Outlook, etc.)
3. **Crear plantilla de email**
4. **Obtener:** User ID, Service ID, Template ID
5. **Actualizar el código** siguiendo la documentación de EmailJS

---

### Opción 4: Basin

**Servicio especializado en formularios.**

#### Características:
- ✅ **100 envíos/mes gratis**
- ✅ Dashboard limpio
- ✅ Protección anti-spam
- ✅ Webhooks disponibles

#### Configuración:

1. **Registrarse:** https://usebasin.com/
2. **Crear formulario**
3. **Obtener endpoint URL**
4. **Actualizar `action` del formulario**

---

## 🔒 Seguridad y GDPR

### Política de Privacidad

**IMPORTANTE:** Debes tener una página de política de privacidad que explique:
- Qué datos recoges
- Cómo los usas
- Dónde se almacenan
- Derechos del usuario (acceso, rectificación, eliminación)

### Checkbox de Consentimiento

El formulario ya incluye un checkbox obligatorio:
```html
<input type="checkbox" id="privacy" name="privacy" required>
<label for="privacy">Accepto la política de privacitat</label>
```

### Protección Anti-Spam

Considera añadir:
- **reCAPTCHA v3** de Google (invisible, gratuito)
- **Honeypot fields** (campo oculto para detectar bots)
- Rate limiting en el servidor

---

## 📊 Ver y Gestionar los Datos

### Con Formspree:
1. Inicia sesión en https://formspree.io/
2. Ve a tu proyecto "Wild Fitness"
3. Haz clic en "Submissions"
4. Exporta a CSV cuando necesites

### Con Google Sheets:
1. Abre tu hoja de Google Sheets
2. Los datos aparecen automáticamente
3. Usa filtros, gráficos, fórmulas
4. Exporta a Excel/CSV cuando quieras

### Notificaciones Email:
Ambas opciones pueden enviar notificaciones a tu email cada vez que recibas un nuevo contacto.

---

## 🧪 Probar el Formulario

1. **Abre tu web** en un navegador
2. **Rellena el formulario** con datos de prueba
3. **Envía** el formulario
4. **Verifica:**
   - ✅ Mensaje de éxito aparece
   - ✅ Recibiste el email / los datos en Sheets
   - ✅ El formulario se resetea

---

## 🆘 Solución de Problemas

### El formulario no envía:

1. **Verifica la URL/ID** en el atributo `action`
2. **Abre la consola** del navegador (F12) y busca errores
3. **Prueba con un email real** (algunos servicios validan emails)
4. **Revisa CORS:** Formspree y Google Apps Script deben permitir tu dominio

### No recibo emails:

1. **Revisa spam/correo no deseado**
2. **Verifica el email** en la configuración del servicio
3. **Comprueba límites** de tu plan gratuito

### Errores de CORS:

- Formspree: Automáticamente configurado
- Google Apps Script: Asegúrate de que "Quién tiene acceso" es "Cualquier persona"

---

## 💡 Consejos Adicionales

### Automatización con Zapier/Make:
Conecta Formspree o Google Sheets con:
- 📧 Email marketing (Mailchimp, Brevo)
- 📊 CRM (HubSpot, Pipedrive)
- 💬 Slack, Discord, Telegram
- 📅 Google Calendar

### Analytics:
El formulario ya tiene tracking integrado con Google Analytics (si está configurado):
```javascript
gtag('event', 'form_submission', {
    'event_category': 'Contact',
    'event_label': 'Contact Form'
});
```

### Campos Adicionales:
Para añadir más campos al formulario:
1. Añade el HTML del campo en `index.html`
2. Añade los estilos en `styles.css` (ya preparado)
3. Actualiza la hoja de Google Sheets con el nuevo encabezado

---

## 🎯 Recomendación Final

**Para empezar:** Usa **Formspree**
- Es la opción más rápida
- Sin configuración compleja
- Dashboard profesional
- 50 envíos/mes es suficiente para empezar

**Para escalar:** Usa **Google Sheets**
- Sin límites de envíos
- Máximo control de los datos
- Fácil de integrar con otras herramientas
- Gratis para siempre

---

## 📞 Soporte

Si tienes problemas con la configuración:
- Revisa la documentación oficial de cada servicio
- Busca en Stack Overflow
- Contacta con el soporte del servicio elegido

---

**¡El formulario está listo para recibir clientes!** 🎉

Configura Formspree en 5 minutos y empieza a recibir mensajes.
