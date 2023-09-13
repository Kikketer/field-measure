import { Component, Show, createEffect, createSignal } from 'solid-js'
import classNames from 'classnames'
import styles from './SizeSlider.module.css'
import { FieldSize } from '../types'
import { SIZES } from '../utilities/constants'

type SizeSliderProps = {
  fieldSize: () => FieldSize
  type: 'width' | 'length'
}

export const SizeSlider: Component<SizeSliderProps> = ({ fieldSize, type }) => {
  // For now the trigger to have reccomended sizes depends on just the width
  const [hasReccomendedSize, setHasReccomendedSize] = createSignal<boolean>(
    SIZES[fieldSize()].recommendedMinWidth !== SIZES[fieldSize()].minWidth,
  )

  createEffect(() => {
    setHasReccomendedSize(
      SIZES[fieldSize()].recommendedMinWidth !== SIZES[fieldSize()].minWidth,
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
        {type === 'length'
          ? SIZES[fieldSize()].minLength
          : SIZES[fieldSize()].minWidth}
      </div>
      <Show when={hasReccomendedSize()}>
        <div class={styles.Label} style={{ left: 'calc(25% - 0.8rem)' }}>
          {type === 'length'
            ? SIZES[fieldSize()].recommendedMinLength
            : SIZES[fieldSize()].recommendedMinWidth}
        </div>
        <div class={styles.Label} style={{ left: 'calc(75% - 0.8rem)' }}>
          {type === 'length'
            ? SIZES[fieldSize()].recommendedMaxLength
            : SIZES[fieldSize()].recommendedMaxWidth}
        </div>
      </Show>
      <div class={styles.Label} style={{ left: 'calc(100% - 1.2rem)' }}>
        {type === 'length'
          ? SIZES[fieldSize()].maxLength
          : SIZES[fieldSize()].maxWidth}
      </div>
    </div>
  )
}
