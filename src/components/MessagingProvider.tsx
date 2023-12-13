import { SupabaseClient } from '@supabase/supabase-js'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider'
import { SupabaseContext } from './SupabaseProvider'

const VAPID_KEY =
  'BJRycxAW6wdLbOnxyOfWhNfRK9XxBIWJv75plM2JKUJnsJSACA1Zwx-vMPCWD-EyiSAfX39NioWyLiRRZHme1B0'
type MessagingProvider = {
  children: JSX.Element
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCBnpgkWZJZnnfQYJ2ryeZYsmCfVpP-lKg',
  authDomain: 'field-manager-29455.firebaseapp.com',
  projectId: 'field-manager-29455',
  storageBucket: 'field-manager-29455.appspot.com',
  messagingSenderId: '861918292994',
  appId: '1:861918292994:web:cd10e1b3ccb2fefad30b1b',
}

const sendTokenToServer = async (
  currentToken: string,
  supabase: SupabaseClient,
  user: () => { id: string },
) => {
  if (!currentToken) {
    console.log(
      'No Instance ID token available. Request permission to generate one.',
    )
    return
  }
  console.log('Sending token to server...')
  const uniqueDeviceId = crypto.randomUUID()
  // Insert a row into the device_tokens table with the current token and current user
  await supabase.from('device_tokens').insert([
    {
      token: currentToken,
      user_id: user?.()?.id,
      device_id: uniqueDeviceId,
      device_info: navigator.userAgent,
    },
  ])
  localStorage.setItem('sentFirebaseMessagingToken', 'true')
  // Save this device ID so we can possibly delete it from our db in the future if needed
  localStorage.setItem('device_id', uniqueDeviceId)
}

export const MessagingContext = createContext<{
  hasSetupMessaging: Accessor<boolean>
  ignoreMessaging: () => void
  setupMessaging: () => Promise<void>
}>()

export const MessagingProvider = (props: MessagingProvider) => {
  const { user } = useContext(AuthenticationContext)
  const { supabase } = useContext(SupabaseContext)
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig)
  const messaging = getMessaging(firebaseApp)
  const [hasSetupMessaging, setHasSetupMessaging] = createSignal(
    !!localStorage.getItem('sentFirebaseMessagingToken'),
  )

  const setupMessaging = async () => {
    try {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          setHasSetupMessaging(true)
          // Check if we've already sent it by checking local storage
          const alreadySent = localStorage.getItem('sentFirebaseMessagingToken')
          if (!alreadySent) {
            console.log('Getting token!')
            const currentToken = await getToken(messaging, {
              vapidKey: VAPID_KEY,
            })
            console.log('Token: ', currentToken)
            await sendTokenToServer(currentToken, supabase, user)
            console.log('Successfully created the token!')
          }
        } else {
          console.log('Unable to get permission to notify.')
        }
      })
    } catch (err) {
      console.log('Error getting token: ', err)
    }

    // Regardless of what happens, let's just not ask again
    localStorage.setItem('sentFirebaseMessagingToken', 'true')
  }

  const ignoreMessaging = () => {
    setHasSetupMessaging(true)
    // Also set the local storage so we stop asking
    localStorage.setItem('sentFirebaseMessagingToken', 'true')
  }

  onMessage(messaging, (payload) => {
    console.log('OnMessage ', payload)
    if (Notification.permission === 'granted') {
      const notification = new Notification(
        payload.notification.title + ' ⚽️',
        {
          body: payload.notification?.body,
          image: payload.notification?.image,
        },
      )

      notification.onclick = (event) => {
        // event.preventDefault() // prevent the browser from focusing the Notification's tab
        // window.open(payload.notification.click_action, '_blank')
        // Be nice and close the notification when you click it:
        notification.close()
      }
    }
  })

  const contextValue = {
    hasSetupMessaging,
    ignoreMessaging,
    setupMessaging,
  }

  return (
    <MessagingContext.Provider value={contextValue}>
      {props.children}
    </MessagingContext.Provider>
  )
}
