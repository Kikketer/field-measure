import { FC, useMemo } from 'react'
import { differenceInCalendarDays } from 'date-fns'

const getColorAtPercentage = (percentage: number) => {
  if (percentage < 50) return '#388E3C'
  if (percentage < 75) return '#F7A278'
  return '#C62828'
}

export const DaysChip: FC<{ predictedNextPaint: Date; lastPainted: Date }> = ({
  predictedNextPaint,
  lastPainted,
}) => {
  if (!predictedNextPaint || !lastPainted) return null

  const percentage = useMemo(() => {
    const totalDaysPredicted = differenceInCalendarDays(
      predictedNextPaint ?? new Date(),
      lastPainted,
    )

    // If the total days predicted is less than 0 (happens when a field is
    // left unpainted for a long time and there's been enough rainfall to
    // make the prediction go negative: 10 max dry, 19 days of rain, rainfall factor 1.125 = 21.375 days
    // which means it's prediction is about -11.375 days)
    // We simply say "it's in need of painting" (cap at 100% degraded)
    if (totalDaysPredicted < 0) return 100

    const daysLeft = differenceInCalendarDays(
      predictedNextPaint ?? new Date(),
      new Date(),
    )

    // Also flip it, 99% = basically gone
    return (1 - daysLeft / totalDaysPredicted) * 100
  }, [predictedNextPaint, lastPainted])

  return (
    <>
      {percentage < 100 ? (
        <div
          style={{
            color: 'white',
            backgroundColor: getColorAtPercentage(percentage),
          }}
        >
          {percentage}
        </div>
      ) : (
        <div />
      )}
      <div>{differenceInCalendarDays(predictedNextPaint, new Date())}</div>
    </>
  )
}
