const CACHE_NAME = 'khedma-tech-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style_root.css',
  '/firebase_config.js',
  'https://cdn.tailwindcss.com'
];

// تثبيت ملفات الكاش
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// جلب البيانات من الكاش عند انقطاع الإنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});