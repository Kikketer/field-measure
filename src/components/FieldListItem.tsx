import { IonItem, IonLabel } from '@ionic/react'
import React from 'react'
import { Field } from '../utilities/types'
import { DaysLeftChip } from './DaysLeftChip'
import './FieldListItem.css'

export const FieldListItem = ({
  field,
  isLast,
}: {
  field: Field
  isLast?: boolean
}) => {
  return (
    <IonItem
      routerLink={`/field/${field.id}`}
      lines={isLast ? 'none' : 'inset'}
      className="field-list-item"
    >
      <div slot="start">
        <DaysLeftChip
          lastPainted={field.lastPainted}
          predictedNextPaint={field.predictedNextPaint}
        />
      </div>
      <IonLabel className="ion-text-nowrap">
        <h2>{field.name}</h2>
        <p>{field.description}</p>
      </IonLabel>
    </IonItem>
  )
}
