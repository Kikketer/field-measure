import { redirect } from '@vercel/remix'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '~/database.types'
import { AuthenticationProvider } from '~/providers/AuthenticationProvider'

export async function loader({ request }: { request: any }) {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  // Redirect if the session is empty
  if (!session) {
    return redirect('/', {
      headers: response.headers,
    })
  }

  return {
    session,
  }
}

export default function Authenticated() {
  return (
    <AuthenticationProvider>
      <Outlet />
    </AuthenticationProvider>
  )
}
