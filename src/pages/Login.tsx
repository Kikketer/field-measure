import { useNavigate } from '@solidjs/router'
import { createEffect, createSignal, Show, useContext } from 'solid-js'
import logo from '../assets/fav.png'
import { Loader } from '../components/Loader'
import { Page } from '../components/Page'
import { SupabaseContext } from '../components/SupabaseProvider'
import styles from './Login.module.css'

export const Login = () => {
  const supabaseContext = useContext(SupabaseContext)
  const navigate = useNavigate()
  const [loading, setLoading] = createSignal(true)

  createEffect(async () => {
    const session = await supabaseContext?.supabase.auth.getSession()
    if (session?.data.session) {
      const expiresAt = new Date(
        Number(`${session.data.session.expires_at}000`),
      )
      if (expiresAt.getTime() > new Date().getTime()) {
        setLoading(false)
        navigate('/fields', { replace: true })
      }
    }
    setLoading(false)
  })

  const signIn = () => {
    console.log('Redirect to ', import.meta.env.VITE_REDIRECT_URL)
    supabaseContext.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_REDIRECT_URL,
      },
    })
  }

  return (
    <Show when={!loading()} fallback={<Loader />}>
      <Page>
        <div class={styles.VerticalAlign}>
          <div>
            <h1>Field Manager</h1>
            <img class={styles.Logo} src={logo} />
          </div>
          <button onClick={signIn}>Sign In</button>
          <button class="secondary" onClick={() => navigate('/quick')}>
            Quick Size
          </button>
        </div>
      </Page>
    </Show>
  )
}
