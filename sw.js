var CACHE = 'printer-orcamento-v23';
var FILES = [
  './',
  './index.html',
  './ver.html',
  './login.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar — salvar arquivos no cache
self.addEventListener('install', function(e) {
  self.skipWaiting(); // Ativar imediatamente sem esperar
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
});

// Ativar — limpar caches antigos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim(); // Assumir controle imediatamente
});

// Fetch — network first para HTML, cache first para assets
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  var isHTML = url.endsWith('.html') || url.endsWith('/');

  if (isHTML) {
    // HTML: tenta rede primeiro, fallback para cache
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(e.request);
        })
    );
  } else {
    // Assets: cache first
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
          return response;
        });
      })
    );
  }
});

// Receber mensagem para pular espera
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
