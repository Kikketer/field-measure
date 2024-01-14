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
  getPaintHistory as getPaintHistoryFromDb,
  logPainted,
  onUpdate as updateFieldsInStore,
  saveField as saveFieldToDb,
} from '../utilities/FieldStore'
import { Field, PaintHistory } from '../utilities/types'
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
  saveField: (T: { field: Partial<Field> }) => Promise<Field>
  logPaintedField: (T: {
    field: Partial<Field>
    previouslyPaintedOn: Date
  }) => Promise<void>
  getPaintHistory: () => Promise<{ fieldId: string; paintedOn: Date }[]>
}>()

const startListening = async ({
  supabase,
  onUpdate,
  onConnectionStatusChange,
}: {
  supabase: SupabaseClient | undefined
  onUpdate: (field: Field) => void
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
              onConnectionStatusChange,
            })
          },
          Math.pow(2, connectRetries) * 1000,
        )
      }
    }
  }

  /**
   * This adds a row to the painted field table
   * This is used to create an average rainfall factor and max dry days
   * that are a little more stable.
   */
  const logPaintedField = async ({
    field,
    previouslyPaintedOn,
  }: {
    field: Partial<Field>
    previouslyPaintedOn: Date
  }) => {
    await logPainted({ supabase, field, previouslyPaintedOn })
  }

  const getPaintHistory = async (): Promise<PaintHistory[]> => {
    const result = await getPaintHistoryFromDb({ supabase })
    return (
      result?.map((r) => ({
        rainfallFactor: r.rainfall_factor,
        rainfallDays: r.rainfall_days,
        daysUnpainted: r.days_unpainted,
      })) ?? []
    )
  }

  const onUpdate = async (updatedField: Field) => {
    const updatedFields = await updateFieldsInStore({
      supabase,
      updatedField,
    })
    setFields(updatedFields)
  }

  const fetchFields = async () => {
    const mappedFields = await getFieldsFromDb({
      supabase,
      isOnline: online?.(),
    })
    setFields(mappedFields)

    return mappedFields
  }

  const saveField = async ({ field }: { field: Partial<Field> }) => {
    const newField = await saveFieldToDb({
      field,
      supabase,
      paintTeamId: user?.().paintTeam.id,
    })
    // Fetch but don't wait
    fetchFields().then(() => undefined)
    return newField
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

  return (
    <FieldsContext.Provider
      value={{
        fields,
        isConnected: connected,
        connecting,
        fetchFields,
        saveField,
        logPaintedField,
        getPaintHistory,
      }}
    >
      {props.children}
      {/*<pre>{log()}</pre>*/}
    </FieldsContext.Provider>
  )
}