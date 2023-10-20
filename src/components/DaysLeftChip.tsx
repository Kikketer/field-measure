import { Component } from 'solid-js'
import { differenceInCalendarDays } from 'date-fns'
import { Field } from '../utilities/types'

export const DaysLeftChip: Component<{
  predictedNextPaint?: Field['predictedNextPaint']
}> = (props) => {
  if (!props.predictedNextPaint) return null

  return (
    <span>
      [[{differenceInCalendarDays(props.predictedNextPaint, new Date())}]]
    </span>
  )
}
