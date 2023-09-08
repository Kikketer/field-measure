import {
  Component,
  JSX,
  Show,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js'
import { initializeDatabase, syncDatabase } from './FieldStore'
import { Route, Routes, useNavigate } from '@solidjs/router'
import { AddField } from './AddField'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
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
      console.log('DB? ')
      // Sync up the database every time we see this page since we are authenticated
      const db = await initializeDatabase()
      // Await for the entire DB to download before we set ready
      await (await syncDatabase(db)).awaitInSync()
      setReady(true)
    }
  })

  return (
    <Show when={ready()} fallback={<div>Setting up the shot...</div>}>
      <Routes>
        <Route path="/new" component={AddField} />
        <Route path="/:id" component={FieldDetail} />
        <Route path="/" component={FieldList} />
      </Routes>
    </Show>
  )
}
