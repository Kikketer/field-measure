import { Component, createEffect, createSignal } from 'solid-js'
import { debounce } from 'lodash-es'
import styles from './App.module.css'
import { Field } from './Field'
import { LockedIndicator } from './LockedIndicator'
import { Menu } from './Menu'

const App: Component = () => {
  // We lock to prevent any touching of the screen and interacting while we are messing
  // with the ropes, paint, and other stuff in the field.
  // TODO This may be better served as a sort of swipe-to-buy style interaction
  const [locked, setLocked] = createSignal(true)
  const [showSettings, setShowSettings] = createSignal(false)
  let lockedTimeout: ReturnType<typeof setTimeout>

  const timeLock = createEffect(() => {
    if (!locked()) {
      clearTimeout(lockedTimeout)
      lockedTimeout = setTimeout(() => {
        setLocked(true)
      }, 3000)
    }
  })

  const unlock = debounce((e) => {
    // Prevents anything else bubbling up from messing with the lock
    if (e.target.id === 'base') {
      if (!locked()) {
        // Show settings if we are already unlocked
        setShowSettings(true)
      }
      setLocked(false)
    }
  }, 500)

  return (
    <div id="base" onClick={unlock} class={styles.App}>
      <LockedIndicator show={locked} />
      <Menu
        isOpen={showSettings}
        onSetFieldSize={() => undefined}
        onClose={() => setShowSettings(false)}
      />
      <Field />
    </div>
  )
}

export default App
