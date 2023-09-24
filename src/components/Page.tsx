import { Component, JSX } from 'solid-js'
import styles from './Page.module.css'

export const Page: Component<{
  children: JSX.Element
}> = ({ children }) => {
  return <div class={styles.Page}>{children}</div>
}
