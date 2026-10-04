# Documentación de origen

Acá vive el material de texto con el que se escribió la web. **No es código y
no se importa en ningún lado**: son las notas del negocio, conservadas tal como
llegaron, para que se pueda revisar de dónde salió cada frase y volver a la
fuente si hay que corregir algo.

| Archivo | Qué es |
| --- | --- |
| `infobase.txt` | Links y datos de contacto del negocio: Instagram, Linktree y la app de producción. Es lo que originó los WhatsApp, el link de Instagram y el nombre de la cuenta que aparecen en el footer y en la sección Social. |
| `notas.txt` | Dos copys de venta completos (el combo Rhodiola + Cordyceps y el Reishi), escritos para Instagram. De acá salen el tono en voseo, las Promesas del Hero y buena parte del FAQ. |

## Dónde se volcó cada cosa

- Contactos, zonas de envío y WhatsApp → `src/lib/site.ts` (`CONTACTS`)
- Productos, precios, descripciones y stock → `src/lib/products.ts`
- Preguntas frecuentes → `src/lib/site.ts` (`FAQ`)
- Tono y frases de venta → secciones `Promises`, `Hero`, `Ritual`, `Cta` y `Faq`

Si cambia un precio, un stock o un número de WhatsApp, el archivo a editar es
`src/lib/products.ts` o `src/lib/site.ts`, no estos textos.
