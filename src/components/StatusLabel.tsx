import classNames from 'classnames'
import { Component, Resource, Show, Switch, createEffect } from 'solid-js'
import { Field } from '../utilities/types'
import { getIsFieldPlayable } from '../utilities/utils'
import styles from './StatusLabel.module.css'

// I wonder if this is a slight downfall of Solid where inside a <For> loop
// you don't get signals/resources/whatever they call it. So this component has
// to awkwardly accept both types and decide if it should be a signal or not.
export const StatusLabel: Component<{ field?: Resource<Field> | Field }> = ({
  field,
}) => {
  if (!field) return null

  return (
    <Show
      when={getIsFieldPlayable(typeof field === 'function' ? field() : field)}
      fallback={
        <div class={classNames(styles.StatusPill, styles.StatusRed)}>
          Unplayable
        </div>
      }
    >
      <div class={classNames(styles.StatusPill, styles.StatusGreen)}>
        Playable
      </div>
    </Show>
  )
}
