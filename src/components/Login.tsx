import { useNavigate } from '@solidjs/router'
import logo from '../assets/fav.png'
import styles from './Login.module.css'
import { Page } from './Page'
import { supabase } from './supabase'

export const Login = () => {
  const navigate = useNavigate()

  const signIn = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_REDIRECT_URL,
      },
    })
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.access_token) {
      navigate('/fields')
    }
  })

  return (
    <div class={styles.VerticalAlign}>
      <div>
        <h1>Field Manager</h1>
        <img class={styles.Logo} src={logo} />
      </div>
      <button onClick={signIn}>Sign In</button>
    </div>
  )
}