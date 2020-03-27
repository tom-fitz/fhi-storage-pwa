// if (workbox) {
//   console.log(`Workbox is loaded`);

//   workbox.precaching.precacheAndRoute(self.__precacheManifest);

// } 
// else {
//   console.log(`Workbox didn't load`);
// }

workbox.setConfig({
  debug: false,
})

// Lets start by caching all .js files
workbox.routing.networkFirst(
  /\.js$/,
  new networkFirst()
)

// then go ahead and cache any .vue files
workbox.routing.networkFirst(
  /\.vue$/,
  new networkFirst()
)

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

console.log("precaching")
  
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