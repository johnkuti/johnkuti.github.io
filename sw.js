const cacheName = self.location.pathname
const pages = [

  "/docs/biography/Russian-Nights/",
    "/docs/biography/",
    "/docs/biography/comments-on-4338/",
    "/posts/blog-post-1/",
    "/tags/blog/",
    "/tags/post/",
    "/tags/",
    "/",
    "/docs/",
    "/posts/",
    "/book.min.7dca40f168e2fd532b7b1937df678e5fcb9289577e924bd85f799138b6137fa6.css",
  "/en.search-data.min.9bead1c1b6485ea7715905dd1fe6061212a94fddafd0e63ad4413ad1b171e17f.json",
  "/en.search.min.7236829c6e501d30c4eeaae78a70859d70df966fe78f821ddfc7656547a6e537.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
