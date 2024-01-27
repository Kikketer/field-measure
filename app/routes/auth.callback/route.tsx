import { redirect } from '@remix-run/node'
import { createServerClient } from '@supabase/auth-helpers-remix'

import type { Database } from '~/database.types'
// import type { LoaderArgs } from '@remix-run/vercel'

export const loader = async ({ request }: { request: any }) => {
  const response = new Response()
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabaseClient = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response },
    )
    await supabaseClient.auth.exchangeCodeForSession(code)
  }

  return redirect('/', {
    headers: response.headers,
  })
}
