import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import OneSignal from 'react-onesignal'

type MessagingProvider = {
  log?: string
}

const MessagingContext = createContext<MessagingProvider>(undefined as any)

export const MessagingProvider: FC<PropsWithChildren<{ appId?: string }>> = ({
  appId,
  children,
}) => {
  const [hasSetupMessaging, setHasSetupMessaging] = useState(false)
  const [log, setLog] = useState('')
  const [hasInitialized, setHasInitialized] = useState(false)

  // Setup the messaging on initial load
  useEffect(() => {
    if (!appId) return

    setLog(log + `\nSetting up messaging`)
    OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: location.hostname === 'localhost',
      serviceWorkerParam: { scope: '/push/onesignal/' },
      serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
    })
      .then((one) => {
        setHasInitialized(true)
        setTimeout(() => {
          console.log('prompting user')
          console.log(OneSignal.User.PushSubscription.optedIn)
        }, 2000)
        setLog(log + `\nSetup!`)
      })
      .catch((err) => {
        console.error(err)
        setHasInitialized(false)
        setLog(log + `\nFailed ${err}`)
      })
  }, [appId])

  return (
    <MessagingContext.Provider
      value={{
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
