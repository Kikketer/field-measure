import { addDays, differenceInCalendarDays, differenceInDays } from 'date-fns'
import { Field } from './types'

export const getPredictedDaysUntilPaint = (field?: Field) => {
  if (!field?.lastPainted) return

  return (
    field.maxDryDays -
    differenceInCalendarDays(new Date(), field.lastPainted) -
    field.rainfallDays * field.rainfallFactor
  )
}

export const getPredictedNextPaintDate = (field?: Field): Date | undefined => {
  const predictedDaysUntilPaint = getPredictedDaysUntilPaint(field)
  if (predictedDaysUntilPaint == null) return

  // (maxDryDays - daysSinceLastPaint - (rainDays * rainFactor))

  // TODO Predict the next paint date based on the lastPainted date and the rainTotals
  // For now predict based on zero rain, eventually take into account the average daily rainfall in the last paint cycle
  return addDays(new Date(), predictedDaysUntilPaint)
}

export const adjustRainFactorAndDryDays = ({
  currentField,
  markedUnplayableOn,
}: {
  currentField: Field
  markedUnplayableOn: Date
}): Field => {
  /**
   * Max days with no rainfall = 14
   * If unplayable and rainfall has happened, adjust the rainfall factor to match the duration since last painting
   * If unplayable is flagged before that with no rainfall, reduce that number
   *  - but also look at the previous time period and adjust the rainfactor to account for this new number
   */

  const differenceInDaysSinceLastPaint = differenceInCalendarDays(
    markedUnplayableOn,
    currentField.lastPainted,
  )
  // Find the previous reason why the rainfall factor is what it is
  // prevMax - (prevRainDays * factor) = ___
  // 14 - (3 * 1) = 11
  // But we found that dry days is actually 10!
  // So: 10 - (3 * n) = 11
  const predictedDaysUsingPreviousRainfallFactor =
    currentField.maxDryDays -
    currentField.previousRainfallDays * currentField.rainfallFactor

  console.log(
    'Predicted from previous rainfall factor',
    predictedDaysUsingPreviousRainfallFactor,
  )
  // currentMax - (previousRainfallDays * rainfallFactor) = predicted
  // 14 - (3 * 1) = >>11<< predictedDaysUsingPreviousRainfallFactor
  // But now we find that the 14 is actually 10, so adjust the rain factor
  // 10 - (3 * n) = 11 << Still the previous predicted days

  // const right = predictedDaysUsingPreviousRainfallFactor
  const rainFactorFromZeroDays =
    (predictedDaysUsingPreviousRainfallFactor - currentField.maxDryDays) /
    -currentField.rainfallDays

  console.log('Rain factor ', rainFactorFromZeroDays)

  // Only adjust the max dry days if the predictedDaysUsingCurrentRainfallFactor is less than the differenceInDaysSinceLastPaint
  // if (
  //   differenceInDaysSinceLastPaint < predictedDaysUsingPreviousRainfallFactor
  // ) {
  // }
  // const previousRainfallFactor =
  //   (differenceInDaysSinceLastPaint - currentField.maxDryDays) /
  //   -currentField.rainfallDays

  // Eg: 14 - (3 * n) = 10 ... solve for n
  // -3n = -4
  // n = 4/3
  const rainfallFactor =
    (differenceInDaysSinceLastPaint - currentField.maxDryDays) /
    -currentField.rainfallDays

  return { ...currentField, rainfallFactor }
}
