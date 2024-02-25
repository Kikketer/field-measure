import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// And the provider code:
const SupabaseContext = createContext<{
  supabase: SupabaseClient
  session: Session | null
  signIn: () => Promise<void>
} | null>(null)

export const SupabaseProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.provider_token) {
          // Set the provider_token as we use this to use the google sheets API:
          localStorage.setItem('provider_token', session.provider_token ?? '')
        }

        setSession(session)
      },
    )

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    // First log out of supabase:
    await supabase.auth.signOut()

    console.log('Redirect to ', import.meta.env.VITE_PUBLIC_REDIRECT_URL)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Read only for all spreadsheets so we can get the field data:
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        redirectTo: `${import.meta.env.VITE_PUBLIC_REDIRECT_URL}/fields`,
      },
    })
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session, signIn }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
