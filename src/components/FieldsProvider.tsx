import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  JSX,
  useContext,
} from 'solid-js'
import { Field } from '../utilities/types'
import { getFields, startListening } from '../utilities/FieldStore'
import { VisibleContext } from './VisibleProvider'

type FieldsProvider = {
  children: JSX.Element
}

export const FieldsContext = createContext<{
  fields?: Accessor<Field[]>
  loading?: boolean
}>()

export const FieldsProvider: Component<FieldsProvider> = (props) => {
  const visible = useContext(VisibleContext)
  const [fields, setFields] = createSignal<Field[]>([])

  // Fetch the fields if we are visible
  createEffect(async () => {
    if (visible?.()) {
      const mappedFields = await getFields()
      setFields(mappedFields)
    }
  })

  const onUpdate = (updatedField: Field) => {
    const newFields = fields()?.slice() || []
    const indexOfExistingField = newFields.findIndex(
      (field: Field) => field.id === updatedField?.id,
    )
    newFields.splice(indexOfExistingField, 1, updatedField)

    // And now re-save this back to the local storage
    localStorage.setItem(
      'fieldStore',
      JSON.stringify({ fields: newFields, lastFetch: new Date() }),
    )
    // And local cache
    // localCache.fields = existingFields
    console.log('saved!', newFields)
    setFields(newFields)
  }

  const onDelete = (deletedField: Field) => {}

  const onInsert = (insertedField: Field) => {}

  // Startup the realtime connection to the database
  startListening({ onUpdate, onDelete, onInsert })

  return (
    <FieldsContext.Provider value={{ fields, loading: false }}>
      {props.children}
    </FieldsContext.Provider>
  )
}
