import { IonItem, IonLabel } from '@ionic/react'
import React from 'react'
import { Field } from '../utilities/types'
import { DaysLeftChip } from './DaysLeftChip'

export const FieldListItem = ({ field }: { field: Field }) => {
  return (
    <IonItem routerLink={`/fields/${field.id}`}>
      <div slot="start">
        <DaysLeftChip
          lastPainted={field.lastPainted}
          predictedNextPaint={field.predictedNextPaint}
        />
      </div>
      <IonLabel className="ion-text-wrap">{field.name}</IonLabel>
    </IonItem>
  )
}