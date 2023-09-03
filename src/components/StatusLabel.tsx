import classNames from 'classnames'
import { differenceInCalendarDays } from 'date-fns'
import { Component } from 'solid-js'
import { Field } from '../types'
import styles from './StatusLabel.module.css'
import { getIsFieldPlayable } from '../utils'

export const StatusLabel: Component<{ field?: Field }> = ({ field }) => {
  if (!field) return null

  // TODO Status evaluation based on the rainTotals, lastPainted, and other factors
  if (getIsFieldPlayable(field)) {
    return (
      <div class={classNames(styles.StatusPill, styles.StatusGreen)}>
        Playable
      </div>
    )
  } else {
    return (
      <div class={classNames(styles.StatusPill, styles.StatusRed)}>
        Unplayable
      </div>
    )
  }
}
