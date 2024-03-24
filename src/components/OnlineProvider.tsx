// import { DisconnectedIcon } from '../assets/DisconnectedIcon'
// import { OfflineIcon } from '../assets/OfflineIcon'
// import { FieldsContext } from './FieldsProvider'
// import styles from './OnlineStatusProvider.module.css'

import { createContext, useContext, useState } from 'react'

type OnlineStatusProvider = {
  children: JSX.Element
}

export const OnlineContext = createContext<boolean>(true)

export const OnlineStatusProvider = (props: OnlineStatusProvider) => {
  const [isOnline, setIsOnline] = useState(true)

  const pingEndpoint = async () => {
    // Fetch the page from our domain to check if we can reach it
    try {
      const response = await fetch(window.location.origin)
      if (response.ok) {
        setIsOnline(true)
      } else {
        setIsOnline(false)
      }
    } catch (err) {
      setIsOnline(false)
    }
    // TODO repeat pinging until we actually reach the endpoint
  }
  // Ping when we load up for the first time
  pingEndpoint()

  window.addEventListener('offline', (event) => {
    setIsOnline(false)
  })

  window.addEventListener('online', (event) => {
    // When we get back online, verify we actually are by pinging the endpoint
    pingEndpoint()
  })

  return (
    <OnlineContext.Provider value={isOnline}>
      {props.children}
    </OnlineContext.Provider>
  )
}

export const useOnlineStatus = () => {
  const context = useContext(OnlineContext)
  if (context === undefined) {
    throw new Error(
      'useOnlineStatus must be used within a OnlineStatusProvider',
    )
  }
  return context
}
