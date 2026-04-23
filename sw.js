import { APP_VERSION } from './version.js';
const CACHE_NAME = `anatomia-equina-${APP_VERSION}`;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './style-premium.css',
  './constants.js',
  './ui.js',
  './scene.js',
  './script.js',
  './version.js'
];

// Instalar y almacenar en caché los archivos estáticos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

const fetchWithRetry = async (req, retries = 3, delay = 3000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const reqClone = req.clone();
      const networkResponse = await fetch(reqClone);
      
      // Si la respuesta es válida y no es un error de servidor (5xx) o rate limit (429), la aceptamos
      if (networkResponse && networkResponse.status < 500 && networkResponse.status !== 429) {
        return networkResponse;
      }
      if (i === retries) return networkResponse; // Último intento
    } catch (error) {
      if (i === retries) throw error; // Falla total de red (ej. offline) en el último intento
    }
    // Esperar antes del siguiente reintento
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Interceptar peticiones (Estrategia Cache-First con Dynamic Caching)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Si está en caché (incluyendo el modelo 3D), devuélvelo
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 2. Si no, haz la petición a la red usando la función de reintentos
      return fetchWithRetry(event.request).then(networkResponse => {
        // Asegúrate de que la respuesta sea válida antes de cachearla
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
          return networkResponse;
        }

        // Clona la respuesta porque la original será consumida por el navegador
        const responseToCache = networkResponse.clone();
        
        // Almacena dinámicamente en caché (útil para el .glb pesado de Hugging Face y librerías Three.js)
        caches.open(CACHE_NAME).then(cache => {
          // Solo cachear peticiones GET (no se pueden cachear POST u otros métodos)
          if (event.request.method === 'GET') {
            cache.put(event.request, responseToCache);
          }
        });

        return networkResponse;
      });
    })
  );
});
