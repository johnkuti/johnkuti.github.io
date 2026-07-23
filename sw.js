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
  "/en.search-data.min.9cb415ab3bb1ccdb3f106f5046248ab522d72fe9ae1effd067bd553a0c77dc9f.json",
  "/en.search.min.a7579096080da7326966761a3036ee2498474af571d891a17fea0f94a395e5fa.js",
  
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
