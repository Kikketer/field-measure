import { redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { User } from '@supabase/supabase-js'
import type { MetaFunction, SessionData } from '@vercel/remix'
import { useEffect } from 'react'
import { Database } from '~/database.types'
import {
  AuthenticationProvider,
  useAuthentication,
} from '~/providers/AuthenticationProvider'

import { json } from '@vercel/remix'
import { createServerClient } from '@supabase/auth-helpers-remix'

// import type { LoaderArgs } from '@vercel/remix' // change this import to whatever runtime you are using

export const loader = async ({ request }: { request: any }) => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  const { data } = await supabaseClient.from('demo').select('*')

  // Check if logged in, but don't trust the actual session data
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  // If session is valid, we are logged in and we redirect to /fields
  if (session) {
    return redirect('/fields', {
      headers: response.headers,
    })
  }

  return json(
    { data, user: session?.user },
    {
      headers: response.headers,
    },
  )
}

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Fields' },
    { name: 'description', content: 'LineUp Field Manager - Fields List' },
  ]
}

export default function _index() {
  return (
    <AuthenticationProvider>
      <Comp />
    </AuthenticationProvider>
  )
}

const Comp = () => {
  const { data, user } = useLoaderData<{
    data: Database['public']['Tables']['demo']['Row']
    user: User | null
  }>()
  const { signIn, signOut } = useAuthentication()

  return (
    <>
      <h1>LineUp Field Manager</h1>
      {user && <Link to={'/fields'}>Fields</Link>}
      <pre>User: {JSON.stringify(user ?? {}, null, 2)}</pre>
      <pre>Data: {JSON.stringify(data ?? {}, null, 2)}</pre>
      {user ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <button onClick={signIn}>Login</button>
      )}
    </>
  )
}
