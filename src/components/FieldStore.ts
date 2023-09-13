import { differenceInHours } from 'date-fns'
import { Field } from '../utilities/types'
import { supabase } from './supabase'

const fieldStore: { lastFetch: Date | undefined; fields: Field[] | undefined } =
  {
    lastFetch: undefined,
    fields: undefined,
  }

const saveToCache = () => {}
const restoreFromCache = () => {}

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
  })

  return duplicateFields
}

const unmapField = (field: Partial<Field>) => {
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

const unmapFields = (fields: Field[]) => {
  return fields.map((field) => unmapField(field))
}

export const getFields = async (isOnline?: boolean): Promise<Field[]> => {
  const localStorageFields = localStorage.getItem('fieldStore')
  let hydratedFieldStore = localStorageFields
    ? JSON.parse(localStorageFields)
    : fieldStore

  // await new Promise((resolve) => setTimeout(resolve, 100))

  let fields = hydratedFieldStore?.fields

  // Always fetch if we are online
  if (isOnline) {
    const result = await supabase
      .from('fields')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    fields = result.data

    fieldStore.lastFetch = new Date()
    // Save to local storage for fetch later (if we are offline)
    localStorage.setItem(
      'fieldStore',
      JSON.stringify({
        ...fieldStore,
        fields: fields ?? [],
      }),
    )
  }

  fieldStore.fields = fields

  if (!fields?.length) return []

  return mapFields(fields)
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

export const saveField = async (
  field: Partial<Field>,
): Promise<Field | undefined> => {
  const { data } = await supabase
    .from('fields')
    .upsert(unmapField(field))
    .select('*')

  console.log('saveField', data)
  if (!data?.length) return

  const updatedField = mapFields(data)[0]
  // Now either add or update the field in the cache
  const fieldIndex = fieldStore.fields?.findIndex(
    (field) => field.id === updatedField.id,
  )
  if (fieldIndex === undefined || fieldIndex === -1) {
    fieldStore.fields?.push(updatedField)
  } else {
    fieldStore.fields?.splice(fieldIndex, 1, updatedField)
  }

  return updatedField
}
