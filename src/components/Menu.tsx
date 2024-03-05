import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useRef } from 'react'

export const Menu = ({ contentId }: { contentId: string }) => {
  const menuRef = useRef<any>()

  return (
    <IonMenu side="end" contentId={contentId} ref={menuRef}>
      <IonContent className="ion-padding">
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
      </IonContent>
    </IonMenu>
  )
}
