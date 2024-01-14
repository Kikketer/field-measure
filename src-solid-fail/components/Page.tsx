import { Component, JSX } from 'solid-js'
import styles from './Page.module.css'
import { Footer } from './Footer'

export const Page: Component<{
  children: JSX.Element
}> = (props) => {
  return (
    <div class={styles.Page}>
      {props.children}
      <Footer />
    </div>
  )
}
