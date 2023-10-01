import { addDays, differenceInCalendarDays } from 'date-fns'
import { Field } from './types'

export const getIsFieldPlayable = (field?: Field) => {
  if (!field) return false

  return (
    differenceInCalendarDays(new Date(), field.lastPainted) < field.maxDryDays
  )
}

export const getPredictedNextPaintLabel = (predictedPaintDate?: Date) => {
  if (!predictedPaintDate) return ''

  if (differenceInCalendarDays(predictedPaintDate, new Date()) <= 0) {
    return 'Since '
  }
  return 'Until '
}

export const formatDate = (date?: Date) => {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric',
  })
}
