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
}

const MessagingContext = createContext<MessagingProvider>(undefined as any)

export const MessagingProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, supabase } = useSupabase()
  const [log, setLog] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)

  const checkAndPrompt = () => {
    const isSupported = OneSignal.Notifications.isPushSupported()
    const alreadyOpted = OneSignal.User.PushSubscription.optedIn
    const alreadyPrompted = localStorage.getItem('push-prompted')

    if (isSupported && !alreadyOpted && !alreadyPrompted) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
    }
  }

  const initializeSignal = async () => {
    try {
      await OneSignal.init({
        appId: import.meta.env.VITE_PUBLIC_PUSH_APP_ID,
        allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
        serviceWorkerParam: { scope: '/push/onesignal/' },
        serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
      })

      const actualUser = await getUser({ supabase })

      if (actualUser?.shouldNotify) {
        checkAndPrompt()
        setLog(log + `\nSetup!`)
      }
    } catch (err) {
      console.error(err)
      setLog(log + `\nFailed ${err}`)
    }
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
              OneSignal.Notifications.requestPermission()
              OneSignal.User.PushSubscription.optIn()
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
