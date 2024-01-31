import { differenceInCalendarDays } from 'date-fns'
import { Database } from '~/database.types'

type Field = Database['public']['Tables']['fields']['Row']
type PaintHistory = Database['public']['Tables']['paint_history']['Row']

export const getFieldWithAdjustedRainFactorAndDryDays = ({
  currentField,
  markUnplayableOn,
  paintHistory,
}: {
  currentField: Field
  markUnplayableOn: Date
  paintHistory: Database['public']['Tables']['paint_history']['Row'][]
}): Field => {
  const modifiedField: Field = { ...currentField }

  // Get the average number of days it went unpainted
  let totalDaysUnpaintedFromHistory = null
  if (paintHistory?.length) {
    totalDaysUnpaintedFromHistory = paintHistory.reduce(
      (acc, cur) => acc + (cur.days_unpainted ?? 0),
      0,
    )
  }

  const differenceBetweenLastPaintAndMarkedUnplayable =
    differenceInCalendarDays(
      markUnplayableOn,
      new Date(currentField.last_painted ?? new Date()),
    )

  // Let's see if we accurately predicted the painted date
  // Find the predicted date:
  const predictedDate = new Date(
    new Date(currentField.last_painted ?? new Date()).setDate(
      new Date(currentField.last_painted ?? new Date()).getDate() +
        (currentField.max_dry_days ?? 0) -
        (currentField.rainfall_days ?? 0) * currentField.rainfall_factor,
    ),
  )

  const predictedDifferenceInDays = differenceInCalendarDays(
    markUnplayableOn,
    predictedDate,
  )

  console.log('Getting difference ', {
    markUnplayableOn,
    lastPainted: currentField.last_painted,
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
    currentField.rainfall_days &&
    differenceBetweenLastPaintAndMarkedUnplayable <
      (currentField.max_dry_days ?? 0)
  ) {
    // currentMaxDry - (rainfallDays * n) = differenceBetweenLastPaintAndMarkedUnplayable
    const differenceOfDays =
      differenceBetweenLastPaintAndMarkedUnplayable -
      (currentField.max_dry_days ?? 0)
    const newRainfallFactor =
      differenceOfDays / -(currentField.rainfall_days ?? 1)
    const totalRainfallFactor =
      paintHistory.reduce((acc, cur) => acc + (cur.rainfall_factor ?? 0), 0) +
      newRainfallFactor

    console.log('modifying the factor', {
      differenceBetweenLastPaintAndMarkedUnplayable,
      differenceOfDays,
      newRainfallFactor,
      totalRainfallFactor,
    })

    // Calculate the new rainfall factor using the average of the previous plus this one
    modifiedField.rainfall_factor =
      totalRainfallFactor / (paintHistory.length + 1)
  }
  // If we have rainfall this period but it's been longer than the max dry days
  // then we need to adjust the max dry days
  else if (
    currentField.rainfall_days &&
    differenceBetweenLastPaintAndMarkedUnplayable >=
      (currentField.max_dry_days ?? 0)
  ) {
    // Set the rainfall factor to 0, ignore any previous rainfall factors
    modifiedField.rainfall_factor = 0

    // Adjust the max dry days to the difference between the last painted and the marked unplayable
    modifiedField.max_dry_days = Math.round(
      differenceBetweenLastPaintAndMarkedUnplayable,
    )
  }
  // If the previous rainfall was 0 or not set (first round)
  // we simply adjust max dry days if needed
  else if (
    totalDaysUnpaintedFromHistory == null ||
    currentField.rainfall_days === 0
  ) {
    // If it was a dry period and no previous predictions
    // Simply update the max dry days:
    modifiedField.max_dry_days = Math.round(
      differenceBetweenLastPaintAndMarkedUnplayable,
    )
  }

  return { ...modifiedField, marked_unplayable: markUnplayableOn.toISOString() }
}
