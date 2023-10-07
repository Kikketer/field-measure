import {
  Component,
  JSX,
  Show,
  createContext,
  createSignal,
  useContext,
} from 'solid-js'
import { OfflineIcon } from '../assets/OfflineIcon.tsx'

type OnlineStatusProvider = {
  children: JSX.Element
}

export const OnlineContext = createContext<() => boolean>()

export const OnlineStatusProvider = (props: OnlineStatusProvider) => {
  const [isOnline, setIsOnline] = createSignal(false)

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
    console.log('The network connection has been lost.')
    setIsOnline(false)
  })

  window.addEventListener('online', (event) => {
    console.log('The network connection has been restored.')
    // When we get back online, verify we actually are by pinging the endpoint
    pingEndpoint()
  })

  return (
    <OnlineContext.Provider value={isOnline}>
      {props.children}
    </OnlineContext.Provider>
  )
}

export const OnlineStatus: Component = () => {
  const isOnline = useContext(OnlineContext)

  return (
    <Show when={!isOnline?.()}>
      <OfflineIcon />
    </Show>
  )
}
