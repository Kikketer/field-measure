import React, {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
} from 'react'

type MessagingProvider = {
  setupMessaging: () => void
  hasSetupMessaging: boolean
}

const MessagingContext = createContext<MessagingProvider>(undefined as any)

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
