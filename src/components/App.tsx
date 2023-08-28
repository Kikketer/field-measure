import { Component, createEffect, createSignal } from 'solid-js'
import { debounce } from 'lodash-es'
import styles from './App.module.css'
import { Field } from './Field'
import { LockedIndicator } from './LockedIndicator'
import { Menu } from './Menu'
import { FieldSize } from '../types'
import { Settings } from './Settings'
import { SIZES } from '../constants'

const App: Component = () => {
  // We lock to prevent any touching of the screen and interacting while we are messing
  // with the ropes, paint, and other stuff in the field.
  // TODO This may be better served as a sort of swipe-to-buy style interaction
  const [locked, setLocked] = createSignal(true)
  const [showSettings, setShowSettings] = createSignal(false)
  const [currentFieldSize, setCurrentFieldSize] = createSignal(
    FieldSize.nineTen,
  )
  const [customWidth, setCustomWidth] = createSignal<number>()
  const [customLength, setCustomLength] = createSignal<number>()
  const [selectedLineGroup, setSelectedLineGroup] = createSignal<string>()

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

  const resetAndSaveFieldSize = (fieldSize: FieldSize) => {
    setCurrentFieldSize(fieldSize)
    setCustomWidth(SIZES[fieldSize].recommendedMaxWidth)
    setCustomLength(SIZES[fieldSize].recommendedMaxLength)
  }

  return (
    <div id="base" onClick={unlock} class={styles.App}>
      {/* <LockedIndicator show={locked} /> */}
      {/* <Menu
        isOpen={showSettings}
        onSetFieldSize={saveSettings}
        onClose={() => setShowSettings(false)}
      /> */}
      <Field
        fieldSize={currentFieldSize}
        customWidth={customWidth}
        customLength={customLength}
      />
      <Settings
        setFieldSize={resetAndSaveFieldSize}
        fieldSize={currentFieldSize}
        customWidth={customWidth}
        setCustomLength={setCustomLength}
        customLength={customLength}
        setCustomWidth={setCustomWidth}
      />
    </div>
  )
}

export default App
