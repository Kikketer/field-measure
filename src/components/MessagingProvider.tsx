import { IonAlert } from '@ionic/react'
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import OneSignal from 'react-onesignal'
import { getUser } from '../utilities/data'
import { useSupabase } from './SupabaseProvider'

type MessagingProvider = {
  log?: string
  resetPush: () => void
}

const MessagingContext = createContext<MessagingProvider>()

export const MessagingProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, supabase } = useSupabase()
  const [log, setLog] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)

  const checkAndPrompt = () => {
    const isSupported = OneSignal.Notifications.isPushSupported()
    const alreadyPrompted = localStorage.getItem('push-prompted')

    if (isSupported && !alreadyPrompted) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
    }
  }

  const initializeSignal = async () => {
    try {
      const actualUser = await getUser({ supabase })

      OneSignal.User.PushSubscription.addEventListener('change', (event) => {
        if (event.current.token) {
          // This only fires when we opt in, and sets the external ID of this user
          OneSignal.login(actualUser.userId)
        }
      })

      await OneSignal.init({
        appId: import.meta.env.VITE_PUBLIC_PUSH_APP_ID,
        allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
        serviceWorkerParam: { scope: '/push/onesignal/' },
        serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
      })

      if (actualUser?.shouldNotify) {
        checkAndPrompt()
        setLog(log + `\nSetup!`)
      }
    } catch (err) {
      console.error(err)
      setLog(log + `\nFailed ${err}`)
    }
  }

  const resetPush = () => {
    localStorage.removeItem('push-prompted')
    localStorage.removeItem('onesignal-notification-prompt')
    checkAndPrompt()
  }

  // Setup the messaging on initial load
  useEffect(() => {
    if (!import.meta.env.VITE_PUBLIC_PUSH_APP_ID) return
    if (!user) return

    setLog(log + `\nSetting up messaging`)
    initializeSignal().then()
  }, [user])

  return (
    <MessagingContext.Provider
      value={{
        log,
        resetPush,
      }}
    >
      {children}
      <IonAlert
        header="Push Notifications"
        message="Do you want to receive notifications when fields need painting?"
        isOpen={showPrompt}
        buttons={[
          {
            text: 'No',
            handler: () => {
              setShowPrompt(false)
              OneSignal.User.PushSubscription.optOut()
              localStorage.setItem('push-prompted', 'true')
            },
          },
          {
            text: 'Yes',
            handler: () => {
              setShowPrompt(false)
              OneSignal.User.PushSubscription.optIn()
              OneSignal.Notifications.requestPermission()
              localStorage.setItem('push-prompted', 'true')
            },
          },
        ]}
      />
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context = useContext(MessagingContext)

  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }

  return context
}
