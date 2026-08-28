CHECKLIST BITÁCORA DE OBRA PÚBLICA MUNICIPAL — PWA
====================================================

Qué es
------
Aplicación web progresiva (PWA) instalable en celular y escritorio.
Funciona offline, guarda el progreso en el dispositivo y permite exportar un resumen.

Contenido
---------
• Apertura (8 verificaciones)
• Operación diaria (10 verificaciones — metodología S.T.A.R.T.)
• Cierre formal (7 verificaciones)
• Recordatorio de los 6 vicios críticos

Cómo usar en local (prueba)
---------------------------
1. Sirva la carpeta con cualquier servidor estático, por ejemplo:
   npx serve .
   o: python3 -m http.server 8080
2. Abra http://localhost:8080 (o el puerto indicado).
3. En el navegador (Chrome / Edge / Safari) use "Instalar aplicación" o "Añadir a pantalla de inicio".

Cómo publicarlo (producto plus del curso)
-----------------------------------------
• Suba toda la carpeta Checklist_Bitacora_PWA a cualquier hosting estático:
  - GitHub Pages
  - Netlify / Vercel (arrastrar carpeta)
  - Firebase Hosting
  - Servidor propio (nginx/apache)
• Asigne un dominio o subdominio (ej. checklist.su-dominio.mx).
• Comparta el enlace a los participantes del curso.
• Opcional: proteja con contraseña básica en el hosting si desea acceso solo para alumnos.

Requisitos técnicos
-------------------
• HTTPS obligatorio para instalación como PWA (excepto localhost).
• Navegadores modernos (Chrome, Edge, Safari, Firefox).

Archivos incluidos
------------------
index.html      — App completa
manifest.json   — Metadatos de instalación
sw.js           — Service Worker (modo offline)
icons/          — Iconos 192, 512 y Apple Touch
README.txt      — Este archivo

Diseño alineado a la identidad de la Certificación Bitácora de Obra
(navy institucional + dorado de acento).
