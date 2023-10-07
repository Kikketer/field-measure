import { Field } from './types'
import { supabase } from '../components/supabase'

type FieldStore = {
  lastFetch: Date | undefined
  fields: Field[] | undefined
}

// Used when we create new fields, fills in the gaps:
const baselineField: Field = {
  id: '',
  createdAt: new Date(),
  size: 'full',
  customWidth: undefined,
  customLength: undefined,
  code: '',
  name: '',
  description: '',
  maxDryDays: 0,
  rainfallDays: 0,
  rainfallFactor: 0,
  lastPainted: new Date(),
  shouldPaint: 0,
  markedUnplayable: new Date(),
  sortOrder: 0,
  active: true,
  modified: new Date(),
  deleted: false,
}

// This local cache mirrors local storae but doesn't have the "not-so-async" issues of localstorage
const localCache: FieldStore = { fields: [], lastFetch: new Date() }

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
    field.createdAt = field.createdAt ? new Date(field.createdAt) : undefined
    field.lastPainted = field.lastPainted
      ? new Date(field.lastPainted)
      : undefined
    field.modified = field.modified ? new Date(field.modified) : undefined
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

export const getFields = (
  isOnline?: boolean,
  onUpdate?: (fields: Field[]) => void,
): Field[] => {
  const localStorageFields = localStorage.getItem('fieldStore')
  let hydratedFieldStore = localStorageFields
    ? JSON.parse(localStorageFields)
    : { fields: [] }

  let fields = hydratedFieldStore?.fields ?? []
  let localCache = hydratedFieldStore

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

  if (!localCache?.fields?.length) return []

  return mapFields(localCache.fields)
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

export const saveField = (
  field: Partial<Field>,
  callback?: (savedField: Field) => void,
): Field | undefined => {
  // Set the sort order to the length of the current fields
  const existingFields = getFields()

  // Get the field as-is for any potential update
  // Oddly it looks like it updates fine except it still throws an error if you don't have required fields!
  const existingFieldToEdit: Field | undefined = existingFields?.find(
    (existingField) => existingField.id === field.id,
  )

  // Update local cache first, then save to supabase
  const fieldIndex = existingFields?.findIndex(
    (field: Field) => field.id === existingFieldToEdit?.id,
  )
  if (!existingFieldToEdit) {
    existingFields?.push({ ...baselineField, ...field, id: 'new-field-id' })
  } else {
    existingFields?.splice(fieldIndex, 1, { ...existingFieldToEdit, ...field })
  }

  // Now just update supabase in the background:
  supabase
    .from('fields')
    .upsert(unmapField({ ...existingFieldToEdit, ...field }))
    .select('*')
    .then((result) => {
      // Now update the local cache with the new or edited field:
      if (!existingFieldToEdit) {
        const indexOfNewField = existingFields?.findIndex(
          (field: Field) => field.id === 'new-field-id',
        )
        existingFields?.splice(indexOfNewField, 1, result.data?.[0])
      } else {
        const indexOfExistingField = existingFields?.findIndex(
          (field: Field) => field.id === existingFieldToEdit?.id,
        )
        existingFields?.splice(indexOfExistingField, 1, result.data?.[0])
      }
      // And now re-save this back to the local storage
      localStorage.setItem(
        'fieldStore',
        JSON.stringify({ fields: existingFields, lastFetch: new Date() }),
      )
      // And local cache
      localCache.fields = existingFields

      // And callback with this:
      callback?.(mapFields(result.data as any[])[0])
    })

  // And now re-save this back to the local storage
  localStorage.setItem(
    'fieldStore',
    JSON.stringify({ fields: existingFields, lastFetch: new Date() }),
  )
  // And local cache
  localCache.fields = existingFields

  // Return the existing field OR the new one we created:
  return existingFieldToEdit ?? { ...baselineField, ...field }
}

export const checkWeather = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('weather-check', {
      body: { name: 'Functions' },
    })
    if (error) throw error

    console.log('Data', data!)
  } catch (err) {
    console.error(err)
  }
}
