import { type Component, createSignal, For } from 'solid-js'
import { throttle } from 'lodash-es'
import styles from './Field.module.css'
import Soccer from '../assets/Soccer.svg'
import { convertToFeet } from '../convertToFeet'
import { LINE_LABELS } from '../lineLabels'
import { FieldSize } from '../types'
import { SIZES } from '../constants'
// import SoccerBuildout from '../assets/Soccer-Buildout.svg'

type FieldProps = {
  fieldSize: () => FieldSize
  customWidth?: () => number | undefined
  customLength?: () => number | undefined
}

export const Field: Component<FieldProps> = ({
  fieldSize,
  customWidth,
  customLength,
}) => {
  const [fieldHeight, setFieldHeight] = createSignal(
    document.getElementById('soccer-field')?.clientHeight,
  )

  window.addEventListener(
    'resize',
    throttle(() => {
      console.log('Re-size')
      setFieldHeight(document.getElementById('soccer-field')?.clientHeight)
    }, 200),
  )

  const actualWidth = customWidth?.() ?? SIZES[fieldSize()].recommendedMaxWidth
  const actualLength =
    customLength?.() ?? SIZES[fieldSize()].recommendedMaxLength

  return (
    <div
      class={styles.FieldWrapper}
      style={{
        height: `${fieldHeight()}px`,
      }}
    >
      <Soccer id="soccer-field" style={{ width: '100%' }} />
      <For each={LINE_LABELS}>
        {(label) => (
          <div
            class={styles.Label}
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
          >
            {convertToFeet(
              label.getLength({
                fieldWidth: actualWidth,
                fieldLength: actualLength,
              }),
            )}
          </div>
        )}
      </For>
    </div>
  )
}
