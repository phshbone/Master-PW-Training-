const CACHE='mpw-clean-1.0.4';
const STATIC=['./','./index.html','./styles-clean.css','./procedures-grid.css','./navigation-repair.css','./core.js','./content.js','./modules.js','./app-clean.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const r=event.request;
  if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    event.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./',copy));return res;}).catch(()=>caches.match('./').then(x=>x||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return res;})));
});