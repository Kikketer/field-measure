import { useNavigate } from '@solidjs/router'
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Show,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from '../providers/AuthenticationProvider'
import { Page } from './Page'
import { Loader } from './Loader'

export const Authenticated: Component<{ children: JSX.Element }> = ({
  children,
}) => {
  const [ready, setReady] = createSignal(false)
  const authContext = useContext(AuthenticationContext)
  const navigate = useNavigate()

  createEffect(async () => {
    if (authContext?.session?.() && !authContext.session()?.data.session) {
      navigate('/', { replace: true })
    } else {
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
