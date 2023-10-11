import { differenceInCalendarDays } from 'date-fns'
import { Field } from './types'

export const getPredictedDaysUntilPaint = (
  field?: Pick<
    Field,
    'maxDryDays' | 'lastPainted' | 'rainfallDays' | 'rainfallFactor'
  >,
) => {
  if (!field?.lastPainted) return

  return (
    field.maxDryDays -
    differenceInCalendarDays(new Date(), field.lastPainted) -
    field.rainfallDays * field.rainfallFactor
  )
}

export const adjustRainFactorAndDryDays = ({
  currentField,
  markUnplayableOn,
}: {
  currentField: Field
  markUnplayableOn: Date
}): Field => {
  const modifiedField = { ...currentField }
  /**
   * Max days with no rainfall = 14
   * If unplayable and rainfall has happened, adjust the rainfall factor to match the duration since last painting
   * If unplayable is flagged before that with no rainfall, reduce that number
   *  - but also look at the previous time period and adjust the rainfactor to account for this new number
   */
  const previousPredictionOfDays = getPredictedDaysUntilPaint({
    ...currentField,
    rainfallDays: currentField.previousRainfallDays,
  })

  const differenceBetweenLastPaintAndMarkedUnplayable =
    differenceInCalendarDays(markUnplayableOn, currentField.lastPainted)

  // If we have rainfall this period then ignore any previous and just set it
  // based on the current rainfall, this is the simplest case:
  if (
    currentField.rainfallDays &&
    differenceBetweenLastPaintAndMarkedUnplayable < currentField.maxDryDays
  ) {
    // currentMaxDry - (rainfallDays * n) = differenceBetweenlastPaintAndMarkedUnplayable
    const differenceOfDays =
      differenceBetweenLastPaintAndMarkedUnplayable - currentField.maxDryDays
    modifiedField.rainfallFactor = differenceOfDays / -currentField.rainfallDays
  }
  // If the previous rainfall was 0 or not set (first round)
  // we simply adjust max dry days if needed
  else if (!currentField.previousRainfallDays) {
    // If it was a dry period and no previous predictions
    // Simply update the max dry days:
    modifiedField.maxDryDays = differenceBetweenLastPaintAndMarkedUnplayable
  }
  // And we haven't had ANY rainfall (we need to adjust it's max dry days)
  // And we have some previous data to use to adjust the rainfall factor
  else if (currentField.rainfallDays === 0 && previousPredictionOfDays) {
    if (
      differenceBetweenLastPaintAndMarkedUnplayable > previousPredictionOfDays
    ) {
      // Find the rainfall factor that makes the predicted days = previousPredicted
      // Adjust maxDry to 12 and figure the rainfall factor from the previous rainfall to make it equal 12
      // newFoundDryDays - (previousRainfallDays * UNKNOWNrainfalFactor) = previousPredictionDays
      // 12 - (5 * n) = 9
      // -(5 * n) = 9 - 12
      // -5n = -3 [a]
      // n = -3/-5 [b]
      // n = 0.6
      const differenceOfDays =
        previousPredictionOfDays - differenceBetweenLastPaintAndMarkedUnplayable
      modifiedField.rainfallFactor =
        differenceOfDays / -currentField.previousRainfallDays
    } else {
      // This is a strange case where the dry period is shorter than the wet
      // This means something is wrong and we should reset the rain factor to
      // 0, since the rain seems to have no effect (or makes the paint MORE visible?)
      modifiedField.rainfallFactor = 0
      // I should likely report this or alert someone, this may actually mean
      // our weather API is failing (this is an incorrect dry period)
    }
  }

  return modifiedField
}
