import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

type SupabaseProvider =
  | SupabaseClient<Record<string, any>, 'public', any>
  | undefined

const SupabaseContext = createContext<SupabaseProvider>(undefined as any)

export const SupabaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient<any, 'public', any>>()

  useEffect(() => {
    if (!window.ENV.SUPABASE_URL || !window.ENV.SUPABASE_ANON_KEY) return

    setSupabase(
      createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY),
    )
  }, [])

  if (!supabase) {
    return <div>Loading Supabase...</div>
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const supabase = useContext(SupabaseContext)

  if (!supabase) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }

  return supabase
}
