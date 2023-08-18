import { Component, createEffect, createSignal } from 'solid-js'
import styles from './App.module.css'
import { Field } from './Field'
import { Menu } from './Menu'

const App: Component = () => {
  const [locked, setLocked] = createSignal(false)

  const timeLock = createEffect(() => {
    if (!locked) {
      setTimeout(() => {
        setLocked(true)
      }, 3000)
    }
  })

  const unlock = () => {
    console.log('Unlocking!')
  }

  return (
    <div onDblClick={unlock} class={styles.App}>
      <Menu />
      <Field />
    </div>
  )
}

export default App
