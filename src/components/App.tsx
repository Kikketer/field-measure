import { debounce } from 'lodash-es'
import { createClient } from '@supabase/supabase-js'
import { Component, createEffect, createResource, createSignal } from 'solid-js'
import { SIZES } from '../constants'
import { FieldSize } from '../types'
import styles from './App.module.css'
import { Field } from './Field'
import { Settings } from './Settings'
import { getFields } from './FieldStore'

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

  const [fields] = createResource(getFields)

  let lockedTimeout: ReturnType<typeof setTimeout>

  const resetAndSaveFieldSize = (fieldSize: FieldSize) => {
    setCurrentFieldSize(fieldSize)
    setCustomWidth(SIZES[fieldSize].recommendedMaxWidth)
    setCustomLength(SIZES[fieldSize].recommendedMaxLength)
  }

  const testApi = async () => {
    try {
      const result = await fetch('/api/weather', {
        headers: { Accept: 'application/json' },
      })
      console.log(await result.json())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div id="base" class={styles.App}>
      {/* <LockedIndicator show={locked} /> */}
      {/* <Menu
        isOpen={showSettings}
        onSetFieldSize={saveSettings}
        onClose={() => setShowSettings(false)}
      /> */}
      <button onClick={testApi}>API Test</button>
      <p>Result:</p>
      <pre>{JSON.stringify(fields() ?? {}, null, 2)}</pre>
      {/* <Field
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
      /> */}
    </div>
  )
}

export default App
