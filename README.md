# Wild Fitness - Entrenamiento de Montaña Profesional

![Wild Fitness](https://img.shields.io/badge/Mountain-Training-2D5016?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-4CAF50?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-D84315?style=for-the-badge)

## 🏔️ Sobre el Proyecto

**Wild Fitness** es una plataforma web profesional dedicada al entrenamiento de montaña, trail running y fitness outdoor. Diseñada para atletas que buscan conquistar cumbres y mejorar su rendimiento en deportes de montaña.

## ✨ Características

- **Diseño Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **SEO Optimizado**: Configurado para máxima visibilidad en buscadores
- **Performance**: Carga rápida y optimizada
- **Programas de Entrenamiento**: 3 niveles diferentes adaptados a cada atleta
- **Sección de Testimonios**: Historias reales de atletas
- **📧 Formulario de Contacto Completo**: Sistema integrado con base de datos externa
- **Gestión de Clientes**: Almacenamiento automático en Formspree o Google Sheets
- **Animaciones Suaves**: Experiencia de usuario fluida y profesional

## 🚀 Tecnologías

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS y flexbox/grid
- **JavaScript Vanilla**: Sin dependencias, código limpio y eficiente
- **Google Fonts**: Tipografías Montserrat y Open Sans
- **GitHub Pages**: Hosting gratuito y confiable

## 📂 Estructura del Proyecto

```
wild-fitness/
├── index.html          # Página principal
├── blog.html           # Página de blog
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
├── CNAME              # Configuración de dominio personalizado
├── FORMULARIO-CONTACTO.md  # Guía de configuración del formulario
└── README.md          # Documentación
```

## 🌐 Despliegue

El sitio está configurado para desplegarse automáticamente en GitHub Pages con el dominio personalizado **wild-fitness.com**.

### Configuración DNS (Cloudflare)

Registros DNS necesarios:
```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www wild-fitness.com
```

### SSL/TLS (Cloudflare)

- **Encryption Mode**: Full (strict)
- **Always Use HTTPS**: Activado
- **TLS Version**: 1.2+
- **HSTS**: Habilitado

## 🎨 Paleta de Colores

- **Primary Teal**: `#2d7d7d` (Verde azulado profundo)
- **Secondary Turquoise**: `#3fb5b5` (Turquesa brillante)
- **Accent Light**: `#5fcaca` (Turquesa claro)
- **Overlay**: `rgba(45, 125, 125, 0.75)` (Capa turquesa)
- **Text**: `#1e293b` (Negro principal)
- **Background**: `#f0f9f9` (Gris-turquesa muy claro)

## 📱 Secciones

1. **Hero Section**: Impacto visual con imagen de montaña y overlay turquesa
2. **Badges de Credibilidad**: Certificación ROPEC, 50+ alumnos, contenido exclusivo
3. **Botones de Acción**: Prova Gratuïta y WhatsApp directo
4. **Features**: 4 características principales del servicio
5. **Programas**: 3 niveles de entrenamiento con precios
6. **Sobre Mí**: Historia del entrenador y certificaciones
7. **Testimonios**: 3 historias reales de clientes
8. **Galería**: Imágenes de entrenamiento
9. **Blog Preview**: Últimos artículos del blog
10. **📧 Formulario de Contacto Completo**: Con gestión de datos externa
11. **CTA**: Llamada a la acción para consulta gratuita
12. **Footer**: Links, contacto y legal

## 🔧 Personalización

### Configurar el Formulario de Contacto

**IMPORTANTE:** El formulario necesita configuración para funcionar.

**Opción 1 - Formspree (Recomendado):**
1. Regístrate gratis en https://formspree.io/
2. Crea un nuevo formulario
3. Copia tu Form ID (ej: `xvgopbld`)
4. En `index.html` línea ~264, reemplaza:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   por:
   ```html
   action="https://formspree.io/f/xvgopbld"
   ```

**Opción 2 - Google Sheets:**
Ver documentación completa en `FORMULARIO-CONTACTO.md`

### Actualizar Información de Contacto

Edita estos valores en `index.html`:

```html
<!-- Email -->
<a href="mailto:TU_EMAIL@wild-fitness.com">TU_EMAIL@wild-fitness.com</a>

<!-- WhatsApp -->
<a href="https://wa.me/34TU_NUMERO">+34 XXX XXX XXX</a>
```

### Cambiar Precios

En la sección de programas, actualiza:

```html
<span class="price-amount">€XX</span>
```

### Agregar Imágenes Reales

Reemplaza los placeholders con imágenes reales:

1. Crea carpeta `/images`
2. Agrega tus fotos
3. Actualiza las rutas en CSS/HTML

## 📊 SEO

- **Title**: Wild Fitness - Entrenamiento de Montaña Profesional
- **Description**: Programas de entrenamiento para montaña, trail running y fitness outdoor
- **Keywords**: entrenamiento montaña, trail running, fitness outdoor, hiking training

## 🔒 Seguridad

- HTTPS forzado via Cloudflare
- Sin dependencias externas vulnerables
- Validación de formularios
- Headers de seguridad configurados

## 📈 Analytics (Opcional)

Para agregar Google Analytics, añade antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Próximas Mejoras

- [x] Formulario de contacto completo con BD externa
- [x] Diseño turquesa/teal moderno
- [x] Hero section mejorado con badges
- [ ] Blog de consejos de entrenamiento ✅ (Implementado)
- [ ] Sistema de reservas online
- [ ] Área de cliente privada
- [ ] Calculadora de nivel fitness
- [ ] Integración con Strava
- [ ] Tienda online de planes
- [ ] CRM integrado para gestión de clientes

## 📝 Licencia

© 2024 Wild Fitness. Todos los derechos reservados.

## 👤 Contacto

- **Email**: info@wild-fitness.com
- **Web**: https://wild-fitness.com
- **WhatsApp**: +34 600 000 000

---

**Hecho con 💚 para los amantes de la montaña**

🏔️ **Wild Fitness** - Conquista tus cumbres
