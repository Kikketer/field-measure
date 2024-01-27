import { Link, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useEffect } from 'react'
import { Database } from '~/database.types'
import { useAuthentication } from '~/providers/AuthenticationProvider'

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

  return json(
    { data },
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
  const { data } = useLoaderData<{
    data: Database['public']['Tables']['demo']['Row']
  }>()
  // const { loading, signIn, signOut, user } = useAuthentication()

  // useEffect(() => {
  //   if (user && !loading) {
  //     console.log('Time to travel!')
  //   }
  // }, [user, loading])

  return (
    <div>
      <h1>LineUp Field Manager</h1>
      <pre>{/*{JSON.stringify(loading)} and {JSON.stringify(!!user)}*/}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/*<button type="button" onClick={() => signIn()}>*/}
      {/*  Login*/}
      {/*</button>*/}
      {/*<button type="button" onClick={() => signOut()}>*/}
      {/*  Log out*/}
      {/*</button>*/}
    </div>
  )
}
