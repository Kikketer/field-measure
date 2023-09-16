// import { HTMLElementTagNameMap } from '@ionic/core/components/index'

// type LocalIntrinsicElements = JSX.IntrinsicElements

declare global {
  declare module 'solid-js' {
    namespace JSX {
      interface IntrinsicElements {
        'ion-app': any
        'ion-content': any
      }
    }
  }
}
