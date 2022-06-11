console.log('[Service Worker] Install');
debugger;

const cacheName = 'stratablet-v1';

const appShellFiles = [
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    '/index.html',
    '/data/craftworlds.js',
    '/data/spacemarines.js',
    '/data/tau.js',
    '/main.js',
    '/style.css',
    '/resources/fonts/Conduit-ExtraBold.otf',
    '/resources/fonts/Conduit-Regular.ttf',
    '/resources/fonts/Conduit-Bold.ttf',
    '/resources/fonts/Conduit-BoldItalic.ttf',
    '/resources/fonts/Conduit-ExtraLight.ttf',
    '/resources/fonts/Conduit-Light.ttf',
    '/resources/fonts/Conduit-LightItalic.ttf',
    '/resources/fonts/Conduit-Medium.ttf',
    '/resources/fonts/Conduit-MediumItalic.ttf',
    '/resources/icons/icon-64.png',
    '/resources/icons/icon-128.png',
    '/resources/icons/icon-256.png',
    '/resources/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log('[Service Worker] Fetching resource: ${e.request.url}');
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching new resource: ${e.request.url}');
      cache.put(e.request, response.clone());
      return response;
    })());
});