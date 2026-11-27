#!/usr/bin/env python3
"""Cifra los datos de una entrega con contraseña.

Uso:
  python3 entregas/cifrar.py datos.json entregas/<codigo>/index.html "contraseña"

- datos.json: los datos de la entrega (mismo formato que el bloque "entrega" de la plantilla;
  "fotos" puede ser la lista completa [["ID", "nombre"], ...]). Este archivo NO se sube al repositorio.
- index.html: copia de entregas/plantilla/index.html. Su bloque <script id="entrega"> se sustituye
  por un bloque <script id="entrega-cifrada"> que solo se puede leer con la contraseña.

Cifrado: AES-256-GCM, clave derivada con PBKDF2-SHA256 (600.000 iteraciones), igual que lo
descifra entrega.js con Web Crypto en el navegador.
"""
import base64, json, os, re, sys
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ITERACIONES = 600_000


def cifrar(datos: dict, clave: str) -> dict:
    sal, iv = os.urandom(16), os.urandom(12)
    k = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=sal, iterations=ITERACIONES).derive(clave.encode())
    texto = json.dumps(datos, ensure_ascii=False, separators=(',', ':')).encode()
    b64 = lambda b: base64.b64encode(b).decode()
    return {"v": 1, "iter": ITERACIONES, "sal": b64(sal), "iv": b64(iv), "datos": b64(AESGCM(k).encrypt(iv, texto, None))}


def main():
    origen, html, clave = sys.argv[1:4]
    datos = json.load(open(origen, encoding='utf-8'))
    bloque = json.dumps(cifrar(datos, clave), separators=(',', ':'))
    s = open(html, encoding='utf-8').read()
    nuevo = f'<script type="application/json" id="entrega-cifrada">{bloque}</script>'
    s, n = re.subn(r'<script type="application/json" id="entrega(?:-cifrada)?">.*?</script>', lambda _: nuevo, s, count=1, flags=re.S)
    if n != 1:
        sys.exit('No encuentro el bloque de datos en ' + html)
    # quitar el comentario de instrucciones de la plantilla, que no hace falta en una entrega cifrada
    s = re.sub(r'\n  <!--\n    DATOS DE LA ENTREGA.*?-->\n', '\n', s, flags=re.S)
    open(html, 'w', encoding='utf-8').write(s)
    print(f'Cifrado: {html} ({len(bloque):,} caracteres)')


if __name__ == '__main__':
    main()
