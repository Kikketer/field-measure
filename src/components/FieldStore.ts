import { supabase } from './supabase'
import { Field } from '../types'

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

export const getFields = async (): Promise<Field[]> => {
  const { data } = await supabase
    .from('fields')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  if (!data?.length) return []

  return mapFields(data)
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
