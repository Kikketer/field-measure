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
    pushId: process.env.VITE_PUBLIC_PUSH_APP_ID,
  })
}

export default function App() {
  const data = useLoaderData<typeof loader>()
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
      </head>
      <body>
        <MessagingProvider appId={data.pushId}>
          <Outlet />
        </MessagingProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  )
}
