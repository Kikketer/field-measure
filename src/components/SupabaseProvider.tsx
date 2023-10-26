import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Component, createContext, JSX } from 'solid-js'

const getSupabase = () => {
  return createClient(
    import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  )
}

type SupabaseProvider = {
  children: JSX.Element
}

export const SupabaseContext = createContext<{
  supabase: SupabaseClient<any, 'public', any>
  resetSupabase: () => SupabaseClient<any, 'public', any>
}>()
export const SupabaseProvider = (props: SupabaseProvider) => {
  // When this is first added to the stack, just set the supabase variable
  let supabase = getSupabase()

  const resetSupabase = () => {
    supabase = getSupabase()
    return supabase
  }

  return (
    <SupabaseContext.Provider value={{ supabase, resetSupabase }}>
      {props.children}
    </SupabaseContext.Provider>
  )
}
