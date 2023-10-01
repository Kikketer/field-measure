import classNames from 'classnames'
import { Component, Resource, Show, Switch, createEffect } from 'solid-js'
import { Field } from '../utilities/types'
import { getIsFieldPlayable } from '../utilities/utils'
import styles from './StatusLabel.module.css'

// I wonder if this is a slight downfall of Solid where inside a <For> loop
// you don't get signals/resources/whatever they call it. So this component has
// to awkwardly accept both types and decide if it should be a signal or not.
export const StatusLabel: Component<{ field?: Resource<Field> | Field }> = (
  props,
) => {
  // This seems to be a pretty big flaw in solidJS, I may be doing something wrong:
  const actualField =
    typeof props.field === 'function' ? props.field() : props.field

  if (!actualField || !actualField?.lastPainted) return null

  return (
    <div
      class={classNames(
        styles.StatusPill,
        getIsFieldPlayable(actualField) ? styles.StatusGreen : styles.StatusRed,
      )}
    >
      {getIsFieldPlayable(actualField) ? 'Playable' : 'Not Playable'}
    </div>
  )
}
