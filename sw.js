// اسم المخزن المؤقت (الكاش)
const CACHE_NAME = 'hemma-platform-v1';

// قائمة الملفات المطلوب تخزينها ليعمل الموقع بدون إنترنت
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم فتح الكاش بنجاح');
      return cache.addAll(assetsToCache);
    })
  );
});

// تفعيل الـ Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// جلب الملفات من الكاش في حال عدم وجود اتصال بالإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
