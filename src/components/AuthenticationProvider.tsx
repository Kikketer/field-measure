import { AuthError, UserResponse } from '@supabase/supabase-js'
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
  user: Resource<UserResponse>
  loading?: boolean
}>()

export const AuthenticationProvider: Component<AuthenticationProvider> = (
  props,
) => {
  const [user] = createResource(() => supabase.auth.getUser())

  return (
    <AuthenticationContext.Provider value={{ user, loading: user.loading }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}
