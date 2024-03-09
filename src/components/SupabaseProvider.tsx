import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { FullLoader } from './FullLoader'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// And the provider code:
const SupabaseContext = createContext<{
  supabase: SupabaseClient
  user?: Session['user']
  signIn: () => Promise<void>
} | null>(null)

export const SupabaseProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<Session['user']>()

  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setUser(session?.data?.session?.user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user)
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

    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Read only for all spreadsheets so we can get the field data:
        // scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        redirectTo: `${import.meta.env.VITE_PUBLIC_REDIRECT_URL}/fields`,
      },
    })
  }

  return (
    <>
      {loading ? (
        <FullLoader />
      ) : (
        <SupabaseContext.Provider value={{ supabase, user, signIn }}>
          {children}
        </SupabaseContext.Provider>
      )}
    </>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
