importScripts("/precache-manifest.45b6cda0069f3216bdfe836715e1050c.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

if (workbox) {
  console.log(`Workbox is loaded`);

  workbox.precaching.precacheAndRoute(self.__precacheManifest);

} 
else {
  console.log(`Workbox didn't load`);
}

// workbox.setConfig({
//     debug: false,
//   })
  
//   workbox.precaching.precacheAndRoute([])
  
//   workbox.routing.registerRoute(
//     /\.(?:png|gif|jpg|jpeg|svg)$/,
//     workbox.strategies.staleWhileRevalidate({
//       cacheName: 'images',
//       plugins: [
//         new workbox.expiration.Plugin({
//           maxEntries: 60,
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//         }),
//       ],
//     }),
//   )
  
//   workbox.routing.registerRoute(
//     new RegExp('https://some-fancy-api.com'),
//     workbox.strategies.networkFirst({
//       cacheName: 'api',
//     }),
//   )
  
//   workbox.routing.registerRoute(
//     new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
//     workbox.strategies.cacheFirst({
//       cacheName: 'googleapis',
//       plugins: [
//         new workbox.expiration.Plugin({
//           maxEntries: 30,
//         }),
//       ],
//     }),
//   )
