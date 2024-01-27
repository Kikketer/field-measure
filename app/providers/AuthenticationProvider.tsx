// Create a context, provider and hook for the user's authentication state (logged in or not)
import { useOutletContext } from '@remix-run/react'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, ReactNode, useCallback, useContext } from 'react'
import { Database } from '~/database.types'

interface AuthenticationContextProps {}

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  signIn: () => {},
  signOut: () => {},
})

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>
  }>()

  const signIn = useCallback(async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Read only for all spreadsheets so we can get the field data:
          scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
          // construct the url based on our current url:
          redirectTo: `${window.location.protocol}//${window.location.hostname}${window.location.port ? window.location.port : ''}/auth/callback`,
        },
      })
    } catch (err) {
      console.error('Failed to log in ', err)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Failed to log out', err)
    }
  }, [supabase])

  return (
    <AuthenticationContext.Provider
      value={{
        signIn,
        signOut,
      }}
    >
      {children}
      <button onClick={signIn}>Login</button>
      <br />
      <button onClick={signOut}>Logout</button>
    </AuthenticationContext.Provider>
  )
}

export function useAuthentication() {
  return useContext(AuthenticationContext)
}
