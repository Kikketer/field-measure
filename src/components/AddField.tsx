import { useLocation, useMatch, useParams } from '@solidjs/router'
import {
  Component,
  Show,
  createMemo,
  createResource,
  createSignal,
} from 'solid-js'
import { SIZES } from '../constants'
import { FieldSize } from '../types'
import { Field } from './Field'
import { getArchivedFields } from './FieldStore'
import { Header } from './Header'
import { Page } from './Page'
import { Settings } from './Settings'

export const AddField: Component = () => {
  const [currentFieldSize, setCurrentFieldSize] = createSignal(
    FieldSize.nineTen,
  )
  const [currentArchivedField, setCurrentArchivedField] = createSignal('')
  const [customWidth, setCustomWidth] = createSignal<number>()
  const [customLength, setCustomLength] = createSignal<number>()
  const [selectedLineGroup, setSelectedLineGroup] = createSignal<string>()

  const [archivedFields] = createResource(getArchivedFields)

  const resetAndSaveFieldSize = (fieldSize: FieldSize | string) => {
    console.log('setting stuff ', fieldSize)
    // Check to find the value of fieldSize is within the enum of FieldSize

    if (Object.values(FieldSize).includes(fieldSize as FieldSize)) {
      setCurrentFieldSize(fieldSize as FieldSize)
      setCustomWidth(SIZES[fieldSize].recommendedMaxWidth)
      setCustomLength(SIZES[fieldSize].recommendedMaxLength)
    } else {
      // Set the currentArchivedField if it's not one of the field sizes defined in the enum
      setCurrentArchivedField(fieldSize as string)
      // TODO Set the width/length to the archived field's width/length
    }
  }

  const isQuickDraw = useLocation().pathname === '/quick'

  return (
    <div>
      <Header />
      <Page>
        <Field
          fieldSize={currentFieldSize}
          customWidth={customWidth}
          customLength={customLength}
        />
        <Settings
          isQuickDraw={isQuickDraw}
          setFieldSize={resetAndSaveFieldSize}
          archivedFields={archivedFields}
          currentArchivedField={currentArchivedField}
          fieldSize={currentFieldSize}
          customWidth={customWidth}
          setCustomLength={setCustomLength}
          customLength={customLength}
          setCustomWidth={setCustomWidth}
        />

        <Show when={!isQuickDraw}>
          <button>Save</button>
        </Show>
      </Page>
    </div>
  )
}
