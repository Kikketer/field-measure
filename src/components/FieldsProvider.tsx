import { REALTIME_SUBSCRIBE_STATES } from '@supabase/realtime-js/src/RealtimeChannel'
import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  JSX,
  useContext,
} from 'solid-js'
import {
  getFields,
  onUpdate as updateFieldsInStore,
} from '../utilities/FieldStore'
import { Field } from '../utilities/types'
import { OnlineContext } from './OnlineStatusProvider'
import { supabase } from './supabase'
import { VisibleContext } from './VisibleProvider'

type FieldsProvider = {
  children: JSX.Element
}

export const FieldsContext = createContext<{
  fields?: Accessor<Field[]>
  isConnected?: Accessor<boolean>
}>()

const startListening = ({
  onUpdate,
  onConnectionStatusChange,
}: {
  onUpdate: (field: Field) => void
  onInsert?: (field: Field) => void
  onDelete?: (field: Field) => void
  onConnectionStatusChange?: (status: REALTIME_SUBSCRIBE_STATES) => void
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
      onConnectionStatusChange?.(p)
    })
}

export const FieldsProvider: Component<FieldsProvider> = (props) => {
  const visible = useContext(VisibleContext)
  const online = useContext(OnlineContext)
  const [connected, setConnected] = createSignal<boolean>(false)
  const [fields, setFields] = createSignal<Field[]>([])

  const onConnectionStatusChange = (status: REALTIME_SUBSCRIBE_STATES) => {
    if (status === 'SUBSCRIBED') {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }

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

  // Fetch the fields if we are visible
  createEffect(async () => {
    if (visible?.()) {
      const mappedFields = await getFields(online?.())
      setFields(mappedFields)

      startListening({ onUpdate, onDelete, onInsert, onConnectionStatusChange })
    }
  })

  return (
    <FieldsContext.Provider value={{ fields, isConnected: connected }}>
      {props.children}
    </FieldsContext.Provider>
  )
}
