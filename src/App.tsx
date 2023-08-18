import { Component } from 'solid-js'
import styles from './App.module.css'
import { Settings } from './Settings'
import { Field } from './Field'
import { Reference } from './Reference'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Reference />
      <Settings />
      <Field />
    </div>
  )
}

export default App
