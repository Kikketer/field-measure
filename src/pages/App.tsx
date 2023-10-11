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
import { AuthRouter } from './AuthRouter'
import { RefetchData } from '../components/RefetchData.tsx'

const App: Component = () => {
  return (
    <OnlineStatusProvider>
      <ServiceWorker />
      <Router>
        <Routes>
          <Route path="/" component={Login} />
          <Route path="/quick" component={AddField} />
          <Route path="/fields" component={AuthRouter}>
            <Route path="/new" component={AddField} />
            <Route path="/:id/edit" component={EditField} />
            <Route path="/:id" component={FieldDetail} />
            <Route path="/" component={FieldList} />
          </Route>
        </Routes>
      </Router>
    </OnlineStatusProvider>
  )
}

export default App
