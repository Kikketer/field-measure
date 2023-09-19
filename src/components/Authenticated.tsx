import { Outlet, useNavigate } from '@solidjs/router'
import {
  Component,
  Show,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from './AuthenticationProvider'
import { OnlineContext } from './OnlineStatusProvider'

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
      navigate('/', { replace: true })
    } else {
      setReady(true)
    }
  })

  return (
    <Show when={ready()} fallback={<div>Setting up the shot...</div>}>
      <Outlet />
    </Show>
  )
}
