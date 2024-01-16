import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'
import type { LinksFunction } from '@vercel/remix'
import { useSWEffect, LiveReload } from '@remix-pwa/sw'
import { MessagingProvider } from '~/providers/MessagingProvider'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  useSWEffect()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#99dc80" />
        <Meta />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>
      <body>
        <MessagingProvider>
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
