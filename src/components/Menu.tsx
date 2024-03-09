import { IonContent, IonItem, IonLabel, IonList, IonMenu } from '@ionic/react'
import { useRef } from 'react'
import './Menu.css'
import { useSupabase } from './SupabaseProvider'

export const Menu = ({ contentId }: { contentId: string }) => {
  const menuRef = useRef<any>()
  const { supabase } = useSupabase()

  const signout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <IonMenu id="menu" side="end" contentId={contentId} ref={menuRef}>
      <IonContent className="ion-padding">
        <div className="spread-flex">
          <IonList>
            <IonItem
              routerLink={`/quick`}
              onClick={() => menuRef.current.close()}
            >
              <IonLabel>Quick Size</IonLabel>
            </IonItem>
            <IonItem
              routerLink={`/field/add`}
              onClick={() => menuRef.current.close()}
              lines="none"
            >
              <IonLabel>Add Field</IonLabel>
            </IonItem>
          </IonList>
          <IonList>
            <IonItem onClick={signout}>
              <IonLabel>Sign Out</IonLabel>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonMenu>
  )
}
