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
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FieldListItem } from '../components/FieldListItem'
import { FullLoader } from '../components/FullLoader'
import { Menu } from '../components/Menu'
import { useOnlineStatus } from '../components/OnlineProvider'
import { useSupabase } from '../components/SupabaseProvider'
import { useVisible } from '../components/VisibleProvider'
import { getFields, getUser } from '../utilities/data'
import { Field, User } from '../utilities/types'
import { groupFields } from '../utilities/utils'

const THROTTLE_TIME = 500

const Fields: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Record<string, Field[]>>()
  const [user, setUser] = useState<User>()
  const { supabase } = useSupabase()
  const isVisible = useVisible()
  const isOnline = useOnlineStatus()
  const { replace } = useHistory()
  const throttleTimer = useRef<any | undefined>()

  const fetch = async () => {
    if (throttleTimer.current) return

    Promise.all([
      getUser({ supabase, useCache: !isOnline }),
      getFields({ supabase, useCache: !isOnline }),
    ]).then(([foundUser, foundFields]) => {
      if (foundUser && !foundUser.paintTeam) {
        // If the user doesn't have a team and somehow got here
        replace('/team-select')
      } else if (foundUser) {
        setUser(foundUser)
        setFields(groupFields(foundFields))
        setLoading(false)
      }
    })

    throttleTimer.current = setTimeout(() => {
      clearTimeout(throttleTimer.current)
      throttleTimer.current = undefined
    }, THROTTLE_TIME)
  }

  useIonViewWillEnter(() => {
    if (supabase) {
      fetch().catch((err) => console.error(err))
    }
  })

  useEffect(() => {
    if (isVisible) {
      fetch().catch((err) => console.error(err))
    }
  }, [isVisible, isOnline])

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
              <IonRefresher
                slot="fixed"
                onIonRefresh={async (e) => {
                  await fetch()
                  e.detail.complete()
                }}
              >
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
                  {user?.paintTeam ? user.paintTeam.name : <IonSkeletonText />}
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
