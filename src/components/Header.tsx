import { Component } from 'solid-js'
import styles from './Header.module.css'

export const Header: Component = () => {
  return (
    <div class={styles.HeaderWrap}>
      <div class={styles.Header}>
        <a onClick={() => history.back()}>&lt; Back</a>
      </div>
    </div>
  )
}
