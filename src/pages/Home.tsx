import { IonButton, IonContent, IonPage, IonText } from '@ionic/react'
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
        {/*<IonGrid>*/}
        {/*  <IonRow style={{ flex: 4 }}>*/}
        {/*    <IonCol>*/}
        {/*      <IonText>HI</IonText>*/}
        {/*    </IonCol>*/}
        {/*  </IonRow>*/}
        {/*  <IonRow style={{ flex: 1 }}>*/}
        {/*    <IonCol>*/}
        {/*      <IonButton>Log In</IonButton>*/}
        {/*    </IonCol>*/}
        {/*  </IonRow>*/}
        {/*</IonGrid>*/}
      </IonContent>
    </IonPage>
  )
}
