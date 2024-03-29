self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('stratablet-v6').then((cache) => cache.addAll([
      'index.html',
      'main.js',
      'data/presets.js',
      'data/astramilitarum.js',
      'data/craftworlds.js',
      'data/spacemarines.js',
      'data/tau.js',
      'data/adeptuscustodes.js',
      'data/thousandsons.js',
      'style.css',
      'resources/fonts/Conduit-ExtraBold.otf',
      'resources/fonts/Conduit-Regular.ttf',
      'resources/fonts/Conduit-Bold.ttf',
      'resources/fonts/Conduit-BoldItalic.ttf',
      'resources/fonts/Conduit-ExtraLight.ttf',
      'resources/fonts/Conduit-Light.ttf',
      'resources/fonts/Conduit-LightItalic.ttf',
      'resources/fonts/Conduit-Medium.ttf',
      'resources/fonts/Conduit-MediumItalic.ttf',
      'resources/icons/64.png',
      'resources/icons/128.png',
      'resources/icons/256.png', 
      'resources/icons/512.png',
      'resources/img/factions/astra-militarum.svg',
      'resources/img/factions/aeldari-craftworlds.svg',
      'resources/img/factions/space-marines.svg',
      'resources/img/factions/tau-empire.svg',
      'resources/img/factions/adeptus-custodes.svg',
      'resources/img/factions/thousand-sons.svg'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
