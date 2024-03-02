import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { FieldListItem } from '../components/FieldListItem'
import { useSupabase } from '../components/SupabaseProvider'
import { getFields } from '../utilities/data'
import { Field } from '../utilities/types'

const Fields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([])
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    if (supabase) {
      getFields({ supabase }).then((fields) => setFields(fields))
    }
  })

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete()
    }, 3000)
  }

  return (
    <IonPage id="fields-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fields</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Fields</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {fields.map((field) => (
            <FieldListItem key={field.id} field={field} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Fields