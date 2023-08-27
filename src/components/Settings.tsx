import type { Component } from 'solid-js'
import { FieldSize } from '../types'
import styles from './Settings.module.css'
import { SizeSlider } from './SizeSlider'
import { SIZES } from '../constants'

export type SettingsProps = {
  onSetFieldSize: (T: {
    size: FieldSize
    customWidth?: number
    customLength?: number
  }) => void
  fieldSize: () => FieldSize
  customWidth?: () => number | undefined
  customLength?: () => number | undefined
}

export const Settings: Component<SettingsProps> = ({
  onSetFieldSize,
  fieldSize,
  customLength,
  customWidth,
}) => {
  const onSet = ({
    fieldSize,
    customWidth,
    customLength,
  }: {
    fieldSize?: FieldSize
    customWidth?: number
    customLength?: number
  }) => {
    onSetFieldSize({
      size: fieldSize ?? FieldSize.full,
      customWidth,
      customLength,
    })
  }

  return (
    <div class={styles.Settings}>
      <select
        id="field-size"
        onChange={(e) => onSet({ fieldSize: e.target.value as FieldSize })}
      >
        <option value={FieldSize.full}>Full Size</option>
        <option value={FieldSize.elevenThirteen}>11-13</option>
        <option value={FieldSize.nineTen}>9-10</option>
        <option value={FieldSize.sevenEight}>7-8</option>
      </select>
      <div class={styles.Grid}>
        <div>
          <label for="width">Width</label>
          <input
            type="number"
            id="width"
            value={customWidth?.() ?? SIZES[fieldSize()].recommendedMaxWidth}
            onChange={(e) => onSet({ customWidth: Number(e.target.value) })}
          ></input>
          <SizeSlider />
        </div>
        <div>
          <label for="length">Length</label>
          <input
            type="number"
            id="length"
            value={customWidth?.() ?? SIZES[fieldSize()].recommendedMaxLength}
            onChange={(e) => onSet({ customLength: Number(e.target.value) })}
          ></input>
          <SizeSlider />
        </div>
      </div>
    </div>
  )
}
