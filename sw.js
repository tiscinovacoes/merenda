/* ============================================================
   SUALE — Service Worker (sw.js)
   Cache Offline-First para Unidades Escolares e Motoristas
   Versão: v3.2.0
   ============================================================ */

const CACHE_NAME = 'suale-pnae-v3.2.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './alimentos.js',
  './js/offline_sync.js',
  './db.js',
  './ai_cardapio_engine.js',
  './sprint_abc.js',
  './js/core_hub.js',
  './js/modules/rbac.js',
  './js/modules/messaging_evolution.js',
  './js/modules/motorista.js',
  './js/modules/nutricao.js',
  './js/modules/estoque.js',
  './js/modules/escolas.js',
  './js/modules/colaboradores.js',
  './js/modules/gestor.js',
  './js/modules/compras.js',
  './js/modules/admin.js',
  './manifest.json'
];

// Instalação: Pré-cache dos ativos estruturais da aplicação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching ativos do SUALE PNAE...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Aviso de cache prévio:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpeza de caches obsoletos de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[SW] Removendo cache obsoleto:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de Requisições: Stale-While-Revalidate com Fallback Offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Não intercepta chamadas externas de APIs (Supabase, Evolution API, CDN)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Requisições de navegação (HTML): Network first, fallback para cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('./index.html') || caches.match('./');
      })
    );
    return;
  }

  // Requisições de recursos estáticos: Cache-first com revalidação em segundo plano
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza o cache silenciosamente em background
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => { /* Sem conexão, silencioso */ });

        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
