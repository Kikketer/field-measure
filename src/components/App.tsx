import { Route, Router, Routes } from '@solidjs/router'
import { Component, createResource, createSignal } from 'solid-js'
import { AddField } from './AddField'
import styles from './App.module.css'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { getFields } from './FieldStore'
import { Login } from './Login'
import { Authenticated } from './Authenticated'

const App: Component = () => {
  // We lock to prevent any touching of the screen and interacting while we are messing
  // with the ropes, paint, and other stuff in the field.
  // TODO This may be better served as a sort of swipe-to-buy style interaction
  const [locked, setLocked] = createSignal(true)
  const [showSettings, setShowSettings] = createSignal(false)

  let lockedTimeout: ReturnType<typeof setTimeout>

  return (
    <div id="base" class={styles.App}>
      <Router>
        <Routes>
          <Route path={['field/*', 'fields']} component={Authenticated} />
          <Route path="/quick" component={AddField} />
          <Route path="/" component={Login} />
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
