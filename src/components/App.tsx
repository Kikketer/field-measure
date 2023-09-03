import { Route, Router, Routes } from '@solidjs/router'
import { Component, createResource, createSignal } from 'solid-js'
import { SIZES } from '../constants'
import { FieldSize } from '../types'
import { AddField } from './AddField'
import styles from './App.module.css'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { getFields } from './FieldStore'

const App: Component = () => {
  // We lock to prevent any touching of the screen and interacting while we are messing
  // with the ropes, paint, and other stuff in the field.
  // TODO This may be better served as a sort of swipe-to-buy style interaction
  const [locked, setLocked] = createSignal(true)
  const [showSettings, setShowSettings] = createSignal(false)

  const [fields] = createResource(getFields)

  let lockedTimeout: ReturnType<typeof setTimeout>

  return (
    <div id="base" class={styles.App}>
      <Router>
        <Routes>
          <Route path="/field/new" component={AddField} />
          <Route path="/field/:id" component={FieldDetail} />
          <Route path="/quick" component={AddField} />
          <Route path="/" element={<FieldList fields={fields} />} />
        </Routes>
      </Router>

      {/* <LockedIndicator show={locked} /> */}
      {/* <Menu
        isOpen={showSettings}
        onSetFieldSize={saveSettings}
        onClose={() => setShowSettings(false)}
      /> */}
    </div>
  )
}

export default App
