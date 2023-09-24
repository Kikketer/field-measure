import { Route, Router, Routes } from '@solidjs/router'
import { Component } from 'solid-js'
import { AddField } from './AddField'
import { Authenticated } from '../components/Authenticated'
import { AuthenticationProvider } from '../components/AuthenticationProvider'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { Login } from './Login'
import { OnlineStatusProvider } from '../components/OnlineStatusProvider'
import { ServiceWorker } from '../components/ServiceWorker'
import { EditField } from './EditField'

const App: Component = () => {
  return (
    <OnlineStatusProvider>
      <ServiceWorker />
      <AuthenticationProvider>
        <Router>
          <Routes>
            <Route path={'/fields'} component={Authenticated}>
              <Route path="/" component={FieldList} />
            </Route>
            <Route path="/field" component={Authenticated}>
              <Route path="/:id/edit" component={EditField} />
              <Route path="/:id" component={FieldDetail} />
              <Route path="/new" component={AddField} />
            </Route>
            <Route path="/" component={Login} />
            <Route path="/quick" component={AddField} />
          </Routes>
        </Router>
      </AuthenticationProvider>
    </OnlineStatusProvider>
  )
}

export default App
