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
import {
  getFields,
  onUpdate as updateFieldsInStore,
} from '../utilities/FieldStore'
import { VisibleContext } from './VisibleProvider'
import { OnlineContext } from './OnlineStatusProvider'
import { supabase } from './supabase'

type FieldsProvider = {
  children: JSX.Element
}

export const FieldsContext = createContext<{
  fields?: Accessor<Field[]>
  loading?: boolean
}>()

const startListening = ({
  onUpdate,
  onInsert,
  onDelete,
}: {
  onUpdate: (field: Field) => void
  onInsert: (field: Field) => void
  onDelete: (field: Field) => void
}) => {
  console.log('Starting to listen')
  supabase
    .channel('fields')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'fields' },
      (payload) => {
        console.log('Field is updated! ', payload)
        onUpdate(payload.new as Field)
      },
    )
    .subscribe()
}

export const FieldsProvider: Component<FieldsProvider> = (props) => {
  const visible = useContext(VisibleContext)
  const online = useContext(OnlineContext)
  const [fields, setFields] = createSignal<Field[]>([])

  // Fetch the fields if we are visible
  createEffect(async () => {
    if (visible?.()) {
      const mappedFields = await getFields(online?.())
      setFields(mappedFields)
    }
  })

  const onUpdate = async (updatedField: Field) => {
    const updatedFields = await updateFieldsInStore(updatedField)
    setFields(updatedFields)
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
