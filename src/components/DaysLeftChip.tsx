import { differenceInCalendarDays } from 'date-fns'
import { useMemo } from 'react'
import { Field } from '../utilities/types'
import styles from './DaysLeftChip.module.css'

const getColorAtPercentage = (percentage: number) => {
  if (percentage < 50) return 'var(--success)'
  if (percentage < 75) return 'var(--warning)'
  return 'var(--danger)'
}

// Slightly lighter to allow us to see the text and slice
const getOffColorAtPercentage = (percentage: number) => {
  if (percentage < 50) return 'var(--success-light)'
  if (percentage < 75) return 'var(--warning-light)'
  return 'var(--danger-light)'
}

const getColorContrast = (percentage: number) => {
  if (percentage < 50) return 'var(--success-contrast)'
  if (percentage < 75) return 'var(--warning-contrast)'
  return 'var(--danger-contrast)'
}

export const DaysLeftChip: React.FC<{
  predictedNextPaint: Field['predictedNextPaint']
  lastPainted: Field['lastPainted']
}> = ({ predictedNextPaint, lastPainted }) => {
  if (!predictedNextPaint || !lastPainted) return null

  const percentage = useMemo(() => {
    const totalDaysPredicted = differenceInCalendarDays(
      predictedNextPaint ?? new Date(),
      lastPainted,
    )
    const daysLeft = differenceInCalendarDays(
      predictedNextPaint ?? new Date(),
      new Date(),
    )

    // If the days left is twice as long as total days predicted (negative) then
    // the field is likely not needed right now and is at 100%
    if (-1 * daysLeft > totalDaysPredicted * 2) {
      return 100
    }

    // Also cap any result to 100% as well:
    const percentageGone = (1 - daysLeft / totalDaysPredicted) * 100
    if (percentageGone > 100) {
      return 100
    }

    // Also flip it, 99% = basically gone
    return percentageGone
  }, [predictedNextPaint, lastPainted])

  return (
    <div>
      {percentage < 100 ? (
        <span
          className={styles.DaysLeft}
          style={{
            // @ts-ignore
            '--current': `${percentage}%`,
            '--currentColor': getColorAtPercentage(percentage),
            '--currentContrast': getColorContrast(percentage),
            '--currentOffColor': getOffColorAtPercentage(percentage),
          }}
        >
          {differenceInCalendarDays(predictedNextPaint, new Date())}
        </span>
      ) : (
        <div className={styles.Total} />
      )}
      {/*{differenceInCalendarDays(predictedNextPaint, new Date())}*/}
    </div>
  )
}
