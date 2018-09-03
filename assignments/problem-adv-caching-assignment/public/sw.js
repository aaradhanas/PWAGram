
var CACHE_STATIC_NAME = 'static-v6';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

var STATIC_FILES = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker..', event)
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_FILES)
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

function isStaticFile(url){
  return STATIC_FILES.some(staticUrl => {
    return staticUrl === url.replace(self.origin,'');
  })
}

self.addEventListener('fetch', function(event) {

  // Handle the IP request url using cache, then network strategy
  if(event.request.url === 'https://httpbin.org/ip'){
    console.log('Cache, then network - ', event.request.url);
    event.respondWith(
      fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  //console.log('Request put in cache - ', event.request.url);
                  return res;
                });
            })
      )
  }
  // Cache only strategy for static files 
  else if(isStaticFile(event.request.url)){
    console.log('Cache only - ', event.request.url);
    event.respondWith(
      caches.match(event.request)
    )
  } 
  // Cache, with network fallback (with dynamic caching) for other dynamic requests
  else {
    console.log('Cache, with network fallback - ', event.request.url);
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  });
              })
              .catch(function(err) {

              });
          }
        })
    );
  }
});

// STRATEGY - Network only
/* self.addEventListener('fetch', function(event){
  event.respondWith(
    fetch(event.request)
  )
}); */

// STRATEGY - Cache Only
/* self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request.url)
  );
}) */

// STRATEGY - Network, with cache fallback (with dynamic caching)
/* self.addEventListener('fetch', function(event){
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
}) */