import { FC, useEffect, useMemo, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { ClientOnly } from '~/components/useClientOnly'

const getColorAtPercentage = (percentage: number) => {
  if (percentage < 50) return '#388E3C'
  if (percentage < 75) return '#F7A278'
  return '#C62828'
}

export const DaysChip: FC<{
  predictedNextPaint?: string | null
  lastPainted?: string | null
}> = ({ predictedNextPaint, lastPainted }) => {
  return (
    <ClientOnly>
      <DaysChipComponent
        predictedNextPaint={predictedNextPaint}
        lastPainted={lastPainted}
      />
    </ClientOnly>
  )
}

const DaysChipComponent: FC<{
  predictedNextPaint?: string | null
  lastPainted?: string | null
}> = ({ predictedNextPaint, lastPainted }) => {
  if (!predictedNextPaint || !lastPainted) return null

  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    // We put this in a useEffect since it needs to run client-side
    const totalDaysPredicted = differenceInCalendarDays(
      new Date(predictedNextPaint ?? new Date()),
      new Date(lastPainted ?? new Date()),
    )

    // If the total days predicted is less than 0 (happens when a field is
    // left unpainted for a long time and there's been enough rainfall to
    // make the prediction go negative: 10 max dry, 19 days of rain, rainfall factor 1.125 = 21.375 days
    // which means it's prediction is about -11.375 days)
    // We simply say "it's in need of painting" (cap at 100% degraded)
    if (totalDaysPredicted < 0) {
      setPercentage(100)
      return
    }

    const daysLeft = differenceInCalendarDays(
      new Date(predictedNextPaint ?? new Date()),
      new Date(),
    )

    // Also flip it, 99% = basically gone
    setPercentage((1 - daysLeft / totalDaysPredicted) * 100)
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
      <div>
        {differenceInCalendarDays(
          new Date(predictedNextPaint ?? new Date()),
          new Date(),
        )}
      </div>
    </>
  )
}
