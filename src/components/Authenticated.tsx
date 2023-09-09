import { Outlet, useNavigate } from '@solidjs/router'
import {
  Component,
  Show,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js'
import { supabase } from './supabase'

export const Authenticated: Component = () => {
  const [ready, setReady] = createSignal(false)
  const [user] = createResource(() => supabase.auth.getUser())
  const navigate = useNavigate()

  createEffect(async () => {
    // Redirect home if the user is not set
    if (!user.loading && !user()?.data?.user) {
      navigate('/', { replace: true })
    } else if (!user.loading && !user.error && user()?.data?.user) {
      // // Sync up the database every time we see this page since we are authenticated
      // const db = await initializeDatabase()
      // // Await for the entire DB to download before we set ready
      // await (await syncDatabase(db)).awaitInSync()
      setReady(true)
    }
  })

  return (
    <Show when={ready()} fallback={<div>Setting up the shot...</div>}>
      <Outlet />
    </Show>
  )
}
