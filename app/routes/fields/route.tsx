import { Outlet, useLoaderData } from '@remix-run/react'
import { json } from '@vercel/remix'
import { SupabaseProvider } from '~/providers/SupabaseProvider'

export const loader = async () => {
  return json({
    supabaseUrl: process.env.VITE_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  })
}

export default function route() {
  const data = useLoaderData<typeof loader>()

  return (
    <SupabaseProvider
      supabaseUrl={data?.supabaseUrl}
      supabaseAnonKey={data?.supabaseAnonKey}
    >
      <h1>Auth</h1>
      <Outlet />
    </SupabaseProvider>
  )
}
