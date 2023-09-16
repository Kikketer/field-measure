import { JSX } from '@ionic/core'

type LocalIntrinsicElements = JSX.IntrinsicElements
export {}

declare global {
  namespace JSX {
    interface IntrinsicElements extends LocalIntrinsicElements {}
    // interface IntrinsicElements {
    //   'ion-app': any
    //   // Add other Ionic components as needed
    // }
  }
}

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'ion-app': any
//     }
//     // interface IntrinsicElements extends LocalIntrinsicElements {}
//   }
// }
