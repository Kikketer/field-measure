import {
  IonContent,
  IonHeader,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
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
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Field[]>([])
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    if (supabase) {
      getFields({ supabase }).then((fields) => {
        setFields(fields)
        setLoading(false)
      })
    }
  })

  const refresh = (e: CustomEvent) => {
    getFields({ supabase })
      .then((fields) => {
        setFields(fields)
        e.detail.complete()
      })
      .catch(() => e.detail.complete())
  }

  return (
    <IonPage id="fields-page">
      {loading ? (
        <IonContent fullscreen>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <IonSpinner />
          </div>
        </IonContent>
      ) : (
        <>
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
        </>
      )}
    </IonPage>
  )
}

export default Fields
