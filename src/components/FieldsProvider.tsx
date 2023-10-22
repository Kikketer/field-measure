import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createMemo,
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
  isConnected?: Accessor<boolean>
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
  supabase
    .channel('fields')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'fields' },
      (payload) => {
        onUpdate(payload.new as Field)
      },
    )
    .subscribe((p) => {
      if (p === 'SUBSCRIBED') {
        console.log('🔌 Listening', p)
      } else {
        console.log('🚫 Broken', p)
      }
    })
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

      startListening({ onUpdate, onDelete, onInsert })
    }
  })

  const onUpdate = async (updatedField: Field) => {
    const updatedFields = await updateFieldsInStore(updatedField)
    setFields(updatedFields)
  }

  const onDelete = (deletedField: Field) => {}

  const onInsert = (insertedField: Field) => {}

  // const conn = createMemo(() => {
  //   console.log('CHange? ', supabase.realtime.connectionState())
  //   console.log('connected? ', supabase.realtime.isConnected())
  //   return supabase.realtime.isConnected()
  // })

  // supabase.realtime.on('connectionStateChanged', () => {
  //   console.log('Changed?')
  // })

  return (
    <FieldsContext.Provider value={{ fields, isConnected: () => true }}>
      {props.children}
    </FieldsContext.Provider>
  )
}
