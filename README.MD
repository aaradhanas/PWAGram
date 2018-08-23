# PWAGram
A simple Instagram clone, implementing a lot of PWA features.

# What is a PWA?

PWA is the abbreviation for **Progressive Web Application**. It is a term referrring to a couple of features you can add to any web application to enhance it. You can progressively enhance your web apps to look and feel like native apps.

**Progressive enhancement** is a design philosophy that centers around providing a baseline of essential content and functionality to as many users as possible, while at the same time going further and delivering the best possible experience only to users of the most modern browsers that can run all the required code.

A PWA basically incorporates the pros of a native mobile application and a web application. It can have the reach of a web app and also use device features (like camera) of a mobile.

- **Reliable**: Load fast and provide offline functionality
- **Fast**: Response quickly to user actions
- **Engaging**: Feel like a native app on mobile devices

# PWA Features

- They are installable (without an App Store)
- They can work offline
- They look good on any device
- They can receive Push Notifications
- They can access native device features like camera.

# PWA Building Blocks

- Web App Manifest
- Service Worker

# Web App Manifest

This is a JSON filed named **manifest.json** which resides in the root folder of the app. The information present in this file is used by the browser to add the app to home screen of the mobile and also use it in the display of the app (Name, Short name, Icons, background color in splash screen, theme color of the app, etc.)

