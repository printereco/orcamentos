// Printer & Co. — Service Worker v4.0
const CACHE = 'printer-co-v4';
const ARQUIVOS = [
  '/',
  '/index.html',
  '/login.html',
  '/clientes.html',
  '/financeiro.html',
  '/admin.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/auth.js',
  '/js/utils.js',
  '/js/menu.js',
  '/manifest.json'
];

// Instala e faz cache dos arquivos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

// Remove caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first para HTML, cache-first para estáticos
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Ignora requisições externas (Supabase, etc)
  if (!url.origin.includes(self.location.origin)) return;

  // HTML: sempre tenta rede primeiro
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Demais recursos: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
