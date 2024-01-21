import { useLoaderData } from '@remix-run/react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { json } from '@vercel/remix'
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react'

type SupabaseProvider = {
  supabase: SupabaseClient<Record<string, any>, 'public', any>
}

const SupabaseContext = createContext<SupabaseProvider>(undefined as any)

export const SupabaseProvider: FC<
  PropsWithChildren<{ supabaseUrl?: string; supabaseAnonKey?: string }>
> = ({ supabaseUrl, supabaseAnonKey, children }) => {
  const supabase = useMemo(() => {
    if (!supabaseAnonKey || !supabaseUrl) return

    return createClient(supabaseUrl, supabaseAnonKey)
  }, [supabaseAnonKey, supabaseUrl])

  if (!supabaseUrl || !supabaseAnonKey) {
    return <div>Loading Supabase...</div>
  }

  return (
    <SupabaseContext.Provider value={{}}>{children}</SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }

  return context.supabase
}
