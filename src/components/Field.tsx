import { type Component, For, Show } from 'solid-js'
import styles from './Field.module.css'
import { FullField } from '../assets/FullField'
import { BuildoutField } from '../assets/BuildoutField'
import { BabyField } from '../assets/BabyField'
import { convertToFeet } from '../utilities/convertToFeet'
import {
  FULL_LINE_LABELS,
  BUILDOUT_LINE_LABELS,
  TINY_LINE_LABELS,
} from '../utilities/lineLabels'
import { FieldSize } from '../utilities/types'
import { SIZES } from '../utilities/constants'

type FieldProps = {
  fieldSize: () => FieldSize
  customWidth?: () => number | undefined
  customLength?: () => number | undefined
}

const getSoccerFieldImage = (size: FieldSize) => {
  switch (size) {
    case FieldSize.full:
    case FieldSize.elevenThirteen:
      return <FullField />
    case FieldSize.nineTen:
      return <BuildoutField />
    case FieldSize.sevenEight:
      return <BabyField />
  }
}

const getLabelsForField = (fieldSize: FieldSize) => {
  switch (fieldSize) {
    case FieldSize.full:
    case FieldSize.elevenThirteen:
      return FULL_LINE_LABELS
    case FieldSize.nineTen:
      return BUILDOUT_LINE_LABELS
    case FieldSize.sevenEight:
      return TINY_LINE_LABELS
  }
}

export const Field: Component<FieldProps> = ({
  fieldSize,
  customWidth,
  customLength,
}) => {
  return (
    <div class={styles.FieldWrapper}>
      {getSoccerFieldImage(fieldSize())}
      <For each={getLabelsForField(fieldSize())}>
        {(label) => (
          <Show
            when={
              !!label.getLength({
                fieldSize: fieldSize(),
                fieldWidth: customWidth?.(),
                fieldLength: customLength?.(),
              })
            }
          >
            <div
              class={styles.Label}
              style={{ left: `${label.x}%`, top: `${label.y}%` }}
            >
              {convertToFeet(
                label.getLength({
                  fieldSize: fieldSize(),
                  fieldWidth: customWidth?.(),
                  fieldLength: customLength?.(),
                }),
              )}
            </div>
          </Show>
        )}
      </For>
      <div
        class={styles.Label}
        style={{ left: '20%', top: '90%', width: '60%' }}
      >
        {fieldSize()}:{' '}
        {customWidth?.() ?? SIZES[fieldSize()].recommendedMaxWidth} x{' '}
        {customLength?.() ?? SIZES[fieldSize()].recommendedMaxLength}
      </div>
    </div>
  )
}
