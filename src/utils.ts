import { addDays, differenceInCalendarDays } from 'date-fns'
import { Field } from './types'

export const getIsFieldPlayable = (field?: Field) => {
  if (!field) return false

  return differenceInCalendarDays(new Date(), field.lastPainted) < 14
}

export const getPredictedNextPaintLabel = (predictedPaintDate?: Date) => {
  if (!predictedPaintDate) return ''

  if (differenceInCalendarDays(predictedPaintDate, new Date()) < 0) {
    return 'Since '
  }
  return 'Until '
}

export const getPredictedNextPaintDate = (field?: Field) => {
  if (!field) return

  // TODO Predict the next paint date based on the lastPainted date and the rainTotals
  // For now predict based on zero rain, eventually take into account the average daily rainfall in the last paint cycle
  return addDays(field.lastPainted, 14)
}

export const formatDate = (date?: Date) => {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric',
  })
}
