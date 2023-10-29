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
  getFields as getFieldsFromDb,
  onUpdate as updateFieldsInStore,
  saveField as saveFieldToDb,
} from '../utilities/FieldStore'
import { Field } from '../utilities/types'
import { AuthenticationContext } from './AuthenticationProvider'
import { OnlineContext } from './OnlineStatusProvider'
import { SupabaseContext } from './SupabaseProvider'
import { VisibleContext } from './VisibleProvider'

type FieldsProvider = {
  children: JSX.Element
}

export const FieldsContext = createContext<{
  fields?: Accessor<Field[]>
  isConnected?: Accessor<boolean>
  connecting?: Accessor<boolean>
  fetchFields: () => Promise<Field[]>
  saveField: (T: { field: Field }) => Promise<Field>
}>()

const startListening = async ({
  supabase,
  onUpdate,
  onConnectionStatusChange,
}: {
  supabase: SupabaseClient | undefined
  onUpdate: (field: Field) => void
  onInsert?: (field: Field) => void
  onDelete?: (field: Field) => void
  onConnectionStatusChange?: (status: REALTIME_SUBSCRIBE_STATES) => void
}) => {
  return supabase
    ?.channel('fields')
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
  const { supabase, resetSupabase } = useContext(SupabaseContext)
  const { user } = useContext(AuthenticationContext)
  const [connecting, setConnecting] = createSignal<boolean>(false)
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
      setConnecting(false)
      connectRetries = 0
    } else {
      setConnected(false)
      connectRetries++
      if (connectRetries > 4) {
        // Just quit, and I'm not sure why supabase sockets do this
        // If you refresh the screen all is well, all other network connections
        // work... it's just an odd situation where it's in a "middle" ground
        setConnecting(false)
      } else if (connectRetries > 2) {
        setLog((prev) => prev + 'Retried, resetting now!\n')
        const supa = resetSupabase()

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
      supabase,
      updatedField,
    })
    setFields(updatedFields)
  }

  const onDelete = (deletedField: Field) => {}

  const onInsert = (insertedField: Field) => {}

  const fetchFields = async () => {
    const mappedFields = await getFieldsFromDb({
      supabase,
      isOnline: online?.(),
    })
    setFields(mappedFields)

    return mappedFields
  }

  // Fetch the fields if we are visible
  createEffect(async () => {
    if (visible?.()) {
      setLog((prev) => prev + 'Is visible\n')
      if (online?.()) {
        setConnecting(true)
        setLog((prev) => prev + 'Is online, connecting...\n')
        // Fetch this as well when we are now online
        await fetchFields()
        // And now start listening to the socket
        // Removed sockets for now, they are unreliable on mobile
        // await startListening({
        //   supabase,
        //   onUpdate,
        //   onDelete,
        //   onInsert,
        //   onConnectionStatusChange,
        // })
        setConnected(true)
        setConnecting(false)
      } else {
        // Fetch the fields anyway if we are offline (getting cached ones)
        await fetchFields()
        setConnecting(false)
      }
    }
  })

  const saveField = async ({ field }: { field: Field }) => {
    const newField = await saveFieldToDb({
      field,
      supabase,
      paintTeamId: user?.().paintTeam.id,
    })
    // Fetch but don't wait
    fetchFields().then(() => undefined)
    return newField
  }

  return (
    <FieldsContext.Provider
      value={{
        fields,
        isConnected: connected,
        connecting,
        fetchFields,
        saveField,
      }}
    >
      {props.children}
      {/*<pre>{log()}</pre>*/}
    </FieldsContext.Provider>
  )
}
