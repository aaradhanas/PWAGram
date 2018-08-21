/*
    Installation event is triggered by the browser if the service worker code is changed.
*/
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker..', event);
});

/*
    Activation event is triggered by the browser. It does not happen until all the opened tabs and windows
    of the app are closed and reopened.
*/
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker..', event);
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
    event.respondWith( fetch(event.request) );
});