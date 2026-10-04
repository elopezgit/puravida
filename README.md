# Hongos Pura Vida — landing

Landing de marca y catálogo para **Hongos Pura Vida**, elixires de hongos
medicinales de Tucumán, Argentina. Sirve como MVP: no procesa pagos, arma el
pedido y lo deriva a WhatsApp (que es como el negocio ya vendía).

---

## Correrla

```bash
npm install
npm run dev
```

Queda en `http://localhost:5173` (también en la red local, por si querés
mirarla desde el celu).

El puerto 5173 tiene `strictPort`, así que si está ocupado el servidor **falla
con un error claro** en vez de saltar al siguiente puerto libre en silencio. Es
a propósito: si otro proyecto tiene el 5173 atado a `localhost`, saltar de
puerto deja dos servidores compitiendo y abrir `localhost:5173` muestra el otro
sitio, que parece que esta web no arranca. Si te pasa, liberá el puerto:

```powershell
netstat -ano | Select-String ':5173'   # busca el PID
Stop-Process -Id <PID> -Force
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Typecheck + build de producción a `dist/` |
| `npm run preview` | Sirve `dist/` para revisar el build |
| `npm run typecheck` | Solo TypeScript |
| `npm run check` | Verifica que el dev server sirva todos los módulos y assets (ver abajo) |
| `npm run check:copy` | Barre el texto en busca de basura o copy sin revisar |
| `npm run check:tokens` | Detecta clases que apuntan a tokens de color inexistentes |
| `npm run check:contrast` | Calcula el contraste WCAG de la paleta contra los fondos reales |
| `npm run check:legibility` | Calcula el contraste del texto **tal como lo pinta el navegador**, con las opacidades ya aplicadas |
| `npm run check:text-size` | Verifica que ningún texto quede por debajo de 12 px |
| `npm run check:assets` | Avisa qué archivo de `public/` no usa nadie y si algún asset referenciado falta en disco |
| `npm run check:build` | Verifica el build de `dist/` servido por `npm run preview` (requiere el preview corriendo) |
| `npm run check:all` | TypeScript + copy + tokens + contraste + legibilidad + tamaño de texto + assets |
| `npm run optimize` | Recomprime imágenes y video de `public/media` (herramienta opcional) |

Sin variables de entorno ni claves: abre y funciona.

---

## Stack

- **Vite 7** + **React 19** + **TypeScript** estricto
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, con `@theme` y `@utility`)
- **motion** (framer-motion v12) para las animaciones
- **lenis** para el scroll suave
- **lucide-react** para los íconos

Sin backend, sin base de datos, sin pasarela de pago. `dist/` es estático y se
puede subir a cualquier hosting.

---

## Estructura

```
puravida/                    # raíz del proyecto: acá se corre npm run dev
├─ index.html              # SEO, Open Graph, curtain de carga (#boot)
├─ docs/                   # material de origen del negocio (no se importa)
│  ├─ infobase.txt         #   links y contactos
│  └─ notas.txt            #   copys de venta de Instagram
├─ assets/                 # originales fuera del bundle
│  └─ social-originales/   #   capturas de Instagram y avatar en JPEG
├─ public/
│  ├─ favicon.svg
│  └─ media/               # fotos de producto, carruseles, video de taller,
│     └─ social/           #   posts de Instagram y avatar (WebP)
├─ scripts/
│  ├─ check-dev.mjs        # verifica que nada caiga al fallback de la SPA
│  ├─ check-copy.mjs       # barre basura de texto y copy sin revisar
│  ├─ check-tokens.mjs     # detecta clases con tokens de color inexistentes
│  ├─ check-contrast.mjs   # contraste WCAG de la paleta contra los fondos
│  ├─ check-legibility.mjs # contraste real del código, opacidades incluidas
│  ├─ check-text-size.mjs  # avisa texto por debajo de 12px
│  ├─ check-assets.mjs     # assets sin usar y assets referenciados ausentes
│  ├─ check-build.mjs      # verifica el build de dist/ servido por preview
│  └─ optimize-media.mjs   # recomprime imágenes (WebP) y video (H.264)
└─ src/
   ├─ main.tsx             # monta React + Lenis
   ├─ App.tsx              # ensambla las secciones en orden
   ├─ styles/index.css     # sistema de diseño: tokens, glassmorphism, grano
   ├─ lib/
   │  ├─ products.ts       # ⭐ catálogo real (15 productos) + ejes + categorías
   │  ├─ site.ts           # ⭐ datos del negocio: contactos, FAQ, ritual, stats
   │  ├─ motion.ts         # curvas y duraciones compartidas
   │  ├─ hooks.ts          # useInView, useCountUp, useMediaQuery, useBodyLock
   │  ├─ smooth.ts         # singleton de Lenis (solo escritorio) + scrollTo
   │  └─ utils.ts          # cn() y helpers
   ├─ store/cart.tsx       # carrito + localStorage + mensaje de WhatsApp
   ├─ components/
   │  ├─ layout/           # Preloader, Nav, Toasts
   │  ├─ ui/               # Reveal/SplitText, Glass/Button/Chip, Atmosphere
   │  └─ shop/             # ProductCard, ProductModal, CartDrawer
   └─ sections/            # Hero, Promises, Manifesto, Method, Catalog,
                           # Finder, Ritual, Testimonials, Social, Shipping,
                           # Faq, Cta, Footer
