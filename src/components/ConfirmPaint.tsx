import React from 'react'
import { IonAlert } from '@ionic/react'

type PromptConfigProps = {
  daysRemaining?: number
  onPaint: (T: { adjustFactor: boolean }) => void
}

const standardUnplayablePrompt = ({ onPaint }: PromptConfigProps) => ({
  heading: 'Paint Field',
  message: 'Was this field unplayable when you painted it?',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Playable but painted anyway',
      handler: () => {
        onPaint({ adjustFactor: false })
      },
    },
    {
      text: 'Unplayable',
      role: 'confirm',
      handler: () => {
        onPaint({ adjustFactor: true })
      },
    },
  ],
})

const overduePrompt = ({ daysRemaining, onPaint }: PromptConfigProps) => ({
  heading: 'Overdue Field',
  message: 'Mark this field as painted',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: `Was unplayable ${Math.abs(daysRemaining ?? 0)} days ago`,
      handler: () => {
        onPaint({ adjustFactor: false })
      },
    },
    {
      text: 'Was playable until today',
      role: 'confirm',
      handler: () => {
        onPaint({ adjustFactor: true })
      },
    },
  ],
})

const wayOverduePrompt = ({ onPaint }: PromptConfigProps) => ({
  heading: 'Way Overdue',
  message: 'This field is way overdue. Predictions will not be adjusted',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Mark Painted',
      role: 'confirm',
      handler: () => {
        onPaint({ adjustFactor: false })
      },
    },
  ],
})

export const ConfirmPaint: React.FC<{
  show: boolean
  daysRemaining: number
  onPaint: (T: { adjustFactor: boolean }) => void
  reasonableLimitOfOverdueDays: number
  onCancel?: () => void
}> = ({
  show,
  onCancel,
  daysRemaining,
  reasonableLimitOfOverdueDays,
  onPaint,
}) => {
  let resultingConfig = standardUnplayablePrompt({
    daysRemaining,
    onPaint,
  })

  if (daysRemaining < -reasonableLimitOfOverdueDays) {
    // The field is beyond a reasonable amount of time, so it's WAY overdue (start of season?)
    resultingConfig = wayOverduePrompt({ daysRemaining, onPaint })
  } else if (daysRemaining < 0) {
    // The field is just averagely out of date
    resultingConfig = overduePrompt({ daysRemaining, onPaint })
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
