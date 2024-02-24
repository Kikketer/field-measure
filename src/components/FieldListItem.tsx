import { IonItem, IonLabel } from '@ionic/react'
import React from 'react'
import { Field } from '../utilities/types'

export const FieldListItem = ({ field }: { field: Field }) => {
  return (
    <IonItem routerLink={`/fields/${field.id}`}>
      <IonLabel className="ion-text-wrap">{field.name}</IonLabel>
    </IonItem>
  )
}
