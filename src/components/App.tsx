import { Route, Router, Routes } from '@solidjs/router'
import { Component } from 'solid-js'
import { AddField } from './AddField'
import styles from './App.module.css'
import { Authenticated } from './Authenticated'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { Login } from './Login'

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
