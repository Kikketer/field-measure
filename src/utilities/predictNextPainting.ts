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
  currentField: Field
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

  // Let's see if we accurately predicted the painted date
  // Find the predicted date:
  const predictedDate = new Date(
    new Date(currentField.lastPainted).setDate(
      new Date(currentField.lastPainted).getDate() +
        currentField.maxDryDays -
        (currentField.rainfallDays ?? 0) * currentField.rainfallFactor,
    ),
  )

  const predictedDifferenceInDays = differenceInCalendarDays(
    markUnplayableOn,
    predictedDate,
  )

  console.log('Getting difference ', {
    markUnplayableOn,
    lastPainted: currentField.lastPainted,
    predictedDate,
    predictedDifferenceInDays,
  })

  // If we were completely accurate in the days then we should just reset
  // and not adjust the rainfall factor or max-days painted
  if (predictedDifferenceInDays === 0) {
    // do nothing
  }
  // If we have rainfall this period then adjust the rainfall factor
  // based on the average of the previous rainfall factors and this new one:
  else if (
    currentField.rainfallDays &&
    differenceBetweenLastPaintAndMarkedUnplayable < currentField.maxDryDays
  ) {
    // currentMaxDry - (rainfallDays * n) = differenceBetweenLastPaintAndMarkedUnplayable
    const differenceOfDays =
      differenceBetweenLastPaintAndMarkedUnplayable - currentField.maxDryDays
    const newRainfallFactor =
      differenceOfDays / -(currentField.rainfallDays ?? 1)
    const totalRainfallFactor =
      paintHistory.reduce((acc, cur) => acc + cur.rainfallFactor, 0) +
      newRainfallFactor

    console.log('modifying the factor', {
      differenceBetweenLastPaintAndMarkedUnplayable,
      differenceOfDays,
      newRainfallFactor,
      totalRainfallFactor,
    })

    // Calculate the new rainfall factor using the average of the previous plus this one
    modifiedField.rainfallFactor =
      totalRainfallFactor / (paintHistory.length + 1)
  }
  // If we have rainfall this period but it's been longer than the max dry days
  // then we need to adjust the max dry days
  else if (
    currentField.rainfallDays &&
    differenceBetweenLastPaintAndMarkedUnplayable >= currentField.maxDryDays
  ) {
    // Set the rainfall factor to 0, ignore any previous rainfall factors
    modifiedField.rainfallFactor = 0

    // Adjust the max dry days to the difference between the last painted and the marked unplayable
    modifiedField.maxDryDays = Math.round(
      differenceBetweenLastPaintAndMarkedUnplayable,
    )
  }
  // If the previous rainfall was 0 or not set (first round)
  // we simply adjust max dry days if needed
  else if (
    totalDaysUnpaintedFromHistory == null ||
    currentField.rainfallDays === 0
  ) {
    // If it was a dry period and no previous predictions
    // Simply update the max dry days:
    modifiedField.maxDryDays = Math.round(
      differenceBetweenLastPaintAndMarkedUnplayable,
    )
  }

  return { ...modifiedField, markedUnplayable: markUnplayableOn }
}
