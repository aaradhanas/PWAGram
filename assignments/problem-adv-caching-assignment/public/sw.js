
var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker..', event)
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/app.css',
          '/src/css/main.css',
          '/src/js/main.js',
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ])
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

// STRATEGY INITIALLY USED - Cache, with network fallback (dynamic caching)
/* self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
         // console.log('Request not present in cache - ', event.request.url);
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  //console.log('Request put in cache - ', event.request.url);
                  return res;
                });
            })
            .catch(function(err) {

            });
        }
      })
  );
}); */


// STRATEGY - Cache Only
/* self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request.url)
  );
}) */

// STRATEGY - Network, with cache fallback (with dynamic caching)
self.addEventListener('fetch', function(event){
  event.respondWith(
    fetch(event.request)
      .then(function(response){
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache){
            cache.put(event.request, response.clone());
            return response;
          })
      })
      .catch(function(err){
        console.error('Fetch failed : ', event.request.url);
        return caches.match(event.request);
      })
  )
})