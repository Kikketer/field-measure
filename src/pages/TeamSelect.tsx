import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FullLoader } from '../components/FullLoader'
import { useSupabase } from '../components/SupabaseProvider'
import { joinTeam } from '../utilities/actions'
import { getUser } from '../utilities/data'

export const TeamSelect = () => {
  const [loading, setLoading] = useState(true)
  const [joinCode, setJoinCode] = useState<string>()
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string>()
  const { supabase } = useSupabase()
  const { push } = useIonRouter()
  const { replace } = useHistory()

  const fetchUser = async () => {
    try {
      const user = await getUser({ supabase })
      if (user && user.paintTeam) {
        replace('/fields')
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode) return

    setJoining(true)

    try {
      await joinTeam({ joinCode, supabase })
      push('/fields', 'forward', 'replace')
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    }
    setJoining(false)
  }

  useEffect(() => {
    if (!joinCode) {
      setError(undefined)
    }
  }, [joinCode])

  return (
    <IonPage id="team-select-page">
      <IonHeader>
        {!loading && (
          <IonToolbar>
            <IonTitle>Paint Team</IonTitle>
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent>
        {loading ? (
          <FullLoader />
        ) : (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Paint Team</IonTitle>
              </IonToolbar>
            </IonHeader>
            <p className="ion-padding">
              You are not yet a member of a paint team, enter the code given to
              you by your paint team lead to join that team.
            </p>
            <form onSubmit={submitForm}>
              <IonItem lines="none">
                <IonInput
                  className={`${!error && 'ion-valid'} ${error && 'ion-invalid'} ${error && 'ion-touched'}`}
                  label="Team Code"
                  name="name"
                  type="text"
                  autofocus
                  required
                  value={joinCode}
                  onIonInput={(e) => setJoinCode(e.detail.value!)}
                  errorText={error}
                />
              </IonItem>
            </form>
          </>
        )}
      </IonContent>
      {!loading && (
        <IonFooter translucent>
          <IonToolbar>
            <IonButton
              type="button"
              slot="primary"
              onClick={submitForm}
              disabled={joining}
            >
              Join Team
            </IonButton>
          </IonToolbar>
        </IonFooter>
      )}
    </IonPage>
  )
}
