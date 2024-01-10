import {
  Component,
  createContext,
  createSignal,
  JSX,
  Show,
  useContext,
} from 'solid-js'
import { DisconnectedIcon } from '../assets/DisconnectedIcon'
import { OfflineIcon } from '../assets/OfflineIcon'
import { FieldsContext } from './FieldsProvider'
import styles from './OnlineStatusProvider.module.css'

type OnlineStatusProvider = {
  children: JSX.Element
}

export const OnlineContext = createContext<() => boolean>()

export const OnlineStatusProvider = (props: OnlineStatusProvider) => {
  const [isOnline, setIsOnline] = createSignal(true)

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

export const OnlineStatus: Component = () => {
  const online = useContext(OnlineContext)
  const fieldsContext = useContext(FieldsContext)

  return (
    <>
      <Show when={!online?.()}>
        <OfflineIcon />
      </Show>
      {/*<Show when={!fieldsContext?.isConnected?.()}>*/}
      {/*  <button class="ghost" onClick={() => location.reload()}>*/}
      {/*    <DisconnectedIcon*/}
      {/*      class={fieldsContext?.connecting?.() ? styles.Pulse : ''}*/}
      {/*    />*/}
      {/*  </button>*/}
      {/*</Show>*/}
    </>
  )
}