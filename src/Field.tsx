import type { Component } from 'solid-js'
import styles from './Field.module.css'

export const Field: Component = () => {
  return <canvas class={styles.Field} id="field" />
}
