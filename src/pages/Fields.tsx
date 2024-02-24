import { FieldListItem } from '../components/FieldListItem'
import MessageListItem from '../components/MessageListItem'
import { useState } from 'react'
import { getFields } from '../data/fields'
import { Message, getMessages } from '../data/messages'
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
import { Field } from '../utilities/types'

const Fields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([])

  useIonViewWillEnter(() => {
    getFields().then((fields) => setFields(fields))
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
