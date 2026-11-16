<div align="center">

# ☕ Café Rústico

**Sitio web multipágina para una cafetería de especialidad urbana con alma rústica.**
HTML5 semántico, CSS3 moderno y JavaScript vanilla: sin frameworks, sin dependencias de build y pensado para cargar rápido incluso con datos móviles.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-C48B5A?style=for-the-badge)

</div>

---

## 📑 Contenido

- [Descripción](#-descripción)
- [Páginas](#-páginas)
- [Características](#-características)
- [Rendimiento](#-rendimiento)
- [Accesibilidad](#-accesibilidad)
- [Seguridad del formulario](#-seguridad-del-formulario)
- [Sistema de diseño](#-sistema-de-diseño)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación y uso](#-instalación-y-uso)
- [Despliegue](#-despliegue)
- [Licencia](#-licencia)

---

## 📖 Descripción

**Café Rústico** es el frontend de una cafetería contemporánea. Presenta la identidad de la marca, un menú filtrable por categorías, un sistema de reservas que envía la solicitud directamente por **WhatsApp** y una sección de reseñas de la comunidad.

El proyecto prioriza tres cosas: una experiencia visual cuidada, **peso de página bajo** (menos de 3 MB en total, video incluido) y accesibilidad.

---

## 🗂 Páginas

| Página | Archivo | Contenido |
|---|---|---|
| **Inicio** | `index.html` | Hero con video de fondo, reservas, ubicación con mapa y footer |
| **Menú** | `menu.html` | Cafés, bebidas frías, postres y alimentos con filtros por categoría |
| **Comunidad** | `comunidad.html` | Testimonios y formulario demo para escribir una reseña |

---

## ✨ Características

- **Hero con video de fondo**: video ligero alojado en el propio proyecto, con versión específica para móviles y póster que se pinta al instante.
- **Navbar dinámico**: transparente sobre el hero y sólido al hacer scroll; menú hamburguesa en móvil y *scrollspy* que resalta la sección visible.
- **Menú filtrable**: filtrado por categoría con animaciones de entrada y estado `aria-pressed` en los botones.
- **Reservas por WhatsApp**: el formulario valida en tiempo real (fecha, hora, teléfono y correo) y genera un mensaje prellenado que abre `wa.me` con todos los datos de la reserva.
- **Validación de fecha y hora**: no permite fechas pasadas, y si la reserva es para hoy la hora debe ser posterior a la actual.
- **Mapa de ubicación**: el iframe de Google Maps se inyecta por JavaScript para no bloquear la carga inicial.
- **Reseñas de la comunidad**: panel colapsable con calificación por estrellas y feedback visual (demo de interfaz, sin backend).
- **Animaciones al hacer scroll**: *reveal* con `IntersectionObserver` y retrasos escalonados en grupos de tarjetas.
- **Botón flotante de WhatsApp** para contacto directo desde cualquier página.
- **Diseño responsivo** con CSS Grid, Flexbox y Custom Properties.

---

## ⚡ Rendimiento

| Recurso | Antes | Ahora |
|---|---|---|
| Video del hero | 16 MB (UHD 2560×1440 desde CDN externo) | **2.1 MB** (720p) · **1.1 MB** (480p en móvil) |
| Póster del hero | 137 KB JPG externo | **74 KB WebP** local |
| Peso total de `index.html` | > 16 MB | **≈ 2.9 MB** escritorio · **≈ 1.9 MB** móvil |

Técnicas aplicadas:

- Video **H.264** a CRF 26, **sin pista de audio** y con `-movflags +faststart` para que empiece a reproducirse antes de terminar de descargar.
- `<source media="(max-width: 768px)">` sirve la versión **854×480** en pantallas pequeñas.
- Póster en **WebP** con `<link rel="preload">` para un primer pintado rápido.
- Imágenes secundarias con `loading="lazy"` y mapa inyectado bajo demanda.
- Librería de íconos anclada a una versión fija y cargada con `defer`.

<details>
<summary><strong>Regenerar los videos del hero con ffmpeg</strong></summary>

```bash
# 720p (escritorio)
ffmpeg -i original.mp4 -an -vf "scale=1280:720:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart \
  public/assets/videos/hero-720p.mp4

# 480p (móvil)
ffmpeg -i original.mp4 -an -vf "scale=854:480:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -profile:v main -movflags +faststart \
  public/assets/videos/hero-480p.mp4
```

</details>

---

## ♿ Accesibilidad

- **`prefers-reduced-motion`**: si el usuario lo tiene activado, el video del hero **no se descarga** y solo se muestra el póster estático. También se desactivan las animaciones de entrada y del botón flotante. Hay un respaldo en CSS por si JavaScript está desactivado.
- HTML semántico (`nav`, `main`, `section`, `footer`) e idioma declarado (`lang="es"`).
- Errores de validación anunciados a lectores de pantalla con `role="alert"` y `aria-describedby`.
- Filtros del menú con `aria-pressed` y botón de WhatsApp con `aria-label`.
- Contraste de la paleta pensado para texto claro sobre el overlay oscuro del hero.

---

## 🛡 Seguridad del formulario

El formulario de reservas no tiene backend, pero incluye protecciones del lado del cliente contra spam y bots:

- **Honeypot doble**: dos campos invisibles que solo rellenan los bots; si tienen contenido, el envío se descarta.
- **Trampa de tiempo**: rechaza formularios completados en menos de 3 segundos.
- **Límite de frecuencia**: un envío cada 45 segundos por navegador.
- **Filtro de spam**: bloquea enlaces y etiquetas HTML en los campos de texto libre.
- **Sanitización**: elimina `<` y `>` antes de construir el mensaje, que además se codifica con `encodeURIComponent`.

> Estas medidas reducen el abuso casual, pero no sustituyen a una validación del lado del servidor si en el futuro se agrega un backend.

---

## 🎨 Sistema de diseño

**Paleta** (definida como variables en `css/style.css`):

| Token | Color | Uso |
|---|---|---|
| `--color-primary` | `#352A22` | Espresso: textos y fondos oscuros |
| `--color-secondary` | `#C48B5A` | Canela: acentos y botones |
| `--color-surface` | `#EBE5D9` | Latte: superficies y tarjetas |
| `--color-bg-light` | `#FCFAED` | Crema: fondo general |
| `--color-text-muted` | `#6E5C4C` | Textos secundarios |
| `--color-success-sage` | `#3A6B4F` | Estados de éxito |

**Tipografías** (Google Fonts): **Roboto Slab** para títulos, **DM Sans** para el cuerpo e **Italiana** como acento decorativo.

**Íconos**: [Lucide](https://lucide.dev) y Font Awesome.

---

## 📁 Estructura del proyecto

```text
coffee-shop/
├── index.html              # Inicio: hero, reservas y ubicación
├── menu.html               # Menú con filtros por categoría
├── comunidad.html          # Reseñas y testimonios
├── css/
│   ├── style.css           # Estilos globales, tokens y layout
│   ├── menu.css            # Estilos específicos del menú
│   └── animations.css      # Animaciones y reduced-motion
├── js/
│   └── main.js             # Navbar, scroll reveal, filtros, reservas, mapa y reseñas
├── public/
│   ├── cafe_icono.ico
│   └── assets/
│       ├── images/
│       │   ├── hero/       # Póster WebP del hero
│       │   └── logo/       # Logo SVG
│       └── videos/         # Video del hero en 720p y 480p
└── package.json
```

---

## 🚀 Instalación y uso

Requisitos: **Git** y **Node.js 18+** (solo para el servidor de desarrollo).

```bash
# 1. Clona el repositorio
git clone https://github.com/jp-software-dev/coffee-shop.git
cd coffee-shop

# 2. Levanta el servidor local con recarga automática
npx live-server
```

El sitio es 100 % estático: también puedes abrirlo con cualquier servidor HTTP, por ejemplo `python -m http.server`.

---

## 🌐 Despliegue

Al ser un sitio estático, se puede publicar en **GitHub Pages**, **Netlify** o **Vercel** sin configuración adicional. El `package.json` incluye un script para GitHub Pages:

```bash
npx gh-pages -d .
```

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**.