If you would like to know the browsers which support the web app manifest, please visit [Web App Manifest - Browser Support](http://caniuse.com/#feat=web-app-manifest)

[MDN Article on the Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and [Web App Manifest Explanation by Google](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/) provide detailed information about the supported properties.

# Service Workers

Before getting on to what service workers are, lets see the behaviour of normal JavaScript files attached to HTML pages. The JS files run on a single thread attached to individual HTML pages. They have the capability to manipulate the DOM.

### How do service workers differ from normal JS files?

- They are also JavaScript files, but they have access to a different set of features.
- They run on a separate **single thread**, because they run in the **background**.
- Even though they are registered through HTML pages, they are decoupled from them.
- They are not attached to a single page, but can manage pages of a given scope (e.g., all pages of a domain OR entire web app).
- They **live on** even after the web app has been closed in the browser (Remember, they are background processes).
- They cannot interact with the DOM and are not attached to a single page.
- Since they run in the background, they are very good at **listening/reacting to events** from:
    - Normal JS pages
    - HTML code
    - Another server (like web push notifications)

### What are the events the service worker can listen to?

1. **Fetch** - Browser or page-related JS initiates a Fetch (HTTP Request)
2. **Push Notifications** - Service worker receives Web Push Notifications (From server of browser vendors)
3. **Notification Interaction** - User interacts with displayed notification
4. **Background Synchonization** - Service Worker receives Background Sync Event (e.g. Internet connection was restored)
5. **Service Worker Lifecycle** - Service Worker Phase changes

### Lifecycle of a service worker

- Browser **registers** the service worker as a background process
- Browser then **installs** the service worker
- Browser then **activates** the service worker
- Service worker then goes to the **idle** state
- After idling for some time, if there are no events to react to, it then goes to the **terminated** state.
- In case of any events, the service worker is triggered to come back to the **idle** state for further actions.

**IMPORTANT** - Service workers only work on pages served via HTTPS.

### Understanding the lifecycle events

1. The service worker registration happens in one of the JavaScript files (Running in a separate thread).
2. The service worker installation and activation happens in the service worker JavaScript file (Running in a separate thread).
3. For every reload of the page, service worker gets registered to the browser.
4. If the service worker code is changed, the installation event gets triggered, but the activation does not happen until all the opened tabs and windows of the app are closed and reopened.
5. The activation of a service worker has such a condition because a service worker is a background process. If a tab with the app running is open, the service worker might be communicating with the app and hence the updated service worker changes might break the existing app.
6. The service worker can be unregistered.

### Non-lifecycle event - FETCH

The most important event which is not part of the service worker lifecycle is the **Fetch** event.
Fetch event is trigged by the application while fetching CSS, JS, images or data. Every fetch request of the app goes through the service worker and so does every response. The service worker acts like a proxy.

The power of this event passing through the service worker gets realized when the application needs to work offline and data needs to be served from cache.

### Unregister a service worker

If you find a bug in your service worker in development mode, there are multiple ways to reload/update it using dev tools. What if the same situation occurs while your app is in production? The blog post [here](https://love2dev.com/blog/how-to-uninstall-a-service-worker/) gives a good overview of the steps that can be taken.

### Multiple service workers

A page could have multiple service workers, but only with **different scopes**. You can use a service worker for the /help "subdirectory" and one for the rest of your app. The more specific service worker (=> /help) overwrites the other one for its scope.

### Difference between Web Workers and Service Workers

Service Workers are a special type of Web Workers.

Web Workers also run on a background thread, decoupled from the DOM. They don't keep on living after the page is closed though. Service Worker on the other hand, keeps on running (depending on the operating system) and also is decoupled from an individual page. 

### Browser support and References

Are Service Workers Ready? - Check [Browser Support](https://jakearchibald.github.io/isserviceworkerready/)

For detailed information on service workers, please read [Getting Started with Service Workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)

# Development mode - How to connect Chrome Developer Tools to a Real/Emulated device

It's easy to connect your Chrome Developer Tools with a Real or Emulated Android Device.

The following article explains it step-by-step and by using helpful images: https://developers.google.com/web/tools/chrome-devtools/remote-debugging/

Make sure you enabled "Developer Mode" on your device. You do that by tapping your Android Build Number (in the Settings) 7 times. Yes, this is no joke ;-)

Once you have connected your real/emulated device to your dev tools, it is possible to inspect the actions happening on your device, view logs in the console and also open new tabs on your device.

**IMPORTANT** - If you make any changes to the service worker, please be aware that you need to close all the opened tabs in your device for the new version of the service worker to get activated.


# Web App Install Banner

A web app install banner is a prompt that comes up when a user accesses the PWA via the browser. This enables the user to install the app to his home screen. The prompt contains the app icon, app name and a button which reads "Add to Home Screen". This banner is shown automatically by the browser if the app meets few important criteria.

For information about the criteria for a Web App Install Banner to be displayed in the browser, please visit [More about the Web App Install Banner](https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/)

## How to add your app to home screen

If your app satifies the above mentioned criteria, the browser fires an event which indicates that the install banner can be shown. In order to show the **Add to Home Screen** dialog, you need to:

1. Listen for the **beforeinstallprompt** event fired by the browser.
2. If you want to show the banner on a particular user action (click of a button, etc.), you have to save the beforeinstallprompt event, and then use it to show the banner on that action.
3. The prompt can be displayed by calling **prompt()** on the saved beforeinstallprompt event.

An **appinstalled** event is fired once the app gets succesfully installed/added to the home screen. You could listen to this event to get a heuristic of how many users actually added the app to their home screen after the app install banner was shown.

# Promises and Fetch API

### Asynchronous code in JavaScript

Asynchronous operations are quite common in any application. If we know that an operation could take time (writing to a database, reading from a server, etc), it is not required for us to wait until the operation is complete and then proceed with the next action. Since JavaScript code runs in a single thread, this could potentiallly block the next operations.

We could define a callback to which the control returns to once the required operation is completed. Hence, this is called a non-blocking operation. One such in-built JS function is **setTimeout**. The disadvantage of async code is that they would lead to the classic callback pyramid of doom when there are nested callbacks.

### Promises

A Promise is an object representing the eventual completion or failure of an asynchronous operation. A promise is created by passing a function you want to execute and this function takes in two functions as arguments - **resolve** and **reject**. 

We can use the **then** function to consume the data when a promise resolves (in success cases). We can use the **catch** function to handle errors when a promise gets rejected (in error cases).

The main advantage of a promise is that it is easier to chain multiple async operations. In particular, we could chain mutiple calls to **then** function. We could have a **catch** function at the end of the chain to catch errors occurring in any of the then blocks.

### Fetch API

**fetch** is a method provided by JavaScript. It allows us to send HTTP requests. This method returns a promise which can be handled using 'then' function in which the response can be read. Any error thrown by the fetch method can be handled using the 'catch' function.

We can specify the mode in which our fetch API needs to operate with respect to CORS. The mode can be set to **cors** (this is the default value) or **no-cors**. Setting the mode to 'cors' expects the CORS headers (Access-Control-Allow-Credentials and Access-Control-Allow-Origin) from the server, which indicates that the server allows requests from origins different from its own. If these headers are not set, the response body is hidden and cannot be accessed by the client.

How does the Fetch API differ from traditional AJAX requests. Fetch API requires a lot lesser code to send an HTTP request, parse the response and handle errors. They are very well suited for service workers which require asynchronous ready operations. AJAX requests cannot be used in service workers because they do have some synchronous behaviour behind the scenes.

### Browser support

Fetch and Promises have good browser support, but are not supported by all browsers (especially older ones). In such cases, we need to use polyfills.

**Polyfill** is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

# Service Workers - Caching

Caching is important to provide offline access of your web application. Why should we support offline access?

- Poor connection (When lot of people are accessing the application)
- No connection (For example, in elevators)
- Lie-Fie (When your phone shows that it is connected to the WiFi, but the connection doesn't work. Especially in hotspots, hotels, etc.)

### The Cache API

It is a separate cache storage living in the browser and managed by the developer. The cache consists of simple **key/value pairs** where key is the request you want to send and value is the response you got back. The cache API can be accessed from both service workers and normal JavaScript (on pages). Cache data can be retrieved instead of sending network request.

With the fetch event listener and the cache API, we have a complete network proxy living in the service worker, which decides whether the request needs to be sent to the network or the response should be returned from the cache, if available.

Refer [Cache API Browser Support](https://developer.mozilla.org/en-US/docs/Web/API/Cache#Browser_compatibility) to know about the browsers which support Cache API.

Refer [Cache API Methods](https://developer.mozilla.org/en-US/docs/Web/API/Cache#Methods) to know about the methods available in the Cache API.

### Identify Cacheable Items

An **application shell** (app shell) is the mininal HTML, CSS and JavaScript required to power the user interface and when cached offline can ensure instant, reliably good performance to users on repeated visits. This is the core part of your application and the first thing to be cached in order to deliver good user experience when your app is offline.

### Static caching at Service Worker Installation

Since the service worker get installed only when there is a new version of it available, this is the best phase to cache any items which do not change that often (our app shell). We do the caching during service worker installation where we get access to the cache API. These assets will become available for fetching from cache right from the next page visit. This is the earliest point of time when we can store our assets in the cache.

### Dynamic caching upon fetch

There could be few assets which do not require pre caching but need to fetched on demand. In this case, it is possible to add them to the cache after they are first fetched so that they become available for future visits. This is important because we cannot bloat the cache with too many entries during pre caching.

# How to Use the App
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.

# Courtesy
This application is a part of Maximilian Schwarzmüller's "Progressive Web Apps - Complete Guide" course on [Udemy](https://www.udemy.com/).

# References

[HTTP Bin](https://httpbin.org) - Contains REST endpoints which can be used for testing any UI with sample data.