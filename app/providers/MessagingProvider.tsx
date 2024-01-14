import React, {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
} from 'react'

const MessagingContext = createContext<{ hasSetupMessaging: boolean }>({})

export const MessagingProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hasSetupMessaging, setHasSetupMessaging] = useState(false)
  const setupMessaging = () => {}

  return (
    <MessagingContext.Provider
      value={{
        setupMessaging,
        hasSetupMessaging,
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
