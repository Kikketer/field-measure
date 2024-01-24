import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSupabase } from '~/providers/SupabaseProvider'
import type { User } from '@supabase/supabase-js'

const AuthContext = createContext<
  | {
      loading?: boolean
      signIn: () => Promise<void>
      signOut: () => Promise<void>
      user?: User
    }
  | undefined
>(undefined)

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const supabase = useSupabase()
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || user) return

    // Check active sessions and sets the user
    supabase.auth
      .getSession()
      .then((session) => {
        console.log('got session?', session)
        if (session?.data?.session?.provider_token) {
          localStorage.setItem(
            'provider_token',
            session?.data?.session?.provider_token ?? '',
          )
        }
        // setUser(session?.data?.user)
      })
      .catch((err) => {
        console.error(err)
      })

    // Listen for changes on auth state (login, signup, logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user)
        setLoading(false)
      },
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [supabase])

  // Sign in with Google
  const signIn = async () => {
    console.log('Signing in!')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Read only for all spreadsheets so we can get the field data:
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        redirectTo: window.ENV.LOGIN_REDIRECT_URL,
      },
    })
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(undefined)
  }

  const value = {
    loading,
    user,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthentication() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error(
      'useAuthentication must be used within a AuthenticationProvider',
    )
  }

  return context
}