```

`src/lib/products.ts` y `src/lib/site.ts` son la fuente de verdad. Para cambiar
precios, textos o el número de WhatsApp, se edita ahí y nada más.

---

## Secciones

| # | Sección | Qué hace |
| --- | --- | --- |
| — | Preloader | Cortina de carga con el logo y las fotos reales |
| 01 | Hero | Slideshow de 5 fondos (fotos + video), frascos flotantes con parallax y tilt 3D, cifras |
| 02 | Promises | Tira de garantías que se desplaza |
| 03 | Manifesto | Texto de posicionamiento, con cita sticky |
| 04 | Method | Los 3 pilares: extracción cíclica, cavitación acústica, trazabilidad |
| 05 | Catalog | Grilla con filtros, búsqueda, orden y **modal de producto** |
| 06 | Finder | "¿Qué te pasa hoy?" — recomendador que devuelve 3 productos |
| 07 | Ritual | El día en tres momentos: mañana, tarde, noche |
| 08 | Testimonials | 6 testimonios reales, uno con foto |
| 09 | Social | Posts reales de Instagram + link a la cuenta |
| 10 | Shipping | Los tres pasos de compra y los tres WhatsApp por provincia |
| 11 | Faq | 8 preguntas reales (adaptógenos, dosis, medicación, envíos, pago) |
| 12 | Cta | Cierre + formulario que abre WhatsApp con el mensaje armado |
| — | Footer | Navegación, contactos, aviso legal |

---

## Detalles técnicos

**Sistema de diseño.** Todo sale de `src/styles/index.css`. La paleta se sacó
de las piezas reales de la marca: oro `#d6ae6a`, crema `#f7efe2`, tinta
`#0b0906`, arcilla `#a57e5e`. Tres familias: Fraunces (display), Inter (texto),
JetBrains Mono (etiquetas y datos).

**Glassmorphism.** Dos intensidades (`glass` y `glass-strong`) más una utilidad
`edge-light` que dibuja el reflejo del borde superior, que es lo que hace que el
vidrio parezca vidrio y no un rectángulo gris.

**Movimiento.** `Reveal` y `SplitText` animan por línea/palabra con un stagger;
`useInView` dispara una sola vez; `useCountUp` sube las cifras cuando entran en
pantalla. Todo respeta `prefers-reduced-motion`.

Dos detalles que no son obvios y salen de bugs reales:

- `Reveal` borra su `transform` y su `filter` al terminar la animación. Framer
  Motion los deja puestos en línea aunque el estado final sea "no movido", y
  cualquier ancestro con `transform` o `filter` se convierte en marco de
  referencia: eso desactiva de golpe el `position: sticky` de los descendientes
  (la barra de filtros, el panel de contacto, las columnas laterales) y el
  `position: fixed` (el botón de WhatsApp). Sin la limpieza, medio layout
  flotaba.
- El paralaje de scroll de Manifiesto y Ritual solo corre por debajo de `lg`,
  porque es ancestro de una columna `lg:sticky` y el transform lo anula.

**Máscaras de texto.** `SplitText` envuelve cada palabra en `.text-mask`, que
es `overflow: hidden` con `padding-block` y el `margin-block` negativo
equivalente. Sin ese aire, con interlineado apretado la caja del recorte queda
más baja que la letra y se come los acentos: "Dónde" perdía el tilde de la "é" y
"transformación" la de la "ó". Por eso el desplazamiento inicial es de 130% y
no de 100%: la palabra tiene que arrancar por debajo del padding de la máscara
para aparecer del todo escondida.

**Legibilidad.** Hay tres capas de control, porque una sola no alcanza:

- `npm run check:contrast` mide los **tokens** de la paleta contra los cuatro
  fondos reales. La paleta pasa entera.
- `npm run check:legibility` mide el **código**: cada `text-<familia>-<n>` que
  aparece en los `.tsx`, con su modificador de opacidad ya compuesto sobre el
  fondo. Esta es la capa que importa, porque es donde se colaba lo ilegible:
  `text-gold-500/60` sobre el cristal no es gold-500, es gold-500 al 60% y queda
  en 2,57:1. El token pasaba 5,10:1 y el texto real no se leía. Hay 5
  combinaciones así repartidas en 24 lugares (etiquetas de sección, eyebrows,
  números de índice, precio tachado); se subieron de tono y ahora el peor
  caso del proyecto está en 4,8:1.
