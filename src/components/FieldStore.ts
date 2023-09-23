import { Field } from '../utilities/types'
import { supabase } from './supabase'

type FieldStore = {
  lastFetch: Date | undefined
  fields: Field[] | undefined
}

const saveToCache = (fields: Field[]) => {}

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

export const getFields = (
  isOnline?: boolean,
  onUpdate?: (fields: Field[]) => void,
): Field[] => {
  const localStorageFields = localStorage.getItem('fieldStore')
  let hydratedFieldStore = JSON.parse(localStorageFields ?? '')

  let fields = hydratedFieldStore?.fields ?? []

  // Always fetch if we are online
  if (isOnline) {
    supabase
      .from('fields')
      .select('*')
      .eq('active', true)
      .order('sort_order')
      .then((result) => {
        fields = result.data

        // Save to local storage for fetch later (if we are offline)
        localStorage.setItem(
          'fieldStore',
          JSON.stringify({
            lastFetch: new Date(),
            fields: fields ?? [],
          }),
        )

        onUpdate?.(mapFields(fields))
      })
  }

  if (!fields?.length) return []

  return mapFields(fields)
}

export const getField = (id: Field['id']): Field | undefined => {
  // We fetch all fields if it's not there (cache is handled in the getFields call)
  return getFields().find((field) => field.id === id)!
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
  // Set the sort order to the length of the current fields
  const existingFields = await getFields()

  const { data } = await supabase
    .from('fields')
    .upsert(unmapField({ ...field, sortOrder: existingFields.length }))
    .select('*')

  if (!data?.length) return

  const updatedField = mapFields(data)[0]

  const fieldIndex = existingFields?.findIndex(
    (field: Field) => field.id === updatedField.id,
  )
  if (fieldIndex === undefined || fieldIndex === -1) {
    existingFields?.push(updatedField)
  } else {
    existingFields?.splice(fieldIndex, 1, updatedField)
  }

  // And now re-save this back to the local storage
  localStorage.setItem(
    'fieldStore',
    JSON.stringify({ fields: existingFields, lastFetch: new Date() }),
  )

  return updatedField
}
