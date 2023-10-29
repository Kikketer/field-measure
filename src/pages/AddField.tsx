import { useLocation, useNavigate } from '@solidjs/router'
import { Component, createSignal, Show, useContext } from 'solid-js'
import { FieldsContext } from '../components/FieldsProvider'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import styles from './AddField.module.css'
import { AuthenticationContext } from '../components/AuthenticationProvider'
import { Field } from '../components/Field'
import { Header } from '../components/Header'
import { Page } from '../components/Page'
import { SizeSlider } from '../components/SizeSlider'

export const AddField: Component = () => {
  const [currentFieldSize, setCurrentFieldSize] = createSignal(
    FieldSize.nineTen,
  )
  const [customWidth, setCustomWidth] = createSignal<number>()
  const [customLength, setCustomLength] = createSignal<number>()
  const navigate = useNavigate()
  const [saving, setSaving] = createSignal(false)
  const isQuick = useLocation().pathname === '/quick'
  const auth = useContext(AuthenticationContext)
  const fieldsContext = useContext(FieldsContext)

  const resetAndSaveFieldSize = (fieldSize: FieldSize | string) => {
    // Check to find the value of fieldSize is within the enum of FieldSize
    if (Object.values(FieldSize).includes(fieldSize as FieldSize)) {
      setCurrentFieldSize(fieldSize as FieldSize)
      setCustomWidth(SIZES[fieldSize].recommendedMaxWidth)
      setCustomLength(SIZES[fieldSize].recommendedMaxLength)
    }
  }

  const saveField = async (e: SubmitEvent) => {
    // TODO after validation, save the field
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.target as HTMLFormElement)
    const data: { [t: string]: any } = {}

    for (const formElement of formData) {
      data[formElement[0]] = formElement[1]
    }

    console.log('Saving field ', data)

    // Check validation for the form (if needed)
    setSaving(true)
    const newField = await fieldsContext?.saveField({ field: data })
    console.log('new field? ', newField)
    setSaving(false)
    navigate(`/fields/${newField?.id}`, { replace: true })
  }

  return (
    <Page>
      <Header backLocation={auth?.session?.() ? '/fields' : '/'}>
        {isQuick ? 'Field' : 'Add Field'}
      </Header>
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
          <Show when={!isQuick}>
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

        <Show when={!isQuick}>
          <button type="submit" disabled={saving()}>
            Save
          </button>
        </Show>
      </form>
    </Page>
  )
}
