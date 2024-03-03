import { differenceInCalendarDays, startOfDay } from 'date-fns'
import { Field } from './types'

export const getIsFieldPlayable = (field?: Field) => {
  if (!field) return false

  return (
    differenceInCalendarDays(
      new Date(field.predictedNextPaint ?? new Date()),
      new Date(),
    ) > 0
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

export const convertUnderscoreToCamelCase = (obj: any) => {
  const duplicateObj: any = { ...obj }
  Object.keys(duplicateObj).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    if (newKey !== key) {
      duplicateObj[newKey] = duplicateObj[key]
      delete duplicateObj[key]
    }
  })

  return duplicateObj
}

export const mapFields = (fields: any[]): Field[] => {
  // Convert all keys with underscores to camelCase:
  const duplicateFields = fields.slice()

  duplicateFields.forEach((field) => {
    Object.keys(field).forEach((key) => {
      const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      if (newKey !== key) {
        field[newKey] = field[key]
        delete field[key]
      }
    })

    // Convert the dates to Date objects:
    field.createdAt = field.createdAt ? new Date(field.createdAt) : undefined
    field.lastPainted = field.lastPainted
      ? new Date(field.lastPainted)
      : undefined
    field.modified = field.modified ? new Date(field.modified) : undefined
    field.predictedNextPaint = field.predictedNextPaint
      ? new Date(field.predictedNextPaint)
      : undefined
  })

  return duplicateFields
}

export const unmapField = (field: Partial<Field>) => {
  const duplicateField: any = { ...field }
  // Convert all keys with camelCase to underscores:
  Object.keys(duplicateField).forEach((key) => {
    const newKey = key.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`)
    if (newKey !== key) {
      duplicateField[newKey] = duplicateField[key]
      delete duplicateField[key]
    }
  })

  return duplicateField
}
