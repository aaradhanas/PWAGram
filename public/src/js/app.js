/*
    A page could have multiple service workers, but only with different scopes. You can use a service worker for the 
    /help "subdirectory" and one for the rest of your app. The more specific service worker (=> /help) overwrites the 
    other one for its scope.
*/
var deferredPrompt;
// navigator is the browser. We check for the property 'serviceWorker' in navigator to ensure support.
if ('serviceWorker' in navigator){
    // Registration of service worker happens on every page reload.
    navigator.serviceWorker
        .register('/sw.js', {scope: '/'})
        .then( function() {
            console.log('Service worker for / registered !!');
        });

    // How to register a service worker for a specific scope
    /* navigator.serviceWorker
    .register('/help/sw-help.js', {scope: '/help/'})
    .then( function() {
        console.log('Service worker for /help registered !!');
    }); */
}

/*
    This listener is added to get hold of the beforeinstallprompt event which is fired by the browser
    before it is ready to show the web app install banner. By listening to this event, it is possible
    to defer the prompt display to a later point.
*/
window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});


// TO VALIDATE - This listender is added to get notified once the app is successfully installed to home screen.
window.addEventListener('appinstalled', function(event) {
    console.log('App successfully installed to home screen');
});


// Unregistration of a service worker is possible, not sure about when it would be used though.
// Reference blog post - https://love2dev.com/blog/how-to-uninstall-a-service-worker/
/*if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations()
        .then( function(serviceWorkers) {
            for( let serviceWorker of serviceWorkers){
                serviceWorker.unregister();
                console.log('Service worker unregistered !!');
            }
        });
}*/