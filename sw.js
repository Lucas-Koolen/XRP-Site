// Basic service worker for offline-first shell (relative paths for GitHub Pages project sites)
const CACHE = 'xrp-site-v2';
const ASSETS = [
  'index.html', 'css/styles.css',
  'js/app.js', 'js/i18n.js', 'js/compare.js', 'js/mock-data.json',
  'manifest.webmanifest'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{}); return res;
    }).catch(() => caches.match('index.html')))
  );
});
