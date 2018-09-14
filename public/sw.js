importScripts('/src/js/idb.js');
importScripts('/src/js/idb-utility.js');

var STATIC_CACHE_NAME = 'static-v22';
var DYNAMIC_CACHE_NAME = 'dynamic-v1';

var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
    '/src/js/idb-utility.js',
    '/src/js/material.min.js',
    '/src/js/polyfills/promise.js',
    '/src/js/polyfills/fetch.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

/*
    Installation event is triggered by the browser if the service worker code is changed.
*/
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker..', event);
    // waitUntil event waits until the promise returned by the function passed to it either rejects or resolves.
    // This ensures that the installation event does not finish until the cache is ready.
    event.waitUntil(
        // Opens a sub cache from the Cache Storage if it already exists or creates a new one, otherwise.
        caches.open(STATIC_CACHE_NAME)
            .then(function(cache){
                console.log('[Service Worker] Precaching App Shell..');
                cache.addAll(STATIC_FILES);
            })
    );
});

/*
    Activation event is triggered by the browser. It does not happen until all the opened tabs and windows
    of the app are closed and reopened.
*/
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker..', event);

    event.waitUntil(
        caches.keys()
            .then(function(keyList){
                // Promise.all() takes an array of promises as an argument and waits for all of them to finish.
                Promise.all(keyList.map(function(key){
                    if(key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME){
                        console.log('[Service Worker] Removing old cache - ', key);
                        return caches.delete(key);
                    }
                }));
            })
    )
    // This ensures the SW is activated correctly. Not really needed, but it might fail if not present.
    // Adding this makes the activation more robust..Might not be required in the future.
    return self.clients.claim();
});

/* 
    Fetch event is trigged by the application while fetching CSS, JS, images or data.
    Every fetch request of the app goes through the service worker and so does every response.
    The service worker acts like a proxy.
    There could be more than one fetch listeners (Part of course FAQ, not sure why)
*/

// Strategy - Cache with Network Fallback
/* self.addEventListener('fetch', function(event) {
    // We can override the response using the below method
    event.respondWith(
        // Looks at all the available sub caches and check if a given request is present   
        caches.match(event.request)
            .then(function(response){
                // Response is null if the request is not present in the cache
                if(response){
                    return response;
                } else{
                    return fetch(event.request)
                            .then(function(res){
                                return caches.open(DYNAMIC_CACHE_NAME)
                                    .then(function(cache){
                                        // Response gets consumed while getting stored in the cache
                                        // It can be consumed only once. Hence, we store the clone.
                                        cache.put(event.request, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function(err){
                                return caches.open(STATIC_CACHE_NAME)
                                        .then(function(cache){
                                            return cache.match('/offline.html');
                                        });
                            })
                }
            })
    );
}); */

// HELPER FUNCTION - To check if the request url is present in the static cache.
function isInArray(requestUrl){
    return STATIC_FILES.some(staticUrl => {
        return staticUrl === requestUrl.replace(self.origin,'');
    })
}

// Strategy - Cache, then network with dynamic caching and offline support
self.addEventListener('fetch', function(event){
    var url = 'https://pwa-gram-6c550.firebaseio.com/posts';
    if(event.request.url.indexOf(url) != -1){
        event.respondWith(
            // Approach 1
            fetch(event.request)
                .then(function (res) {
                    var clonedRes = res.clone();
                    clearAllData('posts-store')
                        .then(function () {
                            return clonedRes.json();
                        })
                        .then(function (data) {
                            for (var key in data) {
                                writeData('posts-store', data[key]);
                            }
                        })
                    return res;
                })
        );
    } else if(isInArray(event.request.url)){
        console.log('Cache only - ', event.request.url);
        event.respondWith(
            caches.match(event.request)
        );
    } else{
        event.respondWith(
            caches.match(event.request)
            .then(function(response){
                // Response is null if the request is not present in the cache
                if(response){
                    return response;
                } else{
                    return fetch(event.request)
                            .then(function(res){
                                return caches.open(DYNAMIC_CACHE_NAME)
                                    .then(function(cache){
                                        //trimCache(DYNAMIC_CACHE_NAME, 3);
                                        // Response gets consumed while getting stored in the cache
                                        // It can be consumed only once. Hence, we store the clone.
                                        cache.put(event.request, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function(err){
                                return caches.open(STATIC_CACHE_NAME)
                                        .then(function(cache){
                                            // Return a fallback content based on accept header
                                            if(event.request.headers.get('accept').includes('text/html')){
                                                return cache.match('/offline.html');
                                            }
                                        });
                            })
                }
            })
        )
    }
    
    
    // Either Approach 1 or below approach works
    /* caches.open(DYNAMIC_CACHE_NAME)
    .then(function(cache){
        return fetch(event.request)
                .then(function(res){
                    //console.log('[Service Worker] fetch listener = ', event.request.url);
                    cache.put(event.request, res.clone());
                    return res;
                });
    }) */
});

/* // Strategy - Cache Only 
self.addEventListener('fetch', function(event){
    event.respondWith( caches.match(event.request) );
}); */

/* // Strategy - Network Only
self.addEventListener('fetch', function(event){
    event.respondWith( fetch(event.request) );
}); */

// Strategy - Network with Cache Fallback - Not used much because we need to wait for the network request to timeout and then fetch from cache.
/* self.addEventListener('fetch', function(event) {
    // We can override the response using the below method
    event.respondWith(
        // Do the fetch first
        fetch(event.request)
            // If fetch succeeds, then add to cache (dynamic caching)
            .then(function(res){
                return caches.open(DYNAMIC_CACHE_NAME)
                    .then(function(cache){
                        // Response gets consumed while getting stored in the cache
                        // It can be consumed only once. Hence, we store the clone.
                        cache.put(event.request, res.clone());
                        return res;
                    })
            })
            // If fetch fails, return response from cache.
            .catch(function(err){
                return caches.match(event.request)
            })
    );
}); */

// Trim the cache by removing theold entries
function trimCache(cacheName, maxItems){
    caches.open(cacheName)
        .then(function(cache){
            cache.keys()
                .then(function(keys){
                    if( keys.length > maxItems){
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                    }
                })
        })
}

// Prints the browser storage usage and quota
function printStorageQuota(){
    if('storage' in navigator && 'estimate' in navigator.storage){
        navigator.storage.estimate()
            .then(function(estimate){
                console.log('Using '+ estimate.usage+' bytes out of '+ estimate.quota+' bytes');
            })
    }
}