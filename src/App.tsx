import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router-dom'
import { SupabaseProvider } from './components/SupabaseProvider'
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
import { AuthRoute } from './components/AuthRoute'
import { Home } from './pages/Home'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <SupabaseProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Home />
          </Route>
          <Route path="/fields" exact={true}>
            <AuthRoute>
              <Fields />
            </AuthRoute>
          </Route>
          <Route path="/fields/:id">
            <AuthRoute>
              <FieldDetail />
            </AuthRoute>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </SupabaseProvider>
  </IonApp>
)

export default App
