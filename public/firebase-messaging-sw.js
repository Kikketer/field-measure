// Import the Firebase scripts that the service worker will use
importScripts(
  'https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js',
)

// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCBnpgkWZJZnnfQYJ2ryeZYsmCfVpP-lKg',
  authDomain: 'field-manager-29455.firebaseapp.com',
  projectId: 'field-manager-29455',
  storageBucket: 'field-manager-29455.appspot.com',
  messagingSenderId: '861918292994',
  appId: '1:861918292994:web:cd10e1b3ccb2fefad30b1b',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  )
  // For some reason any customization is ignored here, but we still need this function
  // to be here for the background notification to work :|
  // In fact any modifications to this would present 2 notifications and not open the tab!

  // // Customize notification here (lies)
  // const notificationTitle = 'Background Message Title'
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: payload.notification.image,
  // }
  //
  // self.registration.showNotification(notificationTitle, notificationOptions)
})
