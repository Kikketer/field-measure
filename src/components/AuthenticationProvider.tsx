import {
  Component,
  createContext,
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

  return (
    <AuthenticationContext.Provider value={{ session, user }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
