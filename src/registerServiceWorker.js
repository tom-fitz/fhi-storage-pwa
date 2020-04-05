/* eslint-disable no-console */

import { register } from 'register-service-worker'

const notifyUserAboutUpdate = worker => {
  alert("New Content is Available!")
  worker.postMessage({action: "skipWaiting"})
}

if (process.env.NODE_ENV === 'production') {
  register(`../service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound (registration) {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
      console.log("registration object", registration)
      notifyUserAboutUpdate(registration.waiting)
    },
    offline () { 
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
  // let refreshing;
  // console.log("sw", navigator.serviceWorker)
  // navigator.serviceWorker.addEventListener("controllerchange", () => {
  //   if(refreshing){return}
  //   window.location.reload()
  //   refreshing = true
  // }).setTimeout(() => {
    
  // }, 2000);
}
