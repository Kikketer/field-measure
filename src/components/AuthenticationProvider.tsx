import {
  Component,
  JSX,
  Resource,
  createContext,
  createResource,
} from 'solid-js'
import { supabase } from './supabase'

type AuthenticationProvider = {
  children: JSX.Element
}

export const AuthenticationContext = createContext<{
  session?: Resource<{ data: any }>
  loading?: boolean
}>()

export const AuthenticationProvider: Component<AuthenticationProvider> = (
  props,
) => {
  const [session] = createResource(() => supabase.auth.getSession())

  return (
    <AuthenticationContext.Provider value={{ session }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
