# Entregas a clientes (opción A · Google Drive)

Cada entrega es una carpeta dentro de `entregas/` con un nombre difícil de adivinar, por ejemplo
`entregas/014-garcia-k7f3/`. La dirección que se manda al cliente es
`https://moderatostudio.com/entregas/014-garcia-k7f3/`.

## Crear una entrega

1. En Google Drive (cuenta moderatostudio.es@gmail.com), crear una carpeta para la entrega y subir los archivos.
2. Compartir la carpeta como «Cualquier persona con el enlace · Lector».
3. Copiar `entregas/plantilla/` con el nombre nuevo.
4. En el `index.html` copiado, cambiar solo el bloque `<script type="application/json" id="entrega">`:
   título, cliente, fechas, enlace de la carpeta y los ID de vídeos, fotos y archivos.
   El ID de un archivo es la parte del enlace entre `/d/` y `/view`.
5. Subir los cambios. La página no aparece en buscadores (`noindex` y `robots.txt`) ni en el menú.

## Cerrar una entrega

Borrar su carpeta de `entregas/` y, si se quiere, la carpeta de Drive. Guardar siempre los originales en disco propio.

## Notas

- La carpeta `plantilla/` es solo el modelo: no se envía a nadie.
- Los textos de la página (ES/EN) están en `entregas/entrega.js`; el diseño, en `css/entregas.css`.
- Si más adelante se pasa a la opción B (Cloudflare R2 con contraseña), el diseño se reutiliza tal cual.

## Entrega con contraseña

1. Copia `plantilla/` a `entregas/<codigo-aleatorio>/`.
2. Prepara los datos en un `datos.json` **fuera del repositorio** (mismo formato que el bloque de la plantilla; `fotos` puede ser la lista completa `[["ID", "nombre"], …]`).
3. `python3 entregas/cifrar.py datos.json entregas/<codigo>/index.html "contraseña"`
4. Publica. La página pide la contraseña y solo entonces descifra y muestra la entrega (AES-256-GCM, PBKDF2 600.000 iteraciones).
   La lista de fotos y los enlaces de Drive nunca quedan en claro en el repositorio.
5. Manda el enlace y la contraseña al cliente por canales distintos.
