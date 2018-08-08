// navigator is the browser. We check for the property 'serviceWorker' in navigator to ensure support.
if ('serviceWorker' in navigator){
    // Registration of service worker happens on every page reload.
    navigator.serviceWorker
        .register('/sw.js', {scope: '/'})
        .then( function() {
            console.log('Service worker registered !!');
        });
}