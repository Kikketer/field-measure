import { A, useNavigate } from '@solidjs/router'
import { Page } from './Page'
import { supabase } from './supabase'
import styles from './Login.module.css'
import logo from '../assets/fav.png'

export const Login = () => {
  const navigate = useNavigate()

  const signIn = () => {
    console.log('signing in!')
    supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.access_token) {
      navigate('/fields')
    }
  })

  return (
    <Page>
      <div class={styles.VerticalAlign}>
        <div>
          <h1>Field Manager</h1>
          <img class={styles.Logo} src={logo} />
        </div>
        <button onClick={signIn}>Sign In</button>
      </div>
    </Page>
  )
}
