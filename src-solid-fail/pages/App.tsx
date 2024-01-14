import { Route, Router, Routes } from '@solidjs/router'
import { Component } from 'solid-js'
import { SupabaseProvider } from '../providers/SupabaseProvider'
import { AddField } from './AddField'
import { EditTeam } from './EditTeam'
import { FieldDetail } from './FieldDetail'
import { FieldList } from './FieldList'
import { Login } from './Login'
import { OnlineStatusProvider } from '../providers/OnlineStatusProvider'
import { ServiceWorker } from '../components/ServiceWorker'
import { EditField } from './EditField'
import { AuthRouter } from '../components/AuthRouter'

const App: Component = () => {
  return (
    <OnlineStatusProvider>
      <ServiceWorker />
      <SupabaseProvider>
        <Router>
          <Routes>
            <Route path="/" component={Login} />
            <Route path="/quick" component={AddField} />
            <Route path="/fields" component={AuthRouter}>
              <Route path="/new" component={AddField} />
              <Route path="/team" component={EditTeam} />
              <Route path="/:id/edit" component={EditField} />
              <Route path="/:id" component={FieldDetail} />
              <Route path="/" component={FieldList} />
            </Route>
          </Routes>
        </Router>
      </SupabaseProvider>
    </OnlineStatusProvider>
  )
}

export default App