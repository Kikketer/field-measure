import { Component, JSX } from 'solid-js'
import styles from './Page.module.css'
import { version } from '../../package.json'

export const Page: Component<{
  children: JSX.Element
}> = ({ children }) => {
  return (
    <div class={styles.Page}>
      {children}
      <div class={styles.Footer}>s: {version}</div>
    </div>
  )
}
