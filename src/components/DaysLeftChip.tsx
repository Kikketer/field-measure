import { differenceInCalendarDays } from 'date-fns'
import { Field } from '../utilities/types'
import styles from './DaysLeftChip.module.css'

const getColorAtPercentage = (percentage: number) => {
  if (percentage < 50) return '#388E3C'
  if (percentage < 75) return '#F7A278'
  return '#C62828'
}

export const DaysLeftChip: Component<{
  predictedNextPaint: Field['predictedNextPaint']
  lastPainted: Field['lastPainted']
}> = (props) => {
  if (!props.predictedNextPaint || !props.lastPainted) return null

  const percentage = createMemo(() => {
    const totalDaysPredicted = differenceInCalendarDays(
      props.predictedNextPaint ?? new Date(),
      props.lastPainted,
    )
    const daysLeft = differenceInCalendarDays(
      props.predictedNextPaint ?? new Date(),
      new Date(),
    )

    // Also flip it, 99% = basically gone
    return (1 - daysLeft / totalDaysPredicted) * 100
  })

  return (
    <div className="row">
      <Show when={percentage() < 100} fallback={<div class={styles.Total} />}>
        <span
          class={styles.DaysLeft}
          style={{
            '--current': `${percentage()}%`,
            '--currentColor': getColorAtPercentage(percentage()),
          }}
        />
      </Show>
      {differenceInCalendarDays(props.predictedNextPaint, new Date())}
    </div>
  )
}
