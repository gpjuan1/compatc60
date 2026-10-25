const C="ah-v1";
const CORE=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(
    fetch(r).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return resp;})
            .catch(()=>caches.match(r).then(m=>m||caches.match("./index.html")))
  );
});
