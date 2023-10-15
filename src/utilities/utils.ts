import { addDays, differenceInCalendarDays } from 'date-fns'
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
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  let dt = new Date()
  if (day) {
    dt = new Date(day)
  }

  return new Date(dt.getTime() + timezoneOffset)
}
