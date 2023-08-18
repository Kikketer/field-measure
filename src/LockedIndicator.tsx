import { Component, createSignal } from 'solid-js'
import classNames from 'classnames'
import styles from './LockedIndicator.module.css'
import LockedIcon from './assets/locked.svg'

type LockedIndicatorProps = {
  show: () => boolean
}

export const LockedIndicator: Component<LockedIndicatorProps> = (props) => {
  return (
    <div
      class={classNames(styles.LockedIndicator, {
        [styles.shown]: props.show(),
      })}
    >
      <LockedIcon />
    </div>
  )
}
