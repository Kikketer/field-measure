/**
 * This is similar to the ConfirmPaint but does not account for the
 * way overdue and has some different phrasing
 */

import React from 'react'
import { IonAlert } from '@ionic/react'

type PromptConfigProps = {
  daysRemaining?: number
  onMarkUnplayable: () => void
}

const standardUnplayablePrompt = ({ onMarkUnplayable }: PromptConfigProps) => ({
  heading: 'Mark Unplayable',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Unplayable',
      role: 'confirm',
      handler: () => {
        onMarkUnplayable()
      },
    },
  ],
})

const overduePrompt = ({
  daysRemaining,
  onMarkUnplayable,
}: PromptConfigProps) => ({
  heading: 'Overdue Field',
  message: 'Was the prediction correct?',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: `Was unplayable ${Math.abs(daysRemaining ?? 0)} days ago`,
      role: 'cancel',
    },
    {
      text: 'Was playable until today',
      role: 'confirm',
      handler: () => {
        onMarkUnplayable()
      },
    },
  ],
})
export const ConfirmUnplayable: React.FC<{
  show: boolean
  daysRemaining: number
  onMarkUnplayable: () => void
  onCancel?: () => void
}> = ({ show, onCancel, daysRemaining, onMarkUnplayable }) => {
  let resultingConfig = standardUnplayablePrompt({
    daysRemaining,
    onMarkUnplayable,
  })

  if (daysRemaining < 0) {
    // The field is just averagely out of date
    resultingConfig = overduePrompt({ daysRemaining, onMarkUnplayable })
  }

  return (
    <IonAlert
      header="Mark Unplayable"
      isOpen={show}
      onDidDismiss={onCancel}
      {...resultingConfig}
    />
  )
}
