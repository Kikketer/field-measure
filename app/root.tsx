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
        <meta name="theme-color" content="#5CB03B" />
        <Meta />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
        {/*<script*/}
        {/*  src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"*/}
        {/*  defer*/}
        {/*></script>*/}
        {/*<script>*/}
        {/*  window.OneSignalDeferred = window.OneSignalDeferred || [];*/}
        {/*</script>*/}
        {/*<script>*/}
        {/*  window.OneSignalDeferred = window.OneSignalDeferred || [];*/}
        {/*  OneSignalDeferred.push((OneSignal) () => {*/}
        {/*    OneSignal.init({*/}
        {/*      appId: "686428fa-a910-4e8d-b932-44b14cb9261f",*/}
        {/*      safari_web_id: "web.onesignal.auto.24e91fba-47ec-4183-a873-89e8fb838de6",*/}
        {/*      notifyButton: {*/}
        {/*        enable: true,*/}
        {/*      },*/}
        {/*    });*/}
        {/*  });*/}
        {/*</script>*/}
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
