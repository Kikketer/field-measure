import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'
import type { LinksFunction } from '@vercel/remix'
import { json } from '@vercel/remix'
import { useSWEffect, LiveReload } from '@remix-pwa/sw'
import { MessagingProvider } from '~/providers/MessagingProvider'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async () => {
  // Set some environment variables
  return json({
    ENV: {
      PUSH_APP_ID: process.env.PUSH_APP_ID,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      LOGIN_REDIRECT_URL: process.env.LOGIN_REDIRECT_URL,
    },
  })
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>()
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
        <Outlet />
        {/*</MessagingProvider>*/}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  )
}
