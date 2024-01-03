import {
  Component,
  createContext,
  createEffect,
  createResource,
  JSX,
  Resource,
  useContext,
} from 'solid-js'
import { getUser } from '../utilities/userStore'
import { SupabaseContext } from './SupabaseProvider'

type AuthenticationProvider = {
  children: JSX.Element
}

export const AuthenticationContext = createContext<{
  session?: Resource<{ data: any }>
  user?: Resource<{ data: any }>
  loading?: boolean
}>()

export const AuthenticationProvider: Component<AuthenticationProvider> = (
  props,
) => {
  const supabaseContext = useContext(SupabaseContext)

  const [session] = createResource(
    () => supabaseContext?.supabase.auth.getSession(),
  )
  const [user] = createResource(() => getUser())

  createEffect(() => {
    if (session?.()?.data?.session?.provider_token) {
      // Set the provider_token as we use this to use the google sheets API:
      localStorage.setItem(
        'provider_token',
        session?.()?.data?.session?.provider_token ?? '',
      )
    }
  })

  return (
    <AuthenticationContext.Provider value={{ session, user }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
