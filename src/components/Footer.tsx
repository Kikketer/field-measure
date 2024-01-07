import { Component, useContext } from 'solid-js'
import styles from './Footer.module.css'
import { version } from '../../package.json'
import { TeamContext } from './TeamProvider'

export const Footer: Component = () => {
  const team = useContext(TeamContext)

  return (
    <div class={styles.Footer}>
      <span>{team?.team?.()?.name}</span>
      <span>{version}</span>
    </div>
  )
}
