import { differenceInCalendarDays } from 'date-fns'
import { useMemo } from 'react'
import {
  getColorAtPercentage,
  getColorContrast,
  getOffColorAtPercentage,
  getPercentage,
} from '../utilities/percentageColors'
import { Field } from '../utilities/types'
import styles from './DaysLeftChip.module.css'

export const DaysLeftChip: React.FC<{
  predictedNextPaint: Field['predictedNextPaint']
  lastPainted: Field['lastPainted']
}> = ({ predictedNextPaint, lastPainted }) => {
  if (!predictedNextPaint || !lastPainted) return null

  const percentage = useMemo(() => {
    return getPercentage({ predictedNextPaint, lastPainted })
  }, [predictedNextPaint, lastPainted])

  const differenceInDays = useMemo(() => {
    return differenceInCalendarDays(predictedNextPaint, new Date())
  }, [predictedNextPaint])

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
          {differenceInDays}
        </span>
      ) : (
        <span className={styles.Total}>
          {differenceInDays > -9 && differenceInDays}
        </span>
      )}
    </div>
  )
}
