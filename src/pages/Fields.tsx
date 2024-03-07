import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'
import { useState } from 'react'
import { FieldListItem } from '../components/FieldListItem'
import { FullLoader } from '../components/FullLoader'
import { Menu } from '../components/Menu'
import { useSupabase } from '../components/SupabaseProvider'
import { getFields, getUser } from '../utilities/data'
import { Field, User } from '../utilities/types'
import { groupFields } from '../utilities/utils'

const Fields: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Record<string, Field[]>>()
  const [user, setUser] = useState<User>()
  const { supabase } = useSupabase()

  useIonViewWillEnter(() => {
    if (supabase) {
      Promise.all([
        getUser({ supabase }).then((user) => setUser(user)),
        getFields({ supabase }).then((fields) => {
          setFields(groupFields(fields))
        }),
      ]).then(() => {
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
    <>
      <Menu contentId="fields-page" />

      <IonPage id="fields-page">
        {loading ? (
          <FullLoader />
        ) : (
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Fields</IonTitle>
                <IonButtons slot="end">
                  <IonMenuButton></IonMenuButton>
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
                  <IonItemGroup key={groupName}>
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
              <div className="ion-padding">
                <IonText color="medium">
                  {user ? user.paintTeam.name : <IonSkeletonText />}
                </IonText>
              </div>
            </IonContent>
          </>
        )}
      </IonPage>
    </>
  )
}

export default Fields
