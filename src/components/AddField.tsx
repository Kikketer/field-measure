import { useLocation, useNavigate, useParams } from '@solidjs/router'
import {
  Accessor,
  Component,
  For,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from 'solid-js'
import { SIZES } from '../utilities/constants'
import { Field as FieldModel, FieldSize } from '../utilities/types'
import styles from './AddField.module.css'
import { Field } from './Field'
import {
  getArchivedFields,
  getField,
  saveField as saveFieldToDb,
} from './FieldStore'
import { Header } from './Header'
import { SizeSlider } from './SizeSlider'
import { Page } from './Page'

export const AddField: Component = () => {
  const [currentFieldSize, setCurrentFieldSize] = createSignal(
    FieldSize.nineTen,
  )
  const [currentArchivedField, setCurrentArchivedField] = createSignal('')
  const [customWidth, setCustomWidth] = createSignal<number>()
  const [customLength, setCustomLength] = createSignal<number>()
  const [loading, setLoading] = createSignal<boolean>(false)
  const [error, setError] = createSignal<string>()
  const path = useLocation().pathname
  const fieldId = useParams().id
  const navigate = useNavigate()

  const field = createMemo(() => {
    return getField(fieldId)
  })

  const resetAndSaveFieldSize = (fieldSize: FieldSize | string) => {
    // Check to find the value of fieldSize is within the enum of FieldSize
    if (Object.values(FieldSize).includes(fieldSize as FieldSize)) {
      setCurrentFieldSize(fieldSize as FieldSize)
      setCustomWidth(SIZES[fieldSize].recommendedMaxWidth)
      setCustomLength(SIZES[fieldSize].recommendedMaxLength)
    }
  }

  const isQuickDraw = useLocation().pathname === '/quick'

  const saveField = async (e: SubmitEvent) => {
    // TODO after validation, save the field
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.target as HTMLFormElement)
    const data: Partial<FieldModel> = {}

    for (const formElement of formData) {
      data[formElement[0]] = formElement[1]
    }

    // Check validation for the form (if needed)
    try {
      setLoading(true)
      const savedField = await saveFieldToDb(data)
      navigate(`/field/${savedField?.id}`, { replace: true })
    } catch (err) {
      setError((err as Error).message)
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <Page>
      <Header>{fieldId ? `Edit ${field()?.name}` : 'Add Field'}</Header>
      <Field
        fieldSize={currentFieldSize}
        customWidth={customWidth}
        customLength={customLength}
      />
      <form onSubmit={saveField}>
        <div class={styles.Settings}>
          <select
            id="field-size"
            name="size"
            onChange={(e) => resetAndSaveFieldSize(e.target.value as FieldSize)}
          >
            <option
              value={FieldSize.full}
              selected={currentFieldSize() === FieldSize.full}
            >
              Full Size
            </option>
            <option
              value={FieldSize.elevenThirteen}
              selected={currentFieldSize() === FieldSize.elevenThirteen}
            >
              11-13
            </option>
            <option
              value={FieldSize.nineTen}
              selected={currentFieldSize() === FieldSize.nineTen}
            >
              9-10
            </option>
            <option
              value={FieldSize.sevenEight}
              selected={currentFieldSize() === FieldSize.sevenEight}
            >
              7-8
            </option>
          </select>
          <div class={styles.Grid}>
            <div>
              <label for="width">Width</label>
              <input
                type="number"
                id="width"
                name="customWidth"
                min={SIZES[currentFieldSize()].minWidth}
                max={SIZES[currentFieldSize()].maxWidth}
                value={
                  customWidth?.() ??
                  SIZES[currentFieldSize()].recommendedMaxWidth
                }
                onChange={(e) => setCustomWidth?.(Number(e.target.value))}
              ></input>
              <SizeSlider fieldSize={currentFieldSize} type="width" />
            </div>
            <div>
              <label for="length">Length</label>
              <input
                type="number"
                id="length"
                name="customLength"
                min={SIZES[currentFieldSize()].minLength}
                max={SIZES[currentFieldSize()].maxLength}
                value={
                  customLength?.() ??
                  SIZES[currentFieldSize()].recommendedMaxLength
                }
                onChange={(e) => setCustomLength?.(Number(e.target.value))}
              ></input>
              <SizeSlider fieldSize={currentFieldSize} type="length" />
            </div>
          </div>
          <Show when={!isQuickDraw}>
            <div>
              <label for="name">Name</label>
              <input type="text" required name="name" id="name" />
            </div>
            <div>
              <label for="description">Description</label>
              <input type="text" name="description" id="description" />
            </div>
          </Show>
        </div>

        <Show when={!isQuickDraw}>
          <button type="submit">Save</button>
        </Show>
      </form>
    </Page>
  )
}
