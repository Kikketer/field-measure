/**
 * Note I have not implemented this yet.
 * There's an aspect of if this is needed.  The predicted next date to paint should
 * be driven based on the "unplayable" date but there are other aspects that I'm just
 * tired of fighting like if they paint the field but it was unplayable since the
 * predicted date.
 * Something to think about again in the future when I have the energy to fight it.
 */

import { differenceInCalendarDays } from 'date-fns'
import { Field } from './types'

export const getFieldAsUnplayable = ({
  field,
  unplayableOn,
}: {
  field: Field
  unplayableOn?: Date
}) => {
  const resultingField = { ...field }
  const fieldPredictedDate = resultingField.predictedNextPaint ?? new Date()
  const unplayableDate = unplayableOn ?? new Date()

  const daysDifferenceFromPredictedDate = differenceInCalendarDays(
    unplayableDate,
    fieldPredictedDate,
  )
  const daysDifferenceFromLastUnplayable = differenceInCalendarDays(
    unplayableDate,
    field.markedUnplayable,
  )

  // If the marked lastMarkedUnplayable + maxDryDays < unplayableDate and there are
  // rainfall days then we set the factor to 0 and increase the maxDryDays to that total
  // This means there's something going on since the rainfall factor would be negative
  if (
    daysDifferenceFromLastUnplayable > field.maxDryDays &&
    field.rainfallDays > 0
  ) {
    resultingField.maxDryDays = daysDifferenceFromLastUnplayable
    resultingField.rainfallFactor = 0
  } else if (resultingField.rainfallDays > 0) {
    // If there is rainfall for this field, adjust the rainfall factor
    // to make the predicted date be the unplayable date
    resultingField.rainfallFactor =
      (daysDifferenceFromLastUnplayable - resultingField.maxDryDays) /
      -resultingField.rainfallDays
  } else {
    // If there is NOT any rainfall for this field, adjust the maxDryDays
    // to make the predicted date be the unplayable date
    resultingField.maxDryDays =
      daysDifferenceFromPredictedDate + resultingField.maxDryDays
  }

  resultingField.predictedNextPaint = unplayableDate

  return resultingField
}