- `npm run check:tokens` caza clases que apuntan a un token inexistente.
  Tailwind v4 no avisa en ese caso: simplemente no genera la utilidad y el
  elemento hereda el color del padre.

Además, **ningún texto baja de 12 px**. El sitio usa mucho microtexto en mono
mayúscula con tracking abierto, y por debajo de 12 px eso deja de leerse en un
celular a plena luz del día. Se ауñó el piso de 0,7/0,72/0,74rem a 0,75rem en 80
lugares: la diferencia es de menos de 1 px, así que no movió ningún layout.

**Scroll.** Lenis solo en punteros finos (mouse o trackpad). En táctil se apaga:
el scroll nativo del celular ya viene con inercia y con el comportamiento
correcto al arrastrar, y meterle un motor propio lo vuelve pastoso, pelea con
el rebote y gasta batería en un `requestAnimationFrame` que no para. El rAF
también se detiene con la pestaña en segundo plano.

**Cursor.** El del sistema, en todas partes. `index.css` pone `cursor: pointer`
en links y botones y `cursor: text` en los campos. No hay puntero propio ni
efecto de seguimiento.

**Carrito.** Vive en `src/store/cart.tsx`, se guarda en `localStorage` y
genera el mensaje de WhatsApp con el detalle del pedido. El checkout es un
`wa.me` con el texto ya escrito — no se toca la tarjeta ni se guardan datos.
En celular entra como hoja desde abajo; en escritorio, como panel lateral.

**Mobile first.** El diseño arranca en 360 px y recién después se ensancha:

- el scroll suave es solo de escritorio, y por lo tanto los saltos a sección
  usan `scrollTo` con el offset medido sobre la nav real (que cambia de alto
  según esté scrolleada);
- todo control táctil mide al menos 44×44 px, con la barra visible adentro: la
  paginación de los testimonios, por ejemplo, se ve como un pill de 3 px pero
  el botón que lo maneja mide 44×44, porque un dedo nunca cae en 3 px;
- los paddings inferiores de las hojas superpuestas respetan
  `env(safe-area-inset-bottom)`, para la barra de inicio del iPhone;
- el botón de WhatsApp vive en `App.tsx`, no dentro de una sección, para que
  ningún ancestro pueda contenerlo.

**Finder.** El recomendador no es magia: cada producto declara en qué ejes
funciona (`axes`) y con qué frase te recognise (`para`). Se filtran por eje y se
suman los que mejor encajan.

**Assets.** Todo local en `public/media/`. Las fotos y los posts se descargaron
del negocio, se pasaron a WebP y el video se transcodificó: el conjunto pasó de
~44 MB a ~3,2 MB. `npm run check:assets` avisa si algún archivo de `public/`
queda sin referenciar: como `public/` se copia entero a `dist/`, un original sin
usar igual viaja en cada build. Los originales que no usa la web (capturas de
Instagram, el avatar en JPEG) están en `assets/social-originales/`, fuera del
bundle.

**Fuentes.** Van por CDN de Google Fonts, así que hace falta internet para
verlas tal como están diseñadas. Sin conexión habría que alojarlas en el mismo
proyecto.

---

## Datos del negocio

Todo el copy viene de la documentación real del negocio
(`docs/infobase.txt` y `docs/notas.txt`) y del catálogo publicado, no se
inventó nada.

- **15 referencias**: 10 elixires simples (un hongo) y 5 blends (dos o tres).
- **50 ml** por frasco, **3 ciclos** de extracción, **cavitación acústica**.
- **3 WhatsApp** por zona: Tucumán, Salta y Córdoba (en `CONTACTS`).
- Envíos a todo el país; pago en efectivo o transferencia.

Si cambia un precio o un número, se edita `src/lib/products.ts` o
`src/lib/site.ts` y listo.

---

## Herramientas opcionales

`npm run check` y `npm run build` andan sin instalar nada más. Para
`npm run optimize` hacen falta dos paquetes que no son dependencia de la app
(son pesados y solo se usan al comprimir assets):

```bash
npm i -D sharp ffmpeg-static
npm run optimize
```

`optimize` pasa todo `public/media` a WebP y recodifica los videos a 720p H.264.
El script avisa y no toca nada si las herramientas no están.

---

## Antes de publicar

- [ ] Confirmar precios y stock contra el catálogo real (se took un snapshot).
- [ ] Revisar los tres números de WhatsApp.
- [ ] Cambiar el aviso legal del footer por los datos fiscales reales.
- [ ] Self-hostear las fuentes si va a haber público sin buena conexión.
- [ ] Definir el dominio y ajustar las URLs de Open Graph en `index.html`.