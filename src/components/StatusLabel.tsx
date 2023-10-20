import classNames from 'classnames'
import { Component, Resource } from 'solid-js'
import { Field } from '../utilities/types'
import { getIsFieldPlayable } from '../utilities/utils'
import styles from './StatusLabel.module.css'

export const StatusLabel: Component<{ field?: Resource<Field> }> = (props) => {
  if (!props.field() || !props.field()?.lastPainted) return null

  return (
    <div
      class={classNames(
        styles.StatusPill,
        getIsFieldPlayable(props.field())
          ? styles.StatusGreen
          : styles.StatusRed,
      )}
    >
      {getIsFieldPlayable(props.field()) ? 'Playable' : 'Not Playable'}
    </div>
  )
}
