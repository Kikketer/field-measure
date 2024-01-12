import { SupabaseClient } from '@supabase/supabase-js'
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider'
import { SupabaseContext } from './SupabaseProvider'

const sendTokenToServer = async (
  uniqueDeviceId: string,
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
  await supabase.from('device_tokens').insert([
    {
      token: currentToken,
      user_id: user?.()?.id,
      device_id: uniqueDeviceId,
      device_info: navigator.userAgent,
    },
  ])
}

export const MessagingContext = createContext<{
  hasSetupMessaging: Accessor<boolean>
  ignoreMessaging: () => void
  setupMessaging: () => Promise<void>
  resetMessaging: () => void
  testPush: () => Promise<void>
}>()

export const MessagingProvider = (props: MessagingProvider) => {
  const { user } = useContext(AuthenticationContext)
  const { supabase } = useContext(SupabaseContext)
  const [hasSetupMessaging, setHasSetupMessaging] = createSignal(
    !!localStorage.getItem('sentMessageToken'),
  )
  const [oneSignalLoaded, setOneSignalLoaded] = createSignal(false)
  const [debug, setDebug] = createSignal({})

  // Setup messaging:
  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.init({
      appId: import.meta.env.VITE_PUBLIC_PUSH_APP_ID,
      safari_web_id: import.meta.env.VITE_PUBLIC_PUSH_SAFARI_ID,
      allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
      // notifyButton: {
      //   enable: true,
      // },
      promptOptions: {
        actionMessage:
          'Would you like to be notified when fields are in need of painting?',
        acceptButton: 'Sure',
        slidedown: {
          prompts: [
            {
              type: 'push',
              autoPrompt: true,
              delay: { timeDelay: 5 },
            },
          ],
        },
      },
      welcomeNotification: {
        disable: true,
      },
    })
    setOneSignalLoaded(true)

    setDebug({
      optedIn: OneSignal.User.PushSubscription.optedIn,
      id: OneSignal.User.PushSubscription.id,
    })
  })

  // createEffect(() => {
  //   if (oneSignalLoaded()) {
  //     // setTimeout(() => {
  //     console.log('one signal has loaded, time to prompt?')
  //     console.log('this users push id', OneSignal.User.PushSubscription.id)
  //     console.log('OptedIn?', OneSignal.User.PushSubscription.optedIn)
  //     // OneSignal.Slidedown.promptPush()
  //     // }, 5000)
  //   }
  // })

  const setupMessaging = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        // Check if we've already sent it by checking local storage
        const alreadySent = !!localStorage.getItem('sentMessageToken')
        if (!alreadySent) {
          const uniqueDeviceId = crypto.randomUUID()
          localStorage.setItem('device_id', uniqueDeviceId)
          // const currentToken = await getToken(messaging, {
          //   vapidKey: VAPID_KEY,
          // })
          // console.log('Token: ', currentToken)
          // await sendTokenToServer(
          //   uniqueDeviceId,
          //   currentToken,
          //   supabase,
          //   user,
          // )
          console.log('Successfully created the token!')
        }
        setHasSetupMessaging(true)
      } else {
        console.log('Unable to get permission to notify.')
      }
    } catch (err) {
      console.log('Error getting token: ', err)
    }

    // Regardless of what happens, let's just not ask again
    localStorage.setItem('sentMessageToken', 'true')
  }

  const ignoreMessaging = () => {
    setHasSetupMessaging(true)
    // Also set the local storage so we stop asking
    localStorage.setItem('sentMessageToken', 'true')
  }

  const testPush = async () => {
    await Promise.resolve()
  }

  const resetMessaging = async () => {
    setHasSetupMessaging(false)
    // Note we leave the token on the server since NO ONE can delete the tokens (they aren't tied to auth)
    localStorage.removeItem('device_id')
    localStorage.removeItem('sentMessageToken')
    // Refresh the browser
    window.location.reload()
  }

  // onMessage(messaging, (payload) => {
  //   console.log('OnMessage ', payload)
  //   if (Notification.permission === 'granted') {
  //     const notification = new Notification(
  //       payload.notification.title + ' ⚽️',
  //       {
  //         body: payload.notification?.body,
  //         image: payload.notification?.image,
  //       },
  //     )
  //
  //     notification.onclick = (event) => {
  //       // event.preventDefault() // prevent the browser from focusing the Notification's tab
  //       // window.open(payload.notification.click_action, '_blank')
  //       // Be nice and close the notification when you click it:
  //       notification.close()
  //     }
  //   }
  // })

  // const contextValue = {
  //   hasSetupMessaging,
  //   ignoreMessaging,
  //   setupMessaging,
  //   resetMessaging,
  //   testPush,
  // }

  return (
    <MessagingContext.Provider
      value={{
        hasSetupMessaging,
        ignoreMessaging,
        setupMessaging,
        resetMessaging,
        testPush,
        debug,
      }}
    >
      {props.children}
    </MessagingContext.Provider>
  )
}
