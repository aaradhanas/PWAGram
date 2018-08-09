# PWAGram
A simple Instagram clone, implementing a lot of PWA features.

# What is a PWA?

PWA is the abbreviation for **Progressive Web Application**. It is a term referrring to a couple of features you can add to any web application to enhance it. You can progressively enhance your web apps to look and feel like native apps.

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

### Multiple service workers

A page could have multiple service workers, but only with different scopes. You can use a service worker for the /help "subdirectory" and one for the rest of your app. The more specific service worker (=> /help) overwrites the other one for its scope.

# Development mode - How to connect Chrome Developer Tools to a Real/Emulated device

It's easy to connect your Chrome Developer Tools with a Real or Emulated Android Device.

The following article explains it step-by-step and by using helpful images: https://developers.google.com/web/tools/chrome-devtools/remote-debugging/

Make sure you enabled "Developer Mode" on your device. You do that by tapping your Android Build Number (in the Settings) 7 times. Yes, this is no joke ;-)

Once you have connected your real/emulated device to your dev tools, it is possible to inspect the actions happening on your device, view logs in the console and also open new tabs on your device.

**IMPORTANT** - If you make any changes to the service worker, please be aware that you need to close all the opened tabs in your device for the new version of the service worker to get activated.


### Web App Install Banner

A web app install banner is a prompt that comes up when a user accesses the PWA via the browser. This enables the user to install the app to his home screen. The prompt contains the app icon, app name and a button which reads "Add to Home Screen". This banner is shown automatically by the browser if the app meets few important criteria.

For information about the criteria for a Web App Install Banner to be displayed in the browser, please visit [More about the Web App Install Banner](https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/)

## How to add your app to home screen

If your app satifies the above mentioned criteria, the browser fires an event which indicates that the install banner can be shown. In order to show the **Add to Home Screen** dialog, you need to:

1. Listen for the **beforeinstallprompt** event fired by the browser.
2. If you want to show the banner on a particular user action (click of a button, etc.), you have to save the beforeinstallprompt event, and then use it to show the banner on that action.
3. The prompt can be displayed by calling **prompt()** on the saved beforeinstallprompt event.

An **appinstalled** event is fired once the app gets succesfully installed/added to the home screen.

# How to Use the App
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.

# Courtesy
This application is a part of Maximilian Schwarzmüller's "Progressive Web Apps - Complete Guide" course on [Udemy](https://www.udemy.com/).