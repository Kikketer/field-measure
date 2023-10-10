import { Component, useContext } from 'solid-js'
import styles from './Footer.module.css'
import { version } from '../../package.json'
import { AuthenticationContext } from './AuthenticationProvider.tsx'

export const Footer: Component = () => {
  const auth = useContext(AuthenticationContext)

  return (
    <div class={styles.Footer}>
      <span>{auth?.user?.()?.paintTeam?.name}</span>
      <span>{version}</span>
    </div>
  )
}
