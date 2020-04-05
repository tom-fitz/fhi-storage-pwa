importScripts("/precache-manifest.d902cb00cccc6546ab3071c21d8ae73c.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// if (workbox) {
//   console.log(`Workbox is loaded`);

//   workbox.precaching.precacheAndRoute(self.__precacheManifest);

// } 
// else {
//   console.log(`Workbox didn't load`);
// }

self.addEventListener("message", msg => {
  if(msg.data.action == 'skipWaiting'){
    self.skipWaiting()
  }
})

workbox.setConfig({
  debug: true,
})

// Lets start by caching all .js files
// workbox.routing.networkFirst(
//   /\.js$/,
//   new networkFirst()
// )

workbox.precaching.precacheAndRoute([])

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
)
  
workbox.routing.registerRoute(
  new RegExp('https://fhistorage-api.azurewebsites.net'),
  workbox.strategies.networkFirst({
    cacheName: 'api',
  }),
)

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  }),
)
