import { Accessor, Component, JSX } from 'solid-js'
import { Field } from '../utilities/types'
import { Header } from './Header'
import styles from './Page.module.css'

export const Page: Component<{
  children: JSX.Element
}> = ({ children }) => {
  return <div class={styles.Page}>{children}</div>
}
