import { IonButton, IonContent, IonPage, useIonRouter } from '@ionic/react'
import './Home.css'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { FullLoader } from '../components/FullLoader'
import { useSupabase } from '../components/SupabaseProvider'

export const Home = () => {
  const { signIn, user } = useSupabase()
  const { replace } = useHistory()

  useEffect(() => {
    if (user) {
      // The user may not have a team yet, but 99% of the time they will
      // So we land on fields first but then redirect to team-select in that off case
      replace('/fields')
    }
  }, [user])

  return (
    <IonPage id="home-page">
      {!!user ? (
        <FullLoader />
      ) : (
        <IonContent fullscreen>
          <div className="grd">
            <h1>
              Line-up
              <br />
              Field Manager
            </h1>
            <div className="button-block">
              {/*<IonButton color="secondary">Sign Up</IonButton>*/}
              <IonButton onClick={signIn}>Log In</IonButton>
            </div>
          </div>
        </IonContent>
      )}
    </IonPage>
  )
}
