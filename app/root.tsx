import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import { Analytics } from '@vercel/analytics/react'
import type { LinksFunction } from '@vercel/remix'
import { json } from '@vercel/remix'
import { useSWEffect, LiveReload } from '@remix-pwa/sw'
import { useEffect, useState } from 'react'
import { Database } from '~/database.types'
import { AuthenticationProvider } from '~/providers/AuthenticationProvider'
import { MessagingProvider } from '~/providers/MessagingProvider'
import { SupabaseProvider } from '~/providers/SupabaseProvider'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async ({ request }: { request: any }) => {
  const response = new Response()

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Set some environment variables
  return json(
    {
      session,
      ENV: {
        PUSH_APP_ID: process.env.PUSH_APP_ID,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        LOGIN_REDIRECT_URL: process.env.LOGIN_REDIRECT_URL,
      },
    },
    { headers: response.headers },
  )
}

export default function App() {
  const { revalidate } = useRevalidator()
  const { ENV, session } = useLoaderData<typeof loader>()
  const [supabase] = useState(() =>
    createBrowserClient<Database>(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!),
  )
  const serverAccessToken = session?.access_token

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== 'INITIAL_SESSION' &&
        session?.access_token !== serverAccessToken
      ) {
        // server and client are out of sync.
        revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, supabase, revalidate])

  useSWEffect()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5CB03B" />
        <Meta />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)};`,
          }}
        />
      </head>
      <body>
        {/*<MessagingProvider>*/}
        {/*<AuthenticationProvider>*/}
        <Outlet context={{ supabase }} />
        {/*</AuthenticationProvider>*/}
        {/*</MessagingProvider>*/}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  )
}
