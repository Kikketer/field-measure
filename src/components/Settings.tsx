import { For, Show, type Component } from 'solid-js'
import { SIZES } from '../utilities/constants'
import { Field, FieldSize } from '../utilities/types'
import styles from './Settings.module.css'
import { SizeSlider } from './SizeSlider'

export type SettingsProps = {
  /**
   * Determines if we should allow saving and other items
   * really just used to edit a field size
   */
  isQuickDraw?: boolean
  setFieldSize: (fieldSize: FieldSize) => void
  fieldSize: () => FieldSize
  customWidth?: () => number | undefined
  setCustomWidth?: (width: number) => void
  customLength?: () => number | undefined
  setCustomLength?: (length: number) => void
  archivedFields: () => Field[] | undefined
  currentArchivedField: () => string | undefined
}

export const Settings: Component<SettingsProps> = ({
  isQuickDraw,
  setFieldSize,
  fieldSize,
  customLength,
  setCustomLength,
  customWidth,
  setCustomWidth,
  archivedFields,
  currentArchivedField,
}) => {
  return (
    <div class={styles.Settings}>
      <select
        id="field-size"
        onChange={(e) => setFieldSize(e.target.value as FieldSize)}
      >
        <option
          value={FieldSize.full}
          selected={fieldSize() === FieldSize.full}
        >
          Full Size
        </option>
        <option
          value={FieldSize.elevenThirteen}
          selected={fieldSize() === FieldSize.elevenThirteen}
        >
          11-13
        </option>
        <option
          value={FieldSize.nineTen}
          selected={fieldSize() === FieldSize.nineTen}
        >
          9-10
        </option>
        <option
          value={FieldSize.sevenEight}
          selected={fieldSize() === FieldSize.sevenEight}
        >
          7-8
        </option>
        <For each={archivedFields()}>
          {(archivedField) => (
            <option
              value={archivedField.code}
              selected={currentArchivedField() === archivedField.code}
            >
              {archivedField.name}
            </option>
          )}
        </For>
      </select>
      <div class={styles.Grid}>
        <div>
          <label for="width">Width</label>
          <input
            type="number"
            id="width"
            min={SIZES[fieldSize()].minWidth}
            max={SIZES[fieldSize()].maxWidth}
            value={customWidth?.() ?? SIZES[fieldSize()].recommendedMaxWidth}
            onChange={(e) => setCustomWidth?.(Number(e.target.value))}
          ></input>
          <SizeSlider fieldSize={fieldSize} type="width" />
        </div>
        <div>
          <label for="length">Length</label>
          <input
            type="number"
            id="length"
            min={SIZES[fieldSize()].minLength}
            max={SIZES[fieldSize()].maxLength}
            value={customLength?.() ?? SIZES[fieldSize()].recommendedMaxLength}
            onChange={(e) => setCustomLength?.(Number(e.target.value))}
          ></input>
          <SizeSlider fieldSize={fieldSize} type="length" />
        </div>
      </div>
      <Show when={!isQuickDraw}>
        <div>
          <label for="name">Name</label>
          <input type="text" required name="name" id="name" />
        </div>
      </Show>
    </div>
  )
}
