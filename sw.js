const CACHE='northlab-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.open(CACHE).then(cache=>
      fetch(e.request).then(res=>{
        if(res.ok)cache.put(e.request,res.clone());
        return res;
      }).catch(()=>caches.match(e.request))
    )
  );
});
