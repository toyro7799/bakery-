const CACHE_NAME = 'baker-offline-v2';
// قائمة الملفات التي سيتم تخزينها مؤقتاً لتشغيل التطبيق بدون إنترنت
// *نستخدم المسارات النسبية (./) لضمان عملها عند تشغيله محلياً في عارض HTML.*
const urlsToCache = [
  './', 
  './index.html',
  './manifest.js',
  // ملف الوظائف والحسابات (الاسم الذي ينتجه أمر npm run build)
  './assets/index-DsjLMiHo.js', 
  // تضمين الخطوط و Tailwind CDN لضمان عمل التصميم دون إنترنت
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
  // إضافة ملفات الأيقونات (إذا كانت موجودة في مجلد assets)
  './assets/icon-192.png',
  './assets/icon-512.png',
];

// مرحلة التثبيت: يتم تخزين الملفات المحددة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
  );
});

// مرحلة الجلب: اعتراض طلبات الإنترنت (Fetch) وتقديم الملفات المخزنة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الكاش، قم بإرجاعه فوراً
        if (response) {
          return response;
        }
        // وإلا، اطلبه من الشبكة (لن يتم جلب هذا في وضع عدم الاتصال)
        return fetch(event.request);
      })
  );
});
