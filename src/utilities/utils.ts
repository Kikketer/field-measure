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

export const getPredictedDaysUntilPaint = (field?: Field) => {
  if (!field) return 0

  return (
    field.maxDryDays -
    differenceInCalendarDays(new Date(), field.lastPainted) -
    field.rainfallDays * field.rainfallFactor
  )
}

export const getPredictedNextPaintDate = (field?: Field): Date | undefined => {
  const predictedTimeLeft = getPredictedDaysUntilPaint(field)

  // (maxDryDays - daysSinceLastPaint - (rainDays * rainFactor))

  // TODO Predict the next paint date based on the lastPainted date and the rainTotals
  // For now predict based on zero rain, eventually take into account the average daily rainfall in the last paint cycle
  return addDays(new Date(), predictedTimeLeft)
}

export const formatDate = (date?: Date) => {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric',
  })
}