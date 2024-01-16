# Field Measurement (SolidJS)

Like most of my projects this is an excuse to learn a different technology stack. This app I'm going to focus on SolidJS, html canvas and offline app.

Apple has improved push notifications on home screen apps as well, so I'd like to explore that.

The app itself will allow me to dynamically get the measurements needed for Soccer fields (in feet since we are calling it Soccer). There are often issues where we as the field painting crew need to make a field fit in a space. There's a lot of trig needed to calculate the distances that can be incredibly difficult when you are standing in an open field with your hands full of ropes, paint and measuring tape.

## Features

- Get measurements for any field size to fit in any space
- Know when you need to paint a field next given rainfall and time factors
- Each field degradation is independently tracked and learns based on your painting routine

## TODOs

- Push notifications using Web Push
- Connect to the game schedule sheets and use that in repaint factors

## Stretch Goals

1. Printable? Maybe? 😃

## Learnings

This is a random smattering of thoughts and issues I ran into while trying to build this application.

1. Vercel + Remix seems to be at war with each-other. Simply "ejecting" (known as "visible") in Remix doesn't work with Vercel because it uses node instead of deno.
2. Setting up the PWA [was painful](https://github.com/remix-pwa/remix-pwa/issues/129), the `remix-pwa` library seems to be in a "in progress" state where the documentation doesn't match the actual needs of the library.  The `<link>` documentation was missing and filled in by a LogRocket blog posting.
3. There's an [issue logged](https://github.com/remix-pwa/remix-pwa/issues/80) in the `remix-pwa` that asks for support with OneSignal (the planned push notification service I want to use).  It's open but closed for comments, and claims it's a work in progress.  The ticket it points to is closed.  So it's hard to know if it supports OneSignal.
