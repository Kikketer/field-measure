import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import { add } from 'ionicons/icons'
import { useState } from 'react'
import { FieldListItem } from '../components/FieldListItem'
import { useSupabase } from '../components/SupabaseProvider'
import { getFields } from '../utilities/data'
import { Field } from '../utilities/types'
import { groupFields } from '../utilities/utils'

const Fields: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Record<string, Field[]>>()
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    if (supabase) {
      getFields({ supabase }).then((fields) => {
        setFields(groupFields(fields))
        setLoading(false)
      })
    }
  })

  const refresh = (e: CustomEvent) => {
    getFields({ supabase })
      .then((fields) => {
        setFields(groupFields(fields))
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
              <IonButtons slot="end">
                <IonIcon slot="icon-only" icon={add} aria-label="Add Field" />
              </IonButtons>
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
              {Object.keys(fields ?? {})?.map((groupName) => (
                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>{groupName}</IonLabel>
                  </IonItemDivider>
                  {fields?.[groupName]?.map((field, index) => (
                    <FieldListItem
                      key={field.id}
                      field={field}
                      isLast={index >= fields[groupName].length - 1}
                    />
                  ))}
                </IonItemGroup>
              ))}
            </IonList>
          </IonContent>
        </>
      )}
    </IonPage>
  )
}

export default Fields
