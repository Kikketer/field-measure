import { differenceInCalendarDays } from 'date-fns'
import { Field } from './types'

export const getColorAtPercentage = (percentage: number) => {
  if (percentage < 66) return 'var(--success)'
  if (percentage < 99) return 'var(--warning)'
  return 'var(--danger)'
}

// Slightly lighter to allow us to see the text and slice
export const getOffColorAtPercentage = (percentage: number) => {
  if (percentage < 66) return 'var(--success-light)'
  if (percentage < 99) return 'var(--warning-light)'
  return 'var(--danger-light)'
}

export const getColorContrast = (percentage: number) => {
  if (percentage < 66) return 'var(--success-contrast)'
  if (percentage < 99) return 'var(--warning-contrast)'
  return 'var(--danger-contrast)'
}

export const getPercentage = ({
  predictedNextPaint,
  lastPainted,
}: {
  predictedNextPaint: Field['predictedNextPaint']
  lastPainted: Field['lastPainted']
}) => {
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
}
