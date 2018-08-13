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
        })
        .catch( function(){
            console.log(err);
        });

    /* How to register a service worker for a specific scope. Need not mention the scope if the
    service worker resides in the same folder of your scope.
    */
    /* navigator.serviceWorker
    .register('/help/sw-help.js', {scope: '/help/'})
    .then( function() {
        console.log('Service worker for /help registered !!');
    });*/
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


// TO VALIDATE - This listener is added to get notified once the app is successfully installed to home screen.
window.addEventListener('appinstalled', function(event) {
    console.log('App successfully installed to home screen');
});

var promise = new Promise(function(resolve, reject){
    setTimeout( function() {
        resolve('Hello World');
        //reject({code: 500, message: 'An error occurred!'});
    }, 3000);
});

promise.then(function(text){
    console.log('Chain 1 text = ', text);
    return new Promise(function(resolve, reject){
        resolve(text.toUpperCase());
    });
}).then(function(text){
    console.log('Chain 2 text = ', text);
})
// Catch blocks catch any errors occurring in the then blocks that come before it.
.catch(function(err){
    console.log(err.code, err.message);
});
console.log('Executed right after setTimeout');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://httpbin.org/ip');
xhr.responseType = 'json';

xhr.onload = function(){
    console.log(xhr.response);
}

xhr.onerror = function(){
    console.log('Error');
}

xhr.send();
// Fetch API
fetch('https://httpbin.org/ip')
 .then(function(response){
     console.log(response);
    // json is a utility method provided by the fetch API on the body of response object.
    // This is an asynchronous operation since the response body is a readable stream.
    return response.json();
 })
 .then(function(data){
    console.log(data);
 })
 .catch(function(err){
     console.log(err);
 });

 fetch('https://httpbin.org/post', {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
     },
     // Another mode is 'no-cors'
     mode: 'cors',
     body: JSON.stringify({
         message: 'Does this work?'
     })
 })
 .then(function(response){
    console.log(response);
    return response.json();
 })
 .then(function(data){
    console.log(data);
 })
 .catch(function(err){
     console.log('Error occurred:',err);
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