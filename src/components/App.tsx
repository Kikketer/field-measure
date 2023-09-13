import { Route, Router, Routes } from '@solidjs/router'
import { Component } from 'solid-js'
import { registerSW } from 'virtual:pwa-register'
import { AddField } from './AddField'
import styles from './App.module.css'
import { Authenticated } from './Authenticated'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { Login } from './Login'
import { OnlineStatusProvider } from './OnlineStatusProvider'
import { AuthenticationProvider } from './AuthenticationProvider'

// Simply refreshes the site if there's a new version available
// I don't forsee the need to prompt the user (there are no intense forms)
// Or we would hold off the refresh until landing on the list page maybe
registerSW({ immediate: true })

const App: Component = () => {
  return (
    <ion-app>
      <ion-content class="ion-padding">
        <OnlineStatusProvider>
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
      </ion-content>
    </ion-app>
  )
}

export default App
