import { A, Outlet, useNavigate } from '@solidjs/router'
import {
  Component,
  JSX,
  Show,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider'
import { OnlineContext } from './OnlineStatusProvider'
import { Page } from './Page'
import { Loader } from './Loader'

export const Authenticated: Component<{ children: JSX.Element }> = ({
  children,
}) => {
  console.log('Rendering authenticated')
  const [ready, setReady] = createSignal(false)
  const authContext = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const isOnline = useContext(OnlineContext)

  createEffect(async () => {
    console.log('Auth ', authContext?.session?.())
    if (!authContext?.loading && !authContext?.session?.()) {
      console.log('Go back!')
      // location.href = '/'
      // Seems we can't navigate to login for some reason... it doesn't actually render!
      // This isn't the first time... not sure why it works sometimes...
      // navigate('/', { replace: true })
    } else if (!!authContext.session) {
      setReady(true)
    }
  })

  return (
    <Show
      when={ready()}
      fallback={
        <Page>
          <Loader />
        </Page>
      }
    >
      {children}
    </Show>
  )
}
