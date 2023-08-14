import type { Component } from 'solid-js'
import styles from './App.module.css'
import { Settings } from './Settings'
import { Field } from './Field'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Settings />
      <Field />
    </div>
  )
}

export default App
