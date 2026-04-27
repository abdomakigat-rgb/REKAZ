// اسم المخزن المؤقت (يمكنك تغييره عند تحديث الموقع)
const CACHE_NAME = 'hemma-platform-v1';

// قائمة الملفات التي سيتم تخزينها للعمل بدون إنترنت
const assetsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// 1. حدث التثبيت: يتم فيه حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم فتح الكاش وتخزين الملفات بنجاح');
      return cache.addAll(assetsToCache);
    })
  );
});

// 2. حدث التنشيط: يتم فيه حذف النسخ القديمة من الكاش إذا وجدت
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('جاري حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. حدث الجلب: للبحث عن الملفات في الكاش أولاً قبل طلبها من الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجد الملف في الكاش، قم بإرجاعه، وإلا اطلبه من الإنترنت
      return response || fetch(event.request);
    }).catch(() => {
      // في حالة فشل الجلب وعدم وجود إنترنت (اختياري: يمكنك عرض صفحة Offline)
      console.log('الموقع يعمل الآن في وضع عدم الاتصال');
    })
  );
});
