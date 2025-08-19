// GaiaSystem Service Worker - Gestão Ambiental Digital
const CACHE_NAME = 'gaia-system-v1.0';
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

const API_CACHE_NAME = 'gaia-api-cache-v1';
const API_URLS = [
  '/api/health',
  '/api/dashboard/stats',
  '/api/licenses',
  '/api/projects',
  '/api/inspections'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 GaiaSystem SW: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('💾 GaiaSystem SW: Cache aberto');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ GaiaSystem SW: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ GaiaSystem SW: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para arquivos estáticos - Cache First
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Estratégia para API - Network First com fallback para cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Se a resposta for válida, armazenar no cache
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Em caso de falha de rede, buscar no cache
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response(
              JSON.stringify({ 
                error: 'Dados não disponíveis offline',
                offline: true 
              }),
              { 
                headers: { 'Content-Type': 'application/json' },
                status: 503 
              }
            );
          });
        })
    );
    return;
  }

  // Para outras requisições - Network First
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Mensagem de background sync (para futuras funcionalidades)
self.addEventListener('message', (event) => {
  console.log('📩 GaiaSystem SW: Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificações push (preparação para futuro)
self.addEventListener('push', (event) => {
  console.log('🔔 GaiaSystem SW: Push recebido:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      data: data.url
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ GaiaSystem SW: Notificação clicada:', event);
  
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

console.log('🚀 GaiaSystem Service Worker carregado!');