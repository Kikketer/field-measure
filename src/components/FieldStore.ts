import { RxCollection, RxDocument, createRxDatabase } from 'rxdb'
import { SupabaseReplication } from 'rxdb-supabase'
import { addRxPlugin } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { Field, RawField } from '../types'
import { supabase } from './supabase'

// Global database?
let fieldsDb: { fields: RxCollection<Field> } | undefined

// Create your database
const fieldDatabase = await createRxDatabase({
  name: 'field-manager',
  storage: getRxStorageDexie(), // Uses IndexedDB
})
addRxPlugin(RxDBDevModePlugin)

// Create a collection matching your Supabase table structure.
const fieldSchema = {
  title: 'fields schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    created_at: { type: 'string' },
    code: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    max_dry_days: { type: 'number' },
    rainfall_days: { type: 'number' },
    last_painted: { type: 'string' },
    should_paint: { type: 'number' },
    size: { type: 'string' },
    custom_width: { type: 'number' },
    custom_length: { type: 'number' },
    sort_order: { type: 'number' },
    marked_unplayable: { type: 'string' },
    rainfall_factor: { type: 'number' },
    active: { type: 'boolean' },
  },
  required: [
    'id',
    'created_at',
    'code',
    'name',
    'sort_order',
    'rainfall_factor',
  ],
}

const mapFields = (fields: any[]): Field[] => {
  // Convert all keys with underscores to camelCase:
  const duplicateFields = fields.slice()

  duplicateFields.forEach((field) => {
    Object.keys(field).forEach((key) => {
      const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      if (newKey !== key) {
        field[newKey] = field[key]
        delete field[key]
      }
    })

    // Convert the dates to Date objects:
    field.createdAt = new Date(field.createdAt)
    field.lastPainted = new Date(field.lastPainted)
    field.markedUnplayable = new Date(field.marked_unplayable)
  })

  console.log('Dup fields ', duplicateFields)

  return duplicateFields
}

const unmapFields = (field: Field) => {
  const duplicateField: any = { ...field }
  // Convert all keys with camelCase to underscores:
  Object.keys(duplicateField).forEach((key) => {
    const newKey = key.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`)
    if (newKey !== key) {
      duplicateField[newKey] = duplicateField[key]
      delete duplicateField[key]
    }
  })

  return duplicateField
}

export const initializeDatabase = async () => {
  fieldsDb = await fieldDatabase.addCollections({
    fields: { schema: fieldSchema },
  })
  return fieldsDb
}

export const syncDatabase = async (fieldCollections: {
  fields: RxCollection<Field>
}) => {
  console.log('Starting replication')

  const replication = new SupabaseReplication({
    supabaseClient: supabase,
    collection: fieldCollections.fields,
    /**
     * An ID for the replication, so that RxDB is able to resume the replication
     * on app reload. It is recommended to add the supabase URL to make sure you're
     * not mixing up replications against different databases.
     *
     * If you're using row-level security, you might also want to append the user ID
     * in case the logged in user changes, although depending on your application you
     * might want to re-create the entire RxDB from scratch in that case or have one
     * RxDB per user ID (you could add the user ID to the RxDB name).
     */
    replicationIdentifier: 'fields',
    pull: {}, // If absent, no data is pulled from Supabase
    push: {}, // If absent, no changes are pushed to Supabase
    live: true, // If true, the replication keeps running and syncing changes as they occur
  })

  // TODO Worry about errors and the like

  return replication
}

export const getFields = async (): Promise<RxDocument<Field>[]> => {
  // const { data } = await supabase
  //   .from('fields')
  //   .select('*')
  //   .eq('active', true)
  //   .order('sort_order')

  // if (!data?.length) return []
  console.log('Getting fields')
  // return mapFields(data)
  const doc = await fieldsDb?.fields
    // .find({})
    .find({ selector: { active: true } })
    // .sort('sort_order')
    .exec()
  console.log('Do? ', doc?.[0]?.code)
  console.log('thing', doc?.[0]?.toJSON())
  // const mappedFields = mapFields(doc ?? [])
  // console.log('mapped fields ', mappedFields)
  // return mappedFields
  return doc ?? []
}

export const getField = async (id: Field['id']): Promise<Field> => {
  // We fetch all fields if it's not there (cache is handled in the getFields call)
  return (await getFields()).find((field) => field.id === id)!
}

export const getArchivedFields = async () => {
  const { data } = await supabase
    .from('fields')
    .select('*')
    .eq('active', false)
    .order('sort_order')

  if (!data?.length) return []

  return mapFields(data)
}

export const saveField = async (field: Field) => {
  const { data } = await supabase
    .from('fields')
    .upsert(unmapFields(field))
    .select('*')

  console.log('saveField', data)

  if (!data?.length) return []

  return data
}
