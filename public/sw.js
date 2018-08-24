/*
    Installation event is triggered by the browser if the service worker code is changed.
*/
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker..', event);
    // This ensures that the installation event does not finish until the cache is ready.
    event.waitUntil(
        // Opens a sub cache from the Cache Storage if it already exists or creates a new one, otherwise.
        caches.open('static-v1')
            .then(function(cache){
                console.log('[Service Worker] Precaching App Shell..');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/js/polyfills/promise.js',
                    '/src/js/polyfills/fetch.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
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
                    if(key !== 'static-v1' && key !== 'dynamic'){
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
self.addEventListener('fetch', function(event) {
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
                                return caches.open('dynamic')
                                    .then(function(cache){
                                        // Response gets consumed while getting stored in the cache
                                        // It can be consumed only once. Hence, we store the clone.
                                        cache.put(event.request, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function(err){
                                console.log('Error ocurred while fetching');
                            })
                }
            })
    );
});