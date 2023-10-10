import {
  Component,
  JSX,
  Resource,
  createContext,
  createResource,
} from 'solid-js'
import { getUser } from '../utilities/userStore'
import { supabase } from './supabase'

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
  const [session] = createResource(() => supabase.auth.getSession())
  const [user] = createResource(() => getUser())

  return (
    <AuthenticationContext.Provider value={{ session, user }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
