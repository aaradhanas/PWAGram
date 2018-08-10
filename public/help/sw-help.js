self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker for /help..', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker for /help...', event);
    // This ensures the SW is activated correctly. Not really needed, but it might fail if not present.
    // Adding this makes the activation more robust..Might not be required in the future.
    return self.clients.claim();
});