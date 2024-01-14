import classNames from 'classnames'
import { Component, createEffect, createSignal, Show } from 'solid-js'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import styles from './SizeSlider.module.css'

type SizeSliderProps = {
  fieldSize: () => FieldSize
  type: 'width' | 'length'
}

export const SizeSlider: Component<SizeSliderProps> = (props) => {
  // For now the trigger to have reccomended sizes depends on just the width
  const [hasReccomendedSize, setHasReccomendedSize] = createSignal<boolean>(
    SIZES[props.fieldSize()].recommendedMinWidth !==
      SIZES[props.fieldSize()].minWidth,
  )

  createEffect(() => {
    setHasReccomendedSize(
      SIZES[props.fieldSize()].recommendedMinWidth !==
        SIZES[props.fieldSize()].minWidth,
    )
  })

  return (
    <div
      class={classNames(styles.SizeSliderWrap, {
        [styles.Green]: !hasReccomendedSize(),
      })}
    >
      <Show when={hasReccomendedSize()}>
        <div class={styles.RecommendedZone} style={{ width: '50%' }} />
      </Show>
      {/* <div class={styles.Spot} /> */}
      <div class={styles.Label} style={{ left: '-0.4rem' }}>
        {props.type === 'length'
          ? SIZES[props.fieldSize()].minLength
          : SIZES[props.fieldSize()].minWidth}
      </div>
      <Show when={hasReccomendedSize()}>
        <div class={styles.Label} style={{ left: 'calc(25% - 0.8rem)' }}>
          {props.type === 'length'
            ? SIZES[props.fieldSize()].recommendedMinLength
            : SIZES[props.fieldSize()].recommendedMinWidth}
        </div>
        <div class={styles.Label} style={{ left: 'calc(75% - 0.8rem)' }}>
          {props.type === 'length'
            ? SIZES[props.fieldSize()].recommendedMaxLength
            : SIZES[props.fieldSize()].recommendedMaxWidth}
        </div>
      </Show>
      <div class={styles.Label} style={{ left: 'calc(100% - 1.2rem)' }}>
        {props.type === 'length'
          ? SIZES[props.fieldSize()].maxLength
          : SIZES[props.fieldSize()].maxWidth}
      </div>
    </div>
  )
}
