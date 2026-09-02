/* fit4 서비스워커 · v0.5
   HTML과 config.js는 네트워크 우선 — 새 버전이 나오면 바로 반영됩니다.
   (캐시 우선으로 두면 폰에 옛날 화면이 계속 떠서 버전이 고정됩니다)
   아이콘·매니페스트는 캐시 우선 — 잘 바뀌지 않고 용량이 큽니다. */
const CACHE = "fit4-v0.7";
const ASSETS = ["./", "./index.html", "./config.js", "./manifest.webmanifest",
                "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function freshFirst(req){
  return fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")));
}

function cacheFirst(req){
  return caches.match(req).then(hit => hit || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    return res;
  }));
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;   // Supabase 호출은 통과

  const live = e.request.mode === "navigate"
            || url.pathname.endsWith("/")
            || url.pathname.endsWith(".html")
            || url.pathname.endsWith("config.js");

  e.respondWith(live ? freshFirst(e.request) : cacheFirst(e.request));
});
