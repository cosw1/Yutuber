# 🚀 Setup - Yutuber Backend

## Requisitos previos

- Node.js 16+
- npm o yarn
- Claves de API (YouTube, Spotify, Firebase)

---

## Paso 1: Clonar el repositorio

```bash
git clone https://github.com/cosw1/Yutuber.git
cd Yutuber/backend
```

---

## Paso 2: Instalar dependencias

```bash
npm install
```

---

## Paso 3: Configurar variables de entorno

### Crear archivo `.env`

```bash
cp .env.example .env
```

### Editar `.env` con tus claves:

```
PORT=5000
NODE_ENV=development

# YouTube API - Obtener en: https://console.cloud.google.com/
YOUTUBE_API_KEY=tu_clave_aqui

# Spotify API - Obtener en: https://developer.spotify.com/
SPOTIFY_CLIENT_ID=tu_id
SPOTIFY_CLIENT_SECRET=tu_secret

# JWT (Genera una cadena segura aleatoria)
JWT_SECRET=tu_secreto_super_seguro

# Otros
CORS_ORIGIN=http://localhost:3000
```

---

## Paso 4: Ejecutar el servidor

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

---

## Paso 5: Probar el servidor

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Respuesta esperada
```json
{
  "status": "OK",
  "timestamp": "2026-05-15T02:15:00.000Z"
}
```

---

## 🔑 Obtener API Keys

### YouTube Data API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Activa YouTube Data API v3
4. Crea credenciales (API Key)
5. Copia la clave en `.env`

### Spotify API
1. Ve a [Spotify Developer](https://developer.spotify.com/)
2. Regístrate y crea una aplicación
3. Obtén Client ID y Client Secret
4. Copia ambos en `.env`

---

## 📁 Estructura de carpetas

```
backend/
├── src/
│   ├── index.js              # Servidor principal
│   ├── services/
│   │   ├── youtube.js        # Servicio YouTube
│   │   └── spotify.js        # Servicio Spotify
│   ├── controllers/          # Lógica de negocio
│   ├── routes/               # Rutas de API
│   └── middleware/           # Autenticación, validación
├── package.json
├── .env.example
└── .gitignore
```

---

## 🐛 Solucionar problemas

### Error: "YOUTUBE_API_KEY is not defined"
- Asegúrate de crear el archivo `.env`
- Verifica que la clave esté completa

### Error: "Cannot find module 'express'"
- Ejecuta: `npm install`

### Puerto 5000 ya en uso
- Cambia en `.env`: `PORT=3001`

---

## ✅ Próximos pasos

1. Crear sistema de autenticación (login/registro)
2. Crear endpoints de búsqueda agregada
3. Integrar base de datos (Firebase/MongoDB)
4. Crear app Android

¡Preguntas? Estoy aquí para ayudarte! 🚀
