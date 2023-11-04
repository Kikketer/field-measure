import { differenceInCalendarDays } from 'date-fns'
import { Field, PaintHistory } from './types'

export const getPredictedDaysUntilPaint = (
  field?: Pick<
    Field,
    'maxDryDays' | 'lastPainted' | 'rainfallDays' | 'rainfallFactor'
  >,
) => {
  if (!field?.lastPainted) return

  return (
    field.maxDryDays -
    differenceInCalendarDays(new Date(), new Date(field.lastPainted)) -
    field.rainfallDays * field.rainfallFactor
  )
}

export const getFieldWithAdjustedRainFactorAndDryDays = ({
  currentField,
  markUnplayableOn,
  paintHistory,
}: {
  currentField: Pick<
    Field,
    'maxDryDays' | 'rainfallDays' | 'rainfallFactor' | 'lastPainted'
  >
  markUnplayableOn: Date
  paintHistory: Array<Pick<PaintHistory, 'rainfallFactor' | 'daysUnpainted'>>
}): Field => {
  const modifiedField = { ...currentField }

  // Get the average number of days it went unpainted
  let totalDaysUnpaintedFromHistory = null
  if (paintHistory?.length) {
    totalDaysUnpaintedFromHistory = paintHistory.reduce(
      (acc, cur) => acc + cur.daysUnpainted,
      0,
    )
  }

  const differenceBetweenLastPaintAndMarkedUnplayable =
    differenceInCalendarDays(markUnplayableOn, currentField.lastPainted)

  // If we have rainfall this period then adjust the rainfall factor
  // based on the average of the previous rainfall factors and this new one:
  if (
    currentField.rainfallDays &&
    differenceBetweenLastPaintAndMarkedUnplayable < currentField.maxDryDays
  ) {
    // currentMaxDry - (rainfallDays * n) = differenceBetweenlastPaintAndMarkedUnplayable
    const differenceOfDays =
      differenceBetweenLastPaintAndMarkedUnplayable - currentField.maxDryDays
    const newRainfallFactor =
      differenceOfDays / -(currentField.rainfallDays ?? 1)
    const totalRainfallFactor =
      paintHistory.reduce((acc, cur) => acc + cur.rainfallFactor, 0) +
      newRainfallFactor

    // Calculate the new rainfall factor using the average of the previous plus this one
    modifiedField.rainfallFactor =
      totalRainfallFactor / (paintHistory.length + 1)
  }
  // If the previous rainfall was 0 or not set (first round)
  // we simply adjust max dry days if needed
  else if (totalDaysUnpaintedFromHistory == null) {
    // If it was a dry period and no previous predictions
    // Simply update the max dry days:
    modifiedField.maxDryDays = Math.round(
      differenceBetweenLastPaintAndMarkedUnplayable,
    )
  }
  // And we haven't had ANY rainfall (we need to adjust it's max dry days)
  // And we have some previous data to use to adjust the rainfall factor
  else if (currentField.rainfallDays === 0) {
    // Do not adjust rainfall factor if the current period has had no rainfall
    // But DO adjust the max dry days to average of days unpainted and the duration of this period
    // This doesn't account for history of rainfall factor but it's better than nothing
    modifiedField.maxDryDays = Math.round(
      (totalDaysUnpaintedFromHistory + currentField.maxDryDays) /
        (paintHistory.length + 1),
    )
  }

  return { ...modifiedField, markedUnplayable: markUnplayableOn }
}
