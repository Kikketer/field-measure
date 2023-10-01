import { Component } from 'solid-js'
import { registerSW } from 'virtual:pwa-register'

export const ServiceWorker: Component = () => {
  // When loaded setup the service worker, and notify the user if it needs a refresh
  registerSW({
    immediate: false,
    onNeedRefresh: () => {
      // TODO make this a better looking thing:
      if (window.confirm('New download available')) {
        window.location.reload()
      }
    },
  })

  return null
}
