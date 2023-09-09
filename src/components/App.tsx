import { Outlet, Route, Router, Routes } from '@solidjs/router'
import { Component, createResource, createSignal } from 'solid-js'
import { AddField } from './AddField'
import styles from './App.module.css'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { getFields } from './FieldStore'
import { Login } from './Login'
import { Authenticated } from './Authenticated'

const App: Component = () => {
  return (
    <div id="base" class={styles.App}>
      <Router>
        <Routes>
          <Route path={'/fields'} component={Authenticated}>
            <Route path="/" component={FieldList} />
          </Route>
          <Route path="/field" component={Authenticated}>
            <Route path="/:id" component={FieldDetail} />
            <Route path="/new" component={AddField} />
          </Route>
          <Route path="/quick" component={AddField} />
          <Route path="/" component={Login} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
