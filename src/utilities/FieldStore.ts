import { Field } from './types'
import { supabase } from '../components/supabase'

type FieldStore = {
  lastFetch: Date | undefined
  fields: Field[] | undefined
}

// Used when we create new fields, fills in the gaps:
const baselineField: Field = {
  // id: undefined (by defualt but here to remind you that we have it)
  createdAt: new Date(),
  size: 'Full',
  customWidth: undefined,
  customLength: undefined,
  name: '',
  description: '',
  maxDryDays: 14,
  rainfallDays: 0,
  rainfallFactor: 1,
  lastPainted: new Date(),
  markedUnplayable: new Date(),
  sortOrder: 0,
  active: true,
  modified: new Date(),
  paintTeamId: 0,
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
    field.predictedNextPaint = field.predictedNextPaint
      ? new Date(field.predictedNextPaint)
      : undefined
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

export const getFields = async (isOnline?: boolean): Promise<Field[]> => {
  const localStorageFields = localStorage.getItem('fieldStore')

  // Always fetch if we are online
  if (isOnline) {
    const result = await supabase
      .from('fields')
      .select('*')
      .eq('active', true)
      .eq('deleted', false)

    const fields = result.data ?? []

    localStorage.setItem(
      'fieldStore',
      JSON.stringify({
        lastFetch: new Date(),
        fields,
      }),
    )

    return mapFields(fields)
  }

  let hydratedFieldStore = localStorageFields
    ? JSON.parse(localStorageFields)
    : { fields: [] }

  let fields = hydratedFieldStore?.fields ?? []

  return mapFields(fields)
  // let localCache = hydratedFieldStore
  // .then((result) => {
  //   fields = result.data
  //
  //   // Save to local storage for fetch later (if we are offline)
  //   localStorage.setItem(
  //     'fieldStore',
  //     JSON.stringify({
  //       lastFetch: new Date(),
  //       fields: fields ?? [],
  //     }),
  //   )
  //
  //   onUpdate?.(mapFields(fields))
  // })

  // Delay the call slightly to allow any others to flush out
  // I'd like to make this use a sort of "pending completion queue"
  // But again, I'm not getting paid for this so going MVP for now
  // if (hydratedFieldStore.fields.length) {
  //   // If we have fields already cached, we can afford to wait a second to call for the refresh
  //   setTimeout(() => {
  //     callFields()
  //   }, 2000)
  // } else {
  // callFields()
  // }
  // }

  // if (!localCache?.fields?.length) return []
  //
  // return mapFields(localCache.fields)
}

export const getArchivedFields = async () => {
  const { data } = await supabase.from('fields').select('*').eq('active', false)

  if (!data?.length) return []

  return mapFields(data)
}

export const saveField = async ({
  field,
  paintTeamId,
}: {
  field: Partial<Field>
  paintTeamId: number
}): Promise<Field> => {
  // Set the sort order to the length of the current fields
  const existingFields = await getFields()

  // Get the field as-is for any potential update
  // Oddly it looks like it updates fine except it still throws an error if you don't have required fields!
  const existingFieldToEdit: Field | undefined = existingFields?.find(
    (existingField) => existingField.id === field.id,
  )

  // Create the proposed field
  const proposedUpdatedField = {
    ...baselineField,
    ...existingFieldToEdit,
    ...field,
    paintTeamId,
  }

  // Update local cache first, then save to supabase
  const fieldIndex = existingFields?.findIndex(
    (field: Field) => field.id === existingFieldToEdit?.id,
  )

  if ((field.deleted || !field.active) && existingFieldToEdit) {
    // If we marked it as deleted, simply splice it out and then call the network
    existingFields?.splice(fieldIndex, 1)
  } else if (!existingFieldToEdit) {
    existingFields?.push({
      ...proposedUpdatedField,
      id: undefined,
    })
  } else {
    existingFields?.splice(fieldIndex, 1, {
      ...proposedUpdatedField,
    })
  }

  // Now just update supabase in the background:
  supabase
    .from('fields')
    // ID is generated by the database:
    .upsert(unmapField(proposedUpdatedField))
    .then(() => {
      // We have to have a .then or await, otherwise this command doesn't even fire
      // The actual response from the server is handled by sockets
    })

  // Return the existing field OR the new one we created:
  return proposedUpdatedField ?? { ...baselineField, ...field }
}

/**
 * Run this when you get an updated field event from the database
 * this will save it to local storage
 */
export const onUpdate = async (updatedField: Field) => {
  const newFields = (await getFields())?.slice() || []
  const indexOfExistingField = newFields.findIndex(
    (field: Field) => field.id === updatedField?.id,
  )
  newFields.splice(indexOfExistingField, 1, updatedField)

  // And now re-save this back to the local storage
  localStorage.setItem(
    'fieldStore',
    JSON.stringify({ fields: newFields, lastFetch: new Date() }),
  )

  return mapFields(newFields)
}
