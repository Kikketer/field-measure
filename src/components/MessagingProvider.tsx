import { SupabaseClient } from '@supabase/supabase-js'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { createContext, JSX, useContext } from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider.tsx'
import { SupabaseContext } from './SupabaseProvider.tsx'

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
  // Insert a row into the device_tokens table with the current token and current user
  if (!alreadySent) {
    await supabase
      .from('device_tokens')
      .insert([{ token: currentToken, user_id: user()?.id }])
    localStorage.setItem('sentFirebaseMessagingToken', 'true')
  }
}

export const MessagingContext =
  createContext<() => { getToken: () => Promise<void> }>()

export const MessagingProvider = (props: MessagingProvider) => {
  const { user } = useContext(AuthenticationContext)
  const { supabase } = useContext(SupabaseContext)
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig)
  const messaging = getMessaging(firebaseApp)

  const setupMessaging = async () => {
    try {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
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
  }

  const contextValue = {
    setupMessaging,
  }

  return (
    <MessagingContext.Provider value={contextValue}>
      {props.children}
    </MessagingContext.Provider>
  )
}
