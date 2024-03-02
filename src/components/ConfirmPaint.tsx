import React from 'react'
import { IonAlert } from '@ionic/react'

const standardUnplayablePrompt = (
  onPaint: (T: { shouldAdjustFactor: boolean }) => void,
) => ({
  message: 'Was this field unplayable when you painted it?',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Playable but painted anyway',
      handler: () => {
        onPaint({ shouldAdjustFactor: false })
      },
    },
    {
      text: 'Unplayable',
      role: 'confirm',
      handler: () => {
        onPaint({ shouldAdjustFactor: true })
      },
    },
  ],
})

const overduePrompt = (
  onPaint: (T: { shouldAdjustFactor: boolean }) => void,
) => ({
  header: 'Overdue Field',
  message: `This field is overdue`,
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Was not playable before today',
      handler: () => {
        onPaint({ shouldAdjustFactor: false })
      },
    },
    {
      text: 'Was playable until today',
      role: 'confirm',
      handler: () => {
        onPaint({ shouldAdjustFactor: true })
      },
    },
  ],
})

const wayOverduePrompt = (
  onPaint: (T: { shouldAdjustFactor: boolean }) => void,
) => ({
  heading: 'Way Overdue',
  message:
    "This field is way overdue. Painting it now will not update it's predicted dates.",
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Mark Painted',
      role: 'confirm',
      handler: () => {
        onPaint({ shouldAdjustFactor: false })
      },
    },
  ],
})

export const ConfirmPaint: React.FC<{
  show: boolean
  daysRemaining: number
  onPaint: (T: { shouldAdjustFactor: boolean }) => void
  reasonableLimitOfOverdueDays: number
  onCancel?: () => void
}> = ({
  show,
  onCancel,
  daysRemaining,
  reasonableLimitOfOverdueDays,
  onPaint,
}) => {
  let resultingConfig = standardUnplayablePrompt(onPaint)

  if (daysRemaining < -reasonableLimitOfOverdueDays) {
    // The field is beyond a reasonable amount of time, so it's WAY overdue (start of season?)
    resultingConfig = wayOverduePrompt(onPaint)
  } else if (daysRemaining < 0) {
    // The field is just averagely out of date
    resultingConfig = overduePrompt(onPaint)
  }

  return (
    <IonAlert
      header="Mark Painted"
      isOpen={show}
      onDidDismiss={onCancel}
      {...resultingConfig}
    />
  )
}
