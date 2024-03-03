import { SupabaseClient } from '@supabase/supabase-js'
import { Field, PaintHistory } from './types'
import { convertUnderscoreToCamelCase, mapFields } from './utils'

export const getFields = async ({
  supabase,
}: {
  supabase: SupabaseClient
}): Promise<Field[]> => {
  const result = await supabase
    ?.from('fields')
    .select('*')
    .eq('active', true)
    .eq('deleted', false)
    .order('name')

  return mapFields(result?.data ?? [])
}

export const getField = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient
  id: string
}): Promise<Field | undefined> => {
  const fields = await supabase
    ?.from('fields')
    .select('*')
    .eq('id', id)
    .limit(1)

  return mapFields(fields.data ?? [])?.[0]
}

export const getPaintHistory = async ({
  fieldId,
  supabase,
}: {
  fieldId: Field['id']
  supabase: SupabaseClient
}): Promise<PaintHistory[] | undefined> => {
  const result = await supabase
    ?.from('paint_history')
    .select('*')
    .eq('field_id', fieldId)
    .order('created_at')
    .limit(3)

  if (result?.data?.length) {
    return result.data.map((historyItem) =>
      convertUnderscoreToCamelCase(historyItem),
    )
  }
}
