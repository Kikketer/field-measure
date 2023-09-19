import { Route, Router, Routes } from '@solidjs/router'
import { Component } from 'solid-js'
import { AddField } from './AddField'
import { Authenticated } from './Authenticated'
import { AuthenticationProvider } from './AuthenticationProvider'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { Login } from './Login'
import { OnlineStatusProvider } from './OnlineStatusProvider'
import { ServiceWorker } from './ServiceWorker'

const App: Component = () => {
  return (
    <ion-app>
      <OnlineStatusProvider>
        <ServiceWorker />
        <AuthenticationProvider>
          <Router>
            <Routes>
              <Route path={'/fields'} component={Authenticated}>
                <Route path="/" component={FieldList} />
              </Route>
              <Route path="/field" component={Authenticated}>
                <Route path="/:id" component={FieldDetail} />
                <Route path="/new" component={AddField} />
              </Route>
              <Route path="/" component={Login} />

              <Route path="/quick" component={AddField} />
            </Routes>
          </Router>
        </AuthenticationProvider>
      </OnlineStatusProvider>
    </ion-app>
  )
}

export default App
