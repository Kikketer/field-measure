import {
  IonButton,
  IonContent,
  IonFooter,
  IonLabel,
  IonPage,
  IonToolbar,
} from '@ionic/react'
import './Home.css'
import { useSupabase } from '../components/SupabaseProvider'

export const Home = () => {
  const { signIn } = useSupabase()

  return (
    <IonPage id="home-page">
      <IonContent fullscreen>
        <div className="grd">
          <h1>
            Line-up
            <br />
            Field Manager
          </h1>
          <div className="button-block">
            <IonButton color="secondary">Sign Up</IonButton>
            <IonButton onClick={signIn}>Log In</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
