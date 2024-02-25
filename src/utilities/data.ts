import { SupabaseClient } from '@supabase/supabase-js'
import { Field } from './types'
import { getFields as getFieldsFromDb } from './FieldStore'

const data: Field[] = [
  {
    id: '1',
    name: 'Field A',
    description:
      'South side of the park with a really long description that you may not see all of it',
    size: 'Full',
    maxDryDays: 7,
    rainfallDays: 0,
    rainfallFactor: 1,
    lastPainted: new Date('2021-01-01'),
    markedUnplayable: new Date('2021-01-01'),
    sortOrder: 1,
    paintTeamId: 1,
  },
]

export const getFields = async ({
  supabase,
}: {
  supabase: SupabaseClient
}): Promise<Field[]> => {
  return getFieldsFromDb({ supabase, isOnline: true })
}

export const getField = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient
  id: string
}): Promise<Field | undefined> => {
  const fields = await getFieldsFromDb({ supabase, isOnline: true })

  return fields.find((field) => field.id === id)
}
