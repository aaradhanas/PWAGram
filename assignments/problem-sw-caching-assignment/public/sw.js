var CACHE_APP_SHELL = 'app-shell-static-v1';

// Service Worker Installation Listener
self.addEventListener('install', function(event){
    console.log('[Service Worker] Installed:', event);
    // Precache the App Shell
    event.waitUntil(
        caches.open(CACHE_APP_SHELL)
            .then(function(cache){
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/main.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/main.css',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ])
            })
    );
});

// Service Worker Activation Listener
self.addEventListener('activate', function(event){
    console.log('[Service Worker] Activated', event);

    event.waitUntil(
        caches.keys()
            .then(function(keyList){
                Promise.all(keyList.map(function(key){
                    if(key !== CACHE_APP_SHELL){
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                }));
            })
    )
});

// Fetch Listener
self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                if(response){
                    return response;
                } else{
                    return fetch(event.request);
                }
            })
    )
})