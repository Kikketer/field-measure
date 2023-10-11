import { addDays, differenceInCalendarDays } from 'date-fns'
import { Field } from './types'
import { getPredictedDaysUntilPaint } from './calculateConditions.ts'

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

export const getPredictedNextPaintDate = (field?: Field): Date | undefined => {
  const predictedDaysUntilPaint = getPredictedDaysUntilPaint(field)
  if (predictedDaysUntilPaint == null) return

  // (maxDryDays - daysSinceLastPaint - (rainDays * rainFactor))

  // TODO Predict the next paint date based on the lastPainted date and the rainTotals
  // For now predict based on zero rain, eventually take into account the average daily rainfall in the last paint cycle
  return addDays(new Date(), predictedDaysUntilPaint)
}

export const formatDate = (date?: Date) => {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
}

export const getStartOfDate = (day?: string): Date => {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  let dt = new Date()
  if (day) {
    dt = new Date(day)
  }

  return new Date(dt.getTime() + timezoneOffset)
}
