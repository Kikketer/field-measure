import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthRoute } from './components/AuthRoute'
import ReloadPrompt from './components/ReloadPrompt'
import { SupabaseProvider } from './components/SupabaseProvider'
import { VisibleProvider } from './components/VisibleProvider'
import { FieldAdd } from './pages/FieldAdd'
import { FieldDetail } from './pages/FIeldDetail'
import Fields from './pages/Fields'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './theme/globals.css'
import { Home } from './pages/Home'
import { Quick } from './pages/Quick'
import { TeamInvite } from './pages/TeamInvite'
import { TeamSelect } from './pages/TeamSelect'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <SupabaseProvider>
      <VisibleProvider>
        <ReloadPrompt />
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true} component={Home} />
            <Route path="/quick" exact={true} component={Quick} />
            <AuthRoute
              path="/team-select"
              exact={true}
              component={TeamSelect}
            />
            <AuthRoute
              component={TeamInvite}
              path="/team-invite"
              exact={true}
            />
            <AuthRoute path="/field/:id" exact={true} component={FieldDetail} />
            <AuthRoute path="/field/add" exact={true} component={FieldAdd} />
            <AuthRoute
              path="/field/:fieldId/edit"
              exact={true}
              component={FieldAdd}
            />
            <AuthRoute path="/fields" exact={true} component={Fields} />
            <Route render={() => <Redirect to={'/'} />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </VisibleProvider>
    </SupabaseProvider>
  </IonApp>
)

export default App
