import { A, Outlet, useNavigate } from '@solidjs/router'
import {
  Component,
  Show,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider'
import { OnlineContext } from './OnlineStatusProvider'
import { Page } from './Page'
import { Loader } from './Loader'

export const Authenticated: Component = () => {
  const [ready, setReady] = createSignal(false)
  const authContext = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const isOnline = useContext(OnlineContext)

  createEffect(async () => {
    if (
      (!authContext?.loading && !authContext?.user?.()) ||
      authContext?.user()?.error
    ) {
      location.href = '/'
      // Seems we can't navigate to login for some reason... it doesn't actually render!
      // navigate('/', { replace: true })
    } else if (!!authContext.user()) {
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
      <Outlet />
    </Show>
  )
}
