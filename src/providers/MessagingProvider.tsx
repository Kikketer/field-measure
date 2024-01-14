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
  const [oneSignalReady, setOneSignalReady] = createSignal(false)
  const [debug, setDebug] = createSignal({ ready: true })

  // Setup messaging:
  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.init({
      appId: import.meta.env.VITE_PUBLIC_PUSH_APP_ID,
      safari_web_id: import.meta.env.VITE_PUBLIC_PUSH_SAFARI_ID,
      allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
      // promptOptions: {
      //   actionMessage:
      //     'Would you like to be notified when fields are in need of painting?',
      //   acceptButton: 'Sure',
      //   slidedown: {
      //     prompts: [
      //       {
      //         type: 'push',
      //         autoPrompt: true,
      //         delay: { timeDelay: 5 },
      //       },
      //     ],
      //   },
      // },
      welcomeNotification: {
        disable: true,
      },
    })

    setOneSignalReady(true)
    setDebug({
      ...debug(),
      optedIn: OneSignal.User.PushSubscription.optedIn,
      id: OneSignal.User.PushSubscription.id,
    })
  })

  const setupMessaging = async () => {
    try {
      if (!OneSignal) return
      const isSupported = OneSignal.Notifications.isPushSupported()
      if (!isSupported) return

      await OneSignal.Notifications.requestPermission()
      const permission = await OneSignal.Notifications.permission
      setDebug({ ...debug(), permission, isSupported })
      if (permission) {
        console.log('permission granted!')
        // Check to see if permissino was granted
        // // Check if we've already sent it by checking local storage
        // const alreadySent = !!localStorage.getItem('sentMessageToken')
        // if (!alreadySent) {
        // const uniqueDeviceId = crypto.randomUUID()
        // localStorage.setItem('device_id', uniqueDeviceId)
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
      // setHasSetupMessaging(true)
      // } else {
      //   console.log('Unable to get permission to notify.')
      // }
    } catch (err) {
      console.log('Error getting token: ', err)
    }

    // Regardless of what happens, let's just not ask again
    localStorage.setItem('sentMessageToken', 'true')
  }

  const testPush = async () => {
    // OneSignal.sendSelfNotification()
  }

  const resetMessaging = async () => {
    // // Delete the indexDb ONE_SIGNAL_SDK_DB
    // await window.indexedDB.deleteDatabase('ONE_SIGNAL_SDK_DB')
    // // Remove the local storage item "onesignal-notification-prompt"
    // localStorage.removeItem('onesignal-notification-prompt')
    // // And the "os_pageviews"
    // localStorage.removeItem('os_pageViews')
    // setDebug({ reset: true })
    // hasSetupMessaging(false)
  }

  // createEffect(() => {
  //   if (oneSignalReady() && !hasSetupMessaging()) {
  //     console.log('Ask')
  //   }
  // })

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
