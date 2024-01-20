import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react'
import OneSignal from 'react-onesignal'

type MessagingProvider = {
  setupMessaging: () => void
  hasSetupMessaging: boolean
  log?: string
}

const MessagingContext = createContext<MessagingProvider>(undefined as any)

export const MessagingProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hasSetupMessaging, setHasSetupMessaging] = useState(false)
  const [log, setLog] = useState('')
  const hasInitialized = useRef(false)
  const setupMessaging = async () => {
    try {
      console.log('Setting up!')
      setLog('Setting up!')
      await OneSignal.init({
        appId: import.meta.env.VITE_PUBLIC_PUSH_APP_ID,
        allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
        notifyButton: {
          enable: true,
        },
        serviceWorkerParam: { scope: '/push/onesignal/' },
        serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
      })
      console.log(OneSignal.User.PushSubscription.optedIn)
      // if (hasInitialized.current) {
      //   console.log('Already initialized!')
      //   setLog(log + '\nAlready initialized!')
      //   return
      // }
      // await OneSignal.Slidedown.promptPush()
      hasInitialized.current = true
      setLog(log + '\nSetup!')
    } catch (err) {
      setLog(log + `\n${err}`)
      console.error(err)
    }
  }

  return (
    <MessagingContext.Provider
      value={{
        setupMessaging,
        hasSetupMessaging,
        log,
      }}
    >
      {children}
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
