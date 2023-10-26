import { REALTIME_SUBSCRIBE_STATES } from '@supabase/realtime-js/src/RealtimeChannel'
import { SupabaseClient } from '@supabase/supabase-js'
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
import { SupabaseContext } from './SupabaseProvider'
import { VisibleContext } from './VisibleProvider'

type FieldsProvider = {
  children: JSX.Element
}

export const FieldsContext = createContext<{
  fields?: Accessor<Field[]>
  isConnected?: Accessor<boolean>
}>()

const startListening = async ({
  supabase,
  onUpdate,
  onConnectionStatusChange,
}: {
  supabase: SupabaseClient
  onUpdate: (field: Field) => void
  onInsert?: (field: Field) => void
  onDelete?: (field: Field) => void
  onConnectionStatusChange?: (status: REALTIME_SUBSCRIBE_STATES) => void
}) => {
  return supabase
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
  const supabaseContext = useContext(SupabaseContext)
  const [connected, setConnected] = createSignal<boolean>(false)
  const [fields, setFields] = createSignal<Field[]>([])
  const [log, setLog] = createSignal('')

  let connectRetries = 0

  const onConnectionStatusChange = (status: REALTIME_SUBSCRIBE_STATES) => {
    setLog(
      (prev) => prev + 'Connection stat: ' + status + ` [${connectRetries}]\n`,
    )
    if (status === 'SUBSCRIBED') {
      setConnected(true)
      connectRetries = 0
    } else {
      setConnected(false)
      connectRetries++
      if (connectRetries > 2) {
        setLog((prev) => prev + 'Retried, resetting now!\n')
        const supa = supabaseContext?.resetSupabase()
        // location.reload()
        // return

        setTimeout(
          async () => {
            await startListening({
              supabase: supa,
              onUpdate,
              onDelete,
              onInsert,
              onConnectionStatusChange,
            })
          },
          Math.pow(2, connectRetries) * 1000,
        )
      }
    }
  }

  const onUpdate = async (updatedField: Field) => {
    const updatedFields = await updateFieldsInStore({
      supabase: supabaseContext?.supabase,
      updatedField,
    })
    setFields(updatedFields)
  }

  const onDelete = (deletedField: Field) => {}

  const onInsert = (insertedField: Field) => {}

  // Fetch the fields if we are visible
  createEffect(async () => {
    if (visible?.()) {
      setLog((prev) => prev + 'Is visible, fetching...\n')
      const mappedFields = await getFields({
        supabase: supabaseContext.supabase,
        isOnline: online?.(),
      })
      setFields(mappedFields)

      if (online?.()) {
        setLog((prev) => prev + 'Is online, connecting...\n')
        // Fetch this as well when we are now online
        const mappedFields = await getFields({
          supabase: supabaseContext.supabase,
          isOnline: online?.(),
        })
        setFields(mappedFields)
        // And now start listening to the socket
        await startListening({
          supabase: supabaseContext.supabase,
          onUpdate,
          onDelete,
          onInsert,
          onConnectionStatusChange,
        })
      }
    }
  })

  return (
    <FieldsContext.Provider value={{ fields, isConnected: connected }}>
      {props.children}
      <pre>{log()}</pre>
    </FieldsContext.Provider>
  )
}
