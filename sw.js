const CACHE_NAME = 'anatomia-equina-v0.2.8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './style-premium.css',
  './constants.js',
  './ui.js',
  './scene.js',
  './script.js'
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

// Interceptar peticiones (Estrategia Cache-First con Dynamic Caching)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Si está en caché (incluyendo el modelo 3D), devuélvelo
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 2. Si no, haz la petición a la red
      return fetch(event.request).then(networkResponse => {
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
