import { differenceInCalendarDays, startOfDay } from 'date-fns'
import { Field } from './types'

export const getIsFieldPlayable = (field?: Field) => {
  if (!field) return false

  return (
    differenceInCalendarDays(new Date(), field.lastPainted) < field.maxDryDays
  )
}

export const formatDate = (date?: Date) => {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
}

export const getStartOfDate = (day?: string): Date => {
  if (!day) return startOfDay(new Date())

  return startOfDay(new Date(day))
}
