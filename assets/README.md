# Material original de marca

Archivos de partida, **fuera de `public/` a propósito**.

`public/` se copia entera a `dist/` en cada build, así que un PNG de 500 KB que
la web no referencia igual suma bytes a todos los deploys. Esto vive acá para
guardar el original sin arrastrarlo al bundle.

| Archivo | Qué es |
| --- | --- |
| `instagram-captura-01..05.png` | Capturas de publicaciones de Instagram, en el orden en que se descargaron. Sin usar en el sitio. |
| `avatar-original.jpg` | El avatar de Instagram en JPEG, 150×150. La web ya usa la versión WebP de `public/media/social/avatar.webp`. |

## Si querés usarlas en la web

1. Pasarlas por el optimizador, que las deja en WebP:

   ```bash
   npm i -D sharp
   npm run optimize
   ```

2. Copiar el resultado a `public/media/social/` con un nombre con sentido
   (`post-<producto>.webp`, `post-<producto>-b.webp`, …).
3. Agregarlas en `src/lib/site.ts`, en la lista de posts de Instagram.
4. Correr `npm run check:assets` para confirmar que quedaron referenciadas.

`npm run check:assets` avisa si algún archivo de `public/` no lo usa nadie, que
es la forma de que este tipo de material no vuelva a colarse en el bundle.
