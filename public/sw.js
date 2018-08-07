self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker..', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker..', event);
    // This ensures the SW is activated correctly. Not really needed, but it might fail if not present.
    // Might not be required in the future.
    return self.clients.claim();
});