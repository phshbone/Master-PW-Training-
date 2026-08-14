const CACHE='mpwg-reconciliation-2026-08-13-c';
const STATIC_ASSETS=[
  './',
  './index.html',
  './styles.css',
  './reconciliation.css',
  './procedure-styles.css',
  './mobile-qa.css',
  './data.js',
  './app.js',
  './lookup-enhancements.js',
  './procedures-reconciliation.js',
  './correction-record-update.js',
  './source-reconciliation.js',
  './master-reference.js',
  './master-pin.js',
  './important-dates.js',
  './home-report-reconciliation.js',
  './qa-fixes.js',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(STATIC_ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put('./',copy));
          return response;
        })
        .catch(()=>caches.match('./').then(r=>r||caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(cached=>{
      if(cached) return cached;
      return fetch(request).then(response=>{
        if(request.method==='GET' && response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      });
    })
  );
});
