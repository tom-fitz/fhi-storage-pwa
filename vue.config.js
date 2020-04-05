module.exports = {
  lintOnSave: false,
  pwa: {
    // configure the workbox plugin
    //workboxPluginMode: 'generateSW',
    workboxOptions: {
        // swSrc is required in InjectManifest mode.
        //swSrc: 'service-worker.js',
        skipWaiting: true
        // ...other Workbox options...
    }
  }
}
