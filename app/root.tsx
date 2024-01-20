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
      // Only add variables that are safe to expose to the client
      VITE_PUBLIC_PUSH_APP_ID: process.env.VITE_PUBLIC_PUSH_APP_ID,
    },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
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
