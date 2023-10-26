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

const startListening = async ({
  onUpdate,
  onConnectionStatusChange,
}: {
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
  const [connected, setConnected] = createSignal<boolean>(false)
  const [fields, setFields] = createSignal<Field[]>([])
  const [log, setLog] = createSignal('')

  let connectRetries = 0

  const onConnectionStatusChange = (status: REALTIME_SUBSCRIBE_STATES) => {
    setLog((prev) => prev + 'Connection stat: ' + status + '\n')
    if (status === 'SUBSCRIBED') {
      setConnected(true)
      connectRetries = 0
    } else {
      setConnected(false)
      if (status === 'TIMED_OUT') {
        if (connectRetries > 3) {
          setLog((prev) => prev + 'Too many retries, giving up...\n')
          location.reload()
          return
        }

        connectRetries++
        setTimeout(
          async () => {
            setLog((prev) => prev + 'Timed out, reconnecting...\n')
            await startListening({
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
      setLog((prev) => prev + 'Is visible, fetching...\n')
      const mappedFields = await getFields(online?.())
      setFields(mappedFields)

      if (online?.()) {
        setLog((prev) => prev + 'Is online, connecting...\n')
        // Fetch this as well when we are now online
        const mappedFields = await getFields(online?.())
        setFields(mappedFields)
        // And now start listening to the socket
        await startListening({
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
