# Cumplimiento de YouTube — Yutuber

## Resumen ejecutivo
Este documento resume las reglas y buenas prácticas para usar contenidos de YouTube en tu aplicación Yutuber. Su objetivo es evitar incumplimientos de los Términos de Servicio de YouTube y de las políticas de las YouTube API Services.

> Nota: Lo siguiente es orientación informativa, no asesoramiento legal. Para decisiones críticas o comerciales consulta con un abogado especializado en propiedad intelectual y licencias.

---

## Puntos clave (lo que NO se puede hacer)
- No descargar, cachear o re-distribuir archivos de vídeo/audio de YouTube fuera de los mecanismos autorizados por YouTube.
- No eliminar, bloquear ni manipular anuncios mostrados por el reproductor de YouTube ni interferir con los mecanismos de monetización.
- No reproducir contenido de YouTube fuera del reproductor autorizado (IFrame Player API, Android Player API, iFrame embebido). Re-hosting (servir el archivo) está prohibido.
- No usar scrapings no oficiales, ingeniería inversa del sitio de YouTube, ni automatizar acceso fuera de las APIs oficiales.
- No afirmar soporte de YouTube/Google ni usar marcas sin respetar las guidelines de branding.

---

## Requisitos (cómo usar YouTube correctamente)
1. Usar las APIs oficiales: YouTube Data API v3 para búsquedas/metadata y los reproductores oficiales para reproducción (IFrame/Android Player API).
2. Mostrar claramente la atribución a YouTube y enlaces al contenido original (ej. enlace al video en YouTube).
3. No prometer ni construir una experiencia "sin anuncios" para contenido proveniente de YouTube. Si ofreces una experiencia sin anuncios, esta debe provenir de servicios con licencia o de usuarios con YouTube Premium (pero no puedes verificar premium vía API público).
4. Cumplir los límites de cuota de la API y gestionar errores/retornos de forma respetuosa.
5. Seguir las YouTube API Services – Developer Policies y las Brand Guidelines.

---

## Consecuencias de incumplimiento
- Revocación de la clave API y bloqueo de acceso a las APIs de Google.
- Eliminación de contenido o reclamaciones por derechos de autor (Content ID, strikes).
- Acciones legales por violación de derechos de autor en casos graves.

---

## Recomendaciones técnicas para Yutuber (implementación segura)
- Backend (backend/src/services/youtube.js):
  - Solo usar la YouTube Data API para obtener metadata (IDs, títulos, thumbnails, duración, canal, enlaces).
  - No almacenar ni exponer URLs directas a archivos de vídeo/audio. Devuelve únicamente el ID de YouTube y la URL embebible (https://www.youtube.com/watch?v=<ID> o https://www.youtube.com/embed/<ID>).
  - Implementa un límite de tasa y manejo de errores (retries with backoff) para respetar cuotas.

- Reproducción (frontend o app móvil):
  - Reproducir videos mediante el IFrame Player API (web) o el YouTube Android/iOS Player (móvil). No intentes extraer audio y reproducirlo con un reproductor personalizado que elimine el vídeo o los anuncios.
  - Si ofreces "modo audio", hazlo conservando el player oficial visible o documenta claramente las limitaciones legales.

- Funcionalidad "sin publicidad":
  - No implementarla para videos de YouTube. Si quieres ofrecer una experiencia sin anuncios, integra servicios con licencia (p. ej. Spotify con los permisos adecuados) o ofrece contenido con licencia propia.

- Manejo de contenido protegido:
  - No permitir descarga de contenidos ni re-hosting. Si el usuario reporta infracción, implementa un procedimiento de DMCA/takedown y un contacto de soporte.

---

## Checklist para el repositorio (tareas concretas)
- [ ] Añadir `docs/YOUTUBE_COMPLIANCE.md` (este archivo).
- [ ] Implementar `backend/src/services/youtube.js` que:
  - Use la YouTube Data API v3 (search, videos.list).
  - Devuelva únicamente metadata y URLs embebibles.
- [ ] En `frontend` usar IFrame Player API para reproducir videos por ID.
- [ ] Añadir en `README.md` y en la app una cláusula de cumplimiento: "Esta aplicación usa la YouTube Data API y respeta los Términos de Servicio de YouTube. No elimina anuncios ni redistribuye contenido.".
- [ ] Crear `POLICY.md` o `PRIVACY.md` con política de uso y contacto para reclamaciones de derechos.
- [ ] Configurar logs para solicitudes fallidas a la API y alertas si la cuota se acerca al límite.

---

## Flujo de ejemplo seguro (backend -> frontend)
1. Usuario busca "Canción X" -> Frontend solicita `/api/search?q=Cancion+X` a tu backend.
2. Backend consulta YouTube Data API (search) y Spotify (si aplica), normaliza resultados y devuelve lista con campos: { id, title, channel, duration, thumbnail, source: 'youtube' }.
3. Usuario pulsa "Reproducir" -> Frontend usa IFrame con `https://www.youtube.com/embed/<ID>` o el SDK nativo para reproducir.
4. No se devuelve nunca una URL directa al archivo de vídeo/audio.

---

## Enlaces útiles (documentación oficial)
- YouTube Terms of Service: https://www.youtube.com/t/terms
- YouTube API Services — Terms of Service: https://developers.google.com/youtube/terms/api-services-terms-of-service
- YouTube API Services — Developer Policies: https://developers.google.com/youtube/terms/developer-policies
- YouTube Branding Guidelines: https://developers.google.com/youtube/branding_guidelines
- YouTube Android Player API: https://developers.google.com/youtube/android/player

---

## Próximos pasos que puedo hacer ahora
- Implementar `backend/src/services/youtube.js` (llamadas a search/videos.list) y añadir tests básicos.
- Implementar componente React que use IFrame Player API para reproducir por ID.
- Añadir cláusulas de privacidad y templates de DMCA en `docs/`.

Dime cuál de estos pasos quieres que realice a continuación y lo implemento.
